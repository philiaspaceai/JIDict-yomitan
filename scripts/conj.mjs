#!/usr/bin/env node
// conj.mjs — engine konjugasi JIDict (MAINTAINER ONLY, bukan tool kontributor).
// Membangkitkan tabel konjugasi (verba + adjektiva-i) dan menginjeksikan blok
// `forms` ke entri. Deterministik, tanpa dependensi.
// - table <kata>: tampilkan tabel satu kata (uji)
// - inject <dir>: injeksikan ke semua entri yg memenuhi syarat (in-place)
// Kelas tak dikenal / ambigu -> SKIP tercatat, tidak ditebak.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const KANA5 = {
  あ: ["あ", "い", "う", "え", "お"], か: ["か", "き", "く", "け", "こ"],
  さ: ["さ", "し", "す", "せ", "そ"], た: ["た", "ち", "つ", "て", "と"],
  な: ["な", "に", "ぬ", "ね", "の"], は: ["は", "ひ", "ふ", "へ", "ほ"],
  ま: ["ま", "み", "む", "め", "も"], や: ["や", null, "ゆ", null, "よ"],
  ら: ["ら", "り", "る", "れ", "ろ"], わ: ["わ", "い", "う", "え", "を"],
  い: ["あ", "い", "う", "え", "お"], き: ["か", "き", "く", "け", "こ"],
  し: ["さ", "し", "す", "せ", "そ"], ち: ["た", "ち", "つ", "て", "と"],
  に: ["な", "に", "ぬ", "ね", "の"], ひ: ["は", "ひ", "ふ", "へ", "ほ"],
  み: ["ま", "み", "む", "め", "も"], り: ["ら", "り", "る", "れ", "ろ"],
  う: ["あ", "い", "う", "え", "お"], く: ["か", "き", "く", "け", "こ"],
  す: ["さ", "し", "す", "せ", "そ"], つ: ["た", "ち", "つ", "て", "と"],
  ぬ: ["な", "に", "ぬ", "ね", "の"], ふ: ["は", "ひ", "ふ", "へ", "ほ"],
  む: ["ま", "み", "む", "め", "も"], ゆ: ["や", null, "ゆ", null, "よ"],
  る: ["ら", "り", "る", "れ", "ろ"],
  え: ["あ", "い", "う", "え", "お"], け: ["か", "き", "く", "け", "こ"],
  せ: ["さ", "し", "す", "せ", "そ"], て: ["た", "ち", "つ", "て", "と"],
  ね: ["な", "に", "ぬ", "ね", "の"], へ: ["は", "ひ", "ふ", "へ", "ほ"],
  め: ["ま", "み", "む", "め", "も"], れ: ["ら", "り", "る", "れ", "ろ"],
  お: ["あ", "い", "う", "え", "お"], こ: ["か", "き", "く", "け", "こ"],
  そ: ["さ", "し", "す", "せ", "そ"], と: ["た", "ち", "つ", "て", "と"],
  の: ["な", "に", "ぬ", "ね", "の"], ほ: ["は", "ひ", "ふ", "へ", "ほ"],
  も: ["ま", "み", "む", "め", "も"], よ: ["や", null, "ゆ", null, "よ"],
  ろ: ["ら", "り", "る", "れ", "ろ"],
  が: ["が", "ぎ", "ぐ", "げ", "ご"], ざ: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  だ: ["だ", "ぢ", "づ", "で", "ど"], ば: ["ば", "び", "ぶ", "べ", "ぼ"],
  ぱ: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
  ぎ: ["が", "ぎ", "ぐ", "げ", "ご"], じ: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  ぢ: ["だ", "ぢ", "づ", "で", "ど"], び: ["ば", "び", "ぶ", "べ", "ぼ"],
  ぴ: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
  ぐ: ["が", "ぎ", "ぐ", "げ", "ご"], ず: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  づ: ["だ", "ぢ", "づ", "で", "ど"], ぶ: ["ば", "び", "ぶ", "べ", "ぼ"],
  ぷ: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
  げ: ["が", "ぎ", "ぐ", "げ", "ご"], ぜ: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  で: ["だ", "ぢ", "づ", "で", "ど"], べ: ["ば", "び", "ぶ", "べ", "ぼ"],
  ぺ: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
  ご: ["が", "ぎ", "ぐ", "げ", "ご"], ぞ: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  ど: ["だ", "ぢ", "づ", "で", "ど"], ぼ: ["ば", "び", "ぶ", "べ", "ぼ"],
  ぽ: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
};

