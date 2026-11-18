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

In GitHub mode, `https://<your domain>/keystatic` opens the editor on the live site. Every save
becomes a commit on `main`, and Vercel redeploys automatically.

1. **Create the GitHub App.** Locally, run `PUBLIC_KEYSTATIC_STORAGE=github npm run dev` and open
   http://localhost:4321/keystatic. Keystatic walks you through creating a GitHub App for
   `pidaydigital/bluebridge-site` and writes its keys to a local `.env` file. Never commit that file.
2. **Allow the live site to sign in.** In the GitHub App's settings, add the callback URL
   `https://<your domain>/api/keystatic/github/oauth/callback`. Add one for the `vercel.app`
   address too, if you'll edit there.
3. **Add the keys to Vercel.** In Project → Settings → Environment Variables, add:
   - `PUBLIC_KEYSTATIC_STORAGE` = `github`
   - `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and
     `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, copied from the `.env` file in step 1.
4. **Redeploy.** Editors need write access to the GitHub repository.

Without `PUBLIC_KEYSTATIC_STORAGE=github`, production builds leave the editor out entirely, so the
public site stays fully static.
