import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("GET /api/v1/tasks/:taskId", () => {
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

	it("Should create task", async () => {
		const { statusCode, body } = await server.post("/v1/tasks").send({
			orgId: 49,
			region: "us",
			priority: "medium",
			taskTypeId: context.taskTypeId,
			title: "Must",
			taskDetail: "You must do this",
			assignedAccountId: [1],
			assignedGroupId: [3],
			createdByAccountId: 4,
			startDate: "2024-11-01T08:00:00Z",
			dueDate: "2024-11-15T17:00:00Z",
			status: "inprogress",
		});
		assert.equal(statusCode, 201);
		assert.isNumber(body.id);
		context["taskId"] = body.id;
	});

	it("Should read task", async () => {
		const { statusCode, body } = await server.get(`/v1/tasks/${context.taskId}`);
		assert.equal(statusCode, 200);
		assert.equal(body.id, context.taskId);
		assert.equal(body.orgId, 49);
		assert.equal(body.priority, "medium");
		assert.equal(body.taskTypeId, context.taskTypeId);
		assert.equal(body.title, "Must");
		assert.equal(body.taskDetail, "You must do this");
		assert.deepEqual(body.assignedAccountId, [1]);
		assert.deepEqual(body.assignedGroupId, [3]);
		assert.equal(body.createdByAccountId, 4);
		assert.isString(body.startDate);
		assert.isString(body.dueDate);
		assert.isString(body.createdAt);
		assert.isString(body.updatedAt);
		assert.equal(body.status, "inprogress");
		assert.isString(body.arn);
	});

	it("Should return is task does not exist", async () => {
		const { statusCode, body } = await server.get(`/v1/tasks/999999`).send({});
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if id is wrong", async () => {
		const { statusCode, body } = await server.get(`/v1/tasks/wrong`).send({});
		assert.equal(statusCode, 422);
		assert.isString(body.message);
	});
});
