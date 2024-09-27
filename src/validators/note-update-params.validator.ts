import { joi } from "@structured-growth/microservice-sdk";

export const NoteUpdateParamsValidator = joi.object({
	noteId: joi.number().positive().required().label("Note Id"),
	query: joi.object(),
	body: joi.object({
		note: joi.string().max(2000).label("Note"),
		status: joi.string().valid("archived", "active"),
		metadata: joi
			.object()
			.max(10)
			.pattern(/^/, joi.alternatives().try(joi.boolean(), joi.number(), joi.string().max(255), joi.string().isoDate())),
	}),
});
