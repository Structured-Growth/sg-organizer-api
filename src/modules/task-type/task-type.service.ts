import { autoInjectable, inject } from "@structured-growth/microservice-sdk";
import { TaskTypeRepository } from "./task-type.repository";

@autoInjectable()
export class TaskTypeService {
	constructor(@inject("TaskTypeRepository") private taskTypeRepository: TaskTypeRepository) {}
}
