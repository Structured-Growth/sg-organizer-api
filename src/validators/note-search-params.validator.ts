import { joi } from "@structured-growth/microservice-sdk";
import { CommonSearchParamsValidator } from "./common-search-params.validator";

export const NoteSearchParamsValidator = joi.object({
	query: joi
		.object({
			orgId: joi.number().positive().label("Organization ID"),
			accountId: joi.array().items(joi.number().positive().required()).label("Account IDs"),
			userId: joi.array().items(joi.number().positive().required()).label("User IDs"),
			status: joi.string().valid("active", "archived"),
			createdAtMin: joi.date().iso().label("Created at minimum"),
			createdAtMax: joi.date().iso().label("Created at maximum"),
			metadata: joi.object().label("Metadata"),
		})
		.concat(CommonSearchParamsValidator),
});
