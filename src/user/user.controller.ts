import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { EnrollRequestDto } from './dto/request/enroll.request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from './entities/user.entity';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '최초가입자 정보등록',
    description: '구글 OAuth2.0 인증 후, 최초가입자로 확인되면, 정보등록 필요',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  enroll(
    @Body() enrollRequestDto: EnrollRequestDto,
    @AuthUser() user: User,
  ): Promise<void> {
    enrollRequestDto.validateRole();
    return this.userService.join(enrollRequestDto, user);
  }
}
