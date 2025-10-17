#!/usr/bin/env sh

# Abort on errors
set -e

# Build
npm run build

# Navigate into the build output directory
cd .vitepress/dist

# Create CNAME for custom domain (if you have one)
# echo 'docs.zenoter.app' > CNAME

# Initialize git in dist folder
git init
git add -A
git commit -m 'deploy'

# Deploy to github pages
git push -f git@github.com:rumankazi/zenoter.git main:gh-pages

cd -
