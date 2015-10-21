import * as express from 'express';
import {Application} from './models/application';
import {User} from './models/user';

export interface MisskeyExpressRequest extends express.Request {
	misskeyApp: Application;
	misskeyUser: User;
}
