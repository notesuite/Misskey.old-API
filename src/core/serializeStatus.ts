import {IUser} from '../interfaces';

export default function(status: Object, me: IUser = null): Promise<Object> {
	'use strict';
	return Promise.resolve(status);
}
