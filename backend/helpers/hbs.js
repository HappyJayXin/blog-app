module.exports = {
  formatDate(value) {
    // format date
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  },
  truncate(str = "", len = 100) {
    // shorten text
    return str.length > len ? `${str.substring(0, len)}...` : str;
  },
  currentYear() {
    // current year
    return new Date().getFullYear();
  }
};
