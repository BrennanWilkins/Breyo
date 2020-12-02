export const pathIsValid = path => {
  if (path.length !== 85) { return false; }
  let pathTest = /\/board\/[a-zA-Z0-9]{24}\/l\/[a-zA-Z0-9]{24}\/c\/[a-zA-Z0-9]{24}/;
  return pathTest.test(path);
};

export const getIDs = path => {
  const listStart = path.indexOf('/l/');
  const cardStart = path.indexOf('/c/');
  const listID = path.slice(listStart + 3, cardStart);
  const cardID = path.slice(cardStart + 3);
  return { listID, cardID };
};
