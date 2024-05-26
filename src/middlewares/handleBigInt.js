const handleBigInt = (req, res, next) => {
  const oldJson = res.json;

  res.json = function (data) {
    const replacer = (key, value) =>
      typeof value === "bigint" ? value.toString() : value;

    oldJson.call(this, JSON.parse(JSON.stringify(data, replacer)));
  };

  next();
};

module.exports = handleBigInt;
