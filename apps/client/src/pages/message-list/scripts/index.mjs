import fs from 'fs';

// API 配置
const API_BASE_URL = 'http://localhost:3001'; // 根据你的后端服务地址调整
const API_TOKEN = ''; // 如果需要认证token，在这里设置

// 生成随机颜色
function generateRandomColor() {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
    '#F1948A',
    '#85C1E9',
    '#D7BDE2',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 读取现有的公司统计数据
function readCompanyStats() {
  const typesPath = '../types.ts';
  try {
    const content = fs.readFileSync(typesPath, 'utf8');
    // 解析 TypeScript 文件中的 const list 对象
    const listMatch = content.match(/const list = ({[\s\S]*?});/);
    if (listMatch) {
      // 将 TypeScript 对象转换为 JSON 可解析的格式
      const objectStr = listMatch[1]
        .replace(/(\w+):/g, '"$1":') // 给属性名加引号
        .replace(/'/g, '"'); // 将单引号替换为双引号
      return JSON.parse(objectStr);
    }
  } catch (error) {
    console.log('读取types文件失败，将创建新的统计数据');
  }
  return {};
}

// 写入公司统计数据到types文件
function writeCompanyStats(companyStats) {
  const typesPath = '../types.ts';
  let content = 'const list = {\n';

  for (const [company, data] of Object.entries(companyStats)) {
    content += `  ${company}: {\n`;
    content += `    count: ${data.count},\n`;
    content += `    color: '${data.color}',\n`;
    content += `  },\n`;
  }

  content += '};\n\nexport default list;';

  fs.writeFileSync(typesPath, content, 'utf8');
}

// 检查公司规模是否小于100人
function isSmallCompany(brandScaleName) {
  if (!brandScaleName) return false;

  // 匹配各种小公司规模格式
  const smallScalePatterns = [
    /^(\d+)-(\d+)人$/, // 匹配 "20-99人" 格式
    /^少于(\d+)人$/, // 匹配 "少于100人" 格式
    /^(\d+)人以下$/, // 匹配 "100人以下" 格式
  ];

  for (const pattern of smallScalePatterns) {
    const match = brandScaleName.match(pattern);
    if (match) {
      const numbers = match
        .slice(1)
        .map((num) => parseInt(num))
        .filter((n) => !isNaN(n));
      // 如果最大值小于100，认为是小公司
      if (numbers.length > 0 && Math.max(...numbers) < 100) {
        return true;
      }
    }
  }

  return false;
}

// 检查是否为政府/公共事业/学术/科研相关行业
function isGovernmentOrAcademicIndustry(brandIndustry) {
  if (!brandIndustry) return false;

  const excludedIndustryKeywords = ['政府', '公共事业', '学术', '科研'];
  return excludedIndustryKeywords.some((keyword) =>
    brandIndustry.includes(keyword)
  );
}

// 解析薪资描述，获取最低薪资
function getMinSalary(salaryDesc) {
  if (!salaryDesc) return 0;

  // 匹配薪资格式，如 "15-28K"、"12-20K"等
  const salaryMatch = salaryDesc.match(/(\d+)-\d+K/);
  if (salaryMatch) {
    return parseInt(salaryMatch[1]);
  }

  // 匹配单一薪资格式，如 "15K"
  const singleSalaryMatch = salaryDesc.match(/(\d+)K/);
  if (singleSalaryMatch) {
    return parseInt(singleSalaryMatch[1]);
  }

  return 0;
}

// 检查职位是否应该被过滤掉
function shouldFilterOut(jobData) {
  // 1. 公司规模小于100人的过滤掉
  if (isSmallCompany(jobData.brandScaleName)) {
    return true;
  }

  // 2. 政府/公共事业/学术/科研相关行业过滤掉
  if (isGovernmentOrAcademicIndustry(jobData.brandIndustry)) {
    return true;
  }

  // 3. 薪资低于15K的过滤掉
  if (getMinSalary(jobData.salaryDesc) < 15) {
    return true;
  }

  return false;
}

// 过滤数据保留指定字段
function filterJobData(jobData) {
  return {
    jobName: jobData.jobName,
    salaryDesc: jobData.salaryDesc,
    jobLabels: jobData.jobLabels || [],
    jobValidStatus: jobData.jobValidStatus,
    iconWord: jobData.iconWord || '',
    skills: jobData.skills || [],
    jobDegree: jobData.jobDegree || '',
    cityName: jobData.cityName || '',
    brandName: jobData.brandName,
    brandIndustry: jobData.brandIndustry || '',
    brandScaleName: jobData.brandScaleName || '',
    welfareList: jobData.welfareList || [],
    source: 'boss直聘', // 添加数据来源
    dataDate: new Date().toISOString().split('T')[0], // 添加数据日期
    isActive: true,
  };
}

// API 请求函数
async function apiRequest(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API 请求失败: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API 请求错误 (${url}):`, error.message);
    throw error;
  }
}

// 批量创建岗位信息
async function batchCreateJobInfo(jobs) {
  console.log(`正在批量创建 ${jobs.length} 条岗位信息...`);

  try {
    const response = await apiRequest('/job-info/batch', {
      method: 'POST',
      body: JSON.stringify({ jobs }),
    });
    console.log(`✓ 批量创建成功: ${response.data.count} 条记录已保存到数据库`);
    return response;
  } catch (error) {
    console.error('✗ 批量创建失败:', error.message);
    throw error;
  }
}

// 分批处理数据（避免一次性发送太多数据）
async function batchProcessJobs(jobs, batchSize = 50) {
  const batches = [];
  for (let i = 0; i < jobs.length; i += batchSize) {
    batches.push(jobs.slice(i, i + batchSize));
  }

  let totalCreated = 0;
  for (let i = 0; i < batches.length; i++) {
    try {
      const result = await batchCreateJobInfo(batches[i]);
      totalCreated += result.count;

      // 短暂延迟，避免请求过于频繁
      if (i < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`第 ${i + 1} 批处理失败:`, error.message);
      // 继续处理下一批
    }
  }

  return totalCreated;
}

// 处理招聘数据
async function processJobData(jsonFilePath) {
  try {
    // 读取JSON数据
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    const jobsData = JSON.parse(rawData);

    // 第一步：基础有效性过滤
    const basicValidJobs = jobsData.filter(
      (job) => job && job.brandName && job.jobName && job.jobValidStatus === 1
    );

    // 第二步：应用新的过滤条件
    const filteredValidJobs = basicValidJobs.filter(
      (job) => !shouldFilterOut(job)
    );

    // 过滤字段
    const filteredJobs = filteredValidJobs.map(filterJobData);

    // 读取现有公司统计
    const companyStats = readCompanyStats();

    // 统计本次数据中的公司数量
    const currentCompanyCounts = {};
    filteredJobs.forEach((job) => {
      const company = job.brandName;
      if (company) {
        currentCompanyCounts[company] =
          (currentCompanyCounts[company] || 0) + 1;
      }
    });

    // 更新公司统计（叠加模式）
    for (const [company, count] of Object.entries(currentCompanyCounts)) {
      if (companyStats[company]) {
        // 现有公司：叠加count
        companyStats[company].count += count;
      } else {
        // 新公司：创建新条目
        companyStats[company] = {
          count: count,
          color: generateRandomColor(),
        };
      }
    }

    // 写入更新后的统计数据
    writeCompanyStats(companyStats);

    for (const [company, count] of Object.entries(currentCompanyCounts)) {
      console.log(
        `  ${company}: +${count} (总计: ${companyStats[company].count})`
      );
    }

    // 保存过滤后的数据
    const outputPath = jsonFilePath.replace('.json', '_filtered.json');
    fs.writeFileSync(outputPath, JSON.stringify(filteredJobs, null, 2), 'utf8');

    // 批量保存到数据库
    if (filteredJobs.length > 0) {
      try {
        const totalCreated = await batchProcessJobs(filteredJobs);
      } catch (error) {}
    } else {
      console.log(`\n没有符合条件的数据需要保存到数据库`);
    }

    return {
      filteredJobs,
      companyStats,
      currentCompanyCounts,
      originalCount: jobsData.length,
      basicValidCount: basicValidJobs.length,
      finalCount: filteredValidJobs.length,
      filteredOutCount: basicValidJobs.length - filteredValidJobs.length,
    };
  } catch (error) {
    console.error('处理数据时出错:', error);
    throw error;
  }
}

// 主函数
async function main() {
  const jsonFilePath = '../data/8.16.json';

  if (!fs.existsSync(jsonFilePath)) {
    console.error(`文件不存在: ${jsonFilePath}`);
    return;
  }

  try {
    await processJobData(jsonFilePath);
  } catch (error) {
    console.error('\n❌ 处理失败:', error.message);
  }
}

// 导出函数供其他文件使用
export {
  processJobData,
  filterJobData,
  readCompanyStats,
  writeCompanyStats,
  batchCreateJobInfo,
  batchProcessJobs,
};

main();
