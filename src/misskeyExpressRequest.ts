import * as express from 'express';
import {Application} from './models/application';
import {IUser} from './models/user';

export interface MisskeyExpressRequest extends express.Request {
	misskeyApp: Application;
	misskeyUser: IUser;
}
