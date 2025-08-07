const createError = (status = 500, message = "Something went wrong") => {
  const err = new Error(message);
  err.status = status;
  return err;
};

export default createError;
