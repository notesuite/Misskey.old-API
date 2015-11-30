import {AlbumFile} from '../models';
import {IUser, IAlbumFile} from '../interfaces';

export default function serializePhotoPost(photoPost: any, me: IUser = null): Promise<Object> {
	'use strict';
	return Promise.all(photoPost.photos.map((photo: string) => new Promise<Object>((resolve, reject) => {
		AlbumFile.findById(photo, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else {
				resolve(file.toObject());
			}
		});
	})))
	.then(photoFiles => {
		photoPost.photos = photoFiles;
		return photoPost;
	});
}
