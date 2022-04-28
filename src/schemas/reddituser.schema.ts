import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type RedditUserDocument = RedditUser & Document;

@Schema()
export class RedditUser {
  display_name: string;
  title: string;
  icon_image: string;
  name: string;
  quarantine: string;
  hide_ads: string;
  prediction_leader_board_entry_type: string;
  emojis_enabled: boolean;
  public_description: string;
  banner_img: string;
  created_at: Date;
  created: number;
}

//export const RedditUserSchema = SchemaFactory.createForClass(RedditUser);

export const RedditUserSchema = new mongoose.Schema(
  {
    display_name: String,
    name: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true, default: Date.now },
    created: { type: Number },
  },
  { strict: false },
);
