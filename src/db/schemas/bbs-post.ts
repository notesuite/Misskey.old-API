import {Schema, Connection, Document, Model} from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

export default function(db: Connection): Model<Document> {
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		files: [{ type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' }],
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		inReplyToPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'BBSPost' },
		isContentModified: { type: Boolean, required: false, default: false },
		isDeleted: { type: Boolean, required: false, default: false },
		isPlain: { type: Boolean, required: false, default: false },
		likesCount: { type: Number, required: false, default: 0 },
		number: { type: Number, required: true },
		repliesCount: { type: Number, required: false, default: 0 },
		text: { type: String, required: true },
		topic: { type: Schema.Types.ObjectId, required: true, ref: 'BBSTopic' },
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
		model: 'BBSPost',
		field: 'cursor'
	});

	return db.model('BBSPost', schema, 'BBSPosts');
}
