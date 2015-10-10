export interface User {
	id: string;
	createdAt: Date;
	name: string;
	screenName: string;
	screenNameLower: string;
	comment: string;
	description: string;
	color: string;
	email: string;
	lang: string;
	location: string;
	hashedPassword: string;
	credit: number;
	pinnedStatus: string;
	websiteUrl: string;
	icon: string;
	banner: string;
	wallpaper: string;
	birthday: Date;
	isVerfied: boolean;
	isEmailVerified: boolean;
	isPro: boolean;
	isPrivate: boolean;
	isSuspended: boolean;
	isDeleted: boolean;
}
