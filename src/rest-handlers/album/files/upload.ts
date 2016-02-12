import * as fs from 'fs';
import {IApplication, IUser} from '../../../db/interfaces';
import upload from '../../../endpoints/album/files/upload';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	const file = req.payload.file;
	if (file === undefined || file === null) {
		res('empty-file').code(400);
		return;
	}
	const unconditional: boolean = req.payload.unconditional;
	let folder: string = req.payload['folder-id'];
	if (folder === 'null') {
		folder = null;
	}
	const path: string = file.path;
	const fileName: string = file.filename;
	const mimetype: string = file.headers['content-type'];
	const fileBuffer: Buffer = fs.readFileSync(path);
	const size: number = file.bytes;
	fs.unlink(path);

	upload(
		app,
		user,
		fileName,
		mimetype,
		fileBuffer,
		size,
		folder,
		unconditional
	).then(albumFile => {
		res(albumFile);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
