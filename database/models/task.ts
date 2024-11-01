import { Column, DataType, Model, Table } from "sequelize-typescript";
import { container, RegionEnum, DefaultModelInterface } from "@structured-growth/microservice-sdk";

export interface TaskAttributes extends Omit<DefaultModelInterface, "accountId"> {
	priority: "low" | "medium" | "high";
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
	status: "to do" | "progress" | "done" | "archive";
}

export interface TaskCreationAttributes
	extends Omit<TaskAttributes, "id" | "arn" | "createdAt" | "updatedAt" | "deletedAt"> {}

export interface TaskUpdateAttributes
	extends Partial<
		Pick<
			TaskCreationAttributes,
			| "priority"
			| "taskTypeId"
			| "title"
			| "taskDetail"
			| "assignedAccountId"
			| "assignedUserId"
			| "assignedGroupId"
			| "startDate"
			| "dueDate"
			| "status"
		>
	> {}

@Table({
	tableName: "tasks",
	timestamps: true,
	underscored: true,
	paranoid: true,
})
export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
	@Column
	orgId: number;

	@Column(DataType.STRING)
	region: RegionEnum;

	@Column(DataType.STRING)
	priority: TaskAttributes["priority"];

	@Column
	taskTypeId: number;

	@Column
	title: string;

	@Column
	taskDetail: string;

	@Column
	assignedAccountId: number;

	@Column
	assignedUserId: number;

	@Column
	assignedGroupId: number;

	@Column
	createdByAccountId: number;

	@Column
	createdByUserId: number;

	@Column
	startDate: Date;

	@Column
	dueDate: Date;

	@Column(DataType.STRING)
	status: TaskAttributes["status"];

	static get arnPattern(): string {
		return [container.resolve("appPrefix"), "<region>", "<orgId>", "<accountId>", "tasks/<taskId>"].join(":");
	}

	get arn(): string {
		return [container.resolve("appPrefix"), this.region, this.orgId, this.createdByAccountId, `tasks/${this.id}`].join(
			":"
		);
	}
}

export default Task;
