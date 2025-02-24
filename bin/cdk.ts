#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {LambdaMinificationStack} from '../lib/lambdaMinificationStack';

const app = new cdk.App();
new LambdaMinificationStack(app, 'CdkLambdaTest');
