import { NoteAttributes } from "../../database/models/note";

export interface NoteUpdateBodyInterface {
	note?: string;
	status?: NoteAttributes["status"];
	metadata?: object;
}
