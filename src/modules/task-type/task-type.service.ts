import {
	autoInjectable,
	inject,
	SearchResultInterface,
	signedInternalFetch,
} from "@structured-growth/microservice-sdk";
import { TaskTypeRepository } from "./task-type.repository";
import { TaskTypeSearchParamsInterface } from "../../interfaces/task-type-search-params.interface";
import TaskType from "../../../database/models/task-type";
import { omit } from "lodash";

@autoInjectable()
export class TaskTypeService {
	constructor(
		@inject("TaskTypeRepository") private taskTypeRepository: TaskTypeRepository,
		@inject("accountApiUrl") private accountApiUrl: string
	) {}

	public async search(params: TaskTypeSearchParamsInterface): Promise<SearchResultInterface<TaskType>> {
		if (params.includeInherited) {
			const response = await signedInternalFetch(`${this.accountApiUrl}/v1/organizations/${params.orgId}/parents`);
			const organizations: object[] = (await response.json()) as any;
			const orgIds: number[] = organizations.map((org) => org["id"]);

			return this.taskTypeRepository.search({
				...omit(params, "includeInherited", "orgId"),
				orgId: [params.orgId, ...orgIds],
			});
		} else {
			return this.taskTypeRepository.search({
				...omit(params, "includeInherited", "orgId"),
				orgId: [params.orgId],
			});
		}
	}
}
