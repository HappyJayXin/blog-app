module.exports = {
  formatDate(date) {
    // format date
    return new Date(date).toLocaleDateString();
  },
  truncate(str, len) {
    // shorten text
    return str.length > len ? str.substring(0, len) + "..." : str;
  }
};
