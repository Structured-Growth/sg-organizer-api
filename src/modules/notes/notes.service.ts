import { autoInjectable, inject } from "@structured-growth/microservice-sdk";
import { NotesRepository } from "./notes.repository";

@autoInjectable()
export class NotesService {
	constructor(@inject("NotesRepository") private noteRepository: NotesRepository) {}
}
