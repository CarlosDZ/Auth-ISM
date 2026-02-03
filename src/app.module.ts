import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ScopesModule } from './scopes/scopes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TenantsModule, UsersModule, AuthModule, RolesModule, ScopesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
