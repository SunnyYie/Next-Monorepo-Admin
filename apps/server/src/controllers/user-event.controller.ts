import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Delete,
  UseGuards,
  Request,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UserEventService } from '../services/user-event.service';
import {
  CreateUserEventDto,
  UserEventQueryDto,
  UserEventStatsDto,
  BatchCreateUserEventDto,
} from '../dto/user-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators';
import { RoleType } from '../../generated/prisma';

@ApiTags('用户埋点管理')
@Controller('user-events')
export class UserEventController {
  private readonly logger = new Logger(UserEventController.name);

  constructor(private readonly userEventService: UserEventService) {}

  @Post()
  @ApiOperation({ summary: '创建用户事件' })
  @ApiResponse({ status: 201, description: '事件创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async createEvent(@Body() createUserEventDto: CreateUserEventDto) {
    try {
      const result =
        await this.userEventService.createEvent(createUserEventDto);
      return {
        code: HttpStatus.CREATED,
        message: '事件创建成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`创建用户事件失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: '创建用户事件失败',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('batch')
  @ApiOperation({ summary: '批量创建用户事件' })
  @ApiResponse({ status: 201, description: '批量事件创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async createBatchEvents(
    @Body() batchCreateUserEventDto: BatchCreateUserEventDto,
  ) {
    try {
      const result = await this.userEventService.createBatchEvents(
        batchCreateUserEventDto,
      );
      return {
        code: HttpStatus.CREATED,
        message: '批量事件创建成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`批量创建用户事件失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: '批量创建用户事件失败',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '查询用户事件列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findEvents(@Query() query: UserEventQueryDto) {
    try {
      const result = await this.userEventService.findEvents(query);
      return {
        code: HttpStatus.OK,
        message: '查询成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`查询用户事件失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '查询用户事件失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取用户事件统计' })
  @ApiResponse({ status: 200, description: '获取统计成功' })
  async getEventStats(@Query() query: UserEventStatsDto) {
    try {
      const result = await this.userEventService.getEventStats(query);
      return {
        code: HttpStatus.OK,
        message: '获取统计成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`获取用户事件统计失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '获取用户事件统计失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('session-analysis/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取用户会话分析' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiQuery({ name: 'sessionId', description: '会话ID', required: false })
  @ApiResponse({ status: 200, description: '获取会话分析成功' })
  async getUserSessionAnalysis(
    @Param('userId') userId: string,
    @Query('sessionId') sessionId?: string,
  ) {
    try {
      const result = await this.userEventService.getUserSessionAnalysis(
        userId,
        sessionId,
      );
      return {
        code: HttpStatus.OK,
        message: '获取会话分析成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`获取用户会话分析失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '获取用户会话分析失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('page-performance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取页面性能统计' })
  @ApiQuery({ name: 'pagePath', description: '页面路径', required: false })
  @ApiResponse({ status: 200, description: '获取页面性能统计成功' })
  async getPagePerformanceStats(@Query('pagePath') pagePath?: string) {
    try {
      const result =
        await this.userEventService.getPagePerformanceStats(pagePath);
      return {
        code: HttpStatus.OK,
        message: '获取页面性能统计成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`获取页面性能统计失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '获取页面性能统计失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('cleanup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '清理过期事件数据' })
  @ApiQuery({ name: 'days', description: '保留天数', required: false })
  @ApiResponse({ status: 200, description: '清理成功' })
  async cleanupOldEvents(@Query('days') days?: string) {
    try {
      const daysToKeep = days ? parseInt(days, 10) : 90;
      if (isNaN(daysToKeep) || daysToKeep < 1) {
        throw new Error('保留天数必须是大于0的整数');
      }

      const result = await this.userEventService.cleanupOldEvents(daysToKeep);
      return {
        code: HttpStatus.OK,
        message: '清理成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`清理过期事件数据失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: '清理过期事件数据失败',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取当前用户的事件记录' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getMyEvents(@Request() req, @Query() query: UserEventQueryDto) {
    try {
      const userId = req.user.id;
      const queryWithUserId = { ...query, userId };
      const result = await this.userEventService.findEvents(queryWithUserId);
      return {
        code: HttpStatus.OK,
        message: '查询成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`获取用户事件记录失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '获取用户事件记录失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('my-session-analysis')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取当前用户的会话分析' })
  @ApiQuery({ name: 'sessionId', description: '会话ID', required: false })
  @ApiResponse({ status: 200, description: '获取会话分析成功' })
  async getMySessionAnalysis(
    @Request() req,
    @Query('sessionId') sessionId?: string,
  ) {
    try {
      const userId = req.user.id;
      const result = await this.userEventService.getUserSessionAnalysis(
        userId,
        sessionId,
      );
      return {
        code: HttpStatus.OK,
        message: '获取会话分析成功',
        data: result,
      };
    } catch (error) {
      this.logger.error(`获取用户会话分析失败: ${error.message}`);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '获取用户会话分析失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
