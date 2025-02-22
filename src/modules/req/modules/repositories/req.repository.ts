import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateReqDto } from '../dtos/create.req.dto';
import { UpdateReqDto } from '../dtos/update.req.dto';
import { ReqEnt } from '../entities/req.entity';
import { ReqMapperPagination } from '../mapper/req.mapper.pagination';
import { ReqPageDto } from '../paginations/req.page.dto';

export class ReqRepo {
  constructor(
    @InjectRepository(ReqEnt)
    private dataSource: DataSource,
  ) {}

  async createReq(
    createDto: CreateReqDto,
    query: QueryRunner | undefined,
  ): Promise<ReqEnt> {
    const reqEnt = new ReqEnt();
    reqEnt.status = createDto.status;
    reqEnt.project = createDto.projectEnt;
    if (query) return await query.manager.save(reqEnt);
    return await this.dataSource.manager.save(reqEnt);
  }

  async findOneReq(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<ReqEnt> {
    const req = await this.dataSource.manager.findOne(ReqEnt, {
      where: { id: searchDto },
      relations: {
        project: true,
      },
    });
    if (!req) throw new BadGatewayException({ message: 'Req does not exits' });
    return req;
  }

  async updateReq(
    entity: ReqEnt,
    updateDto: UpdateReqDto,
    query?: QueryRunner,
  ): Promise<ReqEnt> {
    entity.status = updateDto.status;
    entity.project = updateDto.projectEnt;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  async paginationReq(pageDto: ReqPageDto): Promise<PageDto<ReqEnt>> {
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .select(['req.id', 'req.status']);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }
    if (pageDto.filter) {
      if (pageDto.filter.status) {
        queryBuilder.andWhere('req.status LIKE :status', {
          status: `%${pageDto.filter.status}%`,
        });
      }
    }
    if (pageDto.field) {
      const mapper = ReqMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${ReqMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    const result = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMetaDto);
  }
}
