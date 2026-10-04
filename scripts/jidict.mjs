#!/usr/bin/env node
// jidict.mjs — tool khusus JIDict untuk AI agent kontributor.
// Prinsip: sederhana (4 perintah), struktur terkunci mengikuti standar JIDict.
// - TAG asing ditolak (harus ada di KNOWN_TAGS).
// - Label Indonesia + atribusi diisi otomatis oleh tool, bukan oleh agent.
// - Contoh/rujukan/antonim HANYA dari maintainer (tak tersentuh tool ini).
// Zero dependency: hanya Node stdlib. Laws: tool ini tidak commit/publish.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { classify } from "./conj.mjs";

const BANK_SPLIT = 10000;
const ATTRIB_TEXT = "JIDict (CC BY-NC 4.0)";
const ATTRIB_HREF = "https://github.com/philiaspaceai/JIDict-yomitan";

// Daftar TAG kelas kata yang dikenal (diambil dari data JIDict).
// Di luar daftar ini -> add/fix DITOLAK.
const KNOWN_TAGS = ["代名詞-*-*","副詞-*-*","助動詞-*-*","助詞-係助詞-*","助詞-副助詞-*","助詞-接続助詞-*","助詞-格助詞-*","助詞-準体助詞-*","助詞-終助詞-*","動詞-一般-*","動詞-非自立可能-*","名詞-固有名詞-一般","名詞-固有名詞-人名","名詞-固有名詞-地名","名詞-数詞-*","名詞-普通名詞-サ変可能","名詞-普通名詞-サ変形状詞可能","名詞-普通名詞-一般","名詞-普通名詞-副詞可能","名詞-普通名詞-助数詞可能","名詞-普通名詞-形状詞可能","形容詞-一般-*","形容詞-非自立可能-*","形状詞-タリ-*","形状詞-一般-*","形状詞-助動詞語幹-*","感動詞-フィラー-*","感動詞-一般-*","接尾辞-動詞的-*","接尾辞-名詞的-サ変可能","接尾辞-名詞的-一般","接尾辞-名詞的-副詞可能","接尾辞-名詞的-助数詞","接尾辞-形容詞的-*","接尾辞-形状詞的-*","接続詞-*-*","接頭辞-*-*","補助記号-一般-*","補助記号-括弧開-*","記号-一般-*","記号-文字-*","連体詞-*-*"];

// Label Indonesia per TAG (preseden data; sisanya generik per level-1).
const LABELS = {"代名詞-*-*":"kata ganti","副詞-*-*":"keterangan","助動詞-*-*":"kata bantu","助詞-係助詞-*":"partikel","助詞-副助詞-*":"partikel","助詞-接続助詞-*":"partikel","助詞-格助詞-*":"partikel","助詞-準体助詞-*":"partikel","助詞-終助詞-*":"partikel","動詞-一般-*":"kata kerja","動詞-非自立可能-*":"kata kerja","名詞-固有名詞-一般":"kata benda nama diri","名詞-固有名詞-人名":"kata benda nama orang","名詞-固有名詞-地名":"kata benda nama tempat","名詞-数詞-*":"bilangan","名詞-普通名詞-サ変可能":"kata benda (verba suru)","名詞-普通名詞-サ変形状詞可能":"kata benda (suru+adj-na)","名詞-普通名詞-一般":"kata benda umum","名詞-普通名詞-副詞可能":"kata benda (adverbia)","名詞-普通名詞-助数詞可能":"kata benda (counter)","名詞-普通名詞-形状詞可能":"kata benda (adj-na)","形容詞-一般-*":"kata sifat-i","形容詞-非自立可能-*":"kata sifat-i","形状詞-タリ-*":"kata sifat-na","形状詞-一般-*":"kata sifat-na","形状詞-助動詞語幹-*":"kata sifat-na","感動詞-フィラー-*":"kata seru","感動詞-一般-*":"kata seru","接尾辞-動詞的-*":"akhiran verba","接尾辞-名詞的-サ変可能":"akhiran nomina","接尾辞-名詞的-一般":"akhiran nomina","接尾辞-名詞的-副詞可能":"akhiran nomina","接尾辞-名詞的-助数詞":"akhiran nomina","接尾辞-形容詞的-*":"akhiran adjektiva","接尾辞-形状詞的-*":"akhiran adjektiva","接続詞-*-*":"kata sambung","接頭辞-*-*":"awalan","補助記号-一般-*":"simbol","補助記号-括弧開-*":"simbol","記号-一般-*":"simbol","記号-文字-*":"simbol","連体詞-*-*":"kata penentu"};

