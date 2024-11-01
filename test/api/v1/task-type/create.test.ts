import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("POST /api/v1/task-type", () => {
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
		assert.equal(body.orgId, 49);
		assert.equal(body.region, "us");
		assert.equal(body.title, "Important");
		assert.equal(body.code, randomCode);
		assert.isNotNaN(new Date(body.createdAt).getTime());
		assert.isNotNaN(new Date(body.updatedAt).getTime());
		assert.equal(body.status, "active");
		assert.isString(body.arn);
	});

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.post("/v1/task-type").send({
			orgId: "orgId",
			region: 25,
			title: 87,
			code: 12,
			status: "pending",
		});

		assert.equal(statusCode, 422);
		assert.isDefined(body.validation);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
		assert.isString(body.validation.body.orgId[0]);
		assert.isString(body.validation.body.region[0]);
		assert.isString(body.validation.body.title[0]);
		assert.isString(body.validation.body.code[0]);
		assert.isString(body.validation.body.status[0]);
	});
});
