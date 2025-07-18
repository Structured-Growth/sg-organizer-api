import { joi } from "@structured-growth/microservice-sdk";

export const NoteCreateParamsValidator = joi.object({
	query: joi.object(),
	body: joi.object({
		orgId: joi.number().positive().required().label("validator.notes.orgId"),
		region: joi.string().required().min(2).max(10).label("validator.notes.region"),
		accountId: joi.number().positive().required().label("validator.notes.accountId"),
		userId: joi.number().positive().required().label("validator.notes.userId"),
		note: joi.string().max(2000).required().label("validator.notes.note"),
		status: joi.string().required().valid("active"),
		metadata: joi
			.object()
			.max(10)
			.pattern(/^/, joi.alternatives().try(joi.boolean(), joi.number(), joi.string().max(255), joi.string().isoDate())),
	}),
});
