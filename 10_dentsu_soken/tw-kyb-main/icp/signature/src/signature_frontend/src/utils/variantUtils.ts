export type OkRes<O = any> = {
  Ok: O;
};

export type ErrRes<E = any> = {
  Err: E;
};

export const isOk = (res: OkRes | ErrRes): res is OkRes => {
  return (res as OkRes).Ok !== undefined;
};
