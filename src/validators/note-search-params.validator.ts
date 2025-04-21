import { joi } from "@structured-growth/microservice-sdk";
import { CommonSearchParamsValidator } from "./common-search-params.validator";

export const NoteSearchParamsValidator = joi.object({
	query: joi
		.object({
			orgId: joi.number().positive().label("validator.notes.orgId"),
			accountId: joi.array().items(joi.number().positive().required()).label("validator.notes.accountId"),
			userId: joi.array().items(joi.number().positive().required()).label("validator.notes.userId"),
			status: joi.string().valid("active", "archived"),
			createdAtMin: joi.date().iso().label("validator.notes.createdAtMin"),
			createdAtMax: joi.date().iso().label("validator.notes.createdAtMax"),
			metadata: joi.object().label("validator.notes.metadata"),
		})
		.concat(CommonSearchParamsValidator),
});
