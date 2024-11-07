declare namespace API {
  type AddCourseDto = {
    qq?: string;
    charge?: string;
    memberPrice?: number;
    wechat?: string;
    teachmode?: string;
    description?: string;
    label?: string;
    pic?: string;
    users?: string;
    tags?: string;
    phone?: string;
    grade?: string;
    name?: string;
    validDays?: number;
  };

  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseCourseBaseInfoDto = {
    code?: number;
    data?: CourseBaseInfoDto;
    message?: string;
  };

  type BaseResponseCoursePreviewDto = {
    code?: number;
    data?: CoursePreviewDto;
    message?: string;
  };

  type BaseResponseCoursePublish = {
    code?: number;
    data?: CoursePublish;
    message?: string;
  };

  type BaseResponseListTeachplanListDto = {
    code?: number;
    data?: TeachplanListDto[];
    message?: string;
  };

  type BaseResponsePageCourseBase = {
    code?: number;
    data?: PageCourseBase;
    message?: string;
  };

  type BindTeachplanMediaDto = {
    fileName?: string;
    totalTime?: string;
    teachplanId?: number;
    mediaId?: string;
  };

  type commitAuditParams = {
    courseId: number;
  };

  type CourseBase = {
    charge?: string;
    manager?: string;
    memberPrice?: number;
    teachmode?: string;
    description?: string;
    managerId?: number;
    pic?: string;
    label?: string;
    users?: string;
    tags?: string;
    grade?: string;
    name?: string;
    changeDate?: string;
    auditStatus?: string;
    id?: number;
    createDate?: string;
    status?: string;
  };

  type CourseBaseInfoDto = {
    qq?: string;
    charge?: string;
    manager?: string;
    memberPrice?: number;
    wechat?: string;
    stName?: string;
    teachmode?: string;
    description?: string;
    managerId?: number;
    pic?: string;
    label?: string;
    users?: string;
    tags?: string;
    phone?: string;
    mtName?: string;
    price?: number;
    grade?: string;
    name?: string;
    changeDate?: string;
    auditStatus?: string;
    id?: number;
    createDate?: string;
    status?: string;
    validDays?: number;
  };

  type CourseLearnRecordDto = {
    courseRecordId?: number;
  };

  type CourseLearnRecordTimeDto = {
    courseName?: string;
    courseTeachPlanRecord?: CourseTeachPlanRecord;
    courseId?: number;
  };

  type CoursePreviewDto = {
    courseBase?: CourseBaseInfoDto;
    teachplans?: TeachplanListDto[];
  };

  type CoursePublish = {
    charge?: string;
    manager?: string;
    memberPrice?: number;
    teachmode?: string;
    description?: string;
    remark?: string;
    managerId?: number;
    label?: string;
    pic?: string;
    teachplan?: string;
    users?: string;
    tags?: string;
    market?: string;
    onlineDate?: string;
    offlineDate?: string;
    teachers?: string;
    grade?: string;
    name?: string;
    id?: number;
    username?: string;
    createDate?: string;
    status?: string;
    validDays?: number;
  };

  type CoursePublishListDto = {
    current?: number;
    sortOrder?: string;
    grade?: string;
    sortField?: string;
    name?: string;
    pageSize?: number;
    id?: number;
    label?: string;
    tags?: string;
  };

  type coursepublishParams = {
    courseId: number;
  };

  type CourseTeachPlanRecord = {
    pname?: string;
    totalTime?: string;
    description?: string;
    id?: number;
    label?: string;
    timelength?: string;
  };

  type EditCourseDto = {
    qq?: string;
    charge?: string;
    memberPrice?: number;
    wechat?: string;
    teachmode?: string;
    description?: string;
    label?: string;
    pic?: string;
    users?: string;
    tags?: string;
    phone?: string;
    grade?: string;
    name?: string;
    id?: number;
    validDays?: number;
  };

  type getCourseBaseByIdParams = {
    courseId: number;
  };

  type getCoursepublishParams = {
    courseId: number;
  };

  type getPreviewInfoParams = {
    courseId: number;
    courseLearnRecordDto: CourseLearnRecordDto;
  };

  type getTreeNodesParams = {
    courseId: number;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageCourseBase = {
    total?: number;
    current?: number;
    pages?: number;
    size?: number;
    optimizeCountSql?: PageCourseBase;
    records?: CourseBase[];
    maxLimit?: number;
    searchCount?: PageCourseBase;
    optimizeJoinOfCountSql?: boolean;
    orders?: OrderItem[];
    countId?: string;
  };

  type previewParams = {
    courseId: number;
    courseLearnRecordDto: CourseLearnRecordDto;
  };

  type QueryCourseParamsDto = {
    current?: number;
    courseName?: string;
    sortOrder?: string;
    sortField?: string;
    pageSize?: number;
    auditStatus?: string;
    publishStatus?: string;
  };

  type SaveTeachplanDto = {
    coursePubId?: number;
    pname?: string;
    description?: string;
    mediaType?: string;
    id?: number;
    label?: string;
    courseId?: number;
  };

  type TeachplanListDto = {
    coursePubId?: number;
    pname?: string;
    description?: string;
    orderby?: number;
    mediaType?: string;
    updateTime?: string;
    label?: string;
    timelength?: string;
    teachplanMedia?: TeachplanMedia;
    createTime?: string;
    id?: number;
    courseId?: number;
    status?: number;
  };

  type TeachplanMedia = {
    changePeople?: string;
    mediaFileName?: string;
    teachplanId?: number;
    id?: number;
    mediaId?: string;
    createPeople?: string;
    courseId?: number;
    createDate?: string;
  };
}
