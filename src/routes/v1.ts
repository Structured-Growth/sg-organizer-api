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

//SystemController
router.post(pathPrefix + '/v1/system/migrate', handleRequest(Controllers.SystemController, "migrate", handlerOpts));

//PingController
router.get(pathPrefix + '/v1/ping/alive', handleRequest(Controllers.PingController, "pingGet", handlerOpts));

//ResolverController
router.get(pathPrefix + '/v1/resolver/resolve', handleRequest(Controllers.ResolverController, "resolve", handlerOpts));
router.get(pathPrefix + '/v1/resolver/actions', handleRequest(Controllers.ResolverController, "actions", handlerOpts));
router.get(pathPrefix + '/v1/resolver/models', handleRequest(Controllers.ResolverController, "models", handlerOpts));

//NotesController
router.get(pathPrefix + '/v1/notes', handleRequest(Controllers.NotesController, "search", handlerOpts));
router.post(pathPrefix + '/v1/notes', handleRequest(Controllers.NotesController, "create", handlerOpts));
router.get(pathPrefix + '/v1/notes/:noteId', handleRequest(Controllers.NotesController, "get", handlerOpts));
router.put(pathPrefix + '/v1/notes/:noteId', handleRequest(Controllers.NotesController, "update", handlerOpts));
router.delete(pathPrefix + '/v1/notes/:noteId', handleRequest(Controllers.NotesController, "delete", handlerOpts));

// map is required for correct resolving action by route
export const actionToRouteMap = {
	"SystemController.migrate": 'post /v1/system/migrate',
	"PingController.pingGet": 'get /v1/ping/alive',
	"ResolverController.resolve": 'get /v1/resolver/resolve',
	"ResolverController.actions": 'get /v1/resolver/actions',
	"ResolverController.models": 'get /v1/resolver/models',
	"NotesController.search": 'get /v1/notes',
	"NotesController.create": 'post /v1/notes',
	"NotesController.get": 'get /v1/notes/:noteId',
	"NotesController.update": 'put /v1/notes/:noteId',
	"NotesController.delete": 'delete /v1/notes/:noteId',
};
