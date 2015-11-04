import * as fs from 'fs';
import { MisskeyExpressRequest } from '../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../misskeyExpressResponse';
import upload from '../../endpoints/album/upload';

export default function(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	const filesCount: number = Object.keys(req.files).length;
	if (filesCount === 1) {
		const file: Express.Multer.File = req.files['file'];
		const path: string = file.path;
		const name: string = file.originalname;
		const mimetype: string = file.mimetype;
		const fileBuffer: Buffer = fs.readFileSync(path);
		const size: number = file.size;
		fs.unlink(path);

		upload(req.misskeyApp, req.misskeyUser, name, mimetype, fileBuffer, size).then((status: Object) => {
			res.apiRender(status);
		}, (err: any) => {
			res.apiError(500, err);
		});
	} else if (filesCount > 1) {
		res.apiError(400, 'For now, we are accepting only one file');
	} else {
		res.apiError(400, 'no-attachd-file');
	}
};
