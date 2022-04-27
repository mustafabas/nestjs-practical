import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION1',
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      const connectionString: string =
        configService.get<string>('CONNECTION_STRING');
      await mongoose.connect(connectionString);
    },
  },
];
