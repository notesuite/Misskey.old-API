import * as mongoose from 'mongoose';
import config from './config';

const db = mongoose.createConnection(config.mongo.uri, config.mongo.options);

import albumFile from './models/album-file';
import albumFolder from './models/album-folder';
import application from './models/application';
import bbsPost from './models/bbs-post';
import bbsTopic from './models/bbs-topic';
import bbsWatching from './models/bbs-watching';
import hashtag from './models/hashtag';
import notification from './models/notification';
import { post, status, photo, repost } from './models/post';
import postLike from './models/post-like';
import postMention from './models/post-mention';
import {
	talkUserMessage,
	talkGroupMessage,
	talkGroupSentInvitationActivity,
	talkGroupMemberLeftActivity,
	talkGroupMemberJoinActivity,
	talkRenameGroupActivity,
	talkTransferGroupOwnershipActivity
} from './models/talk-message';
import talkHistory from './models/talk-history';
import user from './models/user';
import userFollowing from './models/user-following';

/* tslint:disable:variable-name */
export const AlbumFile = albumFile(db);
export const AlbumFolder = albumFolder(db);
export const Application = application(db);
export const BBSPost = bbsPost(db);
export const BBSTopic = bbsTopic(db);
export const BBSWatching = bbsWatching(db);
export const Hashtag = hashtag(db);
export const Notification = notification(db);
export const Post = post(db);
export const StatusPost = status(db);
export const PhotoPost = photo(db);
export const Repost = repost(db);
export const PostLike = postLike(db);
export const PostMention = postMention(db);
export const TalkUserMessage = talkUserMessage(db);
export const TalkGroupMessage = talkGroupMessage(db);
export const TalkGroupSendInvitationActivity = talkGroupSendInvitationActivity(db);
export const TalkGroupMemberLeftActivity = talkGroupMemberLeftActivity(db);
export const TalkGroupMemberJoinActivity = talkGroupMemberJoinActivity(db);
export const TalkRenameGroupActivity = talkRenameGroupActivity(db);
export const TalkTransferGroupOwnershipActivity = talkTransferGroupOwnershipActivity(db);
export const TalkHistory = talkHistory(db);
export const User = user(db);
export const UserFollowing = userFollowing(db);
