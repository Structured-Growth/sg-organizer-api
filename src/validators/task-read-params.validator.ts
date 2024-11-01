import { joi } from "@structured-growth/microservice-sdk";

export const TaskReadParamsValidator = joi.object({
	taskId: joi.number().positive().required().label("Task Id"),
});
