"use strict";
const powerful_1 = require('powerful');
const db_1 = require('../../../db/db');
function default_1(user, folderId = null, limit = 20, sinceId = null, maxId = null) {
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 100) {
        return Promise.reject('100 made');
    }
    return new Promise((resolve, reject) => {
        let sort = { createdAt: -1 };
        const query = Object.assign({
            user: user.id,
            folder: folderId,
            isHidden: false,
            isDeleted: false
        }, new powerful_1.Match(null)
            .when(() => sinceId !== null, () => {
            sort = { createdAt: 1 };
            return { _id: { $gt: sinceId } };
        })
            .when(() => maxId !== null, () => {
            return { _id: { $lt: maxId } };
        })
            .getValue({}));
        db_1.AlbumFile
            .find(query)
            .sort(sort)
            .limit(limit)
            .populate('tags')
            .exec(query, (filesFindErr, files) => {
            if (filesFindErr !== null) {
                return reject(filesFindErr);
            }
            resolve(files.map(file => file.toObject()));
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
