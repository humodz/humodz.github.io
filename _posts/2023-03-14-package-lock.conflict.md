---
title: "Resolving conflicts in package-lock.json"
date: 2023-03-14
tags: javascript node git
---

## In a Nutshell

```sh
git checkout --theirs package-lock.json
npm install
```

- If you're using a graphic interface for Git (GitKraken, VSCode, etc), look for "Accept Theirs"
- This can be done for other types of lockfiles too, like `yarn.lock`

After that, as a sanity check, validate if your project still builds and runs.
