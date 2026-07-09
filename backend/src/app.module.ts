import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from 'node_modules/@nestjs-modules/ioredis/dist/modules/redis.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { ReviewModule } from './review/review.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ComplaintModule } from './complaint/complaint.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot() cấu hình kết nối database cho toàn bộ ứng dụng
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'abel',
      password: process.env.DATABASE_PASSWORD,
      database: 'buildpc',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Tự động tạo/cập nhật bảng theo entity — chỉ dùng khi dev
    }),

    // GraphQLModule.forRoot() kích hoạt GraphQL cho ứng dụng
    // autoSchemaFile: tự sinh file schema.gql từ các decorator @ObjectType, @Resolver...
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Mở GraphQL Playground tại /graphql khi dev
      context: ({ req, res }) => ({ req, res }),
    }),

    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),

    AuthModule,

    UserModule,

    ProductModule,

    OrderModule,

    CartModule,

    ReviewModule,

    DashboardModule,

    WishlistModule,

    ComplaintModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
