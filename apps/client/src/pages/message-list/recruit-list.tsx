import { RecruitmentDashboard } from './components/recruitment-dashboard';
// 影刀rpa批量跑数据

export default function RecruitList() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          招聘数据管理平台
        </h1>
        <RecruitmentDashboard />
      </div>
    </div>
  );
}