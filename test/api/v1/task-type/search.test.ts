import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("GET /api/v1/task-type", () => {
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

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.get("/v1/task-type").query({
			orgId: "a",
			title: 0,
			code: 0,
			id: -1,
			arn: 1,
			page: "b",
			limit: false,
			sort: "createdAt:asc",
			status: "superstatus",
		});

		assert.equal(statusCode, 422);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.validation.query.id[0]);
		assert.isString(body.validation.query.orgId[0]);
		assert.isString(body.validation.query.title[0]);
		assert.isString(body.validation.query.arn[0]);
		assert.isString(body.validation.query.code[0]);
		assert.isString(body.validation.query.status[0]);
	});

	it("Should return task type", async () => {
		const { statusCode, body } = await server.get("/v1/task-type").query({
			"id[0]": context.taskTypeId,
			orgId: 49,
			"title[0]": "Important",
			"code[0]": randomCode,
			"status[0]": "active",
		});
		assert.equal(statusCode, 200);
		assert.equal(body.data[0].id, context.taskTypeId);
		assert.equal(body.data[0].orgId, 49);
		assert.equal(body.data[0].title, "Important");
		assert.equal(body.data[0].code, randomCode);
		assert.isString(body.data[0].createdAt);
		assert.isString(body.data[0].updatedAt);
		assert.equal(body.data[0].status, "active");
		assert.isString(body.data[0].arn);
		assert.equal(body.page, 1);
		assert.equal(body.limit, 20);
	});
});
