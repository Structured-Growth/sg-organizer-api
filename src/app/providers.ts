import "reflect-metadata";
import "./load-environment";
import { App } from "./app";
import {
	container,
	Lifecycle,
	logWriters,
	Logger,
	queueProviders,
	QueueService,
	PolicyService,
	AuthService,
	EventbusService,
	eventBusProviders,
} from "@structured-growth/microservice-sdk";
import { loadEnvironment } from "./load-environment";
import { NotesRepository } from "../modules/notes/notes.repository";
import { NotesService } from "../modules/notes/notes.service";
import { TaskTypeRepository } from "../modules/task-type/task-type.repository";
import { TaskTypeService } from "../modules/task-type/task-type.service";
import { TasksRepository } from "../modules/tasks/tasks.repository";
import { TasksService } from "../modules/tasks/tasks.service";

// load and validate env variables
loadEnvironment();

// const
container.register("appPrefix", { useValue: process.env.APP_PREFIX });
container.register("stage", { useValue: process.env.STAGE });
container.register("region", { useValue: process.env.REGION });
container.register("isDev", { useValue: process.env.STAGE === "dev" });
container.register("isTest", { useValue: process.env.STAGE === "test" });
container.register("logDbRequests", { useValue: process.env.LOG_DB_REQUESTS === "true" });
container.register("logRequestBody", { useValue: process.env.LOG_HTTP_REQUEST_BODY === "true" });
container.register("logResponses", { useValue: process.env.LOG_HTTP_RESPONSES === "true" });

// services
container.register("LogWriter", logWriters[process.env.LOG_WRITER] || "ConsoleLogWriter", {
	lifecycle: Lifecycle.Singleton,
});
container.register("NotesService", NotesService);
container.register("TaskTypeService", TaskTypeService);
container.register("TasksService", TasksService);

// repositories
container.register("NotesRepository", NotesRepository);
container.register("TaskTypeRepository", TaskTypeRepository);
container.register("TasksRepository", TasksRepository);

container.register("Logger", Logger);
container.register("App", App, { lifecycle: Lifecycle.Singleton });

container.register("QueueProvider", queueProviders[process.env.QUEUE_PROVIDER || "AwsSqsQueueProvider"]);
container.register("QueueService", QueueService);

container.register("eventbusName", { useValue: process.env.EVENTBUS_NAME || "sg-eventbus-dev" });
container.register("EventbusProvider", eventBusProviders[process.env.EVENTBUS_PROVIDER || "TestEventbusProvider"]);
container.register("EventbusService", EventbusService);

container.register("authenticationEnabled", { useValue: process.env.AUTHENTICATION_ENABLED === "true" });
container.register("authorizationEnabled", { useValue: process.env.AUTHORIZATION_ENABLED === "true" });
container.register("internalAuthenticationEnabled", {
	useValue: process.env.INTERNAL_AUTHENTICATION_ENABLED === "true",
});
container.register("internalRequestsAllowed", { useValue: process.env.INTERNAL_REQUESTS_ALLOWED === "true" });
container.register("internalAuthenticationJwtSecret", { useValue: process.env.INTERNAL_AUTHENTICATION_JWT_SECRET });
container.register("oAuthServiceGetUserUrl", { useValue: process.env.OAUTH_USER_URL });
container.register("policiesServiceUrl", { useValue: process.env.POLICY_SERVICE_URL });
container.register("AuthService", AuthService);
container.register("PolicyService", PolicyService);

container.register("accountApiUrl", { useValue: process.env.ACCOUNT_API_URL });