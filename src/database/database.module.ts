import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { databaseProviders } from './database.providers';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders],
  exports: [],
})
export class DatabaseModule {}
