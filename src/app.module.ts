import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { LoggerMiddleware } from './common/logger.middleware';

@Module({
  imports: [
    // مثل .env في Laravel
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        if (!env.JWT_SECRET) throw new Error('JWT_SECRET is required in .env');
        return env;
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'task_manager'),
        autoLoadEntities: true,
        synchronize: true, // للتطوير فقط! في الإنتاج استخدم migrations
      }),
    }),
    UsersModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
