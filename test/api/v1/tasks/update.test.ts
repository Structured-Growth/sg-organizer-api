import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("PUT /api/v1/tasks/:taskId", () => {
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

	it("Should update task", async () => {
		const { statusCode, body } = await server.put(`/v1/tasks/${context.taskId}`).send({
			priority: "low",
			taskTypeId: 8,
			title: "Must today",
			taskDetail: "You must do this today",
			assignedAccountId: 11,
			assignedUserId: 21,
			assignedGroupId: 31,
			startDate: "2024-12-01T08:00:00Z",
			dueDate: "2024-12-15T17:00:00Z",
			status: "done",
		});
		assert.equal(statusCode, 200);
		assert.equal(body.id, context.taskId);
		assert.equal(body.orgId, 49);
		assert.equal(body.taskTypeId, 8);
		assert.equal(body.title, "Must today");
		assert.equal(body.taskDetail, "You must do this today");
		assert.equal(body.assignedAccountId, 11);
		assert.equal(body.assignedUserId, 21);
		assert.equal(body.assignedGroupId, 31);
		assert.isString(body.createdAt);
		assert.isString(body.updatedAt);
		assert.equal(body.status, "done");
		assert.isString(body.arn);
	});

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.put(`/v1/tasks/${context.taskId}`).send({
			priority: "lowest",
			taskTypeId: "taskTypeId",
			title: 26,
			taskDetail: 25,
			assignedAccountId: "assignedAccountId",
			assignedUserId: "assignedUserId",
			assignedGroupId: "assignedGroupId",
			startDate: 31,
			dueDate: 32,
			status: "active",
		});

		assert.equal(statusCode, 422);
		assert.isDefined(body.validation);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
		assert.isString(body.validation.body.priority[0]);
		assert.isString(body.validation.body.taskTypeId[0]);
		assert.isString(body.validation.body.title[0]);
		assert.isString(body.validation.body.taskDetail[0]);
		assert.isString(body.validation.body.assignedAccountId[0]);
		assert.isString(body.validation.body.assignedUserId[0]);
		assert.isString(body.validation.body.assignedGroupId[0]);
		assert.isString(body.validation.body.startDate[0]);
		assert.isString(body.validation.body.dueDate[0]);
		assert.isString(body.validation.body.status[0]);
	});

	it("Should return validation error if task id is wrong", async () => {
		const { statusCode, body } = await server.put(`/v1/tasks/9999`).send({});
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if task id is wrong", async () => {
		const { statusCode, body } = await server.put(`/v1/tasks/stringid`).send({});
		assert.equal(statusCode, 422);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
	});
});