const usage = `Usage (dari root repo):
  node scripts/jidict.mjs get ./src --term <kata> [--reading <bacaan>]
  node scripts/jidict.mjs add ./src --entry '{"term":"...","reading":"...","tag":"...","senses":["..."]}'
  node scripts/jidict.mjs fix ./src --term <kata> [--reading <bacaan>] [--def 0] --senses '["..."]'
  node scripts/jidict.mjs validate ./src`;

function fail(msg) { console.error(`Error: ${msg}`); process.exit(1); }
function getArg(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? null : process.argv[i + 1] ?? null;
}
function isZip(p) { return p.toLowerCase().endsWith(".zip"); }
function readJson(path) {
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch (e) { fail(`JSON rusak di ${path}: ${e.message}`); }
}
function bankFiles(dir) {
  return readdirSync(dir)
    .filter((n) => /^term_bank_\d+\.json$/.test(n))
    .sort((a, b) => Number(a.match(/(\d+)/)[1]) - Number(b.match(/(\d+)/)[1]));
}
function zipNames(zipPath) {
  try {
    return execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" })
      .split("\n").map((s) => s.trim()).filter(Boolean);
  } catch { fail(`tidak bisa membaca zip (butuh 'unzip'): ${zipPath}`); }
}
function zipRead(zipPath, inner) {
  try { return execFileSync("unzip", ["-p", zipPath, inner], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 }); }
  catch { fail(`tidak bisa membaca ${inner} dari ${zipPath}`); }
}

// Kode kondisi Yomitan (v1/v5/vs/vk/vz/adj-i) untuk field rules.
// Tanpa kode ini entri verba/adjektiva TIDAK cocok pada pencarian bentuk
// konjugasi (Yomitan + hoshidicts memfilter via POS). `add` menempelkannya
// otomatis; `validate` mewajibkannya. Jangan tulis manual.
function rulesCodeFor(tag, term) {
  const cls = classify(term);
  if (!cls) return null;
  if (tag.startsWith("動詞") && (cls === "v1" || cls.startsWith("v5") || ["vs", "vk", "vz"].includes(cls))) {
    return cls.startsWith("v5") ? "v5" : cls;
  }
  if (tag === "形容詞-一般-*" && (cls === "adj-i" || cls === "adj-i-sp")) return "adj-i";
  return null;
}

// Glos0: POS pill + daftar makna. Contoh/rujukan/antonim/atribusi di luar cakupan tool ini:
// - add: atribusi ditempel otomatis.
// - fix: blok selain makna dipertahankan apa adanya.
function buildDef(tag, senses) {
  if (!KNOWN_TAGS.includes(tag)) {
    fail(`TAG tidak dikenal: "${tag}". Gunakan salah satu dari:\n${KNOWN_TAGS.join(", ")}`);
  }
  const clean = senses.map((s) => String(s).trim()).filter(Boolean);
  if (!clean.length) fail("senses kosong — tulis minimal 1 makna");
  return {
    type: "structured-content",
    content: [
      {
        tag: "div", data: { content: "sense-group" }, content: [
          {
            tag: "span", title: tag,
            data: { class: "tag", code: tag, content: "part-of-speech-info" },
            content: LABELS[tag] ?? tag,
          },
          {
            tag: "ol", data: { content: "glossary" }, content: clean.map((s) => ({
              tag: "li", data: { content: "sense" }, content: [
                { tag: "span", data: { content: "gloss" }, content: s },
              ],
            })),
          },
        ],
      },
      {
        tag: "div", data: { content: "attribution" }, content: [
          { tag: "a", href: ATTRIB_HREF, content: ATTRIB_TEXT },
        ],
      },
    ],
  };
}

function findEntries(target, term, reading) {
  const hits = [];
  const files = isZip(target)
    ? zipNames(target).filter((n) => /^term_bank_\d+\.json$/.test(n) && !n.includes("/")).sort()
    : bankFiles(target);
  if (!files.length) fail(`tidak ada bank di ${target}`);
  for (const name of files) {
    const data = isZip(target) ? JSON.parse(zipRead(target, name)) : readJson(join(target, name));
    data.forEach((e, i) => {
      if (Array.isArray(e) && e[0] === term && (!reading || e[1] === reading)) {
        hits.push({ file: name, index: i, entry: e });
      }
    });
  }
  return hits;
}

function cmdGet(target, term, reading) {
  if (!target || !term) fail(usage);
  console.log(JSON.stringify(findEntries(target, term, reading), null, 2));
}

