import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("GET /api/v1/notes/:noteId", () => {
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

	it("Should read note", async () => {
		const { statusCode, body } = await server.get(`/v1/notes/${context.noteId}`);
		assert.equal(statusCode, 200);
		assert.equal(body.id, context.noteId);
		assert.equal(body.orgId, 49);
		assert.equal(body.accountId, 45);
		assert.equal(body.userId, 15);
		assert.isString(body.createdAt);
		assert.isString(body.updatedAt);
		assert.equal(body.note, "Very lucky patient!");
		assert.equal(body.status, "active");
		assert.isString(body.arn);
	});

	it("Should return is note does not exist", async () => {
		const { statusCode, body } = await server.get(`/v1/notes/999999`).send({});
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if id is wrong", async () => {
		const { statusCode, body } = await server.get(`/v1/notes/wrong`).send({});
		assert.equal(statusCode, 422);
		assert.isString(body.message);
	});
});
