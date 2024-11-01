import { joi } from "@structured-growth/microservice-sdk";

export const TaskCreateParamsValidator = joi.object({
	query: joi.object(),
	body: joi.object({
		orgId: joi.number().positive().required().label("Organization Id"),
		region: joi.string().required().min(2).max(10).label("Region"),
		priority: joi.string().required().valid("low", "medium", "high").label("Priority"),
		taskTypeId: joi.number().positive().required().label("Task Type Id"),
		title: joi.string().max(100).required().label("Title"),
		taskDetail: joi.string().max(255).required().label("Task detail"),
		assignedAccountId: joi.number().positive().label("Assigned account Id"),
		assignedUserId: joi.number().positive().label("Assigned user Id"),
		assignedGroupId: joi.number().positive().label("Assigned Group Id"),
		createdByAccountId: joi.number().positive().required().label("Created by account Id"),
		createdByUserId: joi.number().positive().required().label("Created by user Id"),
		startDate: joi.date().iso().label("Start date"),
		dueDate: joi.date().iso().label("Due date"),
		status: joi.string().required().valid("todo", "inprogress", "done", "archived").label("Status"),
	}),
});
