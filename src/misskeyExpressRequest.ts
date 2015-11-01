import * as express from 'express';
import {IApplication, IUser} from './interfaces';

export interface MisskeyExpressRequest extends express.Request {
	misskeyApp: IApplication;
	misskeyUser: IUser;
}
