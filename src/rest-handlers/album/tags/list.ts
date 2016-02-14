import {IApplication, IUser} from '../../../db/interfaces';
import list from '../../../endpoints/album/tags/list';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	list(user).then(tags => {
		res(tags);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
