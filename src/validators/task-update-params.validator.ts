import { joi } from "@structured-growth/microservice-sdk";

export const TaskUpdateParamsValidator = joi.object({
	taskId: joi.number().positive().required().label("Task Id"),
	query: joi.object(),
	body: joi.object({
		priority: joi.string().valid("low", "medium", "high").label("Priority"),
		taskTypeId: joi.number().positive().label("Task Type Id"),
		taskTypeCode: joi.string().max(100).label("Task Type Code"),
		title: joi.string().max(100).label("Title"),
		taskDetail: joi.string().max(255).label("Task detail"),
		assignedAccountId: joi.array().items(joi.number().positive()).label("Assigned account Ids"),
		assignedGroupId: joi.array().items(joi.number().positive()).label("Assigned Group Ids"),
		startDate: joi.date().iso().label("Start date"),
		dueDate: joi.date().iso().label("Due date"),
		status: joi.string().valid("todo", "inprogress", "done", "archived").label("Status"),
		metadata: joi
			.object()
			.max(10)
			.pattern(/^/, joi.alternatives().try(joi.boolean(), joi.number(), joi.string().max(255), joi.string().isoDate())),
	}),
});
