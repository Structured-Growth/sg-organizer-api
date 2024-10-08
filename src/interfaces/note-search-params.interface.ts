import { DefaultSearchParamsInterface } from "@structured-growth/microservice-sdk";
import { NoteAttributes } from "../../database/models/note";

export interface NoteSearchParamsInterface extends Omit<DefaultSearchParamsInterface, "accountId" | "orgId"> {
	orgId?: number;
	accountId?: number[];
	userId?: number[];
	createdAtMin?: Date;
	createdAtMax?: Date;
	status?: NoteAttributes["status"];
	"metadata[customFieldName]"?: string;
}
