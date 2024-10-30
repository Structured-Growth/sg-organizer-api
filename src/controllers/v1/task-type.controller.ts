import { Get, Route, Tags, Queries, OperationId, SuccessResponse, Body, Post, Path, Put, Delete } from "tsoa";
import {
	autoInjectable,
	inject,
	BaseController,
	DescribeAction,
	DescribeResource,
	SearchResultInterface,
	ValidateFuncArgs,
	NotFoundError,
} from "@structured-growth/microservice-sdk";
import { pick } from "lodash";
import { TaskTypeAttributes } from "../../../database/models/task-type";
import { TaskTypeSearchParamsValidator } from "../../validators/task-type-search-params.validator";
import { TaskTypeSearchParamsInterface } from "../../interfaces/task-type-search-params.interface";
import { TaskTypeCreateParamsValidator } from "../../validators/task-type-create-params.validator";
import { TaskTypeCreateBodyInterface } from "../../interfaces/task-type-create-body.interface";
import { TaskTypeReadParamsValidator } from "../../validators/task-type-read-params.validator";
import { TaskTypeUpdateSearchParamsValidator } from "../../validators/task-type-update-params.validator";
import { TaskTypeUpdateBodyInterface } from "../../interfaces/task-type-update-body.interface";
import { TaskTypeRepository } from "../../modules/task-type/task-type.repository";
import { TaskTypeService } from "../../modules/task-type/task-type.service";
import { EventMutation } from "@structured-growth/microservice-sdk";

const publicTaskTypeAttributes = [
	"id",
	"orgId",
	"region",
	"title",
	"status",
	"code",
	"createdAt",
	"updatedAt",
	"arn",
] as const;
type TaskTypeKeys = (typeof publicTaskTypeAttributes)[number];
type PublicTaskTypeAttributes = Pick<TaskTypeAttributes, TaskTypeKeys>;

@Route("v1/task-type")
@Tags("Task Type")
@autoInjectable()
export class TaskTypeController extends BaseController {
	constructor(
		@inject("TaskTypeRepository") private taskTypeRepository: TaskTypeRepository,
		@inject("TaskTypeService") private taskTypeService: TaskTypeService
	) {
		super();
	}

	/**
	 * Search Task Types
	 */
	@OperationId("Search")
	@Get("/")
	@SuccessResponse(200, "Returns list of types")
	@DescribeAction("task-type/search")
	@DescribeResource("Organization", ({ query }) => Number(query.orgId))
	@ValidateFuncArgs(TaskTypeSearchParamsValidator)
	async search(
		@Queries() query: TaskTypeSearchParamsInterface
	): Promise<SearchResultInterface<PublicTaskTypeAttributes>> {
		const { data, ...result } = await this.taskTypeRepository.search(query);
		this.response.status(200);

		return {
			data: data.map((taskType) => ({
				...(pick(taskType.toJSON(), publicTaskTypeAttributes) as PublicTaskTypeAttributes),
				arn: taskType.arn,
			})),
			...result,
		};
	}

	/**
	 * Create Task Type
	 */
	@OperationId("Create")
	@Post("/")
	@SuccessResponse(201, "Returns created type")
	@DescribeAction("task-type/create")
	@DescribeResource("Organization", ({ body }) => Number(body.orgId))
	@ValidateFuncArgs(TaskTypeCreateParamsValidator)
	async create(@Queries() query: {}, @Body() body: TaskTypeCreateBodyInterface): Promise<PublicTaskTypeAttributes> {
		const taskType = await this.taskTypeRepository.create(body);
		this.response.status(201);

		await this.eventBus.publish(
			new EventMutation(this.principal.arn, taskType.arn, `${this.appPrefix}:task-type/create`, JSON.stringify(body))
		);

		return {
			...(pick(taskType.toJSON(), publicTaskTypeAttributes) as PublicTaskTypeAttributes),
			arn: taskType.arn,
		};
	}

	/**
	 * Get Task Type
	 */
	@OperationId("Read")
	@Get("/:taskTypeId")
	@SuccessResponse(200, "Returns type")
	@DescribeAction("task-type/read")
	@DescribeResource("TaskType", ({ params }) => Number(params.taskTypeId))
	@ValidateFuncArgs(TaskTypeReadParamsValidator)
	async get(@Path() taskTypeId: number): Promise<PublicTaskTypeAttributes> {
		const taskType = await this.taskTypeRepository.read(taskTypeId);

		if (!taskType) {
			throw new NotFoundError(`Task Type ${taskTypeId} not found`);
		}

		return {
			...(pick(taskType.toJSON(), publicTaskTypeAttributes) as PublicTaskTypeAttributes),
			arn: taskType.arn,
		};
	}

	/**
	 * Update Task Type
	 */
	@OperationId("Update")
	@Put("/:taskTypeId")
	@SuccessResponse(200, "Returns updated type")
	@DescribeAction("task-type/update")
	@DescribeResource("TaskType", ({ params }) => Number(params.taskTypeId))
	@ValidateFuncArgs(TaskTypeUpdateSearchParamsValidator)
	async update(
		@Path() taskTypeId: number,
		@Queries() query: {},
		@Body() body: TaskTypeUpdateBodyInterface
	): Promise<PublicTaskTypeAttributes> {
		const taskType = await this.taskTypeRepository.update(taskTypeId, body);
		this.response.status(200);

		await this.eventBus.publish(
			new EventMutation(this.principal.arn, taskType.arn, `${this.appPrefix}:task-type/update`, JSON.stringify(body))
		);

		return {
			...(pick(taskType.toJSON(), publicTaskTypeAttributes) as PublicTaskTypeAttributes),
			arn: taskType.arn,
		};
	}

	/**
	 * Mark Task Type as deleted. Will be permanently deleted in 90 days.
	 */
	@OperationId("Delete")
	@Delete("/:taskTypeId")
	@SuccessResponse(204, "Returns nothing")
	@DescribeAction("task-type/delete")
	@DescribeResource("TaskType", ({ params }) => Number(params.taskTypeId))
	async delete(@Path() taskTypeId: number): Promise<void> {
		const taskType = await this.taskTypeRepository.read(taskTypeId);

		if (!taskType) {
			throw new NotFoundError(`Task Type ${taskTypeId} not found`);
		}
		await this.taskTypeRepository.delete(taskTypeId);

		await this.eventBus.publish(
			new EventMutation(this.principal.arn, taskType.arn, `${this.appPrefix}:task-type/delete`, JSON.stringify({}))
		);

		this.response.status(204);
	}
}
