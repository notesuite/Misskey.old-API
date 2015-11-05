import * as express from 'express';

enum Method {
	GET,
	POST,
	DELETE,
	PUT
}

interface IRoute {
	method: Method;
	endpoint: string;
}

const routing: Array<IRoute> = [
	{ method: Method.GET, endpoint: 'login' },
	{ method: Method.GET, endpoint: 'screenname-available' },

	{ method: Method.POST, endpoint: 'account/create' },
	{ method: Method.GET, endpoint: 'account/show' },

	{ method: Method.GET, endpoint: 'users/show' },
	{ method: Method.POST, endpoint: 'users/follow' },
	{ method: Method.DELETE, endpoint: 'users/unfollow' },
	{ method: Method.GET, endpoint: 'users/followings' },
	{ method: Method.GET, endpoint: 'users/followers' },

	{ method: Method.GET, endpoint: 'posts/timeline' },
	{ method: Method.GET, endpoint: 'posts/show' },
	{ method: Method.POST, endpoint: 'posts/status' },
	{ method: Method.POST, endpoint: 'posts/repost' },

	{ method: Method.POST, endpoint: 'album/files/upload' },
	{ method: Method.GET, endpoint: 'album/files/list' },
	{ method: Method.PUT, endpoint: 'album/files/move' },
	{ method: Method.PUT, endpoint: 'album/files/rename' },
	{ method: Method.DELETE, endpoint: 'album/files/delete' },
	{ method: Method.POST, endpoint: 'album/folders/create' },
	{ method: Method.PUT, endpoint: 'album/folders/move' },
	{ method: Method.PUT, endpoint: 'album/folders/rename' }
];

export default function(app: express.Express): void {
	'use strict';
	console.log('Init router');

	app.get('/', (req: express.Request, res: express.Response) => {
		res.status(200).send('Rain tree sketch');
	});

	routing.forEach((route: IRoute) => {
		const method = (() => {
			switch (route.method) {
				case Method.GET:
					return app.put;
				case Method.POST:
					return app.post;
				case Method.DELETE:
					return app.delete;
				case Method.PUT:
					return app.put;
				default:
					break;
			}
		})();
		method('/' + route.endpoint, require(`${__dirname}/restHandlers/${route.endpoint}`));
	});
}
