---
title: Using a Phoenix digest with Webpack dynamic imports
published: 2020-05-31T15:42:39Z
draft: true
preview: test
description: test
slug: using-phoenix-digest-webpack-dynamic-imports
---

One of the most useful features of Webpack is code splitting via [dynamic imports and chunk names](https://webpack.js.org/guides/code-splitting/#dynamic-imports). The [`import` keyword itself](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) returns a promise when used as a function.

When transpiling the `import` function, 