const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

export default [
	{ endpoint: 'login', login: false },

	{ endpoint: 'screenname/available', login: false },

	{ endpoint: 'account/create', login: false },
	{ endpoint: 'account/show', login: true },
	{ endpoint: 'account/name/update', login: true, limitDuration: day, limitMax: 10 },
	{ endpoint: 'account/url/update', login: true, limitDuration: day, limitMax: 10 },
	{ endpoint: 'account/avatar/update', login: true, limitDuration: day, limitMax: 30 },
	{ endpoint: 'account/banner/update', login: true, limitDuration: day, limitMax: 30 },
	{ endpoint: 'account/comment/update', login: true, limitDuration: day, limitMax: 30 },
	{ endpoint: 'account/location/update', login: true, limitDuration: day, limitMax: 30 },

	{ endpoint: 'notifications/show', login: true },
	{ endpoint: 'notifications/timeline', login: true },
	{ endpoint: 'notifications/unread/count', login: true },

	{ endpoint: 'users/show', login: false },
	{ endpoint: 'users/follow', login: true, limitDuration: hour, limitMax: 100 },
	{ endpoint: 'users/unfollow', login: true, limitDuration: hour, limitMax: 100 },
	{ endpoint: 'users/followings', login: false },
	{ endpoint: 'users/followers', login: false },
	{ endpoint: 'users/recommendations', login: true },
	{ endpoint: 'users/search', login: false },
	{ endpoint: 'users/search-by-screen-name', login: false },

	{ endpoint: 'posts/timeline', login: true, limitDuration: 10 * minute, limitMax: 100 },
	{ endpoint: 'posts/user-timeline', login: false },
	{ endpoint: 'posts/mentions', login: true, limitDuration: 10 * minute, limitMax: 100 },
	{ endpoint: 'posts/show', login: false },
	{ endpoint: 'posts/talk/show', login: false },
	{ endpoint: 'posts/replies/show', login: false },
	{ endpoint: 'posts/timeline/unread/count', login: true },
	{ endpoint: 'posts/mentions/unread/count', login: true },
	{ endpoint: 'posts/status', login: true, limitDuration: hour, limitMax: 120, limitKey: 'post' },
	{ endpoint: 'posts/photo', login: true, limitDuration: hour, limitMax: 120, limitKey: 'post' },
	{ endpoint: 'posts/like', login: true, limitDuration: hour, limitMax: 120 },
	{ endpoint: 'posts/repost', login: true, limitDuration: hour, limitMax: 120, limitKey: 'post' },
	{ endpoint: 'posts/likes/show', login: false },
	{ endpoint: 'posts/reposts/show', login: false },

	{ endpoint: 'talks/history/show', login: true, limitDuration: hour, limitMax: 1000 },
	{ endpoint: 'talks/messages/unread/count', login: true },
	{ endpoint: 'talks/messages/say', login: true, limitDuration: hour, limitMax: 120 },
	{ endpoint: 'talks/messages/show', login: true, limitDuration: hour, limitMax: 1000 },
	{ endpoint: 'talks/messages/read', login: true },
	{ endpoint: 'talks/messages/stream', login: true, limitDuration: hour, limitMax: 1000 },
	{ endpoint: 'talks/messages/delete', login: true, limitDuration: hour, limitMax: 100 },
	{ endpoint: 'talks/group/create', login: true, limitDuration: day, limitMax: 30 },

	{ endpoint: 'album/files/upload', login: true, limitDuration: hour, limitMax: 100 },
	{ endpoint: 'album/files/show', login: true },
	{ endpoint: 'album/files/list', login: true },
	{ endpoint: 'album/files/stream', login: true },
	{ endpoint: 'album/files/move', login: true },
	{ endpoint: 'album/files/rename', login: true },
	{ endpoint: 'album/files/delete', login: true },
	{ endpoint: 'album/folders/create', login: true, limitDuration: hour, limitMax: 50 },
	{ endpoint: 'album/folders/move', login: true },
	{ endpoint: 'album/folders/rename', login: true },

	{ endpoint: 'hashtags/search', login: false },
	{ endpoint: 'hashtags/trend/show', login: false },

	{ endpoint: 'bbs/topics/create', login: true, limitDuration: day, limitMax: 30 },
	{ endpoint: 'bbs/posts/create', login: true, limitDuration: hour, limitMax: 120 }
]
