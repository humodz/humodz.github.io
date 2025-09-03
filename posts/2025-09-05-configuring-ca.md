---
title: Configuring CodeArtifact in Node.js projects
type: posts
slug: configuring-ca
code_langs:
    - bash
---

# {{title}}

[CodeArtifact](https://aws.amazon.com/codeartifact/) is AWS's "Artifact Repository" service. for our purposes today, it's a private npm registry. This post is not about why you'd want to use it, but how to make it less inconvenient.

My problem with it is authentication. Even though there's an `aws codeartifact login` command, it sets npm's registry in `~/.npmrc`, which will affect all your projects.

This is a short guide on how to use CodeArtifact on a per-project basis.

# Step 1: Configure your project's .npmrc

Create an `.npmrc` file inside your project and put your CodeArtifact's repository URL in there, for example:

```
registry=https://dev-12345.d.codeartifact.us-east-2.amazonaws.com/npm/my-repository/
```

# Step 2: Write the authentication script

The script below fetches credentials from CodeArtifact and stores them in you home directory's `~/.npmrc`


```sh
#!/usr/bin/env bash

set -e

REGION="..."
DOMAIN_OWNER="..."
DOMAIN="..."

TOKEN="$(aws codeartifact get-authorization-token \
	--region "$REGION" \
	--domain-owner "$DOMAIN_OWNER" \
	--domain "$DOMAIN" \
	--query authorizationToken \
	--output text)"

npm config set --location user "$(npm config get --location project registry):_authToken=$TOKEN"
```

Don't forget to set `REGION`, `DOMAIN_OWNER` and `DOMAIN` to the appropriate values for your CodeArtifact repo.

To authenticate, just `cd` into your project and run the script.