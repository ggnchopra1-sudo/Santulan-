# Running Santulan at getsantulan.in

The site is hosted free on GitHub Pages from the `main` branch of this repository.

## 1. Turn on GitHub Pages (one time)
Repository → Settings → Pages:
- Source: **Deploy from a branch**
- Branch: **main**, folder **/ (root)** → Save
- Custom domain: `getsantulan.in` → Save
- Once the certificate is ready, tick **Enforce HTTPS**.

## 2. DNS at the domain registrar (one time)
Remove any default parking A / CNAME records on `@` and `www`, then add:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | ggnchopra1-sudo.github.io |

DNS can take up to 24 hours to spread.

## 3. Email for the privacy page
Set up forwarding at the registrar: `hello@getsantulan.in` → your Gmail.

## 4. Install on a phone
- Android (Chrome): open getsantulan.in → menu ⋮ → Install app.
- iPhone (Safari): open getsantulan.in → Share → Add to Home Screen.

## Updating the app
Push changes to `main`; Pages redeploys in a minute or two. In `sw.js`, bump `santulan-v1` to `santulan-v2` (and so on) with each release so installed copies pick up the new version.

## Good to know
Each person's data stays in their own phone's browser. Dashboard → Download backup saves a copy.
