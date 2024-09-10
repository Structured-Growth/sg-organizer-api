#!/usr/bin/env node
import "./app/providers";
import { AppMock } from "./app/app.mock";
import { container, generateApiDocs, Lifecycle, QueueService } from "@structured-growth/microservice-sdk";
import { program } from "commander";
import { Message } from "aws-sdk/clients/sqs";

program.option("-e, --env-file <envFile>", "path to .env file", ".env");

program
	.command("web")
	.description("Runs a web server")
	.action(async () => {
		const { startWebServer } = await require("./api");
		await startWebServer();
	});

program
	.command("sqs")
	.description("Runs a queue listener")
	.action(async () => {
		const queue: QueueService = container.resolve<QueueService>("QueueService");
		const alertsApiQueueName: string = container.resolve<string>("alertsApiQueueName");
		const { handler } = await require("./lambda-sqs");
		queue.subscribe(alertsApiQueueName, async (message, event: Message) => {
			await handler({
				Records: [
					{
						messageId: event.MessageId,
						receiptHandle: event.ReceiptHandle,
						body: event.Body,
						attributes: event.Attributes,
						messageAttributes: event.MessageAttributes,
						md5OfBody: event.MD5OfBody,
						eventSource: "",
						eventSourceARN: "",
						awsRegion: "",
					} as any,
				],
			});
		});
	});

program
	.command("docs")
	.description("Generate API docs")
	.action(async () => {
		container.register("App", AppMock, { lifecycle: Lifecycle.Singleton });
		const app = container.resolve<AppMock>("App");
		await app.ready;
		const specConfig = await require("../tsoa.v1.json");
		const controllers = await require("../src/controllers/v1");

		await generateApiDocs(app, controllers, container.resolve("appPrefix"), {
			...specConfig,
			outputDirectory: ".docs/openapi.v1",
			entryFile: "src/controllers/v1/index.ts",
		} as any);
		process.exit();
	});

program.parse(process.argv);

const { envFile } = program.opts();
process.env.__PATH_TO_ENV_FILE = envFile;
