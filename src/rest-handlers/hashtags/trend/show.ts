import {IApplication, IUser} from '../../../db/interfaces';
import show_ from '../../../endpoints/hashtags/trend/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	show_().then(hashtags => {
		res(hashtags);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
