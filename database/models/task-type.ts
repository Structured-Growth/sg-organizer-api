import { Column, DataType, Model, Table } from "sequelize-typescript";
import { container, RegionEnum, DefaultModelInterface } from "@structured-growth/microservice-sdk";

export interface TaskTypeAttributes extends Omit<DefaultModelInterface, "accountId"> {
	title: string;
	code: string;
	status: "active" | "inactive" | "archived";
}

export interface TaskTypeCreationAttributes
	extends Omit<TaskTypeAttributes, "id" | "arn" | "createdAt" | "updatedAt" | "deletedAt"> {}

export type TaskTypeUpdateAttributes = Partial<Pick<TaskTypeAttributes, "title" | "code" | "status">>;

@Table({
	tableName: "task_types",
	timestamps: true,
	underscored: true,
})
export class TaskType extends Model<TaskTypeAttributes, TaskTypeCreationAttributes> implements TaskTypeAttributes {
	@Column
	orgId: number;

	@Column(DataType.STRING)
	region: RegionEnum;

	@Column
	title: string;

	@Column
	code: string;

	@Column(DataType.STRING)
	status: TaskTypeAttributes["status"];

	static get arnPattern(): string {
		return [container.resolve("appPrefix"), "<region>", "<orgId>", "task-type/<taskTypeId>"].join(":");
	}

	get arn(): string {
		return [container.resolve("appPrefix"), this.region, this.orgId, `task-type/${this.id}`].join(":");
	}
}

export default TaskType;
