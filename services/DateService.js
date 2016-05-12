'use strict';

const DateService = {

  getDateXDaysAgo(daysAgo) {
    let date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  },

  getDate(obj) {
    return this.getDateXDaysAgo(obj.daysAgo).toISOString();
  }
};

export default DateService;
