# An opinionated starting point for web projects

- [**Brunch**](https://brunch.io/docs/config) for static site generation.
- [**Pug**](https://pugjs.org/) (and [companion plugin](https://github.com/bmatcuk/pug-brunch-static)) for flexible static markup.
- [**Stylus**](http://stylus-lang.com/) for flexible styling.
- [**Mithril**](https://mithril.js.org/api.html) for SPAs and JS utilities.
- [**Now**](https://zeit.co/docs/) for static hosting and serverless functions.

## Hints

### General

- Code is organized by "page namespaces".
  - Related markup, styles, and scripts live in the same folder when possible.
  - `source/global` includes styles and scripts that are loaded on all pages.
  - `source/_shared` contains import-able, shared resources.
- Prefer root (non-relative) imports.
  - Pug: `extends /_shared/layout` (requires leading slash)
  - Stylus: `@import _shared/config`
  - JS: `import '_shared/util';`
- Secrets should be stored in `.env`.
  - Make a copy from `.env.example`. Do not check this file in.
  - Import or require `dotenv/config` at the beginning of any script to
    populate `process.env.*`.
  - Existing ENV variables will never be overwritten.

### /source/**.pug

- Each `source/**.pug` is compiled to `public/**.html`.
- Prefer `source/example/index.pug` over `source/example.pug`.
- Pages can have YAML and JSON frontmatter.
  - `title` and `description` configure SEO metadata.
- Prefer using `<script defer ...>` in the `<head>`.

### /source/**/index.js

- Each `source/**/index{,~*}.js` is compiled to `public/assets/**.js`.
- To bundle npm modules, name the file `index~module1~module2~etc.js`.
- To bundle `_shared` JS modules, name the file `index~_shared~module1~etc.js`.
- Only modules actually `import`-ed will be included in the build.

### /source/**/index.styl

- Each `source/**/index.styl` is compiled to `public/assets/**.css`.
- Shared stylus variables live in `source/_shared/config.styl`.

## To Do

- Purify CSS to reduce output
- Pug conventions for loading assets
