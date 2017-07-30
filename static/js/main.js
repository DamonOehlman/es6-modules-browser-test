import { fetchData } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
  fetchData().then(text => {
    document.body.appendChild(document.createTextNode(text));
  });
});
