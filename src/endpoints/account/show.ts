import {IUser} from '../../interfaces';

export default function(user: IUser): Object {
	'use strict';
	return user.toObject();
}
