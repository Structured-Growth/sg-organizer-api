import { RegionEnum } from "@structured-growth/microservice-sdk";
import { TaskAttributes } from "../../database/models/task";
export interface TaskCreateBodyInterface {
	orgId: number;
	region: RegionEnum;
	priority: TaskAttributes["priority"];
	taskTypeId: number;
	taskTypeCode: string;
	title: string;
	taskDetail: string;
	assignedAccountId?: number[];
	assignedGroupId?: number[];
	createdByAccountId?: number;
	startDate?: Date;
	dueDate?: Date;
	status: TaskAttributes["status"];
	metadata?: object;
}