function cmdAdd(dir, entryJson) {
  if (!dir || !entryJson) fail(usage);
  let input;
  try { input = JSON.parse(entryJson); }
  catch (e) { fail(`--entry bukan JSON valid: ${e.message}`); }
  const { term, reading = "", tag, senses } = input;
  if (typeof term !== "string" || !term) fail("--entry butuh term (string tak-kosong)");
  if (typeof reading !== "string") fail("--entry reading harus string");
  if (!Array.isArray(senses)) fail("--entry senses harus array of string");
  const files = bankFiles(dir);
  if (!files.length) fail(`tidak ada bank di ${dir}`);
  const defObj = buildDef(tag, senses);
  let maxSeq = -1;
  for (const f of files) {
    for (const e of readJson(join(dir, f))) {
      if (typeof e[6] === "number" && e[6] > maxSeq) maxSeq = e[6];
    }
  }
  const code = rulesCodeFor(tag, term);
  const entry = [term, reading, "", code ? tag + " " + code : tag, 0, [defObj], maxSeq + 1, ""];
  const last = files[files.length - 1];
  const data = readJson(join(dir, last));
  data.push(entry);
  if (data.length > BANK_SPLIT) {
    const overflow = data.splice(BANK_SPLIT);
    writeFileSync(join(dir, last), JSON.stringify(data));
    const next = `term_bank_${Number(last.match(/(\d+)/)[1]) + 1}.json`;
    writeFileSync(join(dir, next), JSON.stringify(overflow));
    console.log(`Ditambah ke ${last} (bank penuh -> ${next})`);
  } else {
    writeFileSync(join(dir, last), JSON.stringify(data));
    console.log(`Ditambah ke ${last} (kini ${data.length} entri)`);
  }
}

function cmdFix(dir, term, reading, defIdx, sensesJson) {
  if (!dir || !term || !sensesJson) fail(usage);
  let senses;
  try { senses = JSON.parse(sensesJson); }
  catch (e) { fail(`--senses bukan JSON valid: ${e.message}`); }
  if (!Array.isArray(senses)) fail("--senses harus array of string");
  const clean = senses.map((s) => String(s).trim()).filter(Boolean);
  if (!clean.length) fail("--senses kosong");
  const hits = findEntries(dir, term, reading || undefined);
  if (!hits.length) fail(`tidak ketemu: ${term}${reading ? ` (${reading})` : ""}`);
  if (hits.length > 1 && !reading) {
    fail(`cocok ${hits.length} entri — sebutkan --reading. Bacaan tersedia: ${hits.map((h) => h.entry[1] || "(kosong)").join(", ")}`);
  }
  const { file, index } = hits[0];
  const data = readJson(join(dir, file));
  const e = data[index];
  const di = Number(defIdx ?? 0);
  const d = e[5][di];
  if (!d || d.type !== "structured-content") fail("definisi target bukan structured-content");
  const sg = d.content.find((c) => c?.data?.content === "sense-group");
  const ol = sg?.content?.find((c) => c?.data?.content === "glossary");
  if (!ol) fail("glossary tidak ditemukan");
  ol.content = clean.map((s) => ({
    tag: "li", data: { content: "sense" }, content: [
      { tag: "span", data: { content: "gloss" }, content: s },
    ],
  }));
  writeFileSync(join(dir, file), JSON.stringify(data));
  console.log(`Diperbaiki: ${term} (${e[1] || "tanpa bacaan"}) di ${file}#${index}, ${clean.length} makna`);
}

