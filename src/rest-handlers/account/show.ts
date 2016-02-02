import {IApplication, IUser} from '../../db/interfaces';
import show from '../../endpoints/account/show';

export default function(
	app: IApplication,
	user: IUser,
	req: any,
	res: any
): void {
	res(show(user));
};
