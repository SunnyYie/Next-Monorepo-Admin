import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserEvent, EventStats, EventType } from '@/types/user-event';

const UserEventList = () => {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    eventType: '',
    pagePath: '',
    startTime: '',
    endTime: '',
    page: 1,
    pageSize: 20,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 0,
    pageSize: 20,
    totalPages: 0,
  });

  // 获取事件列表
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/user-events?${queryParams}`);
      const result = await response.json();

      if (result.code === 200) {
        setEvents(result.data.data);
        setPagination({
          total: result.data.total,
          page: result.data.page,
          pageSize: result.data.pageSize,
          totalPages: result.data.totalPages,
        });
      }
    } catch (error) {
      console.error('获取事件列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.startTime) queryParams.append('startTime', filters.startTime);
      if (filters.endTime) queryParams.append('endTime', filters.endTime);

      const response = await fetch(`/api/user-events/stats?${queryParams}`);
      const result = await response.json();

      if (result.code === 200) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatEventType = (eventType: string) => {
    const typeLabels: Record<string, string> = {
      [EventType.PAGE_VIEW]: '页面访问',
      [EventType.PAGE_LEAVE]: '页面离开',
      [EventType.BUTTON_CLICK]: '按钮点击',
      [EventType.LINK_CLICK]: '链接点击',
      [EventType.FORM_SUBMIT]: '表单提交',
      [EventType.API_REQUEST]: 'API请求',
      [EventType.ERROR]: '错误',
      [EventType.CUSTOM]: '自定义',
    };
    return typeLabels[eventType] || eventType;
  };

  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      [EventType.PAGE_VIEW]: 'bg-blue-100 text-blue-800',
      [EventType.PAGE_LEAVE]: 'bg-gray-100 text-gray-800',
      [EventType.BUTTON_CLICK]: 'bg-green-100 text-green-800',
      [EventType.LINK_CLICK]: 'bg-purple-100 text-purple-800',
      [EventType.FORM_SUBMIT]: 'bg-yellow-100 text-yellow-800',
      [EventType.API_REQUEST]: 'bg-indigo-100 text-indigo-800',
      [EventType.ERROR]: 'bg-red-100 text-red-800',
      [EventType.CUSTOM]: 'bg-pink-100 text-pink-800',
    };
    return colors[eventType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`space-y-6`}>
      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总事件数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.summary.totalEvents}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">独立用户数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.summary.uniqueUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">最活跃页面</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {stats.pageStats[0]?.pagePath || '暂无数据'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">主要浏览器</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {stats.browserStats[0]?.browser || '暂无数据'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 过滤器 */}
      <Card>
        <CardHeader>
          <CardTitle>过滤条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="userId">用户ID</Label>
              <Input
                id="userId"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                placeholder="输入用户ID"
              />
            </div>
            <div>
              <Label htmlFor="eventType">事件类型</Label>
              <select
                id="eventType"
                value={filters.eventType}
                onChange={(e) =>
                  handleFilterChange('eventType', e.target.value)
                }
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">全部</option>
                {Object.values(EventType).map((type) => (
                  <option key={type} value={type}>
                    {formatEventType(type)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="pagePath">页面路径</Label>
              <Input
                id="pagePath"
                value={filters.pagePath}
                onChange={(e) => handleFilterChange('pagePath', e.target.value)}
                placeholder="输入页面路径"
              />
            </div>
            <div>
              <Label htmlFor="startTime">开始时间</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={filters.startTime}
                onChange={(e) =>
                  handleFilterChange('startTime', e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="endTime">结束时间</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={filters.endTime}
                onChange={(e) => handleFilterChange('endTime', e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFilters({
                    userId: '',
                    eventType: '',
                    pagePath: '',
                    startTime: '',
                    endTime: '',
                    page: 1,
                    pageSize: 20,
                  });
                }}
              >
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 事件列表 */}
      <Card>
        <CardHeader>
          <CardTitle>事件列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead>事件类型</TableHead>
                  <TableHead>页面</TableHead>
                  <TableHead>元素</TableHead>
                  <TableHead>浏览器</TableHead>
                  <TableHead>持续时间</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        {new Date(event.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.userName}</div>
                          <div className="text-xs text-gray-500">
                            {event.userId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEventTypeColor(event.eventType)}>
                          {formatEventType(event.eventType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {event.pageTitle || '未知'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.pagePath}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.elementText && (
                          <div>
                            <div className="font-medium">
                              {event.elementText}
                            </div>
                            <div className="text-xs text-gray-500">
                              {event.elementType}{' '}
                              {event.elementId && `#${event.elementId}`}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {event.browser && (
                          <div>
                            <div className="font-medium">{event.browser}</div>
                            <div className="text-xs text-gray-500">
                              {event.platform}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {event.duration &&
                          `${(event.duration / 1000).toFixed(1)}s`}
                        {event.responseTime && `${event.responseTime}ms`}
                      </TableCell>
                      <TableCell>
                        {event.statusCode && (
                          <Badge
                            variant={
                              event.statusCode >= 400
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {event.statusCode}
                          </Badge>
                        )}
                        {event.errorMessage && (
                          <Badge variant="destructive">错误</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                共 {pagination.total} 条记录，第 {pagination.page} /{' '}
                {pagination.totalPages} 页
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserEventList;
