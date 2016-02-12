import {IApplication, IUser} from '../../../db/interfaces';
import folders from '../../../endpoints/album/folders/list';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	folders(user, req.payload['folder-id']).then(folders => {
		res(folders);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
