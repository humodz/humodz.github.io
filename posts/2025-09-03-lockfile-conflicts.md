---
title: Resolving conflicts in package-lock.json
slug: lockfile-conflicts
type: posts
---

# {{title}}

```sh
git checkout --theirs -- package-lock.json
npm install
```

That's it.

Say you've worked on a `feature-branch`, but want to bring in changes from `master`.
`git checkout --theirs` will make it seem that you branched off after the new changes were already there.

Do not try manually editing package-lock.json. It’s huge and not meant for manual edits.

You might have considered not committing package-lock.json to avoid dealing with this. However, comitting it and using `npm ci` has a huge benefit: it makes your builds reproducible, by ensuring
the exact same packages will be installed every time.

Without package-lock.json and `npm ci`, npm might install newer versions
of your dependencies - remember that `"some-lib": "^1.0.0"` means npm will look for some-lib `>= 1.0.0, < 2.0.0`. It doesn't
force npm to install `1.0.0` specifically.

I've been bit before on a project that didn't use `npm ci`, when [AWS SDK released a broken version][aws-sdk-broken]. Suddenly, all pipelines started failing.

As an aside, if you're caching `node_modules` in your CI/CD pipeline, consider caching `~/.npm` instead:

- it's smaller
- no extra configuration needed for workspaces (which can have multiple node_modules folders)
- if there's other commands on your pipeline that might fetch dependencies to different places, all of them will benefit from it

So, in a nutshell:

- always commit package-lock.json
- in your CI/CD pipeline, use `npm ci`, not `npm install`
- cache `~/.npm`, not `node_modules`

[aws-sdk-broken]: https://github.com/aws/aws-sdk-js-v3/issues/5014
