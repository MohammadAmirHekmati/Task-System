import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { CreateRoleDto } from '../../modules/dtos/create.role.dto';
import { RoleEnt } from '../../modules/entities/role.entity';
import { RolePageDto } from '../../modules/paginations/role.page.dto';
import { RoleService } from '../../modules/services/role.service';

@ApiTags('Role')
@Controller('Role')
export class RoleController {
  constructor(private role: RoleService) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEnt> {
    return this.role.createRole(createRoleDto);
  }

  @Get()
  findOneRole(@Query('role_id') role_id: string): Promise<RoleEnt> {
    return this.role.findOneRole(role_id);
  }

  @Post('page')
  paginationRole(@Body() pageDto: RolePageDto): Promise<PageDto<RoleEnt>> {
    return this.role.paginationRole(pageDto);
  }
}
