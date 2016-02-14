import {Schema, Connection, Document, Model} from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

export default function(db: Connection): Model<Document> {
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema({
		createdAt: { type: Date, required: true, default: Date.now },
		color: { type: String, required: true },
		cursor: { type: Number },
		name: { type: String, required: false, default: '' },
		parent: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFolder' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'AlbumFolder',
		field: 'cursor'
	});

	return db.model('AlbumFolder', schema, 'AlbumFolders');
}
