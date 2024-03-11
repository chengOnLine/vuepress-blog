---
title: Git 语法入门
tag: Git
date: 2022-9-8
author: cheng
---

Git在线学习网站[**在这里**](https://learngitbranching.js.org/?locale=zh_CN)

## GIT 原理

![Alt text](../.vuepress/public/assets/images/gitPrinceple.png)

    workspace: 工作区，以文件形式保存在硬盘里
    index/stage:  缓存区， git add 后保存在缓存区
    repository： 本地版本库, git commit 后保存在本地仓库
    remote: 远程版本库, git push 后上传到远程版本库

## GIT 常用命令

    git commit -m <note> 提交修改

    git checkout <branch-name> 创建分支 
    git checkout <commit-id> HEAD分离并指向该提交
    git checkout -b <branch-name> 在本分支基础上创建分支,并切换到新建的分支
    git checkout -f <branch-name> <commit-id> 将分支强制指向该提交

    git reset <commit-id> | HEAD~<num> 在"本地仓库"撤销更改,撤销的内容会回到工作区

    git revert
