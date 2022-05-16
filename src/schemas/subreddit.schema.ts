import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Schema as S } from 'mongoose';
import { Post } from './post.schema';

export type SubRedditDocument = SubReddit & Document;

@Schema()
export class SubReddit {
  _id: string;
  title: string;
  name: string;
  display_name: string;
  id: string;
  subscribers: number;
  created: number;
  created_at: Date;
  lastFetchedPostTime: number;
  posts: Post[];
}

export const SubRedditSchema = new mongoose.Schema(
  {
    _id: S.Types.ObjectId,
    display_name: String,
    title: String,
    name: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true, default: Date.now },
    created: { type: Number },
    posts: [
      {
        type: S.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  { strict: false },
);
