import * as cdkOutputs from './cdkOutputs.json';
import {execSync} from "node:child_process";

const urls = Object.entries(cdkOutputs.CdkLambdaTest);

urls.forEach(([name, url]) => {
  console.log(`\nRunning Artillery for function ${name}`);
  execSync(`pnpm artillery run -t ${url.substring(0, url.length - 1)} artillery.yml`, {stdio: 'inherit'});
});
