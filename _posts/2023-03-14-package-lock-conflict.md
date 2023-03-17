---
title: "Resolving Conflicts in package-lock.json"
date: 2023-03-14
tags: javascript node git beginner guides
---

**Level:** Beginner


```sh
git checkout --theirs package-lock.json
npm install
```

After that, as a sanity check, validate if your project still builds and runs.

- This can be done for other types of lockfiles too, like `yarn.lock`
- If you're using Git in a graphic interface (GitKraken, VSCode, etc), look for a button labeled "Accept Theirs" or similar


## What Does That Do?

Most of the time, conflicts in lockfiles happen because your branch and the incoming branch (that is, the branch that's being merged into yours) both changed the project's dependencies, be that adding, removing or changing existing ones.

The recipe above copies over the `package-lock.json` from the incoming branch, and then updates it with the dependency changes in your branch.


## Why Bother Comitting package-lock.json?

The main benefit, in conjunction with `npm ci`, is making the installation of dependencies reproducible. `npm install` sometimes updates dependencies, which is usually not a problem, but may cause your deployment pipeline to fail if a dependency releases a broken update. For example, happened with [aws-sdk](https://github.com/aws/aws-sdk-js-v3/issues/4060) a few months ago, so if you had that dependency and weren't using `npm ci`, there's a good chance your pipeline broke at the time.

Having a lockfile commited and using `npm ci` in place of `npm install` in your deployment pipeline should protect you from this kind of problem.

If you're using yarn, the equivalent to `npm ci` is `yarn install --frozen-lockfile`.


## Other Recommendations

Avoid having more than one type of lockfile committed (for example, both `package-lock.json` and `yarn.lock`), and by extension avoid using multiple dependency managers in the same project. Discuss with your teammates which dependency manager you're all going to use, and only use that.

Use [NVM](https://github.com/nvm-sh/nvm) or an alternative for managing multiple Node versions. This might come in handy if you have a project that only works with an older version of Node, but would like to use a more updated one the rest of the time.

For more future-proofing, consider documenting which version of Node the project is known to work with. If using NVM, you can create an `.npmrc` file with the output from `node -v`, like so:

```
v16.14.2
```