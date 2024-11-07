declare namespace API {
  type AnswerAddResultRequest = {
    question?: QuestionListRequest[];
    subjects?: string;
    practiceId?: number;
    teachplanId?: number;
    courseId?: number;
  };

  type AnswerAllResultRequest = {
    subjects?: string;
    practiceId?: number;
    teachplanId?: number;
    courseId?: number;
  };

  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseBiResponse = {
    code?: number;
    data?: BiResponse;
    message?: string;
  };

  type BaseResponsePageQuestion = {
    code?: number;
    data?: PageQuestion;
    message?: string;
  };

  type BiResponse = {
    genResult?: number;
    chartId?: number;
    genChart?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageQuestion = {
    total?: number;
    current?: number;
    pages?: number;
    size?: number;
    optimizeCountSql?: PageQuestion;
    records?: Question[];
    maxLimit?: number;
    searchCount?: PageQuestion;
    optimizeJoinOfCountSql?: boolean;
    orders?: OrderItem[];
    countId?: string;
  };

  type Question = {
    createTime?: string;
    subjectsTitle?: string;
    isDelete?: number;
    subjects?: string;
    optionC?: string;
    optionD?: string;
    updateTime?: string;
    optionA?: string;
    id?: number;
    subjectsResult?: string;
    optionB?: string;
  };

  type QuestionListRequest = {
    id?: number;
    value?: string;
  };

  type QuestionQueryRequest = {
    recordId?: number;
    qualifications?: string;
    current?: number;
    teacherId?: number;
    sortOrder?: string;
    subjects?: string;
    sortField?: string;
    pageSize?: number;
    courseId?: number;
  };
}
