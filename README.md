# Portfolio Tools — Deployment Guide

This folder deploys BOTH Plainly and Rally at once, sharing one API key
and one hosting setup — so you only do this process one time, not twice.

## What's in this folder
- `public/index.html` — a landing page linking to both tools
- `public/plainly.html` — the Plainly tool
- `public/rally.html` — the Rally tool
- `api/plainly.js` — backend for Plainly (holds your API key safely)
- `api/rally.js` — backend for Rally (holds your API key safely)
- `package.json` — project info Vercel reads

You will not edit any code. This is account setup + clicking deploy.

---

## Step 1 — Get an Anthropic API key (~5 min)

1. Go to https://console.anthropic.com and sign up (separate from your
   claude.ai login).
2. Add a small amount of billing credit. Both tools together are still
   very cheap to run — a few cents per use.
3. Go to **API Keys** → **Create Key**. Copy it somewhere safe.

## Step 2 — Create a Vercel account (~2 min)

Go to https://vercel.com and sign up (GitHub login or email both work).

## Step 3 — Get this folder onto GitHub

1. Unzip the file you downloaded — you'll get a folder called
   `portfolio-tools`.
2. Create a free GitHub account at https://github.com if you don't
   have one yet.
3. Click the **+** icon top-right → **New repository**. Name it
   `portfolio-tools`. Leave it Public or Private, doesn't matter.
   Don't check any of the "add a README" boxes. Click **Create repository**.
4. On the new repo page, click **"uploading an existing file."**
5. Open the unzipped `portfolio-tools` folder on your computer, select
   everything INSIDE it (the `public` folder, `api` folder,
   `package.json`) — not the outer folder itself — and drag it all
   into the GitHub upload box.
6. Scroll down, click **Commit changes**.

## Step 4 — Deploy on Vercel

1. In Vercel, click **Add New Project** → **Import Git Repository**.
2. Select the `portfolio-tools` repo.
3. Click **Deploy**. Vercel figures out the rest automatically.

## Step 5 — Add your API key

1. In the new Vercel project, go to **Settings → Environment Variables**.
2. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (the key from Step 1)
3. Go to **Deployments** and click **Redeploy** on the latest one so it
   picks up the key.

## Step 6 — Done

Vercel gives you a URL like `portfolio-tools-yourname.vercel.app`.
That's your landing page — it links to both tools from there. Put
that one link on your resume or portfolio site.

---

## If something breaks
Paste me the exact error message and where it showed up (which step,
which tool) — that's faster than re-explaining everything from
scratch.
