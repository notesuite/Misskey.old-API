import * as fs from 'fs';
import { Request, Response } from '../../../misskey-express';
import upload from '../../../endpoints/album/files/upload';

export default function uploadFile(req: Request, res: Response): void {
	'use strict';
	const file: Express.Multer.File = (<any>req).file;
	if (file !== undefined && file !== null) {
		const unconditional: boolean = req.body.unconditional;
		const path: string = file.path;
		const fileName: string = file.originalname;
		const mimetype: string = file.mimetype;
		const fileBuffer: Buffer = fs.readFileSync(path);
		const size: number = file.size;
		fs.unlink(path);

		upload(
				req.misskeyApp,
				req.misskeyUser,
				fileName,
				mimetype,
				fileBuffer,
				size,
				unconditional).then((albumFile: Object) => {
			res.apiRender(albumFile);
		}, (err: any) => {
			res.apiError(500, err);
		});
	} else {
		res.apiError(400, 'empty-file');
	}
};
