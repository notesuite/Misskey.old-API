export interface Image {
	id: string;
	createdAt: Date;
	userId: string;
	name: string;
	serverPath: string;
	folder: string;
	tags: string[];
	dataSize: number;
	width: number;
	height: number;
	format: string;
	hash: string;
	isDeleted: boolean;
}
