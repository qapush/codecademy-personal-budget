const getIndexById = (id, array) => {
  return array.findIndex((item) => item.id == id);
};

module.exports = { getIndexById };
