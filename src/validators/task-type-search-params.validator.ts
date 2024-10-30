import { joi } from "@structured-growth/microservice-sdk";
import { CommonSearchParamsValidator } from "./common-search-params.validator";

export const TaskTypeSearchParamsValidator = joi.object({
	query: joi
		.object({
			orgId: joi.number().positive().required().label("Organization Id"),
			title: joi.array().items(joi.string().max(50).required()).label("Type title"),
			code: joi.array().items(joi.string().max(50).required()).label("Type code"),
			status: joi.array().items(joi.string().valid("active", "inactive", "archived").required().label("Status")),
		})
		.concat(CommonSearchParamsValidator),
});
