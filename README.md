# All Star Surfaces

Public website for All Star Flooring / All Star Surfaces.

Live domain: https://www.all-star-flooring.com

This is a **static site** (HTML, CSS, JS). No build step.

## Pages

- `index.html` — Home (scrollable). Recent jobs come from `data/jobs.json`.
- `flooring.html` — Materials
- `services.html` — Process
- `portfolio.html` — All jobs from `data/jobs.json`
- `remnants.html` — Shop-style remnant listings from `data/remnants.json` (inquire only, no cart)
- `about.html` — Studio
- `contact.html` — Phone / email
- `quote.html` — Quote form

## Easy weekly updates (no code)

You only touch two files after photos are in place:

1. **Remnants shop** → [data/remnants.json](data/remnants.json)
2. **Recent jobs** → [data/jobs.json](data/jobs.json)

On GitHub: open the file → pencil (Edit) → change text → **Commit changes**.
If this repo is connected to Cloudflare Pages, the live site updates in a minute or two.

### Add a remnant

1. Upload a photo to `images/remnants/` (Add file → Upload).
2. Copy one existing block in `data/remnants.json` and change the fields.

`status` can be `available`, `hold`, `sold`, or `hidden`.

### Add a recent job

1. Upload a photo to `images/jobs/`.
2. Add a block in `data/jobs.json`.
3. Set `"featured": true` on up to 3 jobs to show them on the homepage.

Keep a comma between items. Do not put a comma after the last item.

## Cloudflare Pages

1. Workers & Pages → Create → Pages → Connect to Git.
2. Pick `Sarcastixx/all-star-surfaces`.
3. Framework preset: **None**. Build command empty. Output directory `/`.
4. Attach `www.all-star-flooring.com` under Custom domains.
5. Turn **off** Cloudflare Access so visitors do not see a login screen.

## Studio (hidden staff login)

Footer: **Staff sign in**.

- Full edit (all text + photos): `1976@llstar!`
- Update remnants and recent jobs: `Allstar.update!`

Saves on Cloudflare after this repo deploys with `worker.js`.

## Quote leads (email + Google Sheet)

Quotes email **Allstarseattle@gmail.com** through FormSubmit. The first time, that inbox gets a **Confirm form** email — click it once.

To also save every lead in a Google Sheet:

1. Open Google Drive → New → Google Sheet. Name it **All Star Leads**.
2. Extensions → Apps Script. Delete the sample code. Paste `data/leads.gs`.
3. Save. In the function list pick **testLead**, click **Run**, and allow permissions.
4. Deploy → New deployment → Web app.
5. Execute as: **Me**. Who has access: **Anyone**.
6. Deploy, copy the URL, and send it so it can be saved as `SHEET_WEBHOOK`.

Do not click Run on **doPost**. That function is only for live website quotes.

