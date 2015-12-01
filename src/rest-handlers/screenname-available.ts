import * as hapi from 'hapi';
import { IApplication, IUser } from '../interfaces';
import screennameAvailable from '../endpoints/screenname-available';

export default function isScreennameAvailable(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	screennameAvailable(req.payload['screen-name']).then(available => {
		res({
			available
		});
	}, (err: any) => {
		// TODO: エラーコードを判別して適切なHTTPステータスコードを返す
		res({error: err}).code(500);
	});
}
