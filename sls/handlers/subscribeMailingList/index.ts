import Axios from 'axios';
import * as LambdaProxy from "../../interfaces/lambda-proxy";

export default async function handler(
  event: LambdaProxy.Event,
  context: LambdaProxy.Context,
): Promise<LambdaProxy.Response> {
  if (!event.queryStringParameters || !event.queryStringParameters['email']) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        "Access-Control-Allow-Origin": "*",
      },
    body: JSON.stringify({ error: "Invalid or No Email on Request" }),
    };
  }

  const email = event.queryStringParameters['email'];

  try {
    const param = {
      email_address: email,
      status: 'subscribed'
    };

    const stringifiedParam = JSON.stringify(param);
    await Axios.post('https://us16.api.mailchimp.com/3.0/lists/67f546879c/members', stringifiedParam,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
       auth: {
        username: "SlotNSlot",
        password: (process.env["MAILCHIMP_API_KEY"] as string),
      },
    });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: err.response.data.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        "Access-Control-Allow-Origin": "*",
      },
    body: JSON.stringify({ error: err.response.data.title }),
    };
  }
};
