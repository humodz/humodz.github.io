# humodz.github.io

## Local Setup

```sh
sudo apt install ruby-full
sudo gem install bundler
bundle config set --local path "$HOME/.gem"
bundle install
```

## Previewing Locally

```sh
bundle exec jekyll serve
bundle exec jekyll serve ---drafts
```