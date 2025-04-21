import { Get, Route, Tags, Queries, OperationId, SuccessResponse, Body, Post, Path, Put, Delete } from "tsoa";
import {
	autoInjectable,
	BaseController,
	DescribeAction,
	DescribeResource,
	inject,
	NotFoundError,
	SearchResultInterface,
	ValidateFuncArgs,
	I18nType,
} from "@structured-growth/microservice-sdk";
import { pick } from "lodash";
import { TaskAttributes } from "../../../database/models/task";
import { TasksRepository } from "../../modules/tasks/tasks.repository";
import { TasksService } from "../../modules/tasks/tasks.service";
import { TaskSearchParamsInterface } from "../../interfaces/task-search-params.interface";
import { TaskCreateBodyInterface } from "../../interfaces/task-create-body.interface";
import { TaskUpdateBodyInterface } from "../../interfaces/task-update-body.interface";
import { TaskSearchParamsValidator } from "../../validators/task-search-params.validator";
import { TaskCreateParamsValidator } from "../../validators/task-create-params.validator";
import { TaskReadParamsValidator } from "../../validators/task-read-params.validator";
import { TaskUpdateParamsValidator } from "../../validators/task-update-params.validator";
import { TaskDeleteParamsValidator } from "../../validators/task-delete-params.validator";
import { EventMutation } from "@structured-growth/microservice-sdk";

export const publicTaskAttributes = [
	"id",
	"orgId",
	"region",
	"priority",
	"taskTypeId",
	"title",
	"taskDetail",
	"assignedAccountId",
	"assignedGroupId",
	"createdByAccountId",
	"startDate",
	"dueDate",
	"status",
	"metadata",
	"createdAt",
	"updatedAt",
	"arn",
] as const;
type TaskKeys = (typeof publicTaskAttributes)[number];
export type PublicTaskAttributes = Pick<TaskAttributes, TaskKeys>;

@Route("v1/tasks")
@Tags("Tasks")
@autoInjectable()
export class TasksController extends BaseController {
	private i18n: I18nType;
	constructor(
		@inject("TasksRepository") private tasksRepository: TasksRepository,
		@inject("TasksService") private tasksService: TasksService,
		@inject("i18n") private getI18n: () => I18nType
	) {
		super();
		this.i18n = this.getI18n();
	}

	/**
	 * Search Tasks
	 */
	@OperationId("Search")
	@Get("/")
	@SuccessResponse(200, "Returns list of tasks")
	@DescribeAction("tasks/search")
	@DescribeResource("Organization", ({ query }) => Number(query.orgId))
	@DescribeResource("TaskType", ({ query }) => Number(query.taskTypeId))
	@DescribeResource("Account", ({ query }) => query.assignedAccountId?.map(Number))
	@DescribeResource("User", ({ query }) => query.assignedUserId?.map(Number))
	@DescribeResource("Group", ({ query }) => query.assignedGroupId?.map(Number))
	@DescribeResource("Task", ({ query }) => query.id?.map(Number))
	@ValidateFuncArgs(TaskSearchParamsValidator)
	async search(@Queries() query: TaskSearchParamsInterface): Promise<SearchResultInterface<PublicTaskAttributes>> {
		const { data, ...result } = await this.tasksService.search(query);

		return {
			data: data.map((task) => ({
				...(pick(task.toJSON(), publicTaskAttributes) as PublicTaskAttributes),
				arn: task.arn,
			})),
			...result,
		};
	}

	/**
	 * Create Task
	 */
	@OperationId("Create")
	@Post("/")
	@SuccessResponse(201, "Returns created task")
	@DescribeAction("tasks/create")
	@ValidateFuncArgs(TaskCreateParamsValidator)
	@DescribeResource("Organization", ({ body }) => Number(body.orgId))
	@DescribeResource("TaskType", ({ body }) => Number(body.taskTypeId))
	@DescribeResource("Account", ({ body }) => body.assignedAccountId?.map(Number))
	@DescribeResource("User", ({ body }) => body.assignedUserId?.map(Number))
	async create(@Queries() query: {}, @Body() body: TaskCreateBodyInterface): Promise<PublicTaskAttributes> {
		const task = await this.tasksService.create(body);
		this.response.status(201);

		await this.eventBus.publish(
			new EventMutation(this.principal.arn, task.arn, `${this.appPrefix}:tasks/create`, JSON.stringify(body))
		);

		return {
			...(pick(task.toJSON(), publicTaskAttributes) as PublicTaskAttributes),
			arn: task.arn,
		};
	}

	/**
	 * Get Task
	 */
	@OperationId("Read")
	@Get("/:taskId")
	@SuccessResponse(200, "Returns task")
	@DescribeAction("tasks/read")
	@DescribeResource("Task", ({ params }) => Number(params.taskId))
	@ValidateFuncArgs(TaskReadParamsValidator)
	async get(@Path() taskId: number): Promise<PublicTaskAttributes> {
		const task = await this.tasksRepository.read(taskId);

		if (!task) {
			throw new NotFoundError(`${this.i18n.__("error.task.name")} ${taskId} ${this.i18n.__("error.common.not_found")}`);
		}

		return {
			...(pick(task.toJSON(), publicTaskAttributes) as PublicTaskAttributes),
			arn: task.arn,
		};
	}

	/**
	 * Update Task
	 */
	@OperationId("Update")
	@Put("/:taskId")
	@SuccessResponse(200, "Returns updated task")
	@DescribeAction("tasks/update")
	@DescribeResource("Task", ({ params }) => Number(params.taskId))
	@ValidateFuncArgs(TaskUpdateParamsValidator)
	async update(
		@Path() taskId: number,
		@Queries() query: {},
		@Body() body: TaskUpdateBodyInterface
	): Promise<PublicTaskAttributes> {
		const task = await this.tasksService.update(taskId, body);

		await this.eventBus.publish(
			new EventMutation(this.principal.arn, task.arn, `${this.appPrefix}:tasks/update`, JSON.stringify(body))
		);

		return {
			...(pick(task.toJSON(), publicTaskAttributes) as PublicTaskAttributes),
			arn: task.arn,
		};
	}

	/**
	 * Mark Task as deleted. Will be permanently deleted in 90 days.
	 */
	@OperationId("Delete")
	@Delete("/:taskId")
	@SuccessResponse(204, "Returns nothing")
	@DescribeAction("tasks/delete")
	@DescribeResource("Task", ({ params }) => Number(params.taskId))
	@ValidateFuncArgs(TaskDeleteParamsValidator)
	async delete(@Path() taskId: number): Promise<void> {
		const task = await this.tasksRepository.read(taskId);

		if (!task) {
			throw new NotFoundError(`${this.i18n.__("error.task.name")} ${taskId} ${this.i18n.__("error.common.not_found")}`);
		}

		await this.tasksRepository.delete(taskId);

		await this.eventBus.publish(
			new EventMutation(this.principal.arn, task.arn, `${this.appPrefix}:tasks/delete`, JSON.stringify({}))
		);

		this.response.status(204);
	}
}
