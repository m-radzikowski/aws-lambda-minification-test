import * as sourceMapSupport from 'source-map-support'
import {LambdaFunctionURLHandler} from "aws-lambda";
import {z} from "zod";
import * as _ from "lodash";
import axios from "axios";
import * as winston from "winston";

if (process.env.ENABLE_SOURCE_MAP_SUPPORT === "true") {
  sourceMapSupport.install()
}

// call libraries to make sure they are not removed from imports by accident
z.string();
_.noop();
axios.VERSION;
winston.createLogger();

type User = { profile: { name: string } };

export const handler: LambdaFunctionURLHandler = async (event) => {
  await sleep(200);
  const user = JSON.parse(event.body || "{}");
  return generateResponse(user);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateResponse = (user: User) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: generateGreeting(user)}),
  };
}

const generateGreeting = (user: User) => {
  return `Hello ${user.profile.name}`;
}
