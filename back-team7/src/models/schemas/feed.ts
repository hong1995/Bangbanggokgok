import { Schema } from 'mongoose';
import shortid from 'shortid';

const FeedSchema = new Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    userId: {
      type: String,
      ref: 'users',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
    report: {
      type: Object,
      required: false,
    },
    imageUrl: {
      type: [String],
      required: false,
    },
  },
  {
    collection: 'feeds',
    timestamps: true,
  }
);
export { FeedSchema };
