# An opinionated starting point for web projects

- [**Brunch**](https://brunch.io/docs/config) for markup and asset optimizations.
- [**Mithril**](https://mithril.js.org/api.html) for SPAs and JS utilities.
- [**Stylus**](http://stylus-lang.com/) for flexible styling.
- [**Netlify**](https://www.netlify.com/docs/netlify-toml-reference/) for static hosting.

## Hints

### Components

- Each `/components/**/join.styl` is compiled to `/public/assets/**.css`.
- Each `/components/**/entry{,~*}.js` is compiled to `/public/assets/**.js`.
- To bundle npm modules, name the file `entry~module1~module2~module3.js`.
- To bundle `_shared` JS modules, name the file `entry~_shared~module1~module2.js`.
- Only modules actually `import`ed will be included.

### Content

- Pug layouts accept YAML and JSON frontmatter.

## To Do

- Starter styles
- netlify.toml
- ENV / secrets handling
- Pug conventions for loading assets
