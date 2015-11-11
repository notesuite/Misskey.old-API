import {IUser} from '../interfaces';

export default (reply: Object, me: IUser = null): Promise<Object> => {
	'use strict';
	return Promise.resolve(reply);
}
