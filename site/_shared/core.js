/* eslint-disable no-console */
console.log("Hello, universe!");

console.log("process.env.NODE_ENV:", process.env.NODE_ENV);

console.log(
  "process.env.EXAMPLE_VAR:",
  process.env.EXAMPLE_VAR || "(.env not found)"
);

fetch("/api/example")
  .then((res) => res.json())
  .then((json) => console.log("GET /api/example:", json))
  .catch(() => console.log("GET /api/example: (api not available)"));
/* eslint-enable no-console */
