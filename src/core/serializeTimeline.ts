import serializePost from './serializePost';
import {IUser, IPost} from '../interfaces';

export default function(timeline: IPost[], me: IUser = null): Promise<Object[]> {
	'use strict';
	return Promise.all(timeline.map(post => serializePost(post, me)));
}
