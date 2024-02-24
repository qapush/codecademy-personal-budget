const getIndexById = (id, array) => {
  return array.findIndex((item) => item.id == id);
};

const getEnvelopeByName = (name, array) => {
  const index = array.findIndex((item) => item.name == name);
  if(index === -1) return null;
  return(array[index]);

};

module.exports = { getIndexById, getEnvelopeByName };
