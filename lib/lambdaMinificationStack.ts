import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {TestNodejsFunction} from "./testNodejsFunction";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class LambdaMinificationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new TestNodejsFunction(this, 'NoMinifiy');

    new TestNodejsFunction(this, 'MinifyNoSourceMap', {
      bundling: {
        minify: true,
      },
    });

    new TestNodejsFunction(this, 'MinifyWithSourceMapNodejs', {
      bundling: {
        minify: true,
        sourceMap: true,
        sourcesContent: false,
      },
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
      },
    });

    new TestNodejsFunction(this, 'MinifyWithSourceMapLib', {
      bundling: {
        minify: true,
        sourceMap: true,
        sourcesContent: false,
      },
      environment: {
        ENABLE_SOURCE_MAP_SUPPORT: "true",
      },
    });

    const packages = new lambda.Function(this, 'Packages', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('./lambda-packages'),
    })
    const packagesUrl = packages.addFunctionUrl({authType: lambda.FunctionUrlAuthType.NONE});
    new cdk.CfnOutput(this, 'PackagesUrl', {value: packagesUrl.url});

    const packagesUnused = new lambda.Function(this, 'PackagesUnused', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('./lambda-packages-unused'),
    })
    const packagesUnusedUrl = packagesUnused.addFunctionUrl({authType: lambda.FunctionUrlAuthType.NONE});
    new cdk.CfnOutput(this, 'PackagesUnusedUrl', {value: packagesUnusedUrl.url});
  }
}
