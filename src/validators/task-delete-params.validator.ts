import { joi } from "@structured-growth/microservice-sdk";

export const TaskDeleteParamsValidator = joi.object({
	taskId: joi.number().positive().required().label("validator.tasks.taskId"),
});
