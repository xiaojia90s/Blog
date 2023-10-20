#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vitepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:xiaojia90s/xiaojia90s.github.io.git master
# git push -f git@github.com:你的git名/你的git项目名.git master:你的git分支

cd -