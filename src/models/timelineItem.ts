import * as mongoose from 'mongoose';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

const schema: mongoose.Schema = new Schema({
	userId: { type: Schema.Types.ObjectId, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number, required: true },
	contentType: { type: String, required: true },
	contentId: { type: Schema.Types.ObjectId, required: true },
	isContentDeleted: { type: Boolean, required: false, default: false }
});

if (!(<any>schema).options.toObject) {
	(<any>schema).options.toObject = {};
}
(<any>schema).options.toObject.transform = (doc: ITimelineItem, ret: any) => {
	ret.id = doc.id;
	delete ret._id;
	delete ret.__v;
};

export const TimelineItem: mongoose.Model<mongoose.Document> = db.model('TimelineItem', schema);

export interface ITimelineItem extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	createdAt: Date;
	cursor: number;
	contentType: string;
	contentId: mongoose.Types.ObjectId;
	isContentDeleted: boolean;
}