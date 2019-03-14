# An opinionated starting point for web projects

- [**Gulp**](https://gulpjs.com/docs/en/api/concepts) for tooling.
- [**Webpack**](https://webpack.js.org/concepts) for asset bundling.
- [**Pug**](https://pugjs.org/) for flexible markup.
- [**Stylus**](http://stylus-lang.com/) for flexible styling.
- [**Mithril**](https://mithril.js.org/api.html) for SPAs and JS utilities.
- [**Now**](https://zeit.co/docs/) for static hosting and serverless functions.

## Usage

```sh
# local server in development mode (livereload)
npm start

# local server in production mode (asset hashing, minification)
npm run prod

# local api server
npm run api
```

## Hints

### General

- Code is organized by "page namespaces."
  - Related markup, styles, and scripts live in the same folder when possible.
  - `site/core` must be loaded first on ALL pages.
  - `site/_shared` contains import-able, shared resources.
- Use alias and root paths for local imports. No relative paths.
  - JS: `import '~shared/util';`
  - Stylus: `@import ~shared/config`
  - Stylus url(): `url(/assets/image.jpg)` (leading slash)
  - Pug: `extends /_shared/layout` (leading slash)
- Use ENV variables for environment configuration and secrets.
  - Add general, "not-so-secret" variables in `now.json`.
  - Save deployed _production_ secrets with `now secret` and reference them in
    `now.json`.
  - Save local _development_ secrets `now-secrets.json`. Prepend
    `USE_LOCAL_ENV=1` to commands apply local variables. Do not check this
    file in.

### /site/**.pug

- Each `site/**.pug` is compiled to `dist/**.html`.
- Prefer `site/example/index.pug` over `source/example.pug`.

### /site/**/bundle.js

- Each `site/**/bundle.js` is compiled to `dist/**/bundle.js`.
- No need to `import './bundle.styl'`. Webpack is configured to find styles
  automatically.

### /site/**/bundle{,.css}.styl

- Import shared stylus variables with `@import '~shared/config'`.
- Each `site/**/bundle.css.styl` is compiled to `dist/**/bundle.css`.
- Each `site/**/bundle.styl` is compiled and merged into `dist/**/bundle.js`.

## TODO

- Better styling defaults
- Add a "getting started checklist" (env, config, etc.)
- Add zeit / express patterns
