import {IApplication, IUser} from '../../../db/interfaces';
import recolor from '../../../endpoints/album/folders/update-color';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	recolor(
		user,
		req.payload['folder-id'],
		req.payload['color']
	).then(folder => {
		res(folder);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
