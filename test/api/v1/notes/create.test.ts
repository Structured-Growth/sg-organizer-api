import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("POST /api/v1/notes", () => {
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
		assert.equal(body.orgId, 49);
		assert.equal(body.region, "us");
		assert.equal(body.accountId, 45);
		assert.equal(body.userId, 15);
		assert.isNotNaN(new Date(body.createdAt).getTime());
		assert.isNotNaN(new Date(body.updatedAt).getTime());
		assert.equal(body.note, "Very lucky patient!");
		assert.equal(body.status, "active");
		assert.isString(body.arn);
	});

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.post("/v1/notes").send({
			orgId: "orgId",
			region: 25,
			accountId: "accountId",
			userId: "userId",
			note: 173,
			metadata: "metadata",
			status: "pending",
		});

		assert.equal(statusCode, 422);
		assert.isDefined(body.validation);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
		assert.isString(body.validation.body.orgId[0]);
		assert.isString(body.validation.body.region[0]);
		assert.isString(body.validation.body.accountId[0]);
		assert.isString(body.validation.body.userId[0]);
		assert.isString(body.validation.body.note[0]);
		assert.isString(body.validation.body.metadata[0]);
		assert.isString(body.validation.body.status[0]);
	});
});
