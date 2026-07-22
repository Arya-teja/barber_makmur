import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

interface LoginDto {
  email: string
  password: string
}

interface RegisterDto {
  name: string
  email: string
  phone?: string
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload.email, payload.password)
  }

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload)
  }
}
