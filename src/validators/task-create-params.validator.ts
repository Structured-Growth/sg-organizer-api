import { joi } from "@structured-growth/microservice-sdk";

export const TaskCreateParamsValidator = joi.object({
	query: joi.object(),
	body: joi
		.object({
			orgId: joi.number().positive().required().label("Organization Id"),
			region: joi.string().required().min(2).max(10).label("Region"),
			priority: joi.string().required().valid("low", "medium", "high").label("Priority"),
			taskTypeId: joi.number().positive().label("Task Type Id"),
			taskTypeCode: joi.string().max(100).label("Task Type Code"),
			title: joi.string().max(100).required().label("Title"),
			taskDetail: joi.string().max(255).required().label("Task detail"),
			assignedAccountId: joi.array().items(joi.number().positive()).label("Assigned account Ids"),
			assignedGroupId: joi.array().items(joi.number().positive()).label("Assigned Group Ids"),
			createdByAccountId: joi.number().positive().label("Created by account Id"),
			startDate: joi.date().iso().label("Start date"),
			dueDate: joi.date().iso().label("Due date"),
			status: joi.string().required().valid("todo", "inprogress", "done", "archived").label("Status"),
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
