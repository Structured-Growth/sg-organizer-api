import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("PUT /api/v1/notes/:noteId", () => {
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

	it("Should update note", async () => {
		const { statusCode, body } = await server.put(`/v1/notes/${context.noteId}`).send({
			note: "Very unlucky patient!",
			status: "archived",
		});
		assert.equal(statusCode, 200);
		assert.equal(body.id, context.noteId);
		assert.equal(body.orgId, 49);
		assert.equal(body.accountId, 45);
		assert.equal(body.userId, 15);
		assert.isString(body.createdAt);
		assert.isString(body.updatedAt);
		assert.equal(body.note, "Very unlucky patient!");
		assert.equal(body.status, "archived");
		assert.isString(body.arn);
	});

	it("Should return validation error", async () => {
		const { statusCode, body } = await server.put(`/v1/notes/${context.noteId}`).send({
			note: 88,
			status: "active",
		});

		assert.equal(statusCode, 422);
		assert.isDefined(body.validation);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
		assert.isString(body.validation.body.note[0]);
		assert.isString(body.validation.body.status[0]);
	});

	it("Should return validation error if note id is wrong", async () => {
		const { statusCode, body } = await server.put(`/v1/notes/9999`).send({});
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if note id is wrong", async () => {
		const { statusCode, body } = await server.put(`/v1/notes/stringid`).send({});
		assert.equal(statusCode, 422);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.message);
	});
});
