import { autoInjectable, inject, NotFoundError, I18nType } from "@structured-growth/microservice-sdk";
import { TasksRepository } from "./tasks.repository";
import { TaskTypeRepository } from "../task-type/task-type.repository";
import Task from "../../../database/models/task";
import { TaskCreateBodyInterface } from "../../interfaces/task-create-body.interface";
import { TaskUpdateBodyInterface } from "../../interfaces/task-update-body.interface";
import { TaskSearchParamsInterface } from "../../interfaces/task-search-params.interface";
import { SearchResultInterface } from "@structured-growth/microservice-sdk/.dist";
import { TaskTypeService } from "../task-type/task-type.service";

@autoInjectable()
export class TasksService {
	private i18n: I18nType;
	constructor(
		@inject("TasksRepository") private taskRepository: TasksRepository,
		@inject("TaskTypeRepository") private taskTypeRepository: TaskTypeRepository,
		@inject("TaskTypeService") private taskTypeService: TaskTypeService,
		@inject("i18n") private getI18n: () => I18nType
	) {
		this.i18n = this.getI18n();
	}

	public async search(
		params: TaskSearchParamsInterface & {
			metadata?: Record<string, string | number>;
		}
	): Promise<SearchResultInterface<Task>> {
		let taskTypeId: number | undefined = params.taskTypeId;

		if (params.taskTypeCode) {
			const taskTypesResult = await this.taskTypeService.search({
				orgId: params.orgId,
				code: [params.taskTypeCode],
				includeInherited: true,
			});

			const taskType = taskTypesResult.data[0];
			if (!taskType) {
				throw new NotFoundError(
					`${this.i18n.__("error.task.code_not_found")} ${params.taskTypeCode} ${this.i18n.__(
						"error.common.not_found"
					)}`
				);
			}
			taskTypeId = taskType.id;
		}

		return this.taskRepository.search({
			...params,
			taskTypeId,
		});
	}

	public async create(params: TaskCreateBodyInterface): Promise<Task> {
		let taskTypeId: number | undefined = params.taskTypeId;

		if (taskTypeId) {
			const taskType = await this.taskTypeRepository.read(taskTypeId);
			if (!taskType) {
				throw new NotFoundError(
					`${this.i18n.__("error.task.id_not_found")} ${taskTypeId} ${this.i18n.__("error.common.not_found")}`
				);
			}
		} else if (params.taskTypeCode) {
			const taskTypesResult = await this.taskTypeService.search({
				orgId: params.orgId,
				code: [params.taskTypeCode],
				includeInherited: true,
			});

			const taskType = taskTypesResult.data[0];
			if (!taskType) {
				throw new NotFoundError(
					`${this.i18n.__("error.task.code_not_found")} ${params.taskTypeCode} ${this.i18n.__(
						"error.common.not_found"
					)}`
				);
			}
			taskTypeId = taskType.id;
		}

		return this.taskRepository.create({
			...params,
			taskTypeId,
		});
	}

	public async update(taskId: number, params: TaskUpdateBodyInterface): Promise<Task> {
		let taskTypeId: number | undefined = params.taskTypeId;

		if (taskTypeId) {
			const taskType = await this.taskTypeRepository.read(taskTypeId);
			if (!taskType) {
				throw new NotFoundError(
					`${this.i18n.__("error.task.id_not_found")} ${taskTypeId} ${this.i18n.__("error.common.not_found")}`
				);
			}
		} else if (params.taskTypeCode) {
			const task = await this.taskRepository.read(taskId);

			const taskTypesResult = await this.taskTypeService.search({
				orgId: task.orgId,
				code: [params.taskTypeCode],
				includeInherited: true,
			});

			const taskType = taskTypesResult.data[0];
			if (!taskType) {
				throw new NotFoundError(
					`${this.i18n.__("error.task.code_not_found")} ${params.taskTypeCode} ${this.i18n.__(
						"error.common.not_found"
					)}`
				);
			}
			taskTypeId = taskType.id;
		}

		return this.taskRepository.update(taskId, {
			...params,
			taskTypeId,
		});
	}
}
