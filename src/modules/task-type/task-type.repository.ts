import { Op } from "sequelize";
import {
	autoInjectable,
	RepositoryInterface,
	SearchResultInterface,
	NotFoundError,
} from "@structured-growth/microservice-sdk";
import { isUndefined, omitBy } from "lodash";
import TaskType, { TaskTypeCreationAttributes, TaskTypeUpdateAttributes } from "../../../database/models/task-type";
import { TaskTypeSearchParamsInterface } from "../../interfaces/task-type-search-params.interface";

@autoInjectable()
export class TaskTypeRepository
	implements RepositoryInterface<TaskType, TaskTypeSearchParamsInterface, TaskTypeCreationAttributes>
{
	public async search(params: TaskTypeSearchParamsInterface): Promise<SearchResultInterface<TaskType>> {
		const page = params.page || 1;
		let limit = params.limit || 20;
		let offset = (page - 1) * limit;
		const where = {};
		const order = params.sort ? (params.sort.map((item) => item.split(":")) as any) : [["createdAt", "desc"]];

		params.orgId && (where["orgId"] = params.orgId);
		params.status && (where["status"] = params.status);
		params.id && (where["id"] = { [Op.in]: params.id });

		if (params.title?.length > 0) {
			where["title"] = {
				[Op.or]: params.title.map((str) => ({ [Op.iLike]: str.replace(/\*/g, "%") })),
			};
		}

		if (params.code?.length > 0) {
			where["code"] = {
				[Op.or]: params.code.map((str) => ({ [Op.iLike]: str.replace(/\*/g, "%") })),
			};
		}

		const { rows, count } = await TaskType.findAndCountAll({
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

	public async create(params: TaskTypeCreationAttributes): Promise<TaskType> {
		return TaskType.create(params);
	}

	public async read(
		id: number,
		params?: {
			attributes?: string[];
		}
	): Promise<TaskType> {
		return TaskType.findByPk(id, {
			attributes: params?.attributes,
			rejectOnEmpty: false,
		});
	}

	public async update(id: number, params: TaskTypeUpdateAttributes): Promise<TaskType> {
		const taskType = await this.read(id);

		if (!taskType) {
			throw new NotFoundError(`Task type ${id} not found`);
		}
		taskType.setAttributes(params);

		return taskType.save();
	}

	public async delete(id: number): Promise<void> {
		const n = await TaskType.destroy({ where: { id } });

		if (n === 0) {
			throw new NotFoundError(`Task type ${id} not found`);
		}
	}
}
