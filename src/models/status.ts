interface Status {
	id: string;
	createdAt: Date;
	userId: string;
	appId: string;
	cursor: number;
	text: string;
	images: string[];
	isDeleted: boolean;
}
