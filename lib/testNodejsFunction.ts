import {Construct} from "constructs";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";

export class TestNodejsFunction extends nodejs.NodejsFunction {
  constructor(scope: Construct, id: string, props?: nodejs.NodejsFunctionProps) {
    const stackIdx = scope.node.scopes.findIndex(s => s.node.addr === cdk.Stack.of(scope).node.addr);
    const logGroupName = "/" + [
      cdk.Stack.of(scope).stackName,
      ...scope.node.scopes.slice(stackIdx + 1).map(s => s.node.id),
      id,
    ].filter(Boolean).join('/');

    const logGroup = new logs.LogGroup(scope, `${id}LogGroup`, {
      logGroupName,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    super(scope, id, {
      entry: 'lambda/index.ts',
      runtime: lambda.Runtime.NODEJS_20_X,
      logGroup,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(5),
      ...props,
      bundling: {
        target: "node20",
        mainFields: ["module", "main"],
        format: nodejs.OutputFormat.ESM,
        banner: "const require = (await import('node:module')).createRequire(import.meta.url);",
        ...props?.bundling,
      },
      environment: {
        ...props?.environment,
      },
    });

    const functionUrl = this.addFunctionUrl({authType: lambda.FunctionUrlAuthType.NONE});
    new cdk.CfnOutput(this, 'URL', {value: functionUrl.url});
  }
}
