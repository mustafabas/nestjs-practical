/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { ConfigModule, ConfigService } from '@nestjs/config';
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      const connectionString: string =
        configService.get<string>('CONNECTION_STRING');
      (<any>mongoose).Promise = Promise;
      mongoose.connect(connectionString);
    },
  },
];

