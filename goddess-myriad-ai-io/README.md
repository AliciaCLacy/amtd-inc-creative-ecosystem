# Goddess Myriad AI.io — Phase 1: The Living Library

**Authored Alicia C. Lacy. All rights reserved.**

The living brain of Alicia C. Lacy's creations — Phase 1 is the browsable,
searchable library of all 259 creations. No build step. No paid services.
Deploys to any free static host as-is.

## What it is

A static web app (HTML/CSS/JS) with three views:

- **Home** — Goddess Myriad greets visitors in her voice, shows library stats,
  and holds the Phase 2 slots (Talk panel + Support/Membership, both marked
  "coming with Phase 2").
- **Library** — all 259 creations in a searchable, filterable beveled grid.
  Click any card for its detail (name, category, date, status, author).
  Titles are verbatim from the tracker — never reworded.
- **About** — the authorship story: dates + authorship, nothing ever removed.

## Deploy

Any static host. Two free options:

**Netlify** — drag the `goddess-myriad-ai-io/` folder into Netlify Drop,
or connect the folder as a site. `netlify.toml` is included (publishes `.`,
no build command).

**Cloudflare Pages** — "Upload assets" and drop the folder in, or
`npx wrangler pages deploy .` from inside the folder.

`.nojekyll` is included so GitHub Pages serves files verbatim if used there.

## Update the library

The library is generated from the Creation Value Tracker CSV:

```bash
python3 - << 'EOF'
import csv, json
src = '~/workspace/your_files/H01-Signature-Package/Creation-Value-Tracker-2026-09-10.csv'
with open(src, encoding='utf-8') as f:
    rows = list(csv.reader(f))
data = [r for r in rows[3:] if any(c.strip() for c in r)]
creations = [{
    "id": i,
    "name": r[0].strip(),
    "category": r[1].strip(),
    "date": r[3].strip(),
    "status": r[4].strip(),
    "author": r[12].strip() if len(r) > 12 else "Alicia C. Lacy",
} for i, r in enumerate(data, 1)]
with open('creations.json', 'w', encoding='utf-8') as f:
    json.dump({"generated": "2026-10-18",
               "source": "Creation-Value-Tracker-2026-09-10.csv",
               "count": len(creations),
               "creations": creations}, f, ensure_ascii=False, indent=1)
print("creations:", len(creations))
EOF
```

Re-run whenever the tracker gains rows, then redeploy (or push — hosts
redeploy automatically on git push).

## Architecture note — Phase 2

Phase 1 is deliberately the living library only. Phase 2 adds:

1. **Live AI chat** ("Talk to Goddess Myriad") — an API-backed chat panel
   answering from these works. The UI slot already exists on Home, disabled
   and marked "coming with Phase 2". When wired, it calls an LLM API with
   the library as its knowledge base; the only ongoing cost is per-message
   API usage.
2. **Stripe payments** ("Support / Membership") — direct membership so
   supporters pay Alicia with no platform cut. UI slot exists on Home.

Phase 2 keeps the 100% rule: her code, her domain, her data — no backend
lock-in. The static Phase 1 shell stays exactly as-is underneath.

## Rules (hers)

- Her titles and names verbatim — never reworded or inferred down.
- Authorship "Alicia C. Lacy" on everything.
- Dates + authorship on every work — that is how she is paid.
- Her works are never removed. Duplicates go in a folder titled
  "duplicates" — moved, never deleted.
- Nothing invented: only what's in the tracker CSV and her files.
  Anything unclear is marked `TODO (Alicia)`.
