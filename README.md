# An opinionated starting point for web projects

- [**Brunch**](https://brunch.io/docs/config) for markup and asset optimizations.
- [**Mithril**](https://mithril.js.org/api.html) for SPAs and JS utilities.
- [**Stylus**](http://stylus-lang.com/) for flexible styling.
- [**Netlify**](https://www.netlify.com/docs/netlify-toml-reference/) for static hosting.

## Hints

### Components

- `/source/components/global/*.js` must be loaded on every page.
- Each `/source/components/*/join.styl` is compiled to `/public/assets/*.css`.
- Each `/source/components/*/entry{,~*}.js` is compiled to `/public/assets/*.js`.
- To bundle npm modules, name the file `entry~module1~module2~etc.js`.
- To bundle `_shared` JS modules, name the file `entry~_shared~module1~etc.js`.
- Only modules actually `import`ed will be included.

### Pages

- Pug layouts accept YAML and JSON frontmatter.
- Create a 404.pug and Netlify will automatically use it.
- Prefer `<script defer ...>` in the `<head>`.

### Build

- ESLint pre-commit hook automatically attempts to fix errors.
- Airbnb settings are quite strict. Edit `.eslintrc.js` as needed.

## To Do

- Switch to node-sass
- ENV / secrets handling
- Netlify functions
- Pug conventions for loading assets
- RimRaf, node path, etc.
