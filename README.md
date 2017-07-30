## Automated testing for native browser support of ES6 modules

This is a simple repo that uses [`autobrowse`](https://github.com/DamonOehlman/autobrowse) to start browsers in various configurations (i.e. standard settings, flags enabled) to test support for ES6 modules support natively within the browsers.  After reading a few blog posts about it and seeing the [caniuse](http://caniuse.com/#feat=es6-module) feature data I wanted to check this for myself.

### Running the tests

Clone the repo, install dependencies and make it go:

```
git clone https://github.com/DamonOehlman/es6-modules-browser-test.git
cp es6-modules-browser-test/
yarn install
yarn start
```

At this point you __should__ see a few browser windows fire up (with the exception of Chrome, which is started in headless mode), and if the test executes on your machine as it did on mine, the eventual output should look something like the following:

```
👤  damo $ yarn start
yarn start v0.27.5
$ node index.js
❌  chrome
❌  firefox
✅  safari
✅  chrome-experiments-enabled
✅  firefox-modules-enabled
Done in 5.30s.
```

### What's happening under the hood

For the test a server is run which is looking for a request to be made for a particular endpoint for each of the browser configurations.  If that endpoint it hit (before a timeout period - set to 5s) then the test is considered successful.  How this checks for ES6 module support in the particular browser configuration is using the following three (simple) files:

#### `index.html`

```html
<html>
<head>
  <title>Native Module Support in the Browser</title>
</head>
<body>
  <script type="module" src="/main.js"></script>
</body>
</html>
```

#### `main.js`

```js
import { fetchData } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
  fetchData().then(text => {
    document.body.appendChild(document.createTextNode(text));
  });
});
```

#### `api.js`

```js
export const fetchData = () => {
  return fetch(`${location.href}/data`).then(res => res.text());
};
```

As you can see from the above files, we are just orchestrating a `fetch` call to the server, but ensuring we use ES6 module syntax to load the api that does the fetch call.  Rather that testing the output on the page (which would require slightly more advanced techniques), the `GET` request to the server is considered "good enough".

### Why not use Karma?

That was my initial intent.  However, I couldn't find an easy way to override the page that karma uses to load the scripts into the page to propertly import a script using the `<script type="module" src="..."></script>` format.

### Questions / Issues

Feel free to open an issue.  PRs also welcome.

