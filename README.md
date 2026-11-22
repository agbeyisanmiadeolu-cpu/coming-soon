# Sikolini website — GitHub Pages edition

This package contains the published website content and photographs, preserved as a static website. It has no admin login or backend. Your existing live website has not been changed.

## Upload and publish

Upload the contents of this folder to your repository, with `index.html` at the repository root. Keep `.nojekyll`. In GitHub **Settings → Pages**, select deployment from your branch and the root folder.

## Make small changes

Open a file in GitHub, select the pencil icon, edit the relevant text and commit the change. GitHub Pages will publish the updated files after its deployment finishes.

- Homepage: `index.html`
- About: `about/index.html`
- Services and any displayed prices: `services/index.html`
- Gallery: `gallery/index.html`
- Contact: `contact/index.html`

Keep the surrounding HTML tags intact. Shared headers, footers, contact details and service summaries appear on several pages: update each occurrence when changing those details. The contact form and enquiry links use WhatsApp.

## Change photographs

Images are in `assets/`. Upload the replacement image and update its `src` in the relevant HTML. If the image also has a `srcset`, update every version in that attribute, or remove the attribute to use the single replacement. Update the `alt` description to describe the new photograph. Keep images compressed, preferably WebP.

## Domain and search settings

The package uses relative links so it can work under a GitHub repository address or a custom domain. Once your final address is chosen, add the correct canonical URL and social sharing image metadata to each page, and create a sitemap using that address. Previous preview-domain metadata has been removed. Configure your purchased domain through GitHub Pages settings and your domain provider.

Do not upload passwords, private keys, database exports or files from the original admin backend. None are required for this edition.
