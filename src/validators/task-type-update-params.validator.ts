import { joi } from "@structured-growth/microservice-sdk";

export const TaskTypeUpdateSearchParamsValidator = joi.object({
	taskTypeId: joi.number().positive().required().label("Task type Id"),
	query: joi.object(),
	body: joi.object({
		title: joi.string().min(3).max(100).label("Task type title"),
		status: joi.string().valid("active", "inactive", "archived").label("Status"),
		code: joi.string().min(3).max(100).label("Task type code"),
	}),
});
