# Raju Gudla — Portfolio

Responsive single-page portfolio with a server-side contact form.

## Contact form backend
The form sends submissions to `/api/contact`, a Vercel Serverless Function. Messages are delivered to **gudla0098@gmail.com** through Resend. The visitor's email is set as Reply-To so you can reply directly.

### Configure email delivery
1. Create a Resend account and generate an API key.
2. In the Vercel project, open **Settings → Environment Variables**.
3. Add `RESEND_API_KEY` with the private key (Production, Preview and Development as needed).
4. Redeploy the project.
5. Optionally add `SITE_ORIGIN` with your exact public website origin.
6. For a branded sender address, verify your domain in Resend and set `CONTACT_FROM_EMAIL` to that verified address.

The API uses Resend's onboarding sender by default. Resend may restrict recipient delivery until the account/domain is verified; verify your sender domain for production use.

**Never put the Resend API key in frontend JavaScript or commit it to GitHub.** A variable-name-only example is in `.env.example`.

## Run locally
The static pages can be opened in a browser, but the API requires a serverless runtime. Use the Vercel CLI:

```bash
npm install --global vercel
vercel dev
```

## Deploy
Connect `gudla0098-arch/portfilo` to Vercel. Every push to `main` will deploy automatically. The site uses plain HTML, CSS and JavaScript; no frontend build step is required.
