export const detectDate = () => {
  let thisWeekStart = new Date(
      new Date().setHours(0, 0, 0, 0) - 60 * 60 * 24 * 7 * 1000
    ),
    day = thisWeekStart.getDay(),
    diffToMonday = thisWeekStart.getDate() - day + (day === 0 ? -6 : 1);
  let lastWeekStart = new Date(thisWeekStart.setDate(diffToMonday));
  let lastWeekEnd = new Date(thisWeekStart.setDate(diffToMonday + 6));
  thisWeekStart = thisWeekStart.setDate(thisWeekStart.getDate() + 1);
  lastWeekEnd = lastWeekEnd.setDate(lastWeekEnd.getDate() + 1);
  return {
    thisWeekStart,
    day,
    diffToMonday,
    lastWeekStart,
    lastWeekEnd
  };
};

export const getDate = (range, data, lastweek, current) => {
  if (range !== null) {
    let filtered = data.filter(
      x =>
        new Date(x.date) >= new Date(range[0]) &&
        new Date(x.date) <= new Date(range[1].setHours(23, 59, 59, 59))
    );
    return filtered;
  } else if (lastweek !== false) {
    let filtered = data.filter(
      x =>
        new Date(x.date) >= detectDate().lastWeekStart &&
        new Date(x.date) <= detectDate().lastWeekEnd
    );
    return filtered;
  } else if (current !== false) {
    let filtered = data.filter(
      x =>
        new Date(x.date) >= detectDate().thisWeekStart &&
        new Date(x.date) <= Date.now()
    );
    return filtered;
  } else {
    return data;
  }
};
