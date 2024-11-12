import { autoInjectable, inject, NotFoundError } from "@structured-growth/microservice-sdk";
import { TasksRepository } from "./tasks.repository";
import { TaskTypeRepository } from "../task-type/task-type.repository";
import Task from "../../../database/models/task";
import { TaskCreateBodyInterface } from "../../interfaces/task-create-body.interface";
import { TaskUpdateBodyInterface } from "../../interfaces/task-update-body.interface";
import { TaskSearchParamsInterface } from "../../interfaces/task-search-params.interface";
import { SearchResultInterface } from "@structured-growth/microservice-sdk/.dist";

@autoInjectable()
export class TasksService {
	constructor(
		@inject("TasksRepository") private taskRepository: TasksRepository,
		@inject("TaskTypeRepository") private taskTypeRepository: TaskTypeRepository
	) {}

	public async search(
		params: TaskSearchParamsInterface & {
			metadata?: Record<string, string | number>;
		}
	): Promise<SearchResultInterface<Task>> {
		let taskTypeId: number | undefined = params.taskTypeId;

		if (params.taskTypeCode) {
			const taskTypesResult = await this.taskTypeRepository.search({
				orgId: params.orgId,
				code: [params.taskTypeCode],
			});

			const taskType = taskTypesResult.data[0];
			if (!taskType) {
				throw new NotFoundError(`Task type code ${params.taskTypeCode} not found`);
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
				throw new NotFoundError(`Task type id ${taskTypeId} not found`);
			}
		} else if (params.taskTypeCode) {
			const taskTypesResult = await this.taskTypeRepository.search({
				orgId: params.orgId,
				code: [params.taskTypeCode],
			});

			const taskType = taskTypesResult.data[0];
			if (!taskType) {
				throw new NotFoundError(`Task type code ${params.taskTypeCode} not found`);
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
				throw new NotFoundError(`Task type id ${taskTypeId} not found`);
			}
		} else if (params.taskTypeCode) {
			const task = await this.taskRepository.read(taskId);

			const taskTypesResult = await this.taskTypeRepository.search({
				orgId: task.orgId,
				code: [params.taskTypeCode],
			});

			const taskType = taskTypesResult.data[0];
			if (!taskType) {
				throw new NotFoundError(`Task type code ${params.taskTypeCode} not found`);
			}
			taskTypeId = taskType.id;
		}

		return this.taskRepository.update(taskId, {
			...params,
			taskTypeId,
		});
	}
}
