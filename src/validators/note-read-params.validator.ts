import { joi } from "@structured-growth/microservice-sdk";

export const NoteReadParamsValidator = joi.object({
	noteId: joi.number().positive().required().label("Note Id"),
});
