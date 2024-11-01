import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("GET /api/v1/task-type/:taskTypeId", () => {
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

	it("Should read task type", async () => {
		const { statusCode, body } = await server.get(`/v1/task-type/${context.taskTypeId}`);
		assert.equal(statusCode, 200);
		assert.equal(body.id, context.taskTypeId);
		assert.equal(body.orgId, 49);
		assert.equal(body.title, "Important");
		assert.equal(body.code, randomCode);
		assert.isString(body.createdAt);
		assert.isString(body.updatedAt);
		assert.equal(body.status, "active");
		assert.isString(body.arn);
	});

	it("Should return is task type does not exist", async () => {
		const { statusCode, body } = await server.get(`/v1/task-type/999999`).send({});
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if id is wrong", async () => {
		const { statusCode, body } = await server.get(`/v1/task-type/wrong`).send({});
		assert.equal(statusCode, 422);
		assert.isString(body.message);
	});
});
