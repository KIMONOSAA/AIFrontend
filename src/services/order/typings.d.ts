declare namespace API {
  type AddOrderDto = {
    orderType?: string;
    orderDescrip?: string;
    totalPrice?: number;
    orderDetail?: string;
    outBusinessId?: string;
    orderName?: string;
  };

  type BaseResponsePayRecordDto = {
    code?: number;
    data?: PayRecordDto;
    message?: string;
  };

  type PayRecordDto = {
    payNo?: number;
    orderId?: number;
    totalPrice?: number;
    createTime?: string;
    qrcode?: string;
    outPayNo?: string;
    id?: number;
    outPayChannel?: string;
    paySuccessTime?: string;
    userId?: number;
    orderName?: string;
    status?: string;
  };

  type payresultParams = {
    payNo: string;
  };

  type requestPayParams = {
    payNo: string;
  };
}
