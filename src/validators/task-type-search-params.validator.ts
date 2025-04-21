import { joi } from "@structured-growth/microservice-sdk";
import { CommonSearchParamsValidator } from "./common-search-params.validator";

export const TaskTypeSearchParamsValidator = joi.object({
	query: joi
		.object({
			orgId: joi.number().positive().required().label("validator.taskType.orgId"),
			title: joi.array().items(joi.string().max(50).required()).label("validator.taskType.title"),
			code: joi.array().items(joi.string().max(50).required()).label("validator.taskType.code"),
			status: joi.string().valid("active", "inactive", "archived").label("validator.taskType.status"),
		})
		.concat(CommonSearchParamsValidator),
});
