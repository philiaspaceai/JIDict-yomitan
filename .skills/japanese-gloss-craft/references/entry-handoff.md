# Entry Handoff (JIDict edition)

Turn finished, gate-passed glosses into a valid JIDict entry using the repo tool
`scripts/jidict.mjs`. You write the **content** (plain Indonesian clauses);
the tool owns the **mechanics** (structure, labels, attribution, numbering).

## JIDict entry anatomy (what the tool builds for you)

- A definition holds a POS pill (TAG + Indonesian label, filled automatically
  from the TAG you give) followed by a list of senses, one plain clause each.
- You MUST supply a known TAG (e.g. `動詞-一般-*`, `名詞-普通名詞-一般`).
  The tool rejects unknown TAGs and prints the full known list — pick the
  closest one, or stop and ask the user if none fits.
- Sense numbering, example sentences, cross-references, and attribution are
  handled outside your output. Your senses must be plain text: no numbers,
  no headers, no labels.

## Handoff commands (from repo root)

```bash
# find first (avoid duplicates)
node scripts/jidict.mjs get ./src --term "渋い"
# new entry (TAG validated, label + attribution automatic)
node scripts/jidict.mjs add ./src --entry '{"term":"渋い","reading":"しぶい","tag":"形容詞-一般-*","senses":["sepat (rasa)","muram (wajah)","halus dan berselera"]}'
# fix meanings of an existing entry (structure preserved, only senses replaced)
node scripts/jidict.mjs fix ./src --term "渋い" --senses '["sepat (rasa)","muram (wajah)","halus dan berselera"]'
# always validate before opening a PR
node scripts/jidict.mjs validate ./src
```

## Rules

- `get` before `add` — never create a duplicate of an existing entry.
- Never touch `index.json` revision, example/cross-reference blocks, workflows,
  or the tool itself.
- Never build/pack `.zip` files and never commit `dist/` output — releases are
  built by CI from tags.
- Keep source citations in your reply to the user, not inside the entry.
