import { RegionEnum } from "@structured-growth/microservice-sdk";
import { TaskAttributes } from "../../database/models/task";
export interface TaskCreateBodyInterface {
	orgId: number;
	region: RegionEnum;
	priority: TaskAttributes["priority"];
	taskTypeId: number;
	title: string;
	taskDetail: string;
	assignedAccountId?: number;
	assignedUserId?: number;
	assignedGroupId?: number;
	createdByAccountId: number;
	createdByUserId: number;
	startDate?: Date;
	dueDate?: Date;
	status: TaskAttributes["status"];
}
