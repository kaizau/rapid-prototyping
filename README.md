# Rapid Prototyping Template

> Goal: a simple, get sh\*t done toolkit.

**Opinionated takes:**

- React, Vue, and other SPA frameworks are overkill for 90% of projects.
- Adding tests or TypeScript before you have user traction is about as
  restrictive as wearing a tuxedo / evening gown to a triathlon.
- Expect to throw this version away and rewrite it The Right Way™ after you
  figure out what you're actually building.
- When in doubt, follow [sane defaults](https://github.com/elsewhencode/project-guidelines).

## Installation

Expects globally-installed
[`degit`](https://github.com/Rich-Harris/degit#readme) and one of either
[`vercel`](https://vercel.com/docs/cli) or
[`netlify-cli`](https://docs.netlify.com/cli/get-started/).

1. Clone template with `degit kaizau/rapid-prototyping <your-new-project>`
2. Install dependencies with `pnpm i`
3. Copy `.env.example` to `.env` to assign variables

## Usage

Use one of the commands below to start a development server on `localhost:8888`.

```sh
pnpm start         # static server
pnpm vercel    # static server + vercel functions
pnpm netlify   # static server + netlify functions
```

Deploy to Vercel or Netlify using the respective CLI tool or git CI. You can
also inspect a production build locally:

```sh
pnpm build     # build to dist
pnpm analyze   # build + bundle analysis
```

## Notes

- [Parcel](https://parceljs.org/) is the _least bad_ bundler out there, and provides a simpler local development experience than alternatives.
  - Cache-busting hashes, minification, transpiling... all of these happen automatically using sensible defaults.
  - Module resolution automatically routes absolute paths to the project root.
- [EJS](https://ejs.co/) adds JS templating to static HTML.
- [PostCSS](https://github.com/postcss/postcss) is included to support [Tailwind](https://tailwindcss.com/), which provides a pragmatic foundation for layout and styling.
- Local development scripts have been configured to be roughly identical.
- Use `pnpm (vercel|netlify)` for local serverless functions.
