import {UserMute, User} from '../../db/db';
import {IUserMute, IUser} from '../../db/interfaces';

/**
 * ユーザーのミュートを解除します
 * @param muter: ミュートを解除するユーザー
 * @param muteeId: ミュートを解除されるユーザーID
 */
export default function(muter: IUser, muteeId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (muter.id.toString() === muteeId) {
			reject('mutee-is-you');
		} else {
			User.findById(muteeId, (userFindErr: any, mutee: IUser) => {
				if (userFindErr !== null) {
					reject(userFindErr);
				} else if (mutee === null) {
					reject('mutee-not-found');
				} else {
					UserMute.findOne({
						mutee: muteeId,
						muter: muter.id
					}, (muteFindErr: any, userMute: IUserMute) => {
						if (muteFindErr !== null) {
							reject(muteFindErr);
						} else if (userMute === null) {
							reject("not-mute");
						} else {
							userMute.remove((muteRemoveErr: any) => {
								if (muteRemoveErr !== null) {
									reject(muteRemoveErr);
								} else {
									resolve();
								}
							});
						}
					});
				}
			});
		}
	});
}
