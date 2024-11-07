declare namespace API {
  type AIMasterData = {
    id?: number;
    aiTitle?: string;
    aiBody?: string;
    aiResult?: string;
    aiMessageSessionId?: number;
    userTitle?: string;
    userBody?: string;
    userId?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type AIMasterDataAddRequest = {
    aiMessageSessionId?: number;
    aiTitle?: string;
    aiBody?: string;
    aiResult?: string;
    userTitle?: string;
    userBody?: string;
  };


  type AIMasterDataQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    createTime?: string;
    updateTime?: string;
    aiMessageId?: number;
  };

  type AIMessageSession = {
    id?: number;
    title?: string;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
    userId?: number;
  };

  type AIMessageSessionAddRequest = {
    title?: string;
  };

  type AIMessageSessionQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    createTime?: string;
    updateTime?: string;
  };

  type AIMessageSessionUpdateRequest = {
    id?: number;
    title?: string;
    userId?: number;
  };

  type AIResultRecording = {
    id?: number;
    aiRoleId?: number;
    aiTitle?: string;
    aiBody?: string;
    aiResult?: string;
    userTitle?: string;
    userBody?: string;
    userId?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type AIResultRecordingAddRequest = {
    createTime?: string;
    updateTime?: string;
    status?: boolean;
    airole?: string;
    aidescription?: string;
    aimax_Tokens?: number;
  };

  type AIRole = {
    id?: number;
    userId?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
    status?: number;
    airoleReview?: number;
    airole?: string;
    aidescription?: string;
    aimax_Tokens?: number;
  };

  type AIRoleAddRequest = {
    status?: number;
    airole?: string;
    aidescription?: string;
    aimax_Tokens?: number;
  };

  type AIRoleQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
    userId?: number;
    status?: number;
    searchText?: string;
    airole?: string;
    aidescription?: string;
    aimax_Tokens?: string;
  };

  type AIRoleUpdateRequest = {
    id?: number;
    status?: number;
    airole?: string;
    aidescription?: string;
    aimax_Tokens?: number;
  };

  type AnswerAddResultRequest = {
    userId?: number;
    question?: QuestionListRequest[];
    subjects?: string;
    practiceId?: number;
    courseId?: number;
    teachplanId?: number;
  };

  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseAIMasterData = {
    code?: number;
    data?: AIMasterData;
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

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageAIMasterData = {
    code?: number;
    data?: PageAIMasterData;
    message?: string;
  };

  type BaseResponsePageAIMessageSession = {
    code?: number;
    data?: PageAIMessageSession;
    message?: string;
  };

  type BaseResponsePageAIResultRecording = {
    code?: number;
    data?: PageAIResultRecording;
    message?: string;
  };

  type BaseResponsePageAIRole = {
    code?: number;
    data?: PageAIRole;
    message?: string;
  };

  type BaseResponsePageQuestion = {
    code?: number;
    data?: PageQuestion;
    message?: string;
  };

  type BiResponse = {
    genChart?: string;
    genResult?: string;
    chartId?: number;
  };

  type checkAIRoleParams = {
    checkRequest: CheckRequest;
  };

  type CheckRequest = {
    id?: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type listAiRoleByPageParams = {
    aiRoleQueryRequest: AIRoleQueryRequest;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageAIMasterData = {
    records?: AIMasterData[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageAIMasterData;
    searchCount?: PageAIMasterData;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageAIMessageSession = {
    records?: AIMessageSession[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageAIMessageSession;
    searchCount?: PageAIMessageSession;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageAIResultRecording = {
    records?: AIResultRecording[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageAIResultRecording;
    searchCount?: PageAIResultRecording;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageAIRole = {
    records?: AIRole[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageAIRole;
    searchCount?: PageAIRole;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageQuestion = {
    records?: Question[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageQuestion;
    searchCount?: PageQuestion;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type Question = {
    id?: number;
    subjects?: string;
    subjectsTitle?: string;
    optionA?: string;
    optionB?: string;
    optionC?: string;
    optionD?: string;
    page?: number;
    subjectsResult?: string;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type QuestionListRequest = {
    id?: number;
    value?: string;
  };

  // type QuestionQueryRequest = {
  //   current?: number;
  //   pageSize?: number;

  //   sortField?: string;
  //   sortOrder?: string;
  //   subjects?: string;
  // };

  type QuestionQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    subjects?: string;
    recordId?: number;       // 添加 recordId，类型为 number
    teacherId?: number;      // 添加 teacherId，类型为 number
    courseId?: number;       // 添加 courseId，类型为 number
    qualifications?: string; // 添加 qualifications，类型为 string
  };



  type rejectAIRoleParams = {
    checkRequest: CheckRequest;
  };

  type testParams = {
    uid: string;
    text: string;
  };
}
