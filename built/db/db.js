"use strict";
const mongoose = require('mongoose');
const config_1 = require('../config');
const db = mongoose.createConnection(config_1.default.mongo.uri, config_1.default.mongo.options);
const album_file_1 = require('./schemas/album-file');
const album_folder_1 = require('./schemas/album-folder');
const album_tag_1 = require('./schemas/album-tag');
const application_1 = require('./schemas/application');
const bbs_post_1 = require('./schemas/bbs-post');
const bbs_topic_1 = require('./schemas/bbs-topic');
const bbs_watching_1 = require('./schemas/bbs-watching');
const hashtag_1 = require('./schemas/hashtag');
const notification_1 = require('./schemas/notification');
const post_1 = require('./schemas/post');
const post_like_1 = require('./schemas/post-like');
const post_mention_1 = require('./schemas/post-mention');
const talk = require('./schemas/talk-message');
const talk_group_1 = require('./schemas/talk-group');
const talk_group_invitation_1 = require('./schemas/talk-group-invitation');
const talk_history_1 = require('./schemas/talk-history');
const user_1 = require('./schemas/user');
const user_following_1 = require('./schemas/user-following');
exports.AlbumFile = album_file_1.default(db);
exports.AlbumFolder = album_folder_1.default(db);
exports.AlbumTag = album_tag_1.default(db);
exports.Application = application_1.default(db);
exports.BBSPost = bbs_post_1.default(db);
exports.BBSTopic = bbs_topic_1.default(db);
exports.BBSWatching = bbs_watching_1.default(db);
exports.Hashtag = hashtag_1.default(db);
exports.Notification = notification_1.default(db);
exports.Post = post_1.post(db);
exports.Status = post_1.status(db);
exports.Reply = post_1.reply(db);
exports.Repost = post_1.repost(db);
exports.PostLike = post_like_1.default(db);
exports.PostMention = post_mention_1.default(db);
exports.TalkMessage = talk.message(db);
exports.TalkUserMessage = talk.userMessage(db);
exports.TalkGroupMessageBase = talk.groupMessageBase(db);
exports.TalkGroupMessage = talk.groupMessage(db);
exports.TalkGroupSendInvitationActivity = talk.groupSendInvitationActivity(db);
exports.TalkGroupMemberJoinActivity = talk.groupMemberJoinActivity(db);
exports.TalkGroupMemberLeftActivity = talk.groupMemberLeftActivity(db);
exports.TalkRenameGroupActivity = talk.renameGroupActivity(db);
exports.TalkTransferGroupOwnershipActivity = talk.transferGroupOwnershipActivity(db);
exports.TalkHistory = talk_history_1.talkHistory(db);
exports.TalkUserHistory = talk_history_1.talkUserHistory(db);
exports.TalkGroupHistory = talk_history_1.talkGroupHistory(db);
exports.TalkGroup = talk_group_1.default(db);
exports.TalkGroupInvitation = talk_group_invitation_1.default(db);
exports.User = user_1.default(db);
exports.UserFollowing = user_following_1.default(db);
