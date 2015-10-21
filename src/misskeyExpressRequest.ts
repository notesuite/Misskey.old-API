import * as express from 'express';
import Application from './models/application';
import user from './models/user';

export interface MisskeyExpressRequest extends express.Request {
	app: Application;
	user: User;
}
