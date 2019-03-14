# A streamlined starting point for a static site + serverless functions

- [**Gulp**](https://gulpjs.com/docs/en/api/concepts) for tooling.
- [**Webpack**](https://webpack.js.org/concepts) for asset bundling.
- [**Pug**](https://pugjs.org/) for markup.
- [**Stylus**](http://stylus-lang.com/) for styling.
- [**Mithril**](https://mithril.js.org/api.html) for SPAs and JS components.
- [**Now**](https://zeit.co/docs/) for hosting.

## Getting Started

### Usage

**Site:** <http://localhost:8888>

**API:** <http://localhost:8889>

```sh
# serve site in development mode (livereload)
npm start

# serve site in production mode (asset hashing, minification)
npm run prod

# serve api
npm run api

# deploy
npm i -g now-cli # required
npm run deploy
```

### Checklist

- [ ] If this project was `git clone`'ed, `rm -rf .git && git init`.
- [ ] Install dependencies with `npm i`.
- [ ] Configure Zeit:
  - [ ] Add project name and alias in `now.json`.
  - [ ] Save production secrets with `now secret` and reference them in
    `now.json`.
  - [ ] Create local secrets schema in `now-secrets.example.json`.
  - [ ] Copy local secrets file (`cp now-secrets.example.json
    now-secrets.json`) and add local secrets. Do not check this file in!
- [ ] Test out commands and initial deployment.

## Hints

### General

- Code is organized by "page namespaces."
  - Related markup, styles, and scripts live in the same folder when possible.
  - `site/core` must be loaded first on ALL pages.
  - `site/_shared` contains import-able, shared resources.
- Use alias and root paths for local imports. Avoid relative path imports.
  - JS: `import '~shared/util';`
  - Stylus: `@import ~shared/config`
  - Stylus url(): `url(/assets/image.jpg)` (leading slash)
  - Pug: `extends /_shared/layout` (leading slash)

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
- Each `site/**/bundle.styl` is merged into `dist/**/bundle.js`, which injects
  styles onto the page. Best for packaging styles with components.

## TODO

- Better styling defaults
