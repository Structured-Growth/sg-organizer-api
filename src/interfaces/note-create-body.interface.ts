import { RegionEnum } from "@structured-growth/microservice-sdk";
export interface NoteCreateBodyInterface {
	orgId: number;
	region: RegionEnum;
	accountId: number;
	userId: number;
	note: string;
	status: "active";
	metadata?: object;
}
