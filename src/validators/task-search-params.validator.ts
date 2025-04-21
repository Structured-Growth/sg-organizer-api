import { joi } from "@structured-growth/microservice-sdk";
import { CommonSearchParamsValidator } from "./common-search-params.validator";

export const TaskSearchParamsValidator = joi.object({
	query: joi
		.object({
			orgId: joi.number().positive().required().label("validator.tasks.orgId"),
			priority: joi.string().valid("low", "medium", "high").label("validator.tasks.priority"),
			taskTypeId: joi.number().positive().label("validator.tasks.taskTypeId"),
			taskTypeCode: joi.string().max(100).label("validator.tasks.taskTypeCode"),
			title: joi.array().items(joi.string().max(100).required()).label("validator.tasks.title"),
			assignedAccountId: joi
				.array()
				.items(joi.number().positive().required())
				.label("validator.tasks.assignedAccountId"),
			assignedGroupId: joi.array().items(joi.number().positive().required()).label("validator.tasks.assignedGroupId"),
			createdByAccountId: joi
				.array()
				.items(joi.number().positive().required())
				.label("validator.tasks.createdByAccountId"),
			startDate: joi.date().iso().label("validator.tasks.startDate"),
			dueDate: joi.date().iso().label("validator.tasks.dueDate"),
			status: joi.string().valid("todo", "inprogress", "done", "archived").label("validator.tasks.status"),
			createdAtMin: joi.date().iso().label("validator.tasks.createdAtMin"),
			createdAtMax: joi.date().iso().label("validator.tasks.createdAtMax"),
			metadata: joi.object().label("validator.tasks.metadata"),
		})
		.concat(CommonSearchParamsValidator),
});
