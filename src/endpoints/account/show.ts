import {IUser} from '../../interfaces';

export default function show(user: IUser): Object {
	'use strict';
	return user.toObject();
}
