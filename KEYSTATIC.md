# Editing content with Keystatic

Projects, and the labels shared by every project page, are edited in Keystatic, a visual editor for
the files in `src/content`. Each project is one file in `src/content/projects/`, and its images
live in `src/assets/images/projects/<project>/`.

## Edit locally (works today)

```bash
npm install
npm run dev
```

Open http://localhost:4321/keystatic, then:

- **Projects**: add, edit or delete a project. The project's web address is `/projects/<web address>`.
- **Projects page and labels**: the `/projects` page and the wording used on every project page
  (table headings, status names, button labels).

Saving writes the files directly. Run `npm run build`, then commit and push. Vercel publishes
the change.

## Turn on editing on the live site (GitHub mode)

In GitHub mode, `https://<your domain>/keystatic` opens the editor on the live site. You sign in
with GitHub, and every save becomes a commit on `main`, which Vercel publishes automatically.
Anyone with write access to the repository can edit.

### 1. Create the GitHub App

Go to GitHub → Settings → Developer settings → GitHub Apps → **New GitHub App**:

- **GitHub App name**: e.g. `Blue Bridge Keystatic`. It must be unique on GitHub.
- **Homepage URL**: `https://bluebridge-site.vercel.app/keystatic`
- **Callback URL**: `https://bluebridge-site.vercel.app/api/keystatic/github/oauth/callback`.
  Add one for each address you will edit from, such as your custom domain later.
- **Request user authorization (OAuth) during installation**: ticked.
- **Webhook → Active**: unticked.
- **Repository permissions**: Contents **Read and write**, Pull requests **Read-only**
  (Metadata read-only is set automatically).
- **Where can this GitHub App be installed?**: Only on this account.

Click **Create GitHub App**. Then, on the app's page:

- Note the **Client ID**, and the app's **slug**: the last part of its public URL,
  `github.com/apps/<slug>`.
- Click **Generate a new client secret** and copy it straight away (GitHub shows it only once).
- Under **Install App**, install it on `pidaydigital/bluebridge-site` only.

### 2. Add the keys to Vercel

In Vercel → the project → Settings → Environment Variables, add these for **Production**:

| Name | Value |
| --- | --- |
| `PUBLIC_KEYSTATIC_STORAGE` | `github` |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | the app's slug |
| `KEYSTATIC_GITHUB_CLIENT_ID` | the Client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | the client secret |
| `KEYSTATIC_SECRET` | any random string of 32+ characters, e.g. from a password generator |

Never put the secrets in the code or in chat.

### 3. Redeploy

Vercel → Deployments → the latest production deployment → **Redeploy**. Then open
`https://bluebridge-site.vercel.app/keystatic`, sign in with GitHub and authorize the app.

Without `PUBLIC_KEYSTATIC_STORAGE=github`, production builds leave the editor out entirely, so the
public site stays fully static.
