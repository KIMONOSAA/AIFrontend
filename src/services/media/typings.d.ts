declare namespace API {
  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponsePageMediaFiles = {
    code?: number;
    data?: PageMediaFiles;
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUploadFileResultDto = {
    code?: number;
    data?: UploadFileResultDto;
    message?: string;
  };

  type BinFIleListDto = {
    current?: number;
    filename?: string;
    sortOrder?: string;
    sortField?: string;
    pageSize?: number;
    fileType?: string;
    tags?: string;
  };

  type checkchunkParams = {
    fileMd5: string;
    chunk: number;
  };

  type checkfileParams = {
    fileMd5: string;
  };

  type download2Params = {
    fileMd5: string;
  };

  type download3Params = {
    fileMd5: string;
  };

  type download4Params = {
    fileMd5: string;
  };

  type download5Params = {
    fileMd5: string;
  };

  type downloadParams = {
    fileMd5: string;
  };

  type getPlayUrlByMediaIdParams = {
    mediaId: string;
  };

  type getPreviewUrlParams = {
    filemd5: string;
  };

  type MediaFiles = {
    companyName?: string;
    filePath?: string;
    updateTime?: string;
    remark?: string;
    managerId?: number;
    managerName?: string;
    url?: string;
    tags?: string;
    bucket?: string;
    companyId?: number;
    filename?: string;
    createTime?: string;
    fileSize?: number;
    auditMind?: string;
    auditStatus?: string;
    id?: string;
    fileType?: string;
    fileId?: string;
    username?: string;
    status?: string;
  };

  type mergechunksParams = {
    fileMd5: string;
    fileName: string;
    chunkTotal: number;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageMediaFiles = {
    total?: number;
    current?: number;
    pages?: number;
    size?: number;
    optimizeCountSql?: PageMediaFiles;
    records?: MediaFiles[];
    maxLimit?: number;
    searchCount?: PageMediaFiles;
    optimizeJoinOfCountSql?: boolean;
    orders?: OrderItem[];
    countId?: string;
  };

  type uploadchunkParams = {
    fileMd5: string;
    chunk: number;
  };

  type UploadFileResultDto = {
    companyName?: string;
    filePath?: string;
    updateTime?: string;
    remark?: string;
    managerId?: number;
    managerName?: string;
    url?: string;
    tags?: string;
    bucket?: string;
    companyId?: number;
    filename?: string;
    createTime?: string;
    fileSize?: number;
    auditMind?: string;
    auditStatus?: string;
    id?: string;
    fileType?: string;
    fileId?: string;
    username?: string;
    status?: string;
  };

  type uploadParams = {
    objectName: string;
  };
}
