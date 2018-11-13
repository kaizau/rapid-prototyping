// https://www.netlify.com/docs/functions/#javascript-lambda-functions

// Configure production ENV on Netlify
import 'dotenv/config';
import respond from './_shared/respond';

export function handler(event, context, callback) {
  // event.httpMethod
  // event.headers
  // event.queryStringParameters
  // event.body


  callback(null, respond(200, ':)'));
}
