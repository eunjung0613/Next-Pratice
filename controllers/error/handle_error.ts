import { NextApiResponse } from 'next';
import CustomServerError from './custom_server_error';

const handleError = (err: unknown, res: NextApiResponse) => {
  let unknownErr = err;
  if (err instanceof CustomServerError === false) {
    unknownErr = new CustomServerError({ statusCode: 400, message: 'unkown error' });
  }
  const custonError = unknownErr as CustomServerError;
  res
    .status(custonError.statusCode)
    .setHeader('location', custonError.location ?? '')
    .send(custonError.serializeErrors()); // 에러 응답에 body를 전달
};

export default handleError;
