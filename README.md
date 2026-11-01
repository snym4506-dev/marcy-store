# MARCYSTORE

A storefront for hand-sculpted anime/cartoon keychains, medals, charms and small
things — plus a built-in studio admin for adding products and changing prices.

Visual system: jet black, deep burgundy (نبيتي), and warm cream. Editorial type,
grain, bold layout.

## Run it

```bash
npm install
npm run dev
```

- Store: `http://localhost:5173/`
- Admin: `http://localhost:5173/admin`

## Build for production

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

---

## The studio admin (`/admin`)

Open `/admin` (there is also a **Studio login** link in the footer).

**Default passcode: `marcy`**

Change it at the top of `src/Admin.jsx`:

```js
const PASSCODE = "marcy";
```

The passcode is a front-end gate on a static site. It keeps casual visitors out
of the UI; it is **not** real security, because the check runs in the browser.
If the shop ever needs real accounts, put the admin behind a server.

### What she can do

- **Add a product** — name, price, category, badge, edition, size, description,
  details, photo, and whether it is visible.
- **Change a price** — edit the price directly in the table; it saves when you
  click away or press Enter.
- **Edit a product** — pencil button opens the full form.
- **Hide / show** — the switch controls whether a piece appears in the shop.
- **Delete** — trash button, then confirm.
- **Upload a photo** — file picker; images are resized to 900px and stored with
  the catalog. A URL can be used instead.
- **Search and filter** by name or category.
- **Export / Import** — download the catalog as JSON and load it on another
  device or browser.
- **Reset demo** — restores the eight demo products.

### Important: where the data lives

Products are saved in the browser's **localStorage** under
`marcystore-products-v1`. That means:

- Changes appear on the storefront immediately **in the same browser**.
- Changes do **not** travel to other devices, other browsers, or other people.
- Clearing site data wipes the catalog back to the demo defaults.
- Uploaded photos count toward the browser's ~5 MB storage limit, so keep them
  small or use image URLs.

For a real shop with shared products, connect a backend (see below). Until then,
use **Export** to keep a backup.

---

## Connect real products and payments

The checkout button is a demo action. To take real orders:

1. **Shopify Buy Button** — create products in Shopify, embed the Buy Button SDK,
   and replace the checkout action with a Shopify cart permalink.
2. **Stripe Payment Links** — create one link per product (fastest for a small
   drop) and redirect to it from checkout.
3. **Snipcart / Lemon Squeezy** — add their cart script and point product buttons
   at their checkout.
4. **Custom backend** — add an API for products, cart validation, tax, shipping,
   and payment intents. Replace `useProducts` in `src/products.js` with API
   calls, and move the admin behind authentication.

The product shape is intentionally simple (`src/products.js` → `normalizeProduct`),
so it maps cleanly onto a database table or a CMS collection.

---

## Make it yours

- **Products (demo defaults):** `src/data.js`.
- **Live products:** managed in `/admin`, stored in localStorage.
- **Colors and type:** custom properties at the top of `src/styles.css`
  (`--wine` / `--wine-2` for burgundy, `--rose` for accents, `--cream`/`--paper`
  for light text and blocks).
- **Storefront copy:** `src/App.jsx`.
- **Admin styling:** `src/admin.css`.
- **Contact / social:** `hello@marcystore.com` and the footer links in
  `src/App.jsx`.
- **Free-shipping threshold:** `FREE_SHIPPING` in `src/products.js` (currently EGP 1,200).
- **Currency:** prices are in **EGP** (Egyptian pounds), formatted by `money()` in
  `src/products.js`. Change the prefix there to switch currency.

### Photos

The demo products ship with **no photos** and render a designed placeholder tile.
Add real photos in `/admin` → edit a product → **Upload photo**. The hero image is
`public/images/studio-piece.jpg`; replace it with a photo of her work.

---

## Deploy

Standard Vite app: build and publish `dist/`.

The admin lives at `/admin`, which is a client-side route, so the host must serve
`index.html` for unknown paths:

- **Netlify** — `public/_redirects` is already included.
- **Vercel** — `vercel.json` is already included.
- **Cloudflare Pages** — add a Single Page Application fallback rule.
- **GitHub Pages** — needs a 404.html fallback and a subpath-aware base; easiest
  to avoid unless the site is at the domain root.

## Notes

- Placeholder/demo photography is from Pexels; replace it with real studio photos
  before launch.
- Footer policy links are placeholders.
- Add analytics, a cookie notice, and real shipping/tax rules before taking
  payments.
