import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/login-data.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(':slug/login')
    async login(@Param('slug') slug:string, @Body() dto: LoginDataDto, @Req() req) {
        
    const ip: string = req.ip ?? req.headers['x-forwarded-for'] ?? "";
    const userAgent: string = req.headers['user-agent'] ?? "";

    return this.authService.login(slug,dto, ip, userAgent);
  }
}
