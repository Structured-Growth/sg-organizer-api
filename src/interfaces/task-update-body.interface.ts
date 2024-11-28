import { TaskAttributes } from "../../database/models/task";

export interface TaskUpdateBodyInterface {
	priority?: TaskAttributes["priority"];
	taskTypeId?: number;
	taskTypeCode?: string;
	title?: string;
	taskDetail?: string;
	assignedAccountId?: number[];
	assignedGroupId?: number[];
	startDate?: Date;
	dueDate?: Date;
	status?: TaskAttributes["status"];
	metadata?: object;
}
