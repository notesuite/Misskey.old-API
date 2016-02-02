import {IUser} from '../../db/interfaces';

export default function(user: IUser): Object {
	return user.toObject();
}
