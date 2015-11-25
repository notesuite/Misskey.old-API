import * as fs from 'fs';
import { MisskeyExpressRequest } from '../../../misskeyExpressRequest';
import { MisskeyExpressResponse } from '../../../misskeyExpressResponse';
import upload from '../../../endpoints/album/files/upload';

export default function uploadFile(req: MisskeyExpressRequest, res: MisskeyExpressResponse): void {
	'use strict';
	const file: Express.Multer.File = (<any>req).file;
	if (file !== undefined && file !== null) {
		const path: string = file.path;
		const fileName: string = file.originalname;
		const mimetype: string = file.mimetype;
		const fileBuffer: Buffer = fs.readFileSync(path);
		const size: number = file.size;
		fs.unlink(path);

		upload(req.misskeyApp, req.misskeyUser, fileName, mimetype, fileBuffer, size).then((albumFile: Object) => {
			res.apiRender(albumFile);
		}, (err: any) => {
			res.apiError(500, err);
		});
	} else {
		res.apiError(400, 'empty-file');
	}
};
