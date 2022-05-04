import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get('CONNECTION_STRING');
        return {
          uri: connectionString,
        };
      },
    }),
    PostsModule,
    AuthModule,
    UsersModule
    ],
})
export class AppModule {}
