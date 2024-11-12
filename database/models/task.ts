import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { container, RegionEnum, DefaultModelInterface } from "@structured-growth/microservice-sdk";
import TaskType from "./task-type";

export enum TaskPriorityEnum {
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
}

export enum TaskStatusEnum {
	TODO = "todo",
	IN_PROGRESS = "inprogress",
	DONE = "done",
	ARCHIVED = "archived",
}

export interface TaskAttributes extends Omit<DefaultModelInterface, "accountId"> {
	priority: TaskPriorityEnum;
	taskTypeId: number;
	title: string;
	taskDetail: string;
	assignedAccountId?: number[];
	assignedGroupId?: number[];
	createdByAccountId?: number;
	startDate?: Date;
	dueDate?: Date;
	status: TaskStatusEnum;
	metadata?: object;
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
			| "assignedGroupId"
			| "startDate"
			| "dueDate"
			| "status"
			| "metadata"
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
	@ForeignKey(() => TaskType)
	taskTypeId: number;

	@BelongsTo(() => TaskType)
	taskType: TaskType;

	@Column
	title: string;

	@Column
	taskDetail: string;

	@Column(DataType.ARRAY(DataType.INTEGER))
	assignedAccountId: number[];

	@Column(DataType.ARRAY(DataType.INTEGER))
	assignedGroupId: number[];

	@Column
	createdByAccountId: number;

	@Column
	startDate: Date;

	@Column
	dueDate: Date;

	@Column(DataType.STRING)
	status: TaskAttributes["status"];

	@Column({
		type: DataType.JSONB,
	})
	metadata: object;

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
