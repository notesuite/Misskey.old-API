import {IUser} from '../interfaces';

export default (status: Object, me: IUser = null): Promise<Object> => {
	'use strict';
	return Promise.resolve(status);
}
