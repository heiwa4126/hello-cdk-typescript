import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import path = require("node:path");

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

		// Define the Lambda function URL resource
		const myFunctionUrl = myFunction.addFunctionUrl({
			authType: lambda.FunctionUrlAuthType.NONE,
		});

		// Define a CloudFormation output for your URL
		new cdk.CfnOutput(this, "myFunctionUrlOutput", {
			value: myFunctionUrl.url,
		});
	}
}
