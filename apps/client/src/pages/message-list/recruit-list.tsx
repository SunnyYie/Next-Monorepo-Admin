import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import {
  JobInfoService,
  type JobInfo,
  type QueryJobInfoParams,
} from '@/api/services/job-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Eye,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import CircleLoading from '@/components/common/circle-loading';
import DataImport from './components/data-import';
import companyList from './types';

interface FilterState {
  jobName: string;
  cityName: string;
  dataDate: string;
  salaryMin: string;
  salaryMax: string;
  brandName: string;
}

export default function RecruitList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<FilterState>({
    jobName: '',
    cityName: '',
    dataDate: '',
    salaryMin: '',
    salaryMax: '',
    brandName: '',
  });

  // 构建查询参数
  const queryParams = useMemo((): QueryJobInfoParams => {
    const params: QueryJobInfoParams = {
      page: currentPage,
      pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    if (filters.jobName.trim()) {
      params.jobName = filters.jobName.trim();
    }
    if (filters.cityName.trim()) {
      params.cityName = filters.cityName.trim();
    }
    if (filters.dataDate.trim()) {
      params.dataDate = filters.dataDate.trim();
    }
    if (filters.salaryMin.trim()) {
      params.salaryMin = filters.salaryMin.trim();
    }
    if (filters.salaryMax.trim()) {
      params.salaryMax = filters.salaryMax.trim();
    }
    if (filters.brandName.trim()) {
      params.brandName = filters.brandName.trim();
    }

    return params;
  }, [currentPage, pageSize, filters]);

  // 查询岗位列表
  const {
    data: jobListData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['job-list', queryParams],
    queryFn: () => JobInfoService.getJobInfoList(queryParams),
  });

  // 删除岗位信息
  const deleteMutation = useMutation({
    mutationFn: JobInfoService.deleteJobInfo,
    onSuccess: () => {
      toast.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['job-list'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || '删除失败');
    },
  });

  // 处理筛选器变化
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // 重置到第一页
  };

  // 清空筛选器
  const clearFilters = () => {
    setFilters({
      jobName: '',
      cityName: '',
      dataDate: '',
      salaryMin: '',
      salaryMax: '',
      brandName: '',
    });
    setCurrentPage(1);
  };

  // 查看详情
  const handleViewDetail = (jobId: string) => {
    navigate(`/message-list/recruit/${jobId}`);
  };

  // 删除岗位
  const handleDelete = (jobId: string, jobName: string) => {
    if (window.confirm(`确定要删除岗位"${jobName}"吗？`)) {
      deleteMutation.mutate(jobId);
    }
  };

  // 获取公司标签颜色
  const getCompanyTagColor = (brandName: string) => {
    const company = companyList[brandName as keyof typeof companyList];
    return company?.color || '#6B7280';
  };

  // 渲染薪资
  const renderSalary = (salaryDesc: string) => {
    return (
      <div className="flex items-center text-green-600 font-semibold">
        <DollarSign className="mr-1 h-3 w-3" />
        {salaryDesc}
      </div>
    );
  };

  if (isLoading) {
    return <CircleLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">加载失败</h1>
            <p className="text-muted-foreground mb-4">
              {(error as any)?.message || '获取数据时发生错误'}
            </p>
            <Button onClick={() => window.location.reload()}>重新加载</Button>
          </div>
        </div>
      </div>
    );
  }

  const jobList = jobListData?.data || [];
  const pagination = jobListData?.pagination;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">招聘数据管理平台</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  导入数据
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>导入招聘数据</DialogTitle>
                </DialogHeader>
                <DataImport />
              </DialogContent>
            </Dialog>
          </div>

          {/* 筛选器 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                筛选条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* 岗位名称 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">岗位名称</label>
                  <Input
                    placeholder="搜索岗位名称..."
                    value={filters.jobName}
                    onChange={(e) =>
                      handleFilterChange('jobName', e.target.value)
                    }
                  />
                </div>

                {/* 城市 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">城市</label>
                  <Input
                    placeholder="搜索城市..."
                    value={filters.cityName}
                    onChange={(e) =>
                      handleFilterChange('cityName', e.target.value)
                    }
                  />
                </div>

                {/* 发布日期 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">发布日期</label>
                  <Input
                    type="date"
                    value={filters.dataDate}
                    onChange={(e) =>
                      handleFilterChange('dataDate', e.target.value)
                    }
                  />
                </div>

                {/* 公司名称 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">公司名称</label>
                  <Select
                    value={filters.brandName || 'all'}
                    onValueChange={(value) =>
                      handleFilterChange(
                        'brandName',
                        value === 'all' ? '' : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择公司..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部公司</SelectItem>
                      {Object.keys(companyList).map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 最低薪资 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">最低薪资 (K)</label>
                  <Input
                    type="number"
                    placeholder="如: 15"
                    value={filters.salaryMin}
                    onChange={(e) =>
                      handleFilterChange('salaryMin', e.target.value)
                    }
                  />
                </div>

                {/* 最高薪资 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">最高薪资 (K)</label>
                  <Input
                    type="number"
                    placeholder="如: 30"
                    value={filters.salaryMax}
                    onChange={(e) =>
                      handleFilterChange('salaryMax', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  清空筛选
                </Button>
                <Button className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 统计信息 */}
          {pagination && (
            <div className="mb-4 text-sm text-muted-foreground">
              共找到 {pagination.total} 条记录，第 {pagination.page} /{' '}
              {pagination.totalPages} 页
            </div>
          )}

          {/* 数据表格 */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>岗位名称</TableHead>
                    <TableHead>薪资</TableHead>
                    <TableHead>城市</TableHead>
                    <TableHead>公司</TableHead>
                    <TableHead>发布日期</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobList.map((job: JobInfo) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          <div
                            className="max-w-xs truncate"
                            title={job.jobName}
                          >
                            {job.jobName}
                          </div>
                        </TableCell>
                        <TableCell>{renderSalary(job.salaryDesc)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                            {job.cityName || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: getCompanyTagColor(
                                job.brandName
                              ),
                              color: 'white',
                            }}
                          >
                            <Building className="mr-1 h-3 w-3" />
                            {job.brandName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                            {job.dataDate || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetail(job.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(job.id, job.jobName)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 分页 */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                显示第 {(pagination.page - 1) * pagination.pageSize + 1} -{' '}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                )}{' '}
                条，共 {pagination.total} 条记录
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
                <span className="text-sm">
                  第 {pagination.page} / {pagination.totalPages} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
