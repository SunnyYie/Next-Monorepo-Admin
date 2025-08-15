import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Search, Filter } from 'lucide-react';
import type { JobData } from './recruitment-dashboard';

interface DataTableProps {
  data: JobData[];
  appName: string;
  onLogout: () => void;
  isLoading: boolean;
}

export function DataTable({
  data,
  appName,
  onLogout,
  isLoading,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [educationFilter, setEducationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('publishDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 获取唯一的筛选选项
  const uniqueLocations = useMemo(
    () => Array.from(new Set(data.map((job) => job.location))).sort(),
    [data]
  );

  const uniqueExperiences = useMemo(
    () => Array.from(new Set(data.map((job) => job.experience))).sort(),
    [data]
  );

  const uniqueEducations = useMemo(
    () => Array.from(new Set(data.map((job) => job.education))).sort(),
    [data]
  );

  // 过滤和排序数据
  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        locationFilter === 'all' || job.location === locationFilter;
      const matchesExperience =
        experienceFilter === 'all' || job.experience === experienceFilter;
      const matchesEducation =
        educationFilter === 'all' || job.education === educationFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesExperience &&
        matchesEducation
      );
    });

    // 排序
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof JobData];
      let bValue: string | number = b[sortBy as keyof JobData];

      if (sortBy === 'publishDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    data,
    searchTerm,
    locationFilter,
    experienceFilter,
    educationFilter,
    sortBy,
    sortOrder,
  ]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">正在获取招聘数据...</p>
          <p className="text-sm text-muted-foreground">
            请稍候，这可能需要几秒钟
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {appName} - 共 {data.length} 条数据
          </Badge>
          {filteredAndSortedData.length !== data.length && (
            <Badge variant="outline" className="text-sm">
              筛选后 {filteredAndSortedData.length} 条
            </Badge>
          )}
        </div>
        <Button variant="outline" onClick={onLogout} size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>

      {/* 筛选器 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            数据筛选
          </CardTitle>
          <CardDescription>根据不同条件筛选招聘数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">搜索</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="职位或公司名称"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>工作地点</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="选择地点" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部地点</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>工作经验</Label>
              <Select
                value={experienceFilter}
                onValueChange={setExperienceFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择经验" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部经验</SelectItem>
                  {uniqueExperiences.map((experience) => (
                    <SelectItem key={experience} value={experience}>
                      {experience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>学历要求</Label>
              <Select
                value={educationFilter}
                onValueChange={setEducationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择学历" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部学历</SelectItem>
                  {uniqueEducations.map((education) => (
                    <SelectItem key={education} value={education}>
                      {education}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>排序方式</Label>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publishDate-desc">发布时间 ↓</SelectItem>
                  <SelectItem value="publishDate-asc">发布时间 ↑</SelectItem>
                  <SelectItem value="title-asc">职位名称 ↑</SelectItem>
                  <SelectItem value="title-desc">职位名称 ↓</SelectItem>
                  <SelectItem value="company-asc">公司名称 ↑</SelectItem>
                  <SelectItem value="company-desc">公司名称 ↓</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card>
        <CardHeader>
          <CardTitle>招聘数据</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('title')}
                  >
                    职位名称{' '}
                    {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('company')}
                  >
                    公司名称{' '}
                    {sortBy === 'company' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>工作地点</TableHead>
                  <TableHead>薪资范围</TableHead>
                  <TableHead>工作经验</TableHead>
                  <TableHead>学历要求</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('publishDate')}
                  >
                    发布日期{' '}
                    {sortBy === 'publishDate' &&
                      (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      没有找到符合条件的数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((job) => (
                    <TableRow key={job.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.location}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {job.salary}
                      </TableCell>
                      <TableCell>{job.experience}</TableCell>
                      <TableCell>{job.education}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {job.publishDate}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
