# An opinionated starting point for web projects

- [**Gulp**](https://gulpjs.com/docs/en/api/concepts) for tooling.
- [**Webpack**](https://webpack.js.org/concepts) for asset bundling.
- [**Pug**](https://pugjs.org/) for flexible markup.
- [**Stylus**](http://stylus-lang.com/) for flexible styling.
- [**Mithril**](https://mithril.js.org/api.html) for SPAs and JS utilities.
- [**Now**](https://zeit.co/docs/) for static hosting and serverless functions.

## Usage

```sh
# start local dev server
npm start

# start local dev api server
npm run api

# watch site files in development mode
npm run dev

# watch site files in production mode
npm run prod
```

## Hints

### General

- Code is organized by "page namespaces".
  - Related markup, styles, and scripts live in the same folder when possible.
  - `site/global` includes styles and scripts that are loaded on all pages.
  - `site/_shared` contains import-able, shared resources.
- Prefer aliased or root paths for imports.
  - JS: `import '~shared/util';`
  - Stylus: `@import ~shared/config`
  - Pug: `extends /_shared/layout` (leading slash)
  - Stylus url(): `url(/assets/image.jpg)` (leading slash)
- Use ENV variables for environment configuration and secrets.
  - Configure general, "not-so-secret" variables in `now.json`.
  - Save deployed _production_ secrets with `now secret` and reference them in
    `now.json`.
  - Save local _development_ secrets `now-secrets.json`. Prepend
    `USE_LOCAL_ENV=1` to commands apply local variables. Do not check this
    file in.
- Gulp runs production commands by default. Prepend `NODE_ENV=development` to
  use development settings.

### /site/**.pug

- Each `site/**.pug` is compiled to `dist/**.html`.
- Prefer `site/example/index.pug` over `source/example.pug`.
- Prefer using `<script defer ...>` in the `<head>`.

### /site/**/index.js

- Each `site/**/index.js` is compiled to `dist/**/index.js`.
- Only modules actually `import`-ed will be included in the build.

### /site/**/index.styl

- Each `site/**/index.styl` is compiled to `dist/**.css`.
- Import global stylus variables for every entry point `@import '~shared/config'`.

## To Do

- Autoprefixer
- Pug conventions for loading assets
