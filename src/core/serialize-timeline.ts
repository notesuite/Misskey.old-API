import serializePost from './serialize-post';
import {IUser, IPost} from '../interfaces';

export default function serializeTimeline(timeline: IPost[], me: IUser = null): Promise<Object[]> {
	'use strict';
	return Promise.all(timeline.map(post => serializePost(post, me)));
}