function row(ch, target) {
  const t = KANA5[ch];
  if (!t) return null;
  return t[{ a: 0, i: 1, u: 2, e: 3, o: 4 }[target]];
}
const ISET = "いきしちにひみりぎじぢびぴ";
const ESET = "えけせてねへめれげぜでべぺ";
const V5_TE = { う: "って", く: "いて", ぐ: "いで", す: "して", つ: "って", ぬ: "んで", ぶ: "んで", む: "んで", る: "って" };
const GODAN_RU_EXC = new Set(["帰る", "切る", "喋る", "湿る", "焦る", "握る", "捻る", "散る", "要る", "入る", "走る", "減る", "限る", "蹴る", "滑る", "練る", "参る", "覆る", "漲る", "罵る", "遮る", "噛る"]);
const IKU = new Set(["いく", "行く", "逝く", "往く"]);
const NA_AS_I_EXC = new Set(["きれい", "嫌い", "きらい"]);

const ROWS_PAIRED = ["kamus", "sopan", "te", "lampau", "tara", "tai", "potensial", "bersyarat", "pasif", "kausatif", "pasif-kausatif", "sugiru"];
const ROWS_SINGLE = ["volisional", "perintah", "larangan"];
const ROW_LABEL = { kamus: "Kamus", sopan: "Sopan", te: "Bentuk-te", lampau: "Lampau", tara: "Tara", tai: "Tai", potensial: "Potensial", volisional: "Volisional", perintah: "Perintah", larangan: "Larangan", bersyarat: "Bersyarat", pasif: "Pasif", kausatif: "Kausatif", "pasif-kausatif": "Pasif-kausatif", sugiru: "Sugiru" };

export function classify(term) {
  if (["する", "為る", "来る", "くる", "來る"].includes(term)) {
    return ["来る", "くる", "來る"].includes(term) ? "vk" : "vs";
  }
  if (term.endsWith("する")) return "vs";
  if (term.endsWith("来る") || term.endsWith("くる")) return "vk";
  if (term === "いい" || term.endsWith("いい")) return "adj-i-sp";
  if (term.endsWith("いる") || term.endsWith("える")) return GODAN_RU_EXC.has(term) ? "v5r" : "v1";
  if (term.endsWith("る") && term.length >= 2) {
    const prev = term[term.length - 2];
    if (ISET.includes(prev) || ESET.includes(prev)) return GODAN_RU_EXC.has(term) ? "v5r" : "v1";
  }
  if (term.endsWith("い") && !NA_AS_I_EXC.has(term)) return "adj-i";
  if (term.endsWith("ずる") || term.endsWith("づる")) return "vz";
  const last = term[term.length - 1];
  if (KANA5[last] && KANA5[last][2] === last) {
    return { う: "v5u", く: "v5k", ぐ: "v5g", す: "v5s", つ: "v5t", ぬ: "v5n", ぶ: "v5b", む: "v5m", る: "v5r" }[last] ?? null;
  }
  return null;
}

