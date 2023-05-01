# Rapid Prototyping Template

> Goal: a simple, get sh\*t done toolkit.

**Opinionated takes:**

- React, Vue, and other SPA frameworks are overkill for 90% of projects.
- Adding tests or TypeScript before you have user traction is about as
  restrictive wearing a tuxedo / evening gown to a triathlon.
- Expect to throw this version away and rewrite it The Right Way™ after you
  figure out what you're actually building.
- When in doubt, just use Firebase... and follow
  [sane defaults](https://github.com/elsewhencode/project-guidelines).

## Installation

Expects globally-installed [`degit`](https://github.com/Rich-Harris/degit#readme) and one of either
[`vercel`](https://vercel.com/docs/cli) or [`netlify-cli`](https://docs.netlify.com/cli/get-started/).

1. Clone template with `degit kaizau/rapid-prototyping <your-new-project>`
2. Install dependencies with `npm i`
3. Copy `.env.example` to `.env` to assign variables

## Usage

Use one of the commands below to start a development server on
`localhost:8888`.

```sh
npm start         # static server
npm run vercel    # static server + vercel functions
npm run netlify   # static server + netlify functions
```

Deploy to Vercel or Netlify using the respective CLI tool or git CI. You can
also inspect a production build locally:

```sh
npm run build     # build to dist
npm run analyze   # build + bundle analysis
```

## Notes

- [Parcel](https://parceljs.org/) is the _least bad_ bundler out there, and
  provides a much simpler local development expereience than alternatives.
  - Cache-busting hashes, minification, transpiling... all of these happen
    automatically using sensible defaults.
  - Module resolution automatically routes absolute paths to the project root.
- Local development, Vercel, and Netlify have been configured to be roughly
  identical.
  - The local dev server uses a middleware proxy to emulate clean URLs (no
    ".html" extension).
- [PostHTML](https://github.com/posthtml/posthtml) adds simple templating
  (variables, modules, expressions) to static HTML.
- [PostCSS](https://github.com/postcss/postcss) is included to support
  [Tailwind](https://tailwindcss.com/), which provides a pragmatic (and
  easily LLM-generatable) foundation for layout and styling.
