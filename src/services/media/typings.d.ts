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
  type BinFIleListDto = {
    current?: number;
    filename?: string;
    file_type?: string;
    sortOrder?: string;
    sortField?: string;
    pageSize?: number;
    tags?: string;
  };
  type downloadParams = {
    fileMd5: string;
  };

  type checkchunkParams = {
    fileMd5: string;
    chunk: number;
  };

  type checkfileParams = {
    fileMd5: string;
  };

  type getPlayUrlByMediaIdParams = {
    mediaId: string;
  };

  type MediaFiles = {
    file_path?: string;
    company_id?: number;
    audit_mind?: string;
    updateTime?: string;
    remark?: string;
    audit_status?: string;
    url?: string;
    file_size?: number;
    tags?: string;
    bucket?: string;
    manager_name?: string;
    filename?: string;
    manager_id?: number;
    createTime?: string;
    file_type?: string;
    company_name?: string;
    file_id?: string;
    id?: string;
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
    data: { url: any; };
    file_path?: string;
    company_id?: number;
    audit_mind?: string;
    updateTime?: string;
    remark?: string;
    audit_status?: string;
    url?: string;
    file_size?: number;
    tags?: string;
    bucket?: string;
    manager_name?: string;
    filename?: string;
    manager_id?: number;
    createTime?: string;
    file_type?: string;
    company_name?: string;
    file_id?: string;
    id?: string;
    username?: string;
    status?: string;
  };

  type uploadParams = {
    objectName?: string;
  };
}
