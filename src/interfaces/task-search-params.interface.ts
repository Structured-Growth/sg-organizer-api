import { DefaultSearchParamsInterface } from "@structured-growth/microservice-sdk";
import { TaskAttributes } from "../../database/models/task";

export interface TaskSearchParamsInterface extends Omit<DefaultSearchParamsInterface, "accountId" | "orgId"> {
	orgId?: number;
	priority?: TaskAttributes["priority"];
	taskTypeId?: number;
	title?: string;
	assignedAccountId?: number[];
	assignedUserId?: number[];
	assignedGroupId?: number[];
	createdByAccountId?: number[];
	createdByUserId?: number[];
	startDate?: Date;
	dueDate?: Date;
	status?: TaskAttributes["status"];
	createdAtMin?: Date;
	createdAtMax?: Date;
}
