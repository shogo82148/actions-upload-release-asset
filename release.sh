#!/bin/bash

set -uex

CURRENT=$(cd "$(dirname "$0")" && pwd)
VERSION=$1
MAJOR=$(echo "$VERSION" | cut -d. -f1)
MINOR=$(echo "$VERSION" | cut -d. -f2)
PATCH=$(echo "$VERSION" | cut -d. -f3)
WORKING=$CURRENT/.working

: clone
ORIGIN=$(git remote get-url origin)
chmod -R +w "$WORKING" &&  rm -rf "$WORKING"
git clone "$ORIGIN" "$WORKING"
cd "$WORKING"

: build the action
git checkout -b "releases/v$MAJOR" "origin/releases/v$MAJOR" || git git checkout -b "releases/v$MAJOR" main
git merge -X theirs -m "Merge branch 'main' into releases/v$MAJOR" main || true
jq ".version=\"$MAJOR.$MINOR.$PATCH\"" < package.json > .tmp.json
mv .tmp.json package.json
npm ci
npm run build
npm run pack

: publish to GitHub
perl -ne 'print unless m(^/dist/$)' -i .gitignore
git add .
git commit -m "bump up to v$MAJOR.$MINOR.$PATCH"
git tag -a "v$MAJOR.$MINOR.$PATCH" -m "release v$MAJOR.$MINOR.$PATCH"
git push origin "releases/v$MAJOR"
git push origin "v$MAJOR.$MINOR.$PATCH"
git tag -fa "v$MAJOR" -m "release v$MAJOR.$MINOR.$PATCH"
git push -f origin "v$MAJOR"

cd "$CURRENT"
chmod -R +w "$WORKING" &&  rm -rf "$WORKING"
