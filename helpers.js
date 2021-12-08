const generateRandomString = (length) => {
  let ranString = "";
  const alphNumChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    ranString += alphNumChars.charAt(Math.round(Math.random() * alphNumChars.length));
  }
  return ranString;
};

const getUserByEmail = (emailAddress, database) => {
  for (const user in database) {
    if (database[user].email === emailAddress) {
      return database[user];
    }
  }
};

const urlsForUser = (id, database) => {
  const userURLs = {};
  for (const objectKey in database) {
    const objectValue = database[objectKey];
    if (objectValue.userID === id) {
      userURLs[objectKey] = objectValue;
    }
  }
  return userURLs;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser };