# A streamlined starting point for modern web projects

- [**Gulp**](https://gulpjs.com/docs/en/api/concepts) for tooling.
- [**Webpack**](https://webpack.js.org/concepts) for asset bundling.
- [**Pug**](https://pugjs.org/) for markup.
- [**Stylus**](http://stylus-lang.com/) for styling.
- [**Mithril**](https://mithril.js.org/api.html) for SPAs and JS components.
- [**Zeit**](https://zeit.co/docs/) for static and serverless hosting.

## Getting Started

### Usage

**Site:** <http://localhost:8888>

**API:** <http://localhost:8888/api/>

```sh
# setup
npm i -g now degit
cd my-project-dir
degit kaizau/starter-web
npm i

# serve in development mode (with livereload)
npm start

# serve in production mode (with asset hashing, minification)
npm run start-prod

# preview deployment locally
npm run preview

# deploy (or if Zeit is integrated , just merge branch into master)
npm run deploy
```

## Conventions

### General

- Code is organized by "folder namespaces."
  - Related markup, styles, and scripts live in the same folder when possible.
  - `site/_shared` contains resources that are shared across namespaces.
  - `site/_shared/bundle.js` is a special entry point that will have the
    webpack runtime and all shared modules prepended after compilation. Its
    compiled output `/shared/bundle.js` must be loaded first on all pages.
- Prefer webpack aliases and root paths when sharing assets between namespaces.
  This avoids long relative import paths (`import '../../../lib/utils';`).
  - JS: `import '~shared/util';`
  - Stylus: `@import ~shared/styles/config`
  - Stylus url(): `url(/assets/image.jpg)` (leading slash)
  - Pug: `extends /_shared/layout` (leading slash)
- Use environment variables for secrets and configuration.
  - Save production secrets with `now secret` and reference their `@keys` in
    `now.json`.
  - Check in blank .env schemas in `schema.env` and `schema.env.build`.
  - Create local .env files (`cp schema.env .env && cp schema.env.build .env.build`) and add development values. Do not check these in!
- When in doubt, aim to follow these principles:
  - https://github.com/elsewhencode/project-guidelines
  - https://3factor.app/
  - http://madeofmetaphors.com/shapes
  - http://madeofmetaphors.com/boundaries-and-infinities

### /site/\*\*.pug

- Each `site/**.pug` is compiled to `dist/**.html`.
- Prefer `site/example/index.pug` over `source/example.pug`.

### /site/\_shared/\*

- Unlike all other namespaces, `site/_shared/` is compiled to `site/shared/`.
- `/shared/bundle.js` must be loaded first on all pages.

### /site/\*\*/bundle.js

- Each `site/**/bundle.js` is compiled to `dist/**/bundle.js`.
- No need to `import './bundle.styl'`. Webpack is configured to find styles
  automatically.

### /site/\*\*/bundle{,.css}.styl

- Import shared stylus variables with `@import '~shared/config'`.
- Each `site/**/bundle.css.styl` is compiled to `dist/**/bundle.css`.
- Each `site/**/bundle.styl` is merged into `dist/**/bundle.js`, which injects
  styles onto the page. Best for packaging styles with components.
