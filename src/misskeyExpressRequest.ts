import * as express from 'express';
import {IApplication} from './models/application';
import {IUser} from './models/user';

export interface MisskeyExpressRequest extends express.Request {
	misskeyApp: IApplication;
	misskeyUser: IUser;
}
