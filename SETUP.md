# Bathini Bona — Complete installation and configuration guide

Version **2.0.0**, greenfield release. No previous v1.x code required. Uses **one normal WordPress site** and three independently deployable Next.js applications.

## 1. Requirements

- Node.js >=20.9 (Node 22 is recommended), npm, Docker Desktop for local WordPress.
- For production: three Node.js-compatible application deployments, one managed WordPress/PHP host, MySQL/MariaDB, HTTPS certificates, scheduled backups, email/SMPP integration, private audio storage/CDN, monitoring and a payment provider account.
- Source files: `apps/music`, `apps/studio`, `apps/admin`, `packages/shared`, `wordpress/bathini-bona-api`.
- User accounts are stored in **one WordPress database**. `bbm_fan` and `bbm_studio` roles are created by the plugin. WordPress `administrator` has the Admin app permissions. Admin signup is intentionally disabled.

## 2. Install WordPress locally

1. From repository root, copy `.env.example` to `.env` and set strong development-only database passwords.
2. Run `docker compose up -d`. Wait until WordPress is reachable at http://localhost:8080.
3. Complete the WordPress first-install form. Save the Administrator username/password securely; these log into **both** WP Admin and Bathini Bona Admin.
4. Open `http://localhost:8080/wp-admin/plugins.php`, activate **Bathini Bona Headless API**.
5. Browse `http://localhost:8080/wp-json/bbm/v1/health`. Expect `{ "status": "ok" ... }`.
6. WP Dashboard now contains BBM Tracks, BBM Releases, BBM Events, BBM Campaigns, plus BBM Genres. Studio uploads go into pending queues, then appear on Music once approved by Admin.
7. If not using Docker, run your own single WordPress installation and upload `bathini-bona-wordpress-api-v2.0.0.zip` as a plugin. WordPress REST API must be reachable over HTTPS in production.

## 3. Run all three Next.js frontends

1. From root: `npm install`.
2. Copy each `apps/music/.env.example`, `apps/studio/.env.example`, `apps/admin/.env.example` to `.env.local`.
3. Set `WORDPRESS_URL=http://localhost:8080`, `BBM_DEMO_MODE=false`, and `NEXT_PUBLIC_BBM_DEMO=false` in each.
4. Terminal 1: `npm run dev:music` — Music on http://localhost:3000.
5. Terminal 2: `npm run dev:studio` — Studio on http://localhost:3001.
6. Terminal 3: `npm run dev:admin` — Admin on http://localhost:3002.
7. Click Sign Up at Music to create a free listener account. Click Sign Up at Studio to create a creator/business account. Both share one WordPress login identity.
8. To test studio approval, register a Studio user, upload your own audio via Studio → Upload Music, visit Admin at port 3002 and log in with **the WordPress administrator username or email and password**, then approve under Music Approvals. Open Music and check the catalogue.
9. On localhost, all ports share the same hostname and hence cookie space. The account role is checked server-side for access. If you test with a fan and admin account concurrently, use separate browsers/incognito profiles because signing in as one user can replace the shared login cookie.

### Demo mode (visual and generated-audio preview only)

In **Music** `.env.local` set `BBM_DEMO_MODE=true`, `NEXT_PUBLIC_BBM_DEMO=true`. Restart. You can see seeded music, albums, artists, events and hear synthesized short WAV examples. These are not commercial music. Other apps have an authentication gate unless WordPress is connected. For production set both flags to `false`.

## 4. Production hostnames and DNS

| Hostname | Deployment |
|---|---|
| `bathinibona.co.za` and `www.bathinibona.co.za` | Music Next.js |
| `studio.bathinibona.co.za` | Studio Next.js |
| `admin.bathinibona.co.za` | Admin Next.js |
| `api.bathinibona.co.za` | Standard WordPress installation |

Configure each DNS A/CNAME record according to the provider, HTTPS certificates and (where needed) the `www` redirect. On each Next app set server-only `WORDPRESS_URL=https://api.bathinibona.co.za`, `BBM_DEMO_MODE=false`, and public environment values:

```
NEXT_PUBLIC_BBM_DEMO=false
NEXT_PUBLIC_MUSIC_URL=https://bathinibona.co.za
NEXT_PUBLIC_STUDIO_URL=https://studio.bathinibona.co.za
NEXT_PUBLIC_ADMIN_URL=https://admin.bathinibona.co.za
NEXT_PUBLIC_WP_ADMIN_URL=https://api.bathinibona.co.za/wp-admin/
```

