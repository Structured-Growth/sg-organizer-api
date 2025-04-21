import { Op } from "sequelize";
import {
	autoInjectable,
	RepositoryInterface,
	SearchResultInterface,
	NotFoundError,
	I18nType,
	inject,
} from "@structured-growth/microservice-sdk";
import { isUndefined, omitBy } from "lodash";
import Note, { NoteCreationAttributes, NoteUpdateAttributes } from "../../../database/models/note";
import { NoteSearchParamsInterface } from "../../interfaces/note-search-params.interface";

@autoInjectable()
export class NotesRepository implements RepositoryInterface<Note, NoteSearchParamsInterface, NoteCreationAttributes> {
	private i18n: I18nType;
	constructor(@inject("i18n") private getI18n: () => I18nType) {
		this.i18n = this.getI18n();
	}
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

		(params.createdAtMin || params.createdAtMax) &&
			(where["createdAt"] = omitBy(
				{
					[Op.gte]: params.createdAtMin,
					[Op.lte]: params.createdAtMax,
				},
				isUndefined
			));

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
			throw new NotFoundError(`${this.i18n.__("error.account.name")} ${id} ${this.i18n.__("error.common.not_found")}`);
		}
		note.setAttributes(params);

		return note.save();
	}

	public async delete(id: number): Promise<void> {
		const n = await Note.destroy({ where: { id } });

		if (n === 0) {
			throw new NotFoundError(`${this.i18n.__("error.account.name")} ${id} ${this.i18n.__("error.common.not_found")}`);
		}
	}
}
