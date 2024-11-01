import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("POST /api/v1/tasks", () => {
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
			status: "inprogress",
		});
		assert.equal(statusCode, 201);
		assert.isNumber(body.id);
		assert.equal(body.orgId, 49);
		assert.equal(body.region, "us");
		assert.equal(body.priority, "medium");
		assert.equal(body.taskTypeId, 3);
		assert.equal(body.title, "Must");
		assert.equal(body.taskDetail, "You must do this");
		assert.equal(body.assignedAccountId, 1);
		assert.equal(body.assignedUserId, 2);
		assert.equal(body.assignedGroupId, 3);
		assert.equal(body.createdByAccountId, 4);
		assert.equal(body.createdByUserId, 5);
		assert.isNotNaN(new Date(body.startDate).getTime());
		assert.isNotNaN(new Date(body.dueDate).getTime());
		assert.isNotNaN(new Date(body.createdAt).getTime());
		assert.isNotNaN(new Date(body.updatedAt).getTime());
		assert.equal(body.status, "inprogress");
		assert.isString(body.arn);
	});

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.post("/v1/tasks").send({
			orgId: "orgId",
			region: 25,
			priority: "no",
			taskTypeId: "taskTypeId",
			title: 37,
			taskDetail: 25,
			assignedAccountId: "assignedAccountId",
			assignedUserId: "assignedUserId",
			assignedGroupId: "assignedGroupId",
			createdByAccountId: "createdByAccountId",
			createdByUserId: "createdByUserId",
			startDate: 173,
			dueDate: 174,
			status: "pending",
		});

		assert.equal(statusCode, 422);
		assert.isDefined(body.validation);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
		assert.isString(body.validation.body.orgId[0]);
		assert.isString(body.validation.body.region[0]);
		assert.isString(body.validation.body.priority[0]);
		assert.isString(body.validation.body.taskTypeId[0]);
		assert.isString(body.validation.body.title[0]);
		assert.isString(body.validation.body.taskDetail[0]);
		assert.isString(body.validation.body.assignedAccountId[0]);
		assert.isString(body.validation.body.assignedUserId[0]);
		assert.isString(body.validation.body.assignedGroupId[0]);
		assert.isString(body.validation.body.createdByAccountId[0]);
		assert.isString(body.validation.body.createdByUserId[0]);
		assert.isString(body.validation.body.startDate[0]);
		assert.isString(body.validation.body.dueDate[0]);
		assert.isString(body.validation.body.status[0]);
	});
});
