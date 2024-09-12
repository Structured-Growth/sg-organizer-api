import { Op } from "sequelize";
import {
	autoInjectable,
	RepositoryInterface,
	SearchResultInterface,
	NotFoundError,
} from "@structured-growth/microservice-sdk";
import Note, { NoteCreationAttributes, NoteUpdateAttributes } from "../../../database/models/note";
import { NoteSearchParamsInterface } from "../../interfaces/note-search-params.interface";

@autoInjectable()
export class NotesRepository implements RepositoryInterface<Note, NoteSearchParamsInterface, NoteCreationAttributes> {
	public async search(
		params: NoteSearchParamsInterface & {
			metadata?: Record<string, string | number>;
		}
	): Promise<SearchResultInterface<Note>> {
		const page = params.page || 1;
		let limit = params.limit || 20;
		let offset = (page - 1) * limit;
		const where = {};
		const order = params.sort ? (params.sort.map((item) => item.split(":")) as any) : [["createdAt", "desc"]];

		params.orgId && (where["orgId"] = params.orgId);
		params.accountId && (where["accountId"] = { [Op.in]: params.accountId });
		params.userId && (where["userId"] = { [Op.in]: params.userId });
		params.status && (where["status"] = params.status);
		params.id && (where["id"] = { [Op.in]: params.id });

		if (params.metadata) {
			where["metadata"] = params.metadata;
		}

		const { rows, count } = await Note.findAndCountAll({
			where,
			offset,
			limit,
			order,
		});

		return {
			data: rows,
			total: count,
			limit,
			page,
		};
	}

	public async create(params: NoteCreationAttributes): Promise<Note> {
		return Note.create(params);
	}

	public async read(
		id: number,
		params?: {
			attributes?: string[];
		}
	): Promise<Note> {
		return Note.findByPk(id, {
			attributes: params?.attributes,
			rejectOnEmpty: false,
		});
	}

	public async update(id: number, params: NoteUpdateAttributes): Promise<Note> {
		const note = await this.read(id);
		if (!note) {
			throw new NotFoundError(`Note ${id} not found`);
		}
		note.setAttributes(params);

		return note.save();
	}

	public async delete(id: number): Promise<void> {
		const n = await Note.destroy({ where: { id } });

		if (n === 0) {
			throw new NotFoundError(`Note ${id} not found`);
		}
	}
}