export function conjugate(term, cls) {
  const F = (p, n) => [p ?? null, n ?? null];
  if (cls === "v1") {
    const s = term.slice(0, -1);
    return {
      kamus: F(term, s + "ない"), sopan: F(s + "ます", s + "ません"),
      te: F(s + "て", s + "なくて"), lampau: F(s + "た", s + "なかった"),
      tara: F(s + "たら", s + "なかったら"), tai: F(s + "たい", s + "たくない"),
      potensial: F(s + "られる", s + "られない"),
      volisional: F(s + "よう", null), perintah: F(s + "ろ", null),
      larangan: F(term + "な", null),
      bersyarat: F(s + "れば", s + "なければ"), pasif: F(s + "られる", s + "られない"),
      kausatif: F(s + "させる", s + "させない"),
      "pasif-kausatif": F(s + "させられる", s + "させられない"),
      sugiru: F(s + "すぎる", s + "すぎない"),
    };
  }
  if (cls === "vz") {
    const s = term.slice(0, -2) + "じ";
    const r = conjugate(s + "る", "v1");
    r.kamus = F(term, s + "ない");
    return r;
  }
  if (cls && cls.startsWith("v5")) {
    const last = term[term.length - 1];
    const base = term.slice(0, -1);
    const tePos = base + (IKU.has(term) ? "って" : V5_TE[last]);
    if (!V5_TE[last] && !IKU.has(term)) return null;
    const taPos = tePos.endsWith("で") ? tePos.slice(0, -1) + "だ" : tePos.slice(0, -1) + "た";
    const aRaw = row(last, "a"), ist = row(last, "i"), e = row(last, "e"), o = row(last, "o");
    if (!aRaw || !ist || !e || !o) return null;
    const a = (last === "う") ? "わ" : aRaw;
    return {
      kamus: F(term, base + a + "ない"), sopan: F(base + ist + "ます", base + ist + "ません"),
      te: F(tePos, base + a + "なくて"), lampau: F(taPos, base + a + "なかった"),
      tara: F(taPos + "ら", base + a + "なかったら"),
      tai: F(base + ist + "たい", base + ist + "たくない"),
      potensial: F(base + e + "る", base + e + "ない"),
      volisional: F(base + o + "う", null), perintah: F(base + e, null),
      larangan: F(term + "な", null),
      bersyarat: F(base + e + "ば", base + a + "なければ"),
      pasif: F(base + a + "れる", base + a + "れない"),
      kausatif: F(base + a + "せる", base + a + "せない"),
      "pasif-kausatif": F(base + a + "せられる", base + a + "せられない"),
      sugiru: F(base + ist + "すぎる", base + ist + "すぎない"),
    };
  }
  if (cls === "vs") {
    const s = (term === "する" || term === "為る") ? "" : term.slice(0, -2);
    return {
      kamus: F(term, s + "しない"), sopan: F(s + "します", s + "しません"),
      te: F(s + "して", s + "しなくて"), lampau: F(s + "した", s + "しなかった"),
      tara: F(s + "したら", s + "しなかったら"), tai: F(s + "したい", s + "したくない"),
      potensial: F(s + "できる", s + "できない"),
      volisional: F(s + "しよう", null), perintah: F(s + "しろ", null),
      larangan: F(term + "な", null),
      bersyarat: F(s + "すれば", s + "しなければ"), pasif: F(s + "される", s + "されない"),
      kausatif: F(s + "させる", s + "させない"),
      "pasif-kausatif": F(s + "させられる", s + "させられない"),
      sugiru: F(s + "しすぎる", s + "しすぎない"),
    };
  }
  if (cls === "vk") {
    const pre = ["来る", "くる", "來る"].includes(term) ? "" : term.slice(0, -2);
    return {
      kamus: F(term, pre + "こない"), sopan: F(pre + "きます", pre + "きません"),
      te: F(pre + "きて", pre + "こなくて"), lampau: F(pre + "きた", pre + "こなかった"),
      tara: F(pre + "きたら", pre + "こなかったら"), tai: F(pre + "きたい", pre + "きたくない"),
      potensial: F(pre + "こられる", pre + "こられない"),
      volisional: F(pre + "こよう", null), perintah: F(pre + "こい", null),
      larangan: F(term + "な", null),
      bersyarat: F(pre + "くれば", pre + "こなければ"), pasif: F(pre + "こられる", pre + "こられない"),
      kausatif: F(pre + "こさせる", pre + "こさせない"),
      "pasif-kausatif": F(pre + "こさせられる", pre + "こさせられない"),
      sugiru: F(pre + "きすぎる", pre + "きすぎない"),
    };
  }
  if (cls === "adj-i" || cls === "adj-i-sp") {
    const stem = cls === "adj-i-sp" ? (term === "いい" ? "よ" : term.slice(0, -2) + "よ") : term.slice(0, -1);
    const sop = cls === "adj-i-sp" ? [term + "です", stem + "くないです"] : [term.slice(0, -1) + "いです", stem + "くないです"];
    return {
      kamus: F(term, stem + "くない"), sopan: F(sop[0], sop[1]),
      te: F(stem + "くて", stem + "くなくて"), lampau: F(stem + "かった", stem + "くなかった"),
      tara: F(stem + "かったら", stem + "くなかったら"),
      bersyarat: F(stem + "ければ", stem + "くなければ"),
      sugiru: F(stem + "すぎる", stem + "すぎない"),
    };
  }
  return null;
}

