import { RegionEnum } from "@structured-growth/microservice-sdk";

export interface TaskTypeCreateBodyInterface {
	orgId: number;
	region: RegionEnum;
	title: string;
	code: string;
	status: "active" | "inactive";
}
