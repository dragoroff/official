const apiResponse = (res, code, mes) => {
  return res.status(code).json({ data: mes });
};

module.exports = { apiResponse };
