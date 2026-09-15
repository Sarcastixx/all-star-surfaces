# All Star Surfaces

Public website for All Star Flooring / All Star Surfaces.

Live domain: https://www.all-star-flooring.com

This is a **static site** (HTML, CSS, JS). No build step.

## Pages

- `index.html` — Home (scrollable)
- `flooring.html` — Materials
- `services.html` — Process
- `portfolio.html` — Work
- `about.html` — Studio
- `contact.html` — Phone / email
- `quote.html` — Quote form (name, phone, email, second email)

## How to edit (no terminal)

1. Open this repo on GitHub.
2. Click a file (for example `index.html`).
3. Click the pencil (Edit).
4. Change the words or image URLs.
5. Click **Commit changes**.
6. If this repo is connected to Cloudflare Pages, the site updates in a minute or two.

### Change a photo

Find a line that looks like:

```html
<img src="https://images.unsplash.com/...." alt="Kitchen">
```

Replace the `src="..."` with your own photo URL.

### Change phone or email

Search the files for `(206) 799-9881` and `hello@all-star-flooring.com`.

## Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick `Sarcastixx/all-star-surfaces`.
3. Framework preset: **None**.
4. Build command: leave empty.
5. Output directory: `/` (root).
6. Deploy, then attach `www.all-star-flooring.com` under **Custom domains**.

Turn **off** Cloudflare Access on the domain so visitors do not see a login screen.
