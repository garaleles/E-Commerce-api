export const globalErrorHandler = (err, req, res, next) => {
  const stack = err?.stack;
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  const message = err?.message ? err?.message : 'Bir hata oluştu';

  res.status(statusCode).json({
    success: false,
    stack,
    message,
  });
};

//404 handler
export const notFoundHandler = (req, res, next) => {
  const err = new Error(`Bu sayfa- ${req.originalUrl} bulunamadı.`);
  err.statusCode = 404;
  next(err);
};
