/**
* IMPORTANT NOTE!
* This file was auto-generated with tsoa.
* Please do not modify it. Re-run tsoa to re-generate this file
*/

import { Router } from "express";
import { container, handleRequest } from "@structured-growth/microservice-sdk";
import * as Controllers from "../controllers/v1";

const handlerOpts = {
    logRequestBody: container.resolve<boolean>('logRequestBody'),
    logResponses: container.resolve<boolean>('logResponses'),
}

export const router = Router();
const pathPrefix = process.env.URI_PATH_PREFIX || '';

//TasksController
router.get(pathPrefix + '/v1/tasks', handleRequest(Controllers.TasksController, "search", handlerOpts));
router.post(pathPrefix + '/v1/tasks', handleRequest(Controllers.TasksController, "create", handlerOpts));
router.get(pathPrefix + '/v1/tasks/:taskId', handleRequest(Controllers.TasksController, "get", handlerOpts));
router.put(pathPrefix + '/v1/tasks/:taskId', handleRequest(Controllers.TasksController, "update", handlerOpts));
router.delete(pathPrefix + '/v1/tasks/:taskId', handleRequest(Controllers.TasksController, "delete", handlerOpts));

//TaskTypeController
router.get(pathPrefix + '/v1/task-type', handleRequest(Controllers.TaskTypeController, "search", handlerOpts));
router.post(pathPrefix + '/v1/task-type', handleRequest(Controllers.TaskTypeController, "create", handlerOpts));
router.get(pathPrefix + '/v1/task-type/:taskTypeId', handleRequest(Controllers.TaskTypeController, "get", handlerOpts));
router.put(pathPrefix + '/v1/task-type/:taskTypeId', handleRequest(Controllers.TaskTypeController, "update", handlerOpts));
router.delete(pathPrefix + '/v1/task-type/:taskTypeId', handleRequest(Controllers.TaskTypeController, "delete", handlerOpts));

//SystemController
router.post(pathPrefix + '/v1/system/migrate', handleRequest(Controllers.SystemController, "migrate", handlerOpts));

//PingController
router.get(pathPrefix + '/v1/ping/alive', handleRequest(Controllers.PingController, "pingGet", handlerOpts));

//NotesController
router.get(pathPrefix + '/v1/notes', handleRequest(Controllers.NotesController, "search", handlerOpts));
router.post(pathPrefix + '/v1/notes', handleRequest(Controllers.NotesController, "create", handlerOpts));
router.get(pathPrefix + '/v1/notes/:noteId', handleRequest(Controllers.NotesController, "get", handlerOpts));
router.put(pathPrefix + '/v1/notes/:noteId', handleRequest(Controllers.NotesController, "update", handlerOpts));
router.delete(pathPrefix + '/v1/notes/:noteId', handleRequest(Controllers.NotesController, "delete", handlerOpts));

//ResolverController
router.get(pathPrefix + '/v1/resolver/resolve', handleRequest(Controllers.ResolverController, "resolve", handlerOpts));
router.get(pathPrefix + '/v1/resolver/actions', handleRequest(Controllers.ResolverController, "actions", handlerOpts));
router.get(pathPrefix + '/v1/resolver/models', handleRequest(Controllers.ResolverController, "models", handlerOpts));

// map is required for correct resolving action by route
export const actionToRouteMap = {
	"TasksController.search": 'get /v1/tasks',
	"TasksController.create": 'post /v1/tasks',
	"TasksController.get": 'get /v1/tasks/:taskId',
	"TasksController.update": 'put /v1/tasks/:taskId',
	"TasksController.delete": 'delete /v1/tasks/:taskId',
	"TaskTypeController.search": 'get /v1/task-type',
	"TaskTypeController.create": 'post /v1/task-type',
	"TaskTypeController.get": 'get /v1/task-type/:taskTypeId',
	"TaskTypeController.update": 'put /v1/task-type/:taskTypeId',
	"TaskTypeController.delete": 'delete /v1/task-type/:taskTypeId',
	"SystemController.migrate": 'post /v1/system/migrate',
	"PingController.pingGet": 'get /v1/ping/alive',
	"NotesController.search": 'get /v1/notes',
	"NotesController.create": 'post /v1/notes',
	"NotesController.get": 'get /v1/notes/:noteId',
	"NotesController.update": 'put /v1/notes/:noteId',
	"NotesController.delete": 'delete /v1/notes/:noteId',
	"ResolverController.resolve": 'get /v1/resolver/resolve',
	"ResolverController.actions": 'get /v1/resolver/actions',
	"ResolverController.models": 'get /v1/resolver/models',
};
