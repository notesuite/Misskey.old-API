import * as express from 'express';

interface IRoute {
	method: string;
	endpoint: string;
}

const routing: IRoute[] = [
	{ method: 'get', endpoint: 'login' },
	{ method: 'get', endpoint: 'screenname-available' },

	{ method: 'post', endpoint: 'account/create' },
	{ method: 'get', endpoint: 'account/show' },
	{ method: 'put', endpoint: 'account/update-name' },
	{ method: 'put', endpoint: 'account/update-url' },
	{ method: 'put', endpoint: 'account/update-icon' },

	{ method: 'get', endpoint: 'users/show' },
	{ method: 'post', endpoint: 'users/follow' },
	{ method: 'delete', endpoint: 'users/unfollow' },
	{ method: 'get', endpoint: 'users/followings' },
	{ method: 'get', endpoint: 'users/followers' },
	{ method: 'get', endpoint: 'users/search' },

	{ method: 'get', endpoint: 'posts/timeline' },
	{ method: 'get', endpoint: 'posts/user-timeline' },
	{ method: 'get', endpoint: 'posts/show' },
	{ method: 'get', endpoint: 'posts/talk' },
	{ method: 'get', endpoint: 'posts/replies' },
	{ method: 'post', endpoint: 'posts/status' },
	{ method: 'post', endpoint: 'posts/photo' },
	{ method: 'post', endpoint: 'posts/favorite' },
	{ method: 'post', endpoint: 'posts/repost' },

	{ method: 'post', endpoint: 'album/files/upload' },
	{ method: 'get', endpoint: 'album/files/show' },
	{ method: 'get', endpoint: 'album/files/list' },
	{ method: 'put', endpoint: 'album/files/move' },
	{ method: 'put', endpoint: 'album/files/rename' },
	{ method: 'delete', endpoint: 'album/files/delete' },
	{ method: 'post', endpoint: 'album/folders/create' },
	{ method: 'put', endpoint: 'album/folders/move' },
	{ method: 'put', endpoint: 'album/folders/rename' },

	{ method: 'get', endpoint: 'search/hashtags' }
];

export default function(app: express.Express): void {
	'use strict';
	console.log('Init router');

	app.get('/', (req: express.Request, res: express.Response) => {
		res.status(200).send('Rain tree sketch');
	});

	routing.forEach(route => {
		console.log('- load: ' + route.endpoint);
		const handler: any = require(`${__dirname}/restHandlers/${route.endpoint}`);
		if (handler.hasOwnProperty('default')) {
			(<any>app)[route.method]('/' + route.endpoint, handler.default);
		} else {
			(<any>app)[route.method]('/' + route.endpoint, handler);
		}
	});
}
