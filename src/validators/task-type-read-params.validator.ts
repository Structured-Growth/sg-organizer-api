import { joi } from "@structured-growth/microservice-sdk";

export const TaskTypeReadParamsValidator = joi.object({
	taskTypeId: joi.number().positive().required().label("validator.taskType.taskTypeId"),
});
