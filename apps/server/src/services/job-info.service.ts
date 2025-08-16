import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreateJobInfoDto,
  UpdateJobInfoDto,
  QueryJobInfoDto,
  BatchCreateJobInfoDto,
  BatchDeleteJobInfoDto,
} from '../dto/job-info.dto';

@Injectable()
export class JobInfoService {
  constructor(private prisma: PrismaService) {}

  // 创建单个岗位信息
  async create(createJobInfoDto: CreateJobInfoDto) {
    try {
      return await this.prisma.jobInfo.create({
        data: createJobInfoDto,
      });
    } catch (error) {
      throw new BadRequestException('创建岗位信息失败');
    }
  }

  // 批量创建岗位信息
  async batchCreate(batchCreateJobInfoDto: BatchCreateJobInfoDto) {
    try {
      const result = await this.prisma.jobInfo.createMany({
        data: batchCreateJobInfoDto.jobs,
        skipDuplicates: true,
      });
      return {
        message: '批量创建成功',
        count: result.count,
      };
    } catch (error) {
      console.log('批量创建岗位信息失败:', error);
      throw new BadRequestException('批量创建岗位信息失败');
    }
  }

  // 分页查询岗位信息
  async findMany(queryJobInfoDto: QueryJobInfoDto) {
    const {
      jobName,
      brandName,
      cityName,
      brandIndustry,
      salaryMin,
      salaryMax,
      isActive,
      source,
      dataDate,
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryJobInfoDto;

    // 构建 where 条件
    const where: any = {};

    if (jobName) {
      where.jobName = {
        contains: jobName,
        mode: 'insensitive',
      };
    }

    if (brandName) {
      where.brandName = {
        contains: brandName,
        mode: 'insensitive',
      };
    }

    if (cityName) {
      where.cityName = {
        contains: cityName,
        mode: 'insensitive',
      };
    }

    if (brandIndustry) {
      where.brandIndustry = {
        contains: brandIndustry,
        mode: 'insensitive',
      };
    }

    if (source) {
      where.source = source;
    }

    if (dataDate) {
      where.dataDate = dataDate;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    // 薪资范围过滤（简单实现，可以根据需要优化）
    if (salaryMin || salaryMax) {
      // 这里可以添加更复杂的薪资过滤逻辑
      // 目前简单按字符串匹配
    }

    // 计算偏移量
    const skip = (page - 1) * pageSize;

    // 构建排序条件
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    try {
      const [jobs, total] = await Promise.all([
        this.prisma.jobInfo.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
        }),
        this.prisma.jobInfo.count({ where }),
      ]);

      return {
        data: jobs,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      throw new BadRequestException('查询岗位信息失败');
    }
  }

  // 根据ID查询单个岗位信息
  async findOne(id: string) {
    const jobInfo = await this.prisma.jobInfo.findUnique({
      where: { id },
    });

    if (!jobInfo) {
      throw new NotFoundException('岗位信息不存在');
    }

    return jobInfo;
  }

  // 更新岗位信息
  async update(id: string, updateJobInfoDto: UpdateJobInfoDto) {
    await this.findOne(id); // 检查是否存在

    try {
      return await this.prisma.jobInfo.update({
        where: { id },
        data: updateJobInfoDto,
      });
    } catch (error) {
      throw new BadRequestException('更新岗位信息失败');
    }
  }

  // 删除单个岗位信息
  async remove(id: string) {
    await this.findOne(id); // 检查是否存在

    try {
      await this.prisma.jobInfo.delete({
        where: { id },
      });
      return { message: '删除成功' };
    } catch (error) {
      throw new BadRequestException('删除岗位信息失败');
    }
  }

  // 批量删除岗位信息
  async batchRemove(batchDeleteJobInfoDto: BatchDeleteJobInfoDto) {
    const { ids } = batchDeleteJobInfoDto;

    try {
      const result = await this.prisma.jobInfo.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return {
        message: '批量删除成功',
        count: result.count,
      };
    } catch (error) {
      throw new BadRequestException('批量删除岗位信息失败');
    }
  }

  // 根据公司名称统计岗位数量
  async getJobCountByCompany() {
    try {
      const result = await this.prisma.jobInfo.groupBy({
        by: ['brandName'],
        where: {
          isActive: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });

      return result.map((item) => ({
        brandName: item.brandName,
        count: item._count.id,
      }));
    } catch (error) {
      throw new BadRequestException('统计公司岗位数量失败');
    }
  }

  // 根据行业统计岗位数量
  async getJobCountByIndustry() {
    try {
      const result = await this.prisma.jobInfo.groupBy({
        by: ['brandIndustry'],
        where: {
          isActive: true,
          brandIndustry: {
            not: null,
          },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });

      return result.map((item) => ({
        brandIndustry: item.brandIndustry,
        count: item._count.id,
      }));
    } catch (error) {
      throw new BadRequestException('统计行业岗位数量失败');
    }
  }

  // 根据城市统计岗位数量
  async getJobCountByCity() {
    try {
      const result = await this.prisma.jobInfo.groupBy({
        by: ['cityName'],
        where: {
          isActive: true,
          cityName: {
            not: null,
          },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });

      return result.map((item) => ({
        cityName: item.cityName,
        count: item._count.id,
      }));
    } catch (error) {
      throw new BadRequestException('统计城市岗位数量失败');
    }
  }

  // 切换岗位状态
  async toggleStatus(id: string) {
    const jobInfo = await this.findOne(id);

    try {
      return await this.prisma.jobInfo.update({
        where: { id },
        data: {
          isActive: !jobInfo.isActive,
        },
      });
    } catch (error) {
      throw new BadRequestException('切换岗位状态失败');
    }
  }
}
