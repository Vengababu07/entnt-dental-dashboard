export const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
export const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));
