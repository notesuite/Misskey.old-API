"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../../db/db');
function default_1(user, folderId = null, limit = 50, sinceId = null, maxId = null) {
    return new Promise((resolve, reject) => {
        const query = Object.assign({
            user: user.id,
            folder: folderId,
            isHidden: false,
            isDeleted: false
        }, new powerful_1.Match(null)
            .when(() => sinceId !== null, () => {
            return { _id: { $gt: sinceId } };
        })
            .when(() => maxId !== null, () => {
            return { _id: { $lt: maxId } };
        })
            .getValue({}));
        db_1.AlbumFile
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('tags')
            .exec((err, files) => {
            if (err !== null) {
                return reject(err);
            }
            else if (isEmpty(files)) {
                return resolve([]);
            }
            resolve(files.map(file => file.toObject()));
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
