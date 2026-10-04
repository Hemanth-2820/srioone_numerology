# SRIONE

SRIONE is a static website prototype for a crystals, spiritual services, and Vaastu brand. The frontend brings together a product catalog, product details, a browser-based cart, account-form flows, and consultation pages.

## Features

- Responsive landing page with Home, Shop, Services, and Contact sections.
- Product catalog with category filters, search suggestions, product details, and Rashi selection where available.
- Cart saved in the browser and order enquiries prepared as an email to `shop@srione.com`.
- Sign-in and sign-up interface with demo account state saved in browser storage.
- Dedicated Numerology, Vaastu, and Crystal Healing consultation pages, with WhatsApp booking links.
- Local image, video, and font assets, plus spreadsheet files used for product and price reference.

## Preview Locally

No build step or package installation is required. From the repository root, start a local static server:

```bash
python -m http.server 8000 --directory frontend
```

Then open [http://localhost:8000](http://localhost:8000). Alternatively, open `frontend/index.html` directly in a browser. A local server is recommended so relative assets and browser features behave consistently.
also can use srionegrow.vercel.app

## Pages

- `frontend/index.html` — primary website and storefront. Its sections are navigated using URL hashes such as `#shop` and `#services`.
- `frontend/services/numerology.html` — Numerology consultation information.
- `frontend/services/vaastu.html` — Vaastu consultation information.
- `frontend/services/crystal-healing.html` — Crystal Healing consultation information.
- `frontend/shop/shop.html` — legacy/secondary shop entry; currently redirects to the Shop section in `frontend/index.html`.

## Project Layout

```text
frontend/
  index.html                 Main site, catalog, product details, cart, and account UI
  style.css                  Main site styles
  srionegrow_logo.png         Brand logo
  srione_video.mp4            Hero video
  cherry_blossom.webp         Decorative image
  crystal_images/             Product and Rashi imagery
  services/
    *.html                   Consultation pages
    service.css              Shared consultation page styles
  shop/
    shop.html                Secondary shop page (redirects to main catalog)
    shop.css                 Secondary shop styles
```

Additional media, a local font, and product/price spreadsheets are also stored in `frontend/`.

## Technology

The site uses HTML, CSS, and vanilla JavaScript. It has no build tooling or server-side application in this repository. Google Fonts are requested by the pages when a network connection is available; local media and the Manrope font are included in the frontend folder.

## Prototype Limitations

- Account forms are a front-end demonstration, not real authentication. The sign-in form does not verify credentials, and account state is stored in the current browser's `localStorage`.
- Cart contents are stored in `localStorage`; checkout opens an email draft. No payment, inventory, order submission, or delivery workflow is connected.
- Consultation booking opens WhatsApp. The user must send the message to complete the enquiry.
- The secondary `frontend/shop/shop.html` currently redirects to the main catalog. Its standalone catalog data is not populated.

Do not enter real passwords or sensitive personal information into the prototype.

## Contact

- General enquiries: [hello@srione.com](mailto:hello@srione.com)
- Product and order enquiries: [shop@srione.com](mailto:shop@srione.com)
