---
title: Capture simple analytics without Google Analytics
published: 2020-01-05T17:27:46Z
draft: true
preview: TBA
description: TBA
slug: capture-simple-analytics-without-google-analytics
---

As part of this building my blog, I wanted to capture some analytics with a simple, privacy-focused approach. Normally, I would reach for Google Analytics or [Fathom](https://usefathom.com/), but it is a simple problem to solve with Cloud Run and [Cloud Firestore](https://firebase.google.com/docs/firestore). I have created [Exlytics](https://github.com/corybuecker/exlytics) as an example of my approach in under 100 lines of Elixir code.

## Privacy concerns

### Cookies

Google Analytics relies on a cookie to remember the steps a particular visitor follows around a website. While [this is a first-party cookie](https://clearcode.cc/blog/difference-between-first-party-third-party-cookies/), I don't see the need to use cookies for a simple blog. I'm not interested, at this time, in distinct user analytics for a small site.