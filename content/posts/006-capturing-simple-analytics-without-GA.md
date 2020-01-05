---
title: Capture simple analytics without Google Analytics
published: 2020-01-05T17:27:46Z
draft: true
preview: TBA
slug: capture-simple-analytics-without-google-analytics
---

As part of this building my blog, I wanted to capture visitor analytics with a simple, privacy-focused approach. Normally, I would reach for Google Analytics or [Fathom](https://usefathom.com/), but it is a very simple problem to solve with Cloud Run and [Cloud Firestore](https://firebase.google.com/docs/firestore). I have created [Exlytics](https://github.com/corybuecker/exlytics) as an example of my approach in under 100 lines of Elixir code.