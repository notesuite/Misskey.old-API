import {UserMute, User} from '../../db/db';
import {IUserMute, IUser} from '../../db/interfaces';

/**
 * ユーザーをミュートします
 * @param muter ミュートするユーザー
 * @param muteeId ミュートされるユーザーID
 */
export default function(muter: IUser, muteeId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (muter.id.toString() === muteeId) {
			return reject('mutee-is-you');
		}
		User.findById(muteeId, (userFindErr: any, mutee: IUser) => {
			if (userFindErr !== null) {
				return reject(userFindErr);
			} else if (mutee === null) {
				return reject('mutee-not-found');
			}
			UserMute.findOne({
				mutee: muteeId,
				muter: muter.id
			}, (muteFindErr: any, userMute: IUserMute) => {
				if (muteFindErr !== null) {
					return reject(muteFindErr);
				} else if (userMute !== null) {
					return reject('already-mute');
				}
				UserMute.create({
					mutee: muteeId,
					muter: muter.id
				}, (createErr: any, createdUserMute: IUserMute) => {
					if (createErr !== null) {
						return reject(createErr);
					}
					resolve();
				});
			});
		});
	});
}
