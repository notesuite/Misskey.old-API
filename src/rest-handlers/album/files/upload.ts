import * as fs from 'fs';
import * as hapi from 'hapi';
import { IApplication, IUser } from '../../../interfaces';
import upload from '../../../endpoints/album/files/upload';

export default function uploadFile(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	const file = req.payload.file;
	if (file === undefined || file === null) {
		res('empty-file').code(400);
		return;
	}
	const unconditional: boolean = req.payload.unconditional;
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
		unconditional
	).then(albumFile => {
		res(albumFile);
	}, (err: any) => {
		res({error: err}).code(500);
	});
};
