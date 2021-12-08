const getUserByEmail = (emailAddress, database) => {
  for (const user in database) {
    if (database[user].email === emailAddress) {
      return database[user];
    }
  }
}

module.exports = getUserByEmail;