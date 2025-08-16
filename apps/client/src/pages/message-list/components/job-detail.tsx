import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { JobInfoService } from '@/api/services/job-info';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building, MapPin, Calendar, DollarSign, GraduationCap, Briefcase } from 'lucide-react';
import CircleLoading from '@/components/common/circle-loading';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: jobInfo, isLoading, error } = useQuery({
    queryKey: ['job-info', id],
    queryFn: () => JobInfoService.getJobInfoById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <CircleLoading />;
  }

  if (error || !jobInfo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">岗位信息不存在</h1>
            <Button onClick={() => navigate('/message-list/recruit')}>
              返回列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/message-list/recruit')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          <h1 className="text-3xl font-bold">{jobInfo.jobName}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium mr-2">公司:</span>
                <span>{jobInfo.brandName}</span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium mr-2">薪资:</span>
                <span className="text-green-600 font-semibold">{jobInfo.salaryDesc}</span>
              </div>

              {jobInfo.cityName && (
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium mr-2">城市:</span>
                  <span>{jobInfo.cityName}</span>
                </div>
              )}

              {jobInfo.jobDegree && (
                <div className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium mr-2">学历要求:</span>
                  <span>{jobInfo.jobDegree}</span>
                </div>
              )}

              {jobInfo.dataDate && (
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium mr-2">发布日期:</span>
                  <span>{jobInfo.dataDate}</span>
                </div>
              )}

              {jobInfo.source && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">来源:</span>
                  <span>{jobInfo.source}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 公司信息 */}
          <Card>
            <CardHeader>
              <CardTitle>公司信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium mr-2">公司名称:</span>
                <span>{jobInfo.brandName}</span>
              </div>
              
              {jobInfo.brandIndustry && (
                <div>
                  <span className="font-medium mr-2">行业:</span>
                  <span>{jobInfo.brandIndustry}</span>
                </div>
              )}

              {jobInfo.brandScaleName && (
                <div>
                  <span className="font-medium mr-2">公司规模:</span>
                  <span>{jobInfo.brandScaleName}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 岗位标签 */}
          <Card>
            <CardHeader>
              <CardTitle>岗位标签</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jobInfo.jobLabels.map((label, index) => (
                  <Badge key={index} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 技能要求 */}
          <Card>
            <CardHeader>
              <CardTitle>技能要求</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jobInfo.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 福利待遇 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>福利待遇</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jobInfo.welfareList.map((welfare, index) => (
                  <Badge key={index} variant="default" className="bg-blue-100 text-blue-800 border-blue-300">
                    {welfare}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 状态信息 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>状态信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium mr-2">岗位状态:</span>
                <Badge variant={jobInfo.isActive ? "default" : "secondary"}>
                  {jobInfo.isActive ? "活跃" : "不活跃"}
                </Badge>
              </div>
              <div>
                <span className="font-medium mr-2">有效状态:</span>
                <Badge variant={jobInfo.jobValidStatus === 1 ? "default" : "destructive"}>
                  {jobInfo.jobValidStatus === 1 ? "有效" : "无效"}
                </Badge>
              </div>
              <div>
                <span className="font-medium mr-2">创建时间:</span>
                <span>{new Date(jobInfo.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium mr-2">更新时间:</span>
                <span>{new Date(jobInfo.updatedAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