function cellNode(text) {
  if (text === null || text === undefined) return { tag: "td", content: "—" };
  return { tag: "td", content: text };
}

export function formsBlock(term, reading, table, cls) {
  const tds = (pair) => pair;
  const prow = (key) => {
    const pair = table[key];
    if (!pair || (!pair[0] && !pair[1])) return null;
    return {
      tag: "tr", data: { content: "forms-row" }, content: [
        { tag: "th", data: { content: "forms-row-label" }, content: ROW_LABEL[key] },
        cellNode.call({ term, reading }, pair[0]),
        cellNode.call({ term, reading }, pair[1]),
      ],
    };
  };
  const paired = ROWS_PAIRED.map(prow).filter(Boolean);
  // Tabel tunggal: pasangannya sopan (turunan dari baris berpasangan).
  const get = (k, i) => (table[k] && table[k][i]) || null;
  const isVerb = !!cls && (cls[0] === "v" || cls === "vz");
  const singleDefs = isVerb ? [
    ["volisional", get("sopan", 0) ? get("sopan", 0).replace(/ます$/, "ましょう") : null],
    ["perintah", get("te", 0) ? get("te", 0) + "ください" : null],
    ["larangan", get("kamus", 1) ? get("kamus", 1) + "でください" : null],
  ] : [];
  const srows = [];
  for (const [key, sopan] of singleDefs) {
    const biasa = get(key, 0);
    if (!biasa && !sopan) continue;
    srows.push({
      tag: "tr", data: { content: "forms-row" }, content: [
        { tag: "th", data: { content: "forms-row-label" }, content: ROW_LABEL[key] },
        cellNode.call({ term, reading }, biasa),
        cellNode.call({ term, reading }, sopan),
      ],
    });
  }
  if (!paired.length && !srows.length) return null;
  const tables = [];
  if (paired.length) {
    tables.push({
      tag: "table", data: { content: "forms-table" }, content: [
        {
          tag: "tr", data: { content: "forms-header-row" }, content: [
            { tag: "th", content: "Bentuk" },
            { tag: "th", content: "Positif" },
            { tag: "th", content: "Negatif" },
          ],
        },
        ...paired,
      ],
    });
  }
  if (srows.length) {
    tables.push({
      tag: "table", data: { content: "forms-table-single" }, content: [
        {
          tag: "tr", data: { content: "forms-header-row" }, content: [
            { tag: "th", content: "Bentuk" },
            { tag: "th", content: "Biasa" },
            { tag: "th", content: "Sopan" },
          ],
        },
        ...srows,
      ],
    });
  }
  return {
    tag: "div", data: { content: "forms" }, content: [
      { tag: "span", data: { class: "tag", content: "forms-label" }, content: "Konjugasi" },
      { tag: "div", data: { content: "forms-tables" }, content: tables },
    ],
  };
}

