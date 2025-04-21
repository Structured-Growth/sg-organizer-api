import { joi } from "@structured-growth/microservice-sdk";

export const TaskCreateParamsValidator = joi.object({
	query: joi.object(),
	body: joi
		.object({
			orgId: joi.number().positive().required().label("validator.tasks.orgId"),
			region: joi.string().required().min(2).max(10).label("validator.tasks.region"),
			priority: joi.string().required().valid("low", "medium", "high").label("validator.tasks.priority"),
			taskTypeId: joi.number().positive().label("validator.tasks.taskTypeId"),
			taskTypeCode: joi.string().max(100).label("validator.tasks.taskTypeCode"),
			title: joi.string().max(100).required().label("validator.tasks.title"),
			taskDetail: joi.string().max(255).required().label("validator.tasks.taskDetail"),
			assignedAccountId: joi.array().items(joi.number().positive()).label("validator.tasks.assignedAccountId"),
			assignedGroupId: joi.array().items(joi.number().positive()).label("validator.tasks.assignedGroupId"),
			createdByAccountId: joi.number().positive().label("validator.tasks.createdByAccountId"),
			startDate: joi.date().iso().label("validator.tasks.startDate"),
			dueDate: joi.date().iso().label("validator.tasks.dueDate"),
			status: joi.string().required().valid("todo", "inprogress", "done", "archived").label("validator.tasks.status"),
			metadata: joi
				.object()
				.max(10)
				.pattern(
					/^/,
					joi.alternatives().try(joi.boolean(), joi.number(), joi.string().max(255), joi.string().isoDate())
				),
		})
		.xor("taskTypeId", "taskTypeCode"),
});
