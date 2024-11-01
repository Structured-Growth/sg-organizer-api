import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("DELETE /api/v1/task-type/:taskTypeId", () => {
	const { server, context } = initTest();
	const randomCode = `important${Math.floor(Math.random() * 100000)}`;

	it("Should create task type", async () => {
		const { statusCode, body } = await server.post("/v1/task-type").send({
			orgId: 49,
			region: "us",
			title: "Important",
			code: randomCode,
			status: "active",
		});
		assert.equal(statusCode, 201);
		assert.isNumber(body.id);
		context["taskTypeId"] = body.id;
	});

	it("Should delete task type", async () => {
		const { statusCode, body } = await server.delete(`/v1/task-type/${context.taskTypeId}`);
		assert.equal(statusCode, 204);
	});

	it("Should return if task type does not exist", async () => {
		const { statusCode, body } = await server.delete(`/v1/task-type/${context.taskTypeId}`);
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if id is wrong", async () => {
		const { statusCode, body } = await server.delete(`/v1/task-type/wrong`);
		assert.equal(statusCode, 422);
		assert.isString(body.message);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.validation.taskTypeId[0]);
	});
});