function bankFiles(dir) {
  return readdirSync(dir)
    .filter((n) => /^term_bank_\d+\.json$/.test(n))
    .sort((a, b) => Number(a.match(/(\d+)/)[1]) - Number(b.match(/(\d+)/)[1]));
}

function cmdTable(term) {
  if (!term) { console.error("Usage: node scripts/conj.mjs table <kata>"); process.exit(1); }
  const cls = classify(term);
  if (!cls) { console.error(`tidak bisa diklasifikasi: ${term}`); process.exit(1); }
  const t = conjugate(term, cls);
  if (!t) { console.error(`gagal generate: ${term} [${cls}]`); process.exit(1); }
  console.log(`${term} [${cls}]`);
  for (const k of [...ROWS_PAIRED, ...ROWS_SINGLE]) {
    const pair = t[k];
    if (!pair || (!pair[0] && !pair[1])) continue;
    console.log(`  ${k} | ${pair[0] ?? "-"} | ${pair[1] ?? "-"}`);
  }
}

function cmdInject(dir) {
  if (!dir) { console.error("Usage: node scripts/conj.mjs inject <dir>"); process.exit(1); }
  const skipped = [];
  let nHit = 0, nSkip = 0;
  for (const f of bankFiles(dir)) {
    const p = join(dir, f);
    const data = JSON.parse(readFileSync(p, "utf8"));
    let dirty = false;
    for (const e of data) {
      if (!Array.isArray(e) || e.length !== 8) continue;
      const [term, reading] = e;
      const tag = (e[3] ?? "").split(" ")[0];
      const eligible = tag.startsWith("動詞") || tag === "形容詞-一般-*" || tag.includes("サ変");
      if (!eligible) continue;
      const conjTerm = tag.includes("サ変") && !tag.startsWith("動詞") ? term + "する" : term;
      const cls = classify(conjTerm);
      const table = cls ? conjugate(conjTerm, cls) : null;
      if (!table) { nSkip++; skipped.push(`${term} (${reading || "-"}) [${cls ?? "?"}]`); continue; }
      const defs = Array.isArray(e[5]) ? e[5] : [];
      const d = defs[0];
      if (!d || d.type !== "structured-content") { nSkip++; skipped.push(`${term} [bukan-structured]`); continue; }
      const sg = d.content.find((c) => c?.data?.content === "sense-group");
      if (!sg) { nSkip++; skipped.push(`${term} [tanpa sense-group]`); continue; }
      const block = formsBlock(term, reading, table, cls);
      if (!block) { nSkip++; skipped.push(`${term} [tabel kosong]`); continue; }
      const gi = sg.content.findIndex((c) => c?.data?.content === "glossary");
      const fi = sg.content.findIndex((c) => c?.data?.content === "forms");
      if (fi !== -1) sg.content.splice(fi, 1);
      const at = sg.content.findIndex((c) => c?.data?.content === "glossary");
      sg.content.splice(at === -1 ? sg.content.length : at + 1, 0, block);
      nHit++;
      dirty = true;
    }
    if (dirty) writeFileSync(p, JSON.stringify(data));
  }
  console.log(JSON.stringify({ injected: nHit, skipped: nSkip, skipSample: skipped.slice(0, 30) }));
}

import { pathToFileURL } from "node:url";

const [cmd, a1] = process.argv.slice(2);
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
if (cmd === "table") cmdTable(a1);
else if (cmd === "inject") cmdInject(a1);
else { console.log("Usage:\n  node scripts/conj.mjs table <kata>\n  node scripts/conj.mjs inject <dir>"); process.exit(1); }
}
