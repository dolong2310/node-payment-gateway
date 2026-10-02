export type ResultVerified = {
  isSuccess: boolean;
  isVerified: boolean;
  message: string;
};

export type BaseResponseFromZaloPay = {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
};
