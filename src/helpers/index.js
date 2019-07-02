const getShortYear = function(date) {
  return new Date(date)
    .getFullYear()
    .toString()
    .substr(-2);
};

const paginate = (query, { page, pageSize }) => {
  const offset = parseInt(page) * parseInt(pageSize);
  const limit = parseInt(offset) + parseInt(pageSize);

  return {
    ...query,
    offset,
    limit
  };
};

module.exports = { getShortYear, paginate };
