declare namespace API {
  type getPublishEventParams = {
    code: string;
  };

  type UserDto = {
    id?: number;
    userAccount?: string;
    email?: string;
    userPassword?: string;
    userName?: string;
    userAvatar?: string;
    createTime?: string;
    updateTime?: string;
    isPoint?: number;
    isDelete?: number;
    isEnable?: number;
  };
}
