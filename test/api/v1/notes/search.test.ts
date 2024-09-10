import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("GET /api/v1/notes", () => {
	const { server, context } = initTest();

	it("Should create note", async () => {
		const { statusCode, body } = await server.post("/v1/notes").send({
			orgId: 49,
			region: "us",
			accountId: 45,
			userId: 15,
			note: "Very lucky patient!",
			status: "active",
		});
		assert.equal(statusCode, 201);
		assert.isNumber(body.id);
		context["noteId"] = body.id;
	});

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.get("/v1/notes").query({
			orgId: "a",
			accountId: 0,
			userId: 0,
			id: -1,
			arn: 1,
			page: "b",
			limit: false,
			sort: "createdAt:asc",
			"status[0]": "superstatus",
			metadata: "metadata",
		});

		assert.equal(statusCode, 422);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.validation.query.id[0]);
		assert.isString(body.validation.query.orgId[0]);
		assert.isString(body.validation.query.accountId[0]);
		assert.isString(body.validation.query.arn[0]);
		assert.isString(body.validation.query.userId[0]);
		assert.isString(body.validation.query.status[0]);
		assert.isString(body.validation.query.metadata[0]);
	});

	it("Should return note", async () => {
		const { statusCode, body } = await server.get("/v1/notes").query({
			"id[0]": context.alertId,
			orgId: 49,
			"accountId[0]": 45,
			"userId[0]": 15,
			status: "active",
		});
		assert.equal(statusCode, 200);
		assert.equal(body.data[0].id, context.noteId);
		assert.equal(body.data[0].orgId, 49);
		assert.equal(body.data[0].accountId, 45);
		assert.equal(body.data[0].userId, 15);
		assert.isString(body.data[0].createdAt);
		assert.isString(body.data[0].updatedAt);
		assert.equal(body.data[0].status, "active");
		assert.isString(body.data[0].arn);
		assert.equal(body.page, 1);
		assert.equal(body.limit, 20);
	});
});
