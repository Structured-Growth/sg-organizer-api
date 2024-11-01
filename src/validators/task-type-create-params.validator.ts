import { joi } from "@structured-growth/microservice-sdk";

export const TaskTypeCreateParamsValidator = joi.object({
	query: joi.object(),
	body: joi.object({
		orgId: joi.number().positive().required().label("Organization Id"),
		region: joi.string().min(2).required().label("Task type region"),
		title: joi.string().min(3).max(100).required().label("Task type title"),
		code: joi.string().min(3).max(100).required().label("Task type code"),
		status: joi.string().required().valid("active", "inactive").label("Status"),
	}),
});
