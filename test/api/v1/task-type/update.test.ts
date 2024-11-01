import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("PUT /api/v1/task-type/:taskTypeId", () => {
	const { server, context } = initTest();
	const randomCode = `important${Math.floor(Math.random() * 100000)}`;
	const randomCodeUpdate = `important${Math.floor(Math.random() * 100000)}`;

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

	it("Should update task type", async () => {
		const { statusCode, body } = await server.put(`/v1/task-type/${context.taskTypeId}`).send({
			title: "Very Important",
			code: randomCodeUpdate,
			status: "archived",
		});
		assert.equal(statusCode, 200);
		assert.equal(body.id, context.taskTypeId);
		assert.equal(body.orgId, 49);
		assert.equal(body.title, "Very Important");
		assert.equal(body.code, randomCodeUpdate);
		assert.isString(body.createdAt);
		assert.isString(body.updatedAt);
		assert.equal(body.status, "archived");
		assert.isString(body.arn);
	});

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.put(`/v1/task-type/${context.taskTypeId}`).send({
			title: 88,
			code: 77,
			status: "act",
		});

		assert.equal(statusCode, 422);
		assert.isDefined(body.validation);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
		assert.isString(body.validation.body.title[0]);
		assert.isString(body.validation.body.code[0]);
		assert.isString(body.validation.body.status[0]);
	});

	it("Should return validation error if task type id is wrong", async () => {
		const { statusCode, body } = await server.put(`/v1/task-type/9999`).send({});
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if task type id is wrong", async () => {
		const { statusCode, body } = await server.put(`/v1/task-type/stringid`).send({});
		assert.equal(statusCode, 422);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
	});
});
