const { createProxyMiddleware } = require("http-proxy-middleware");

// Enable clean URLs when using parcel watch or serve
module.exports = (app) => {
  app.use(
    createProxyMiddleware(
      (path) => {
        if (path === "/" || path.startsWith("/api/") || path.includes(".")) {
          return false;
        }
        return true;
      },
      {
        target: `http://localhost:${process.env.PORT}`,
        pathRewrite(path) {
          // NOTE: Parcel seems to automatically try "path/index.html" when path.html is missing
          // if (path.endsWith("/")) {
          //   return path + "index.html";
          // }
          return path + ".html";
        },
      }
    )
  );
};