Next.js BFF Route Handler forwards requests server-to-server to WordPress. **Do not put user passwords or WordPress application credentials in `NEXT_PUBLIC_*` variables.** The login response sets an HttpOnly 12-hour cookie scoped to `.bathinibona.co.za` on those production hosts. In production the cookie is Secure, SameSite=Lax. Require consistent HTTPS everywhere. Keep `/wp-admin/` inaccessible to untrusted roles and consider IP restrictions/MFA for administrators.

## 5. How each Next app works

**Music (`apps/music`):** public Trending Songs, Popular Artists, Albums & Singles, Upcoming Events; centered search; Browse Music, Live Events, Discover, New Releases, genres. Logged-in listeners see Recommended for You and All Music, Live Events, Artists filters. Music supports free playback and a simple timed house-ad break between auto-advancing tracks; this is a UI demonstration, NOT a compliant ad server. Non-account visitors can browse but must register/login for real WordPress-backed streaming. BBM PRO features (repeat and new playlist form) are gated by the WordPress `_bbm_pro_until` entitlement.

**Studio (`apps/studio`):** Studio role logs in, submits MP3/M4A/WAV audio and artwork (up to 30MB audio in this build), submits events and campaigns (minimum R20 daily campaign budget), views tracks, basic counts and earnings disclosures, and edits a profile. All submissions start as Pending.

**Admin (`apps/admin`):** WordPress administrator credentials; approve/reject tracks, events and campaigns **without opening WordPress dashboard**. A separate sidebar link opens native WP Admin when needed. Admin financial view shows published business rules but no fake financial settlements.

## 6. Billing and money — precise status

- Free fan registration and streaming; simple sponsored interstitial between tracks (bypassable at present).
- PRO: R55/month **planned**; R44 Bathini Bona + R11 Afrunet on each successfully collected gross subscription before fees/tax. **Checkout and recurring gateway webhooks NOT implemented**; entitlement field exists for future integration.
- Advertising rate: R0.04 per verified unique eligible reach, minimum R20/day; Studio campaign submission and approval implemented, but **no charges, funding, delivery metering or gateway split yet**.
- Creator share, only when a **validated billable ad-funded stream** can be attributed: R0.026 to Creator; R0.0112 Bathini Bona; R0.0028 Afrunet. The database ledger is created but no client-supplied plays can create financial credit. Ordinary plays are not automatically payable.
- Event ticket URLs can point to an external legitimate ticket checkout when supplied by the organiser. Internal inventory, card checkout, refund and settlement NOT included.

## 7. Required operational services before accepting money

- Recurring-payment gateway, verified server-to-server webhooks, idempotent reconciliation, cancellation, expiry, refunds and bank settlement; confirm gateway actually supports the chosen split structure.
- Protected audio objects (private object storage + time-limited signed playback URLs or segmented streaming) rather than public WordPress Media Library paths.
- Durable playback event service, protected anti-bot analytics, independent ad-server verified unique reach, delivery proof, settlement-aware creator ledger and payout eligibility safeguards.
- Music licences, artist contracts, POPIA/privacy policy, age considerations, VAT/tax advice, advertiser moderation, invoicing and financial record retention.
- An integrated tickets provider with supported checkout/seat inventory and webhook verification.

## 8. Troubleshooting

- `WordPress API is unavailable`: check `docker compose ps`, `WORDPRESS_URL`, and `/wp-json/bbm/v1/health`.
- Failed uploads: adjust `upload_max_filesize` and `post_max_size` on your PHP host, confirm file type and 30MB application limit.
- 401 from authenticated route after login: confirm Apache passes the `Authorization` header to PHP and that the production hosts share the same cookie domain and HTTPS protocol. WordPress's rewrite configuration typically preserves `HTTP_AUTHORIZATION`; some reverse proxies require explicit forwarding.
- Studio login works but cannot upload: ensure the account role is `bbm_studio` (not `bbm_fan`).
- No Music catalogue: only **published** music appears publicly. Pending music appears in Admin approvals.
- Admin login but access denied: ensure you used a WordPress user with `administrator` capabilities on the same backend.
- Demo catalogue appears instead of uploaded WordPress content: set `BBM_DEMO_MODE=false` and restart all Next servers.
- `npm install` or build fails: verify network access and Node 20.9+; install dependencies before running build.

## 9. Recommended operational checks

- Inspect API response permissions for unauthenticated fans and creators. Try accessing `/admin/tracks` via a fan session: it must reject with 403.
- Test registration, logout, invalid logins, profile email uniqueness, password change, Studio uploads, approval, genre filtering, RSVP, mobile layouts and disabled checkout.
- Confirm real audio rights before upload; don't publish unauthorized commercial music.
- See `docs/LAUNCH.md` for go-live blockers and commercial limitations.
