import { autoInjectable, inject } from "@structured-growth/microservice-sdk";
import { TasksRepository } from "./tasks.repository";

@autoInjectable()
export class TasksService {
	constructor(@inject("TasksRepository") private taskRepository: TasksRepository) {}
}