function cmdValidate(target) {
  if (!target) fail(usage);
  const errors = [];
  const files = isZip(target)
    ? zipNames(target).filter((n) => (n.endsWith(".json") || n === "styles.css") && !n.includes("/"))
    : readdirSync(target).filter((n) => n.endsWith(".json") || n === "styles.css");
  if (!files.includes("index.json")) fail(`bukan direktori kamus (tanpa index.json): ${target}`);
  const readText = (n) => (isZip(target) ? zipRead(target, n) : readFileSync(join(target, n), "utf8"));
  let index;
  try { index = JSON.parse(readText("index.json")); }
  catch (e) { fail(`index.json rusak: ${e.message}`); }
  if (typeof index.title !== "string" || !index.title) errors.push("index.json: title kosong");
  if (index.format !== 3) errors.push("index.json: format harus 3");
  if (typeof index.revision !== "string" || !index.revision) errors.push("index.json: revision kosong");
  // Syarat auto-update Yomitan (jangan dirilis tanpanya — rantai update akan putus).
  if (index.isUpdatable !== true) errors.push("index.json: isUpdatable harus true (auto-update)");
  for (const k of ["indexUrl", "downloadUrl"]) {
    if (typeof index[k] !== "string" || !index[k].startsWith("https://")) {
      errors.push(`index.json: ${k} harus URL https yang valid`);
    }
  }
  const nums = new Set();
  for (const n of files) {
    const m = /^(term_bank)_(\d+)\.json$/.exec(n);
    if (n.endsWith(".json") && n !== "index.json" && !m) errors.push(`${n}: nama file tak dikenal`);
    if (m) nums.add(Number(m[2]));
  }
  if (nums.size) {
    const max = Math.max(...nums);
    for (let k = 1; k <= max; k++) {
      if (!nums.has(k)) errors.push(`term_bank_${k}.json hilang (penomoran harus 1..${max} tanpa lompat)`);
    }
  }
  let nEnt = 0, nSense = 0;
  for (const n of files) {
    const m = /^(term_bank)_(\d+)\.json$/.exec(n);
    if (!m) continue;
    let data;
    try { data = JSON.parse(readText(n)); }
    catch (e) { errors.push(`${n}: JSON rusak`); continue; }
    if (!Array.isArray(data) || !data.length) { errors.push(`${n}: bank kosong/bukan array`); continue; }
    if (data.length > BANK_SPLIT) errors.push(`${n}: melebihi ${BANK_SPLIT} entri`);
    data.forEach((e, i) => {
      nEnt++;
      if (!Array.isArray(e) || e.length !== 8) { errors.push(`${n}[${i}]: bukan entri 8 field`); return; }
      if (typeof e[0] !== "string" || !e[0]) { errors.push(`${n}[${i}]: term kosong`); return; }
      {
        const need = rulesCodeFor(String(e[3] ?? "").split(" ")[0], e[0]);
        const have = String(e[3] ?? "").split(" ");
        if (need && !have.includes(need)) {
          errors.push(`${n}[${i}]: entri terkonyugasi tanpa kode rules "${need}" (tambah via tool / minta maintainer menjalankan pass kode)`);
        }
      }
      for (const d of e[5]) {
        if (typeof d === "string") { errors.push(`${n}[${i}]: masih string (belum structured)`); continue; }
        if (d?.type !== "structured-content" || !Array.isArray(d.content)) { errors.push(`${n}[${i}]: structured-content rusak`); continue; }
        const sg = d.content.find((c) => c?.data?.content === "sense-group");
        if (!sg) { errors.push(`${n}[${i}]: tanpa sense-group`); continue; }
        const pill = sg.content.find((c) => c?.data?.content === "part-of-speech-info");
        const code = pill?.data?.code ?? "";
        const label = typeof pill?.content === "string" ? pill.content : "";
        if (!code || !KNOWN_TAGS.includes(code)) errors.push(`${n}[${i}]: TAG asing/kosong: ${code || "(kosong)"}`);
        if (!label) errors.push(`${n}[${i}]: label pill kosong`);
        const ol = sg.content.find((c) => c?.data?.content === "glossary");
        const items = ol?.content ?? [];
        if (!items.length) { errors.push(`${n}[${i}]: glossary kosong`); continue; }
        for (const li of items) {
          nSense++;
          const t = li?.content?.find?.((c) => c?.data?.content === "gloss")?.content;
          if (typeof t !== "string" || !t.trim()) { errors.push(`${n}[${i}]: gloss kosong`); continue; }
          if (/^【/.test(t)) errors.push(`${n}[${i}]: sisa header teks-datar: ${t.slice(0, 50)}`);
          if (/[①-⑳㉑-㉟]/.test(t)) errors.push(`${n}[${i}]: sisa penomoran teks-datar: ${t.slice(0, 50)}`);
          const toks = t.split(/\s+/);
          for (let k = 0; k + 9 < toks.length; k++) {
            let run = true;
            for (let r = 1; r < 10; r++) { if (toks[k + r] !== toks[k]) { run = false; break; } }
            if (run) { errors.push(`${n}[${i}]: indikasi loop: ${t.slice(0, 60)}`); break; }
          }
        }
      }
    });
  }
  const ok = !errors.length;
  console.log(JSON.stringify({ target, ok, entries: nEnt, senses: nSense, errors: errors.slice(0, 20), errorCount: errors.length }, null, 2));
  process.exit(ok ? 0 : 1);
}

const [cmd, target, a3] = process.argv.slice(2);
if (cmd === "get") cmdGet(target, getArg("--term"), getArg("--reading"));
else if (cmd === "add") cmdAdd(target, getArg("--entry"));
else if (cmd === "fix") cmdFix(target, getArg("--term"), getArg("--reading"), getArg("--def"), getArg("--senses"));
else if (cmd === "validate") cmdValidate(target);
else { console.log(usage); process.exit(1); }
