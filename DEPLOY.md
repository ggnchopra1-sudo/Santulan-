# Putting Santulan live on getsantulan.in

## 1. Upload (5 minutes)
1. Unzip `santulan-pwa.zip` on your laptop.
2. Go to https://app.netlify.com/drop and sign up (free).
3. Drag the unzipped `santulan-pwa` folder onto the page.
4. You get a link like `something-random.netlify.app`. Open it on your phone to check.
5. In Netlify: Site configuration → Change site name → `santulan` (gives `santulan.netlify.app`).

## 2. Connect getsantulan.in
1. Netlify: Domain management → Add a domain → `getsantulan.in`.
2. At the registrar where you bought the domain, open DNS settings and add:

| Type | Host | Value |
|---|---|---|
| A | @ | 75.2.60.5 |
| CNAME | www | santulan.netlify.app (your Netlify site name) |

   If your registrar offers ALIAS or ANAME records, use `apex-loadbalancer.netlify.com` for `@` instead of the A record.
3. Delete any old A or CNAME records on `@` and `www` that the registrar added by default (parking pages).
4. Wait. DNS can take up to 24 hours. Netlify then issues the free HTTPS certificate on its own.

## 3. Email for the privacy page
The privacy page lists `hello@getsantulan.in`. Set up free email forwarding at your registrar (most offer it), forwarding to your Gmail.

## 4. Install on a phone
- Android (Chrome): open getsantulan.in → menu ⋮ → Install app / Add to Home screen.
- iPhone (Safari): open getsantulan.in → Share → Add to Home Screen.

## Updating later
Drag the new folder onto Netlify's Deploys page. In `sw.js`, change `santulan-v1` to `santulan-v2` (and so on) each time, so phones pick up the new version.

## Good to know
- Each person's data stays in their own phone's browser. Use Dashboard → Download backup now and then.
- Clearing browser data or uninstalling deletes it, unless you restore a backup.
