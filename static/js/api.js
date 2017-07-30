export const fetchData = () => {
  return fetch(`${location.href}/data`).then(res => res.text());
};
