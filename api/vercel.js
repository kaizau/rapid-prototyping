// eslint-disable-next-line no-unused-vars
export default function handler(request, response) {
  return response.status(200).json({ fromVercel: process.env.EXAMPLE_VAR });
}
