export default function respond(code, body) {
  return {
    statusCode: code,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  };
}
