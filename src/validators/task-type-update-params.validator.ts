import { joi } from "@structured-growth/microservice-sdk";

export const TaskTypeUpdateSearchParamsValidator = joi.object({
	taskTypeId: joi.number().positive().required().label("validator.taskType.taskTypeId"),
	query: joi.object(),
	body: joi.object({
		title: joi.string().min(3).max(100).label("validator.taskType.title"),
		status: joi.string().valid("active", "inactive", "archived").label("validator.taskType.status"),
		code: joi.string().min(3).max(100).label("validator.taskType.code"),
	}),
});
