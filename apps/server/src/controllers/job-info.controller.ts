import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobInfoService } from '../services/job-info.service';
import {
  CreateJobInfoDto,
  UpdateJobInfoDto,
  QueryJobInfoDto,
  BatchCreateJobInfoDto,
  BatchDeleteJobInfoDto,
} from '../dto/job-info.dto';
import { Roles } from '../auth/decorators';
import { RoleType } from 'generated/prisma';

@Controller('job-info')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class JobInfoController {
  constructor(private readonly jobInfoService: JobInfoService) {}

  // 创建单个岗位信息
  @Post()
  // @Roles(RoleType.ADMIN, RoleType.OWNER)
  create(@Body() createJobInfoDto: CreateJobInfoDto) {
    return this.jobInfoService.create(createJobInfoDto);
  }

  // 批量创建岗位信息
  @Post('batch')
  // @Roles(RoleType.ADMIN, RoleType.OWNER)
  batchCreate(@Body() batchCreateJobInfoDto: BatchCreateJobInfoDto) {
    return this.jobInfoService.batchCreate(batchCreateJobInfoDto);
  }

  // 分页查询岗位信息
  @Get()
  findAll(@Query() queryJobInfoDto: QueryJobInfoDto) {
    return this.jobInfoService.findMany(queryJobInfoDto);
  }

  // 获取公司岗位统计
  @Get('stats/company')
  getJobCountByCompany() {
    return this.jobInfoService.getJobCountByCompany();
  }

  // 获取行业岗位统计
  @Get('stats/industry')
  getJobCountByIndustry() {
    return this.jobInfoService.getJobCountByIndustry();
  }

  // 获取城市岗位统计
  @Get('stats/city')
  getJobCountByCity() {
    return this.jobInfoService.getJobCountByCity();
  }

  // 根据ID查询单个岗位信息
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobInfoService.findOne(id);
  }

  // 更新岗位信息
  @Patch(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  update(@Param('id') id: string, @Body() updateJobInfoDto: UpdateJobInfoDto) {
    return this.jobInfoService.update(id, updateJobInfoDto);
  }

  // 切换岗位状态
  @Patch(':id/toggle-status')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  toggleStatus(@Param('id') id: string) {
    return this.jobInfoService.toggleStatus(id);
  }

  // 删除单个岗位信息
  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  remove(@Param('id') id: string) {
    return this.jobInfoService.remove(id);
  }

  // 批量删除岗位信息
  @Delete('batch/remove')
  // @Roles(RoleType.ADMIN, RoleType.OWNER)
  batchRemove(@Body() batchDeleteJobInfoDto: BatchDeleteJobInfoDto) {
    return this.jobInfoService.batchRemove(batchDeleteJobInfoDto);
  }

  // 清理过期岗位数据
  @Delete('cleanup/expired')
  // @Roles(RoleType.ADMIN, RoleType.OWNER)
  cleanupExpiredJobs(@Query('hours') hours?: string) {
    const hoursAgo = hours ? parseInt(hours) : 48;
    return this.jobInfoService.cleanupExpiredJobs(hoursAgo);
  }

  // 清理不活跃的过期岗位数据
  @Delete('cleanup/inactive-expired')
  // @Roles(RoleType.ADMIN, RoleType.OWNER)
  cleanupInactiveExpiredJobs(@Query('hours') hours?: string) {
    const hoursAgo = hours ? parseInt(hours) : 48;
    return this.jobInfoService.cleanupInactiveExpiredJobs(hoursAgo);
  }

  // 获取即将过期的数据统计
  @Get('stats/expiring')
  getExpiringJobsStats(@Query('hours') hours?: string) {
    const hoursAgo = hours ? parseInt(hours) : 48;
    return this.jobInfoService.getExpiringJobsStats(hoursAgo);
  }
}
