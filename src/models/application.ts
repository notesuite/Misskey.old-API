interface Application {
	id: string;
	createdAt: Date;
	userId: string;
	appKey: string;
	callbackUrl: string;
	description: string;
	icon: string;
	permissions: string[];
	isSuspended: boolean;
	idDeleted: boolean;
}
