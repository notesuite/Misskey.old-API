import * as express from 'express';

export interface MisskeyExpressResponse extends express.Response {
	apiRender: (data: any) => void;
	apiError: (httpStatusCode: number, err: any) => void;
}
