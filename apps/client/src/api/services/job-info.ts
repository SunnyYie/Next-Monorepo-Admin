import apiClient from '../api-client';

export interface JobInfo {
  id: string;
  jobName: string;
  salaryDesc: string;
  jobLabels: string[];
  jobValidStatus: number;
  iconWord?: string;
  skills: string[];
  jobDegree?: string;
  cityName?: string;
  brandName: string;
  brandIndustry?: string;
  brandScaleName?: string;
  welfareList: string[];
  source?: string;
  dataDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobInfoData {
  jobName: string;
  salaryDesc: string;
  jobLabels: string[];
  jobValidStatus: number;
  iconWord?: string;
  skills: string[];
  jobDegree?: string;
  cityName?: string;
  brandName: string;
  brandIndustry?: string;
  brandScaleName?: string;
  welfareList: string[];
  source?: string;
  dataDate?: string;
  isActive?: boolean;
}

export interface UpdateJobInfoData extends Partial<CreateJobInfoData> {}

export interface QueryJobInfoParams {
  jobName?: string;
  brandName?: string;
  cityName?: string;
  brandIndustry?: string;
  salaryMin?: string;
  salaryMax?: string;
  isActive?: boolean;
  source?: string;
  dataDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobInfoListResponse {
  data: JobInfo[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CompanyJobCount {
  brandName: string;
  count: number;
}

export interface IndustryJobCount {
  brandIndustry: string;
  count: number;
}

export interface CityJobCount {
  cityName: string;
  count: number;
}

// 岗位信息 API 服务
export class JobInfoService {
  // 创建岗位信息
  static async createJobInfo(data: CreateJobInfoData): Promise<JobInfo> {
    return await apiClient.post<JobInfo>({
      url: '/job-info',
      data,
    });
  }

  // 批量创建岗位信息
  static async batchCreateJobInfo(
    jobs: CreateJobInfoData[]
  ): Promise<{ message: string; count: number }> {
    return await apiClient.post<{ message: string; count: number }>({
      url: '/job-info/batch',
      data: { jobs },
    });
  }

  // 分页查询岗位信息
  static async getJobInfoList(
    params: QueryJobInfoParams = {}
  ): Promise<JobInfoListResponse> {
    return await apiClient.get<JobInfoListResponse>({
      url: '/job-info',
      params,
    });
  }

  // 根据ID查询岗位信息
  static async getJobInfoById(id: string): Promise<JobInfo> {
    return await apiClient.get<JobInfo>({
      url: `/job-info/${id}`,
    });
  }

  // 更新岗位信息
  static async updateJobInfo(
    id: string,
    data: UpdateJobInfoData
  ): Promise<JobInfo> {
    return await apiClient.put<JobInfo>({
      url: `/job-info/${id}`,
      data,
    });
  }

  // 切换岗位状态
  static async toggleJobInfoStatus(id: string): Promise<JobInfo> {
    return await apiClient.put<JobInfo>({
      url: `/job-info/${id}/toggle-status`,
    });
  }

  // 删除岗位信息
  static async deleteJobInfo(id: string): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>({
      url: `/job-info/${id}`,
    });
  }

  // 批量删除岗位信息
  static async batchDeleteJobInfo(
    ids: string[]
  ): Promise<{ message: string; count: number }> {
    return await apiClient.delete<{ message: string; count: number }>({
      url: '/job-info/batch/remove',
      data: { ids },
    });
  }

  // 获取公司岗位统计
  static async getJobCountByCompany(): Promise<CompanyJobCount[]> {
    return await apiClient.get<CompanyJobCount[]>({
      url: '/job-info/stats/company',
    });
  }

  // 获取行业岗位统计
  static async getJobCountByIndustry(): Promise<IndustryJobCount[]> {
    return await apiClient.get<IndustryJobCount[]>({
      url: '/job-info/stats/industry',
    });
  }

  // 获取城市岗位统计
  static async getJobCountByCity(): Promise<CityJobCount[]> {
    return await apiClient.get<CityJobCount[]>({
      url: '/job-info/stats/city',
    });
  }
}
