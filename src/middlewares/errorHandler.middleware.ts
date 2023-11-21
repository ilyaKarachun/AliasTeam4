import ValidationException from '../exceptions/validationException';
import HttpException from '../exceptions/httpException';

const errorHandlerMiddleWare = (error, req, res, next) => {
  if (
    error &&
    (error instanceof HttpException || error instanceof ValidationException)
  ) {
    console.error(error);
    return res.status(error.code || 400).json({
      error: error.message || 'Something Went Wrong',
    });
  }

  console.error(error);
  return res.status(500).json({
    error: 'Something Went Wrong',
  });
};

export default errorHandlerMiddleWare;
