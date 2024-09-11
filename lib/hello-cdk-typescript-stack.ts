import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";
import * as path from "node:path";

export class HelloCdkTypescriptStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Define the Lambda function resource
		// const myFunction = new lambda.Function(this, "HelloWorldFunction", {
		// 	runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
		// 	handler: "index.handler",
		// 	code: lambda.Code.fromInline(`
		//     exports.handler = async function(event) {
		//       return {
		//         statusCode: 200,
		//         body: JSON.stringify('Hello CDK!'),
		//       };
		//     };
		//   `),
		// });

		const myFunction = new lambda.Function(this, "HelloWorldFunction", {
			runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
			handler: "app.lambdaHandler",
			code: lambda.Code.fromAsset(path.join(__dirname, "..", "lambda", "hello"), {
				exclude: ["*.log", "tests/**/*"],
			}),
		});

		// Create a CloudWatch Logs Log Group for myFunction
		const myFunctionLog = new logs.LogGroup(this, "HelloWorldFunctionLogGroup", {
			retention: logs.RetentionDays.ONE_WEEK,
			logGroupName: `/aws/lambda/${myFunction.functionName}`,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		// Define the Lambda function URL resource
		const myFunctionUrl = myFunction.addFunctionUrl({
			authType: lambda.FunctionUrlAuthType.NONE,
		});

		// Define a CloudFormation output for your URL
		new cdk.CfnOutput(this, "HelloFunctionUrl", {
			value: myFunctionUrl.url,
		});
		// Define a CloudFormation output for LogGroup
		new cdk.CfnOutput(this, "HelloFunctionLogGroup", {
			value: myFunctionLog.logGroupName,
		});
	}
}
