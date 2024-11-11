import { autoInjectable, inject, NotFoundError } from "@structured-growth/microservice-sdk";
import { TasksRepository } from "./tasks.repository";
import { TaskTypeRepository } from "../task-type/task-type.repository";
import Task from "../../../database/models/task";
import { TaskCreateBodyInterface } from "../../interfaces/task-create-body.interface";
import { TaskUpdateBodyInterface } from "../../interfaces/task-update-body.interface";

@autoInjectable()
export class TasksService {
	constructor(
		@inject("TasksRepository") private taskRepository: TasksRepository,
		@inject("TaskTypeRepository") private taskTypeRepository: TaskTypeRepository
	) {}

	public async create(params: TaskCreateBodyInterface): Promise<Task> {
		const taskTypeId = await this.taskTypeRepository.read(params.taskTypeId);

		if (!taskTypeId) {
			throw new NotFoundError(`Task type id ${params.taskTypeId} not found`);
		}

		return this.taskRepository.create({
			...params,
		});
	}

	public async update(taskId, params: TaskUpdateBodyInterface): Promise<Task> {
		if (params.taskTypeId) {
			const taskTypeId = await this.taskTypeRepository.read(params.taskTypeId);

			if (!taskTypeId) {
				throw new NotFoundError(`Task type id ${params.taskTypeId} not found`);
			}
		}

		return this.taskRepository.update(taskId, { ...params });
	}
}
