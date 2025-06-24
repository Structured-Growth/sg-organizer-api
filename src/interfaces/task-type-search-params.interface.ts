import { DefaultSearchParamsInterface } from "@structured-growth/microservice-sdk";
import { TaskTypeAttributes } from "../../database/models/task-type";

export interface TaskTypeSearchParamsInterface extends Omit<DefaultSearchParamsInterface, "accountId"> {
	status?: TaskTypeAttributes["status"];
	title?: string[];
	code?: string[];
	/**
	 * Include inherited types from parent organizations.
	 *
	 * @default true
	 */
	includeInherited?: boolean;
}
