import { joi } from "@structured-growth/microservice-sdk";

export const TaskUpdateParamsValidator = joi.object({
	taskId: joi.number().positive().required().label("Task Id"),
	query: joi.object(),
	body: joi.object({
		priority: joi.string().valid("low", "medium", "high").label("Priority"),
		taskTypeId: joi.number().positive().label("Task Type Id"),
		taskDetail: joi.string().max(255).label("Task detail"),
		assignedAccountId: joi.number().positive().label("Assigned account Id"),
		assignedUserId: joi.number().positive().label("Assigned user Id"),
		assignedGroupId: joi.number().positive().label("Assigned Group Id"),
		startDate: joi.date().iso().label("Start date"),
		dueDate: joi.date().iso().label("Due date"),
		status: joi.string().valid("to do", "progress", "done", "archive").label("Status"),
	}),
});
