import { Column, DataType, Model, Table } from "sequelize-typescript";
import { container, RegionEnum, DefaultModelInterface } from "@structured-growth/microservice-sdk";

export interface NoteAttributes extends DefaultModelInterface {
	userId: number;
	note: string;
	status: "active" | "archived";
	metadata?: object;
}

export interface NoteCreationAttributes
	extends Omit<NoteAttributes, "id" | "arn" | "createdAt" | "updatedAt" | "deletedAt"> {}

export interface NoteUpdateAttributes extends Partial<Pick<NoteCreationAttributes, "status" | "note" | "metadata">> {}

@Table({
	tableName: "notes",
	timestamps: true,
	underscored: true,
	paranoid: true,
})
export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
	@Column
	orgId: number;

	@Column(DataType.STRING)
	region: RegionEnum;

	@Column
	accountId: number;

	@Column
	userId: number;

	@Column
	note: string;

	@Column(DataType.STRING)
	status: NoteAttributes["status"];

	@Column({
		type: DataType.JSONB,
	})
	metadata: object;

	static get arnPattern(): string {
		return [container.resolve("appPrefix"), "<region>", "<orgId>", "<accountId>", "notes/<noteId>"].join(":");
	}

	get arn(): string {
		return [container.resolve("appPrefix"), this.region, this.orgId, this.accountId, `notes/${this.id}`].join(":");
	}
}

export default Note;
