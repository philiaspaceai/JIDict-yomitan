---
name: japanese-gloss-craft
description: Craft highly accurate Indonesian meanings for Japanese vocabulary when adding new JIDict dictionary entries or improving existing glosses. Use when the user wants to write, add, or fix the meaning of a Japanese word, create a new entry from scratch, or check whether a gloss is accurate. Grounds every sense in Japanese monolingual dictionaries before writing anything.
---

# Japanese Gloss Craft (JIDict edition)

Produce expert-linguist-quality **Indonesian** meanings for Japanese words, for the
JIDict dictionary. Quality comes from **process + sources, not model cleverness**:
you never write a meaning from memory. Every sense is quoted from a monolingual
dictionary first, then rendered into Indonesian.

For file mechanics (finding/adding/fixing entries, validating) use the repo tool
`scripts/jidict.mjs` (`get`/`add`/`fix`/`validate`) — this skill decides
**what the meaning says**. Output glosses as plain Indonesian clauses, WITHOUT
numbers, headers, or labels — the tool wraps them into JIDict structure.

## How It Works

1. **Pin down the term** — headword, reading, part of speech, and the user's context
   (which sense do they need? if unclear, ask).
2. **Prepare monolingual sources** — pick at least one trusted Japanese monolingual
   dictionary you have access to (see `references/monolingual-sources.md`),
   then look up **only this term**.
3. **Collect monolingual senses** — quote each sense's definition in Japanese,
   keeping senses separate exactly as the source separates them.
4. **Map senses** — decide split vs merge per `references/sense-mapping.md`.
5. **Write Indonesian glosses** — per `references/gloss-craft.md` (+ the JIDict
   note at its end), one plain clause per sense, each citing its monolingual source.
6. **Pass the quality gate, then hand off** — no entry is written until every
   gate item passes; then write via `scripts/jidict.mjs`
   (see `references/entry-handoff.md`).

## Quality Gate (all must pass)

- [ ] Every Indonesian sense traces to a quoted monolingual sense (no memory-written glosses).
- [ ] Polysemous words checked in ≥2 monolingual sources; disagreements kept as separate senses.
- [ ] Transitive/intransitive pairs, register (keigo/slang/archaic), and aspect nuance verified, not assumed.
- [ ] Gloss reads naturally in Indonesian (no translationese) and fits the user's context.
- [ ] Source cited per sense (dictionary name + sense number).

## Present Results to User

Per sense: monolingual quote (short) → your gloss → source. Then the written entry
and its validation result. Summarize — don't dump banks. Write for a
non-programmer: no JSON, no branch talk, no file mechanics.

## Troubleshooting

- Term missing in one dictionary → try another source before concluding it doesn't exist
  (coverage differs, especially slang vs classical).
- Unfamiliar TAG for the new entry → run the tool; it rejects unknown TAGs with the
  full known list. Pick the closest known TAG; if none fits, stop and ask the user.
- Unsure which sense the user needs → ask with the monolingual options, don't guess.

## Reference files (read on demand, not up front)

- `references/monolingual-sources.md` — which dictionary for what.
- `references/sense-mapping.md` — splitting/mapping senses like a lexicographer.
- `references/gloss-craft.md` — writing accurate, natural meanings (+ JIDict note).
- `references/entry-handoff.md` — turning finished glosses into a JIDict entry.
