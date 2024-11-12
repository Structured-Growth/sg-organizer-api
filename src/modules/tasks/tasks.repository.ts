import { Op } from "sequelize";
import {
	autoInjectable,
	RepositoryInterface,
	SearchResultInterface,
	NotFoundError,
} from "@structured-growth/microservice-sdk";
import { isUndefined, omitBy } from "lodash";
import Task, { TaskCreationAttributes, TaskUpdateAttributes } from "../../../database/models/task";
import { TaskSearchParamsInterface } from "../../interfaces/task-search-params.interface";

@autoInjectable()
export class TasksRepository implements RepositoryInterface<Task, TaskSearchParamsInterface, TaskCreationAttributes> {
	public async search(
		params: TaskSearchParamsInterface & {
			metadata?: Record<string, string | number>;
		}
	): Promise<SearchResultInterface<Task>> {
		const page = params.page || 1;
		let limit = params.limit || 20;
		let offset = (page - 1) * limit;
		const where = {};
		const order = params.sort ? (params.sort.map((item) => item.split(":")) as any) : [["createdAt", "desc"]];

		params.orgId && (where["orgId"] = params.orgId);
		params.priority && (where["priority"] = params.priority);
		params.taskTypeId && (where["taskTypeId"] = params.taskTypeId);
		params.assignedAccountId && (where["assignedAccountId"] = { [Op.overlap]: params.assignedAccountId });
		params.assignedGroupId && (where["assignedGroupId"] = { [Op.contains]: params.assignedGroupId });
		params.createdByAccountId && (where["createdByAccountId"] = { [Op.in]: params.createdByAccountId });
		params.status && (where["status"] = params.status);
		params.id && (where["id"] = { [Op.in]: params.id });

		if (params.title?.length > 0) {
			where["title"] = {
				[Op.or]: params.title.map((str) => ({ [Op.iLike]: str.replace(/\*/g, "%") })),
			};
		}

		if (params.startDate) {
			where["startDate"] = {
				[Op.gte]: params.startDate,
			};
		}

		if (params.dueDate) {
			where["dueDate"] = {
				[Op.lte]: params.dueDate,
			};
		}

		if (params.createdAtMin || params.createdAtMax) {
			where["createdAt"] = omitBy(
				{
					[Op.gte]: params.createdAtMin,
					[Op.lte]: params.createdAtMax,
				},
				isUndefined
			);
		}

		if (params.metadata) {
			where["metadata"] = params.metadata;
		}

		const { rows, count } = await Task.findAndCountAll({
			where,
			offset,
			limit,
			order,
		});

		return {
			data: rows,
			total: count,
			limit,
			page,
		};
	}

	public async create(params: TaskCreationAttributes): Promise<Task> {
		return Task.create(params);
	}

	public async read(
		id: number,
		params?: {
			attributes?: string[];
		}
	): Promise<Task> {
		return Task.findByPk(id, {
			attributes: params?.attributes,
			rejectOnEmpty: false,
		});
	}

	public async update(id: number, params: TaskUpdateAttributes): Promise<Task> {
		const task = await this.read(id);
		if (!task) {
			throw new NotFoundError(`Task ${id} not found`);
		}
		task.setAttributes(params);

		return task.save();
	}

	public async delete(id: number): Promise<void> {
		const n = await Task.destroy({ where: { id } });

		if (n === 0) {
			throw new NotFoundError(`Task ${id} not found`);
		}
	}
}
