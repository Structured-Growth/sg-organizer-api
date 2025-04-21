import { joi } from "@structured-growth/microservice-sdk";

export const TaskUpdateParamsValidator = joi.object({
	taskId: joi.number().positive().required().label("validator.tasks.taskId"),
	query: joi.object(),
	body: joi.object({
		priority: joi.string().valid("low", "medium", "high").label("validator.tasks.taskId"),
		taskTypeId: joi.number().positive().label("validator.tasks.taskTypeId"),
		taskTypeCode: joi.string().max(100).label("validator.tasks.taskTypeCode"),
		title: joi.string().max(100).label("validator.tasks.title"),
		taskDetail: joi.string().max(255).label("validator.tasks.taskDetail"),
		assignedAccountId: joi.array().items(joi.number().positive()).label("validator.tasks.assignedAccountId"),
		assignedGroupId: joi.array().items(joi.number().positive()).label("validator.tasks.assignedGroupId"),
		startDate: joi.date().iso().label("validator.tasks.startDate"),
		dueDate: joi.date().iso().label("validator.tasks.dueDate"),
		status: joi.string().valid("todo", "inprogress", "done", "archived").label("validator.tasks.status"),
		metadata: joi
			.object()
			.max(10)
			.pattern(/^/, joi.alternatives().try(joi.boolean(), joi.number(), joi.string().max(255), joi.string().isoDate())),
	}),
});
