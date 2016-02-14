import {IApplication, IUser} from '../../../db/interfaces';
import recolor from '../../../endpoints/album/tags/recolor';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	recolor(
		user,
		req.payload['tag-id'],
		req.payload['color']
	).then(tag => {
		res(tag);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
