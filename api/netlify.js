// eslint-disable-next-line no-unused-vars
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ fromNetlify: process.env.EXAMPLE_VAR }),
  };
};
