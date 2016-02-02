import {IApplication, IUser} from '../../db/interfaces';
import screennameAvailable from '../../endpoints/screenname/available';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	screennameAvailable(req.payload['screen-name']).then(available => {
		res({
			available
		});
	}, (err: any) => {
		// TODO: エラーコードを判別して適切なHTTPステータスコードを返す
		res({error: err}).code(500);
	});
}
