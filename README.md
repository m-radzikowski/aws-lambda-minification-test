# Lambda performance testing of bundling variations

Testing Lambda performance with and without code minification.

See the [blog post](https://betterdev.blog/lambda-code-minification/) for more information.

Install:

```shell
pnpm install
```

Install packages directly in the `lambda-packages` and `lambda-packages-unused` directories:

```shell
cd lambda-packages
npm install
cd ../lambda-packages-unused
npm install
```

Deploy:

```shell
cdk deploy
```

Run Artillery:

```shell
pnpm tsx ./runArtillery.ts
```

Logs Insights query (wait a few minutes after running Artillery):

```
filter @type = "REPORT"
| parse @log /\d+:\/\w+\/(?<function>[\w\d-]+)/
| stats
count(*) as invocations,
pct(@initDuration, 50) as init.p50,
pct(@initDuration, 95) as init.p95,
pct(@duration, 50) as dur.p50,
pct(@duration, 95) as dur.p95
group by function, ispresent(@initDuration) as coldstart
| sort by function desc, coldstart desc
```
