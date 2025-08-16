import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  JobInfoService,
  type CreateJobInfoData,
} from '@/api/services/job-info';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import jsonData from '../data/8.16_filtered.json';

interface ImportResult {
  success: boolean;
  message: string;
  count?: number;
}

export default function DataImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (jobs: CreateJobInfoData[]) => {
      return await JobInfoService.batchCreateJobInfo(jobs);
    },
    onSuccess: (data) => {
      setImportResult({
        success: true,
        message: `成功导入 ${data.count} 条招聘数据`,
        count: data.count,
      });
      toast.success(`成功导入 ${data.count} 条招聘数据`);
      queryClient.invalidateQueries({ queryKey: ['job-list'] });
    },
    onError: (error: any) => {
      setImportResult({
        success: false,
        message: error?.message || '导入失败',
      });
      toast.error(error?.message || '导入失败');
    },
    onSettled: () => {
      setIsImporting(false);
    },
  });

  const handleImportData = async () => {
    try {
      setIsImporting(true);
      setImportResult(null);

      // 转换 JSON 数据为 CreateJobInfoData 格式
      const jobsToImport: CreateJobInfoData[] = jsonData.map((item: any) => ({
        jobName: item.jobName,
        salaryDesc: item.salaryDesc,
        jobLabels: item.jobLabels || [],
        jobValidStatus: item.jobValidStatus || 1,
        iconWord: item.iconWord || '',
        skills: item.skills || [],
        jobDegree: item.jobDegree || '',
        cityName: item.cityName || '',
        brandName: item.brandName,
        brandIndustry: item.brandIndustry || '',
        brandScaleName: item.brandScaleName || '',
        welfareList: item.welfareList || [],
        source: item.source || '',
        dataDate: item.dataDate || '',
        isActive: item.isActive !== undefined ? item.isActive : true,
      }));

      await importMutation.mutateAsync(jobsToImport);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          导入招聘数据
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>准备导入 {jsonData.length} 条招聘数据</p>
          <p>数据来源：8.16_filtered.json</p>
        </div>

        {importResult && (
          <div
            className={`p-4 rounded-md border ${
              importResult.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {importResult.success ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <AlertCircle className="mr-2 h-4 w-4" />
              )}
              <span>{importResult.message}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleImportData}
            disabled={isImporting || importMutation.isPending}
            className="flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isImporting ? '导入中...' : '开始导入'}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>注意：</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>导入过程中请勿关闭页面</li>
            <li>重复导入可能会创建重复数据</li>
            <li>导入完成后会自动刷新列表</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
