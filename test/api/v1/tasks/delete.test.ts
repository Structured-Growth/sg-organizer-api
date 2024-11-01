import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("DELETE /api/v1/tasks/:taskId", () => {
	const { server, context } = initTest();

	it("Should create task", async () => {
		const { statusCode, body } = await server.post("/v1/tasks").send({
			orgId: 49,
			region: "us",
			priority: "medium",
			taskTypeId: 3,
			title: "Must",
			taskDetail: "You must do this",
			assignedAccountId: 1,
			assignedUserId: 2,
			assignedGroupId: 3,
			createdByAccountId: 4,
			createdByUserId: 5,
			startDate: "2024-11-01T08:00:00Z",
			dueDate: "2024-11-15T17:00:00Z",
			status: "progress",
		});
		assert.equal(statusCode, 201);
		assert.isNumber(body.id);
		context["taskId"] = body.id;
	});

	it("Should delete task", async () => {
		const { statusCode, body } = await server.delete(`/v1/tasks/${context.taskId}`);
		assert.equal(statusCode, 204);
	});

	it("Should return if task does not exist", async () => {
		const { statusCode, body } = await server.delete(`/v1/tasks/${context.taskId}`);
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if id is wrong", async () => {
		const { statusCode, body } = await server.delete(`/v1/tasks/wrong`);
		assert.equal(statusCode, 422);
		assert.isString(body.message);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.validation.taskId[0]);
	});
});
