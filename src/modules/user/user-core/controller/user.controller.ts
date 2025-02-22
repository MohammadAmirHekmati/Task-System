import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { JwtStrategy } from '../../modules/auth/strategy/jwt.strategy';
import { CreateUserDto } from '../../modules/dtos/create.user.dto';
import { LoginUserDto } from '../../modules/dtos/login.user.dto';
import { UpdateUserDto } from '../../modules/dtos/update.user.dto';
import { UserEnt } from '../../modules/entities/User.entity';
import { UserPageDto } from '../../modules/paginations/user.page.dto';
import { UserService } from '../../modules/services/User.service';

@ApiTags('User')
@Controller('User')
export class UserController {
  PREFIX_TOKEN_AUTH = 'prefix_auth_token_';
  constructor(private user: UserService) {}

  @Post('/register')
  register(
    @Query('id_department') id_department: string,
    @Query('id_role') id_role: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEnt> {
    createUserDto.id_department = id_department;
    createUserDto.id_role = id_role;
    return this.user.createUser(createUserDto);
  }
  //login
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<Object> {
    return this.user._createJwt(loginUserDto);
  }

  @ApiBasicAuth()
  @UseGuards(JwtStrategy)
  @Get('/protected')
  sayHello(): string {
    return 'ok';
  }

  @Put()
  updateUser(
    @Query('id_user') id_user: string,
    @Query('id_department') id_department: string,
    @Query('id_role') id_role: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEnt> {
    updateUserDto.id_department = id_department;
    updateUserDto.id_role = id_role;
    return this.user.updateUser(id_user, updateUserDto);
  }

  @ApiOperation({ summary: 'pagination for user' })
  @Post('page')
  paginationUser(@Body() pageDto: UserPageDto): Promise<PageDto<UserEnt>> {
    return this.user.paginationUser(pageDto);
  }
}
