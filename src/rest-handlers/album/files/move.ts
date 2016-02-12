import {IApplication, IUser} from '../../../db/interfaces';
import move from '../../../endpoints/album/files/move';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	let folderId: string = req.payload['folder-id'];
	if (folderId === 'null') {
		folderId = null;
	}
	move(user, req.payload['file-id'], folderId).then(file => {
		res(file);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
