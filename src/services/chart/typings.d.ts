declare namespace API {
  type AccuracyChart = {
    genChat?: string;
    genResult?: string;
    createTime?: string;
    isDelete?: number;
    execMessage?: string;
    updateTime?: string;
    id?: number;
    userId?: number;
    status?: string;
  };

  type BaseResponseAccuracyChart = {
    code?: number;
    data?: AccuracyChart;
    message?: string;
  };

  type BaseResponseBiResponse = {
    code?: number;
    data?: BiResponse;
    message?: string;
  };

  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseChart = {
    code?: number;
    data?: Chart;
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageChart = {
    code?: number;
    data?: PageChart;
    message?: string;
  };

  type BaseResponsePagePracticeRecordPro = {
    code?: number;
    data?: PagePracticeRecordPro;
    message?: string;
  };

  type BiResponse = {
    genResult?: string;
    chartId?: number;
    genChart?: string;
  };

  type Chart = {
    genChat?: string;
    goal?: string;
    isDelete?: number;
    execMessage?: string;
    updateTime?: string;
    userId?: number;
    chartData?: string;
    genResult?: string;
    createTime?: string;
    name?: string;
    chartType?: string;
    id?: number;
    status?: string;
  };

  type ChartAddRequest = {
    chartData?: string;
    goal?: string;
    name?: string;
    chartType?: string;
  };

  type ChartEditRequest = {
    chartData?: string;
    goal?: string;
    name?: string;
    chartType?: string;
    id?: number;
  };

  type ChartQueryRequest = {
    current?: number;
    goal?: string;
    sortOrder?: string;
    sortField?: string;
    name?: string;
    chartType?: string;
    pageSize?: number;
    id?: number;
    userId?: number;
  };

  type ChartUpdateRequest = {
    chartData?: string;
    genChat?: string;
    genResult?: string;
    goal?: string;
    createTime?: string;
    isDelete?: number;
    name?: string;
    chartType?: string;
    updateTime?: string;
    id?: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type genChartByAIRabbitMQParams = {
    genChartByAI: GenChartyByAIRequest;
  };

  type GenChartyByAIRequest = {
    goal?: string;
    name?: string;
    chartType?: string;
  };

  type getChartByIdParams = {
    id: number;
  };

  type GouZiAdditionalMessages = {
    role?: string;
    content_type?: string;
    content?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageChart = {
    total?: number;
    current?: number;
    pages?: number;
    size?: number;
    optimizeCountSql?: PageChart;
    records?: Chart[];
    maxLimit?: number;
    searchCount?: PageChart;
    optimizeJoinOfCountSql?: boolean;
    orders?: OrderItem[];
    countId?: string;
  };

  type PagePracticeRecordPro = {
    total?: number;
    current?: number;
    pages?: number;
    size?: number;
    optimizeCountSql?: PagePracticeRecordPro;
    records?: PracticeRecordPro[];
    maxLimit?: number;
    searchCount?: PagePracticeRecordPro;
    optimizeJoinOfCountSql?: boolean;
    orders?: OrderItem[];
    countId?: string;
  };

  type PracticeRecordPro = {
    subjects?: string;
    airesult?: string;
    userId?: number;
    practicePoint?: number;
    userError?: number;
    userRight?: number;
    qualifications?: string;
    createTime?: string;
    practiceStatus?: string;
    teachplanId?: number;
    id?: number;
    endTime?: string;
    courseId?: number;
  };

  type PracticeRecordRequest = {
    userError?: number;
    userRight?: number;
    qualifications?: string;
    current?: number;
    sortOrder?: string;
    subjects?: string;
    sortField?: string;
    pageSize?: number;
    practiceStatus?: string;
    userId?: number;
    practicePoint?: number;
  };
}
