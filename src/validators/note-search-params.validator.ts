import { joi } from "@structured-growth/microservice-sdk";
import { CommonSearchParamsValidator } from "./common-search-params.validator";

export const NoteSearchParamsValidator = joi.object({
	query: joi
		.object({
			orgId: joi.number().positive().label("Organization ID"),
			accountId: joi.array().items(joi.number().positive().required()).label("Account IDs"),
			userId: joi.array().items(joi.number().positive().required()).label("User IDs"),
			status: joi.string().valid("active", "archived"),
			metadata: joi.object().label("Metadata"),
		})
		.concat(CommonSearchParamsValidator),
});
