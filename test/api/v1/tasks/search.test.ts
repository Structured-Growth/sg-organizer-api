import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("GET /api/v1/tasks", () => {
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

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.get("/v1/tasks").query({
			orgId: "a",
			priority: "no",
			taskTypeId: "taskTypeId",
			title:
				"Add a feature to display a loading spinner while data is being fetched, ensuring a smooth user experience.",
			assignedAccountId: "assignedAccountId",
			assignedUserId: "assignedUserId",
			assignedGroupId: "assignedGroupId",
			createdByAccountId: "createdByAccountId",
			createdByUserId: "createdByUserId",
			startDate: 23,
			dueDate: 24,
			id: -1,
			arn: 1,
			page: "b",
			limit: false,
			sort: "createdAt:asc",
			"status[0]": "superstatus",
		});

		assert.equal(statusCode, 422);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.validation.query.id[0]);
		assert.isString(body.validation.query.orgId[0]);
		assert.isString(body.validation.query.priority[0]);
		assert.isString(body.validation.query.arn[0]);
		assert.isString(body.validation.query.taskTypeId[0]);
		assert.isString(body.validation.query.title[0]);
		assert.isString(body.validation.query.assignedAccountId[0]);
		assert.isString(body.validation.query.assignedUserId[0]);
		assert.isString(body.validation.query.assignedGroupId[0]);
		assert.isString(body.validation.query.createdByAccountId[0]);
		assert.isString(body.validation.query.createdByUserId[0]);
		assert.isString(body.validation.query.startDate[0]);
		assert.isString(body.validation.query.dueDate[0]);
		assert.isString(body.validation.query.status[0]);
	});

	it("Should return task", async () => {
		const { statusCode, body } = await server.get("/v1/tasks").query({
			"id[0]": context.taskId,
			orgId: 49,
			priority: "medium",
			taskTypeId: 3,
			title: "Must",
			"assignedAccountId[0]": 1,
			"assignedUserId[0]": 2,
			"assignedGroupId[0]": 3,
			"createdByAccountId[0]": 4,
			"createdByUserId[0]": 5,
			status: "progress",
		});

		console.log("Data: ", body);

		assert.equal(statusCode, 200);
		assert.equal(body.data[0].id, context.taskId);
		assert.equal(body.data[0].orgId, 49);
		assert.equal(body.data[0].priority, "medium");
		assert.equal(body.data[0].taskTypeId, 3);
		assert.equal(body.data[0].title, "Must");
		assert.equal(body.data[0].assignedAccountId, 1);
		assert.equal(body.data[0].assignedUserId, 2);
		assert.equal(body.data[0].assignedGroupId, 3);
		assert.equal(body.data[0].createdByAccountId, 4);
		assert.equal(body.data[0].createdByUserId, 5);
		assert.isString(body.data[0].createdAt);
		assert.isString(body.data[0].updatedAt);
		assert.equal(body.data[0].status, "progress");
		assert.isString(body.data[0].arn);
		assert.equal(body.page, 1);
		assert.equal(body.limit, 20);
	});
});
