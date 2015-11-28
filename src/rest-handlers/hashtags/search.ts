import * as hapi from 'hapi';
import { IApplication, IUser } from '../../interfaces';
import search from '../../endpoints/hashtags/search';

export default function searchHashtags(
	app: IApplication,
	user: IUser,
	req: hapi.Request,
	res: hapi.IReply
): void {
	'use strict';
	search(req.query['name']).then(hashtags => {
		res(hashtags);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
