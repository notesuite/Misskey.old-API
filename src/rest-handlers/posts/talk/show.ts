import {IApplication, IUser} from '../../../db/interfaces';
import talk from '../../../endpoints/posts/talk/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	talk(
		user,
		req.payload['post-id'],
		req.payload['limit']
	).then(posts => {
		res(posts);
	}, (err: any) => {
		res({error: err}).code(500);
	});
}
