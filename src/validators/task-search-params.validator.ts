import { joi } from "@structured-growth/microservice-sdk";
import { CommonSearchParamsValidator } from "./common-search-params.validator";

export const TaskSearchParamsValidator = joi.object({
	query: joi
		.object({
			orgId: joi.number().positive().label("Organization ID"),
			priority: joi.string().valid("low", "medium", "high").label("Priority"),
			taskTypeId: joi.number().positive().label("Task type ID"),
			title: joi.string().max(100).required().label("Title"),
			assignedAccountId: joi.array().items(joi.number().positive().required()).label("Assigned account Ids"),
			assignedUserId: joi.array().items(joi.number().positive().required()).label("Assigned user Ids"),
			assignedGroupId: joi.array().items(joi.number().positive().required()).label("Assigned group Ids"),
			createdByAccountId: joi.array().items(joi.number().positive().required()).label("Created by account Ids"),
			createdByUserId: joi.array().items(joi.number().positive().required()).label("Created by user Ids"),
			startDate: joi.date().iso().label("Start date"),
			dueDate: joi.date().iso().label("Due date"),
			status: joi.string().valid("todo", "inprogress", "done", "archived").label("Status"),
			createdAtMin: joi.date().iso().label("Created at minimum"),
			createdAtMax: joi.date().iso().label("Created at maximum"),
		})
		.concat(CommonSearchParamsValidator),
});
