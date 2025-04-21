import { joi } from "@structured-growth/microservice-sdk";

export const TaskTypeCreateParamsValidator = joi.object({
	query: joi.object(),
	body: joi.object({
		orgId: joi.number().positive().required().label("validator.taskType.orgId"),
		region: joi.string().min(2).required().label("validator.taskType.region"),
		title: joi.string().min(3).max(100).required().label("validator.taskType.title"),
		code: joi.string().min(3).max(100).required().label("validator.taskType.code"),
		status: joi.string().required().valid("active", "inactive").label("validator.taskType.status"),
	}),
});
