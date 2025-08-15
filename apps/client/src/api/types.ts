export interface Result<T = any> {
  status: number;
  message: string;
  data?: T;
}

export enum ResultEnum {
  SUCCESS = 0,
  ERROR = -1,
}
