import { Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Schema as S} from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  selftext: string;
  author_fullname: string;
  saved: boolean;
  title: string;
  subreddit_name_prefixed: string;
  name: string;
  score: number;
  subreddit_id: string;
  created_at: Date;
  created: number;
  internalSubReddit: string;
}
export const PostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true, default: Date.now },
    created: { type: Number },
    internalSubReddit: {
      type: S.Types.ObjectId,
      ref: 'SubReddit',
    },
  },
  { strict: false },
);
