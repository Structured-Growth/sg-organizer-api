import { joi } from "@structured-growth/microservice-sdk";

export const NoteDeleteParamsValidator = joi.object({
	noteId: joi.number().positive().required().label("Note Id"),
});
