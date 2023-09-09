import { UserService } from './user.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoginUserContract } from './contracts/loginUser.contract';
import { CreateUserContract } from './contracts/createUser.contract';
import { BanUserContract } from './contracts/banUser.contract';
import { SetRoleUserContract } from './contracts/setRoleUser.contract';
import { AdminGuard } from 'src/guards/admin.guards';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sign-up')
  @ApiParam({ name: 'firstname', type: String })
  @ApiParam({ name: 'lastname', type: String })
  @ApiParam({ name: 'email', type: String })
  @ApiParam({ name: 'password', type: String })
  @ApiParam({ name: 'avatar', type: String, required: false })
  async signUp(@Body() body: CreateUserContract) {
    return await this.userService.signUp(body);
  }

  @Post('sign-in')
  @ApiParam({ name: 'email', type: String })
  @ApiParam({ name: 'password', type: String })
  async signIn(@Body() body: LoginUserContract) {
    return await this.userService.signIn(body);
  }

  @Post('check-token')
  async checkToken(@Headers() headers: any) {
    const token: string = headers.authorization.split(' ')[1];
    return await this.userService.checkToken(token);
  }

  @Post('ban-user')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'reason', type: String })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'banned', type: Boolean })
  async banUser(@Body() body: BanUserContract) {
    return await this.userService.banUser(body);
  }

  @Post('set-role')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'role', type: String })
  @ApiParam({ name: 'userId', type: Number })
  async setRole(@Body() body: SetRoleUserContract) {
    return await this.userService.setRole(body);
  }

  @Post('change-avatar')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'avatar', type: String })
  async changeAvatar(@Body() body, @Headers() headers) {
    return await this.userService.changeAvatar(body.avatar, headers);
  }

  @Post('verify-email')
  @UseGuards(AuthGuard)
  async verifyEmail(@Body() body, @Headers() headers) {
    return await this.userService.verifyEmail();
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'password', type: String })
  @ApiParam({ name: 'newPassword', type: String })
  async changePassword(@Body() body, @Headers() headers) {
    return await this.userService.changePassword(body, headers);
  }

  @Get('get-user/:id')
  @UseGuards(AdminGuard)
  async getUser(@Param() param) {
    return await this.userService.getUser(param.id);
  }

  @Get('get-many')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'firstname', type: String, required: false })
  @ApiQuery({ name: 'lastname', type: String, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'sortColumn', type: String, required: false })
  async getManyUsers(@Query() query) {
    return await this.userService.getMany(query);
  }

  @Get('get-profile')
  @UseGuards(AuthGuard)
  async getProfile(@Headers() headers) {
    return await this.userService.getProfile(headers);
  }
}
