declare namespace API {
  type addPointParams = {
    userId: number;
  };

  type AuthentianResponse = {
    refershToken?: string;
    accessToken?: string;
  };

  type BaseResponseAuthentianResponse = {
    code?: number;
    data?: AuthentianResponse;
    message?: string;
  };

  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseInteger = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageUser = {
    code?: number;
    data?: PageUser;
    message?: string;
  };

  type BaseResponsePageUserMember = {
    code?: number;
    data?: PageUserMember;
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser = {
    code?: number;
    data?: User;
    message?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type findAllValidTokenByUserParams = {
    id: number;
  };

  type findByEmailParams = {
    username: string;
  };

  type findByTokenParams = {
    jwt: string;
  };

  type getSaveUserTokenParams = {
    jwtToken: string;
  };

  type getUserByIdParams = {
    id: number;
  };

  type GobalGetLoginUserParams = {
    request: string;
  };

  type insertUserParams = {
    user: User;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageRequest = {
    current?: number;
    sortOrder?: string;
    sortField?: string;
    pageSize?: number;
  };

  type PageUser = {
    total?: number;
    current?: number;
    pages?: number;
    size?: number;
    optimizeCountSql?: PageUser;
    records?: User[];
    maxLimit?: number;
    searchCount?: PageUser;
    optimizeJoinOfCountSql?: boolean;
    orders?: OrderItem[];
    countId?: string;
  };

  type PageUserMember = {
    total?: number;
    current?: number;
    pages?: number;
    size?: number;
    optimizeCountSql?: PageUserMember;
    records?: UserMember[];
    maxLimit?: number;
    searchCount?: PageUserMember;
    optimizeJoinOfCountSql?: boolean;
    orders?: OrderItem[];
    countId?: string;
  };

  type Permissions = {
    code?: string;
    roleId?: number;
    id?: number;
    permissionName?: string;
  };

  type registerParams = {
    confirmPassword: string;
    userPassword: string;
    qualification: string;
    userAccount: string;
    grade: string;
    email: string;
  };

  type Token = {
    expired?: boolean;
    id?: number;
    revoked?: boolean;
    userId?: number;
    token?: string;
  };

  type updatePointParams = {
    userId: number;
    point: number;
  };

  type User = {
    isPoint?: number;
    userPassword?: string;
    roleId?: number;
    isDelete?: number;
    userAvatar?: string;
    updateTime?: string;
    userName?: string;
    isEnable?: number;
    qualification?: string;
    createTime?: string;
    grade?: string;
    userAccount?: string;
    member?: string;
    id?: number;
    userRole?: 'USER' | 'ADMIN' | 'MANAGER' | 'USERVIP';
    email?: string;
  };

  type UserAddRequest = {
    qualification?: string;
    password?: string;
    userAccount?: string;
    grade?: string;
    confirmPassword?: string;
    userName?: string;
    userRole?: string;
    email?: string;
  };

  type UserAuthenticationRequest = {
    password?: string;
    email?: string;
  };

  type UserDto = {
    isPoint?: number;
    userPassword?: string;
    roleId?: number;
    userAccount?: string;
    member?: string;
    id?: number;
    userRole?: string;
    userName?: string;
    email?: string;
    isEnable?: number;
  };

  type UserEmailVerificationRequest = {
    code?: string;
    userId?: string;
    email?: string;
  };

  type UserLocalDto = {
    userAccount?: string;
    id?: number;
    userName?: string;
    email?: string;
  };

  type UserMember = {
    memberDescribes?: string;
    memberPrice?: number;
    createTime?: string;
    memberName?: string;
    updateTime?: string;
    id?: number;
    memberType?: string;
    expirationDate?: string;
  };

  type UserPermissionDto = {
    userPassword?: string;
    roleId?: number;
    userAccount?: string;
    member?: string;
    id?: number;
    userName?: string;
    email?: string;
  };

  type UserPublishEventRequest = {
    id?: number;
    email?: string;
  };

  type UserQueryRequest = {
    current?: number;
    sortOrder?: string;
    sortField?: string;
    pageSize?: number;
    id?: number;
    userName?: string;
    userRole?: string;
    userProfile?: string;
  };

  type userSignParams = {
    date: string;
  };

  type UserUpdateRequest = {
    userPassword?: string;
    userAccount?: string;
    member?: string;
    id?: number;
    userName?: string;
    userRole?: 'USER' | 'ADMIN' | 'MANAGER' | 'USERVIP';
    email?: string;
  };
}
