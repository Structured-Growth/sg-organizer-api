import { Op } from "sequelize";
import {
	autoInjectable,
	RepositoryInterface,
	SearchResultInterface,
	NotFoundError,
	I18nType,
	inject,
} from "@structured-growth/microservice-sdk";
import TaskType, { TaskTypeCreationAttributes, TaskTypeUpdateAttributes } from "../../../database/models/task-type";
import { TaskTypeSearchParamsInterface } from "../../interfaces/task-type-search-params.interface";

interface TaskTypeRepositorySearchParamsInterface extends Omit<TaskTypeSearchParamsInterface, "orgId"> {
	orgId?: number[];
	metadata?: Record<string, string>;
}

@autoInjectable()
export class TaskTypeRepository
	implements RepositoryInterface<TaskType, TaskTypeRepositorySearchParamsInterface, TaskTypeCreationAttributes>
{
	private i18n: I18nType;
	constructor(@inject("i18n") private getI18n: () => I18nType) {
		this.i18n = this.getI18n();
	}
	public async search(params: TaskTypeRepositorySearchParamsInterface): Promise<SearchResultInterface<TaskType>> {
		const page = params.page || 1;
		let limit = params.limit || 20;
		let offset = (page - 1) * limit;
		const where = {};
		const order = params.sort ? (params.sort.map((item) => item.split(":")) as any) : [["createdAt", "desc"]];

		params.orgId && (where["orgId"] = { [Op.in]: params.orgId });
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
			throw new NotFoundError(
				`${this.i18n.__("error.task_type.name")} ${id} ${this.i18n.__("error.common.not_found")}`
			);
		}
		taskType.setAttributes(params);

		return taskType.save();
	}

	public async delete(id: number): Promise<void> {
		const n = await TaskType.destroy({ where: { id } });

		if (n === 0) {
			throw new NotFoundError(
				`${this.i18n.__("error.task_type.name")} ${id} ${this.i18n.__("error.common.not_found")}`
			);
		}
	}
}
