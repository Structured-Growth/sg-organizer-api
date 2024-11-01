import { TaskTypeAttributes } from "../../database/models/task-type";

export interface TaskTypeUpdateBodyInterface {
	title?: string;
	status?: TaskTypeAttributes["status"];
	code?: string;
}
