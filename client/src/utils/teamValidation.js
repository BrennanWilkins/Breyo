export const checkURL = url => {
  if (url.length > 50) { return `Your team's URL cannot be over 50 characters.`; }
  const urlTest = /^[a-zA-Z0-9]*$/;
  const checkURL = urlTest.test(url);
  if (!checkURL) { return `Your team's URL can only contain letters or numbers.`; }
  return '';
};
