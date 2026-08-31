---
name: reset-demo-state
description: Put a Ledgerly demo machine back to the shipped state — reseed SQLite, restore the intentional red test, free the port, clear stray edits. Use when a demo just ended, the data looks wrong, tests are unexpectedly green, or the dev server will not start.
---

# Reset the demo state

Goal state: clean working tree on `main`, seeded Fieldnote book, dev server on 43173, and `npm test` showing exactly **1 failed / 9 passed**.

## Checklist (run what applies)

1. **Stray edits from the last demo**

```bash
git status
git checkout -- lib/dispute-credit.ts   # the sanctioned fix beat turns this green; red is shipped
git checkout -- .                        # only if the user agrees to drop ALL local changes
```

2. **Database looks wrong / empty dashboard**

```bash
npx prisma db seed        # idempotent: pushes schema + reloads Fieldnote
# nuclear option if the file is corrupt:
npm run db:reset
```

There are no migrations in this repo — never run `prisma migrate`; the seed's `db push` is the whole story.

3. **Port 43173 busy**

```bash
lsof -ti :43173 | xargs kill   # macOS/Linux/WSL
npm run dev
```

4. **Verify shipped state**

```bash
npm test    # expect: 1 failed (dispute-credit), 9 passed
```

Open `http://127.0.0.1:43173` — dashboard shows Fieldnote data, catalog $49/$99/$249, disputes badge on the sidebar.

Open `http://127.0.0.1:43173/disputes/dsp_1043` — the Resolution panel shows a red **Suggested credit $400.00** above the $249 Scale price. If it reads $249.00, the sanctioned fix is still applied: `git checkout -- lib/dispute-credit.ts`.

## Never

- Never delete `prisma/seed.ts` data or add customers to "fix" a demo.
- Never commit a green `lib/dispute-credit.ts` to main to make CI happy — red is the product.
