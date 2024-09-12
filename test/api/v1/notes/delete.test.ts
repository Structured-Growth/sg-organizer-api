import "../../../../src/app/providers";
import { assert } from "chai";
import { initTest } from "../../../common/init-test";

describe("DELETE /api/v1/notes/:noteId", () => {
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

	it("Should delete note", async () => {
		const { statusCode, body } = await server.delete(`/v1/notes/${context.noteId}`);
		assert.equal(statusCode, 204);
	});

	it("Should return if note does not exist", async () => {
		const { statusCode, body } = await server.delete(`/v1/notes/${context.noteId}`);
		assert.equal(statusCode, 404);
		assert.equal(body.name, "NotFound");
		assert.isString(body.message);
	});

	it("Should return validation error if id is wrong", async () => {
		const { statusCode, body } = await server.delete(`/v1/notes/wrong`);
		assert.equal(statusCode, 422);
		assert.isString(body.message);
		assert.equal(body.name, "ValidationError");
		assert.isString(body.validation.noteId[0]);
	});
});
