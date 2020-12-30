#!/usr/bin/env bash

PROJECT=$1
VERSION=$2
NAME=bridge-$PROJECT

PREFIX=$(node -e "console.log(require('../package.json')['docker-registry'] || '')")
if [ -z "$PREFIX" ]; then
  PREFIX=$(node -e "console.log(require('../package.json')['docker-user'] || '')")
fi

if [ -z "$PREFIX" ]; then
  echo "Docker push requires either docker-registry or docker-user in package.json"
  exit 1
fi

if [[ "$PROJECT" != "api" && "$PROJECT" != "web" ]]; then
  echo "Invalid project name argument. Please pass 'api' or 'web'"
  echo "e.g. ./docker-build.sh api"
  exit 1
fi

# Can manually overwrite version by passing second arg to this script
if [ -z "$VERSION" ]; then
  VERSION=$(node -e "console.log(require('../package.json').version)")
fi

echo "Build docker image $NAME:$VERSION ?"
echo -n "y/n: "
read DOCKER_BUILD_PROCEED

if [ "$DOCKER_BUILD_PROCEED" != "y" ]; then
  exit 1;
fi

docker build -t "$NAME:$VERSION" ../$PROJECT 

echo "Push docker image $PREFIX/$NAME:$VERSION ?"
echo -n "y/n: "
read DOCKER_PUSH_PROCEED

if [ "$DOCKER_PUSH_PROCEED" != "y" ]; then
  exit 1;
fi

docker tag "$NAME:$VERSION" "$PREFIX/$NAME"
docker push "$PREFIX/$NAME"
docker tag "$NAME:$VERSION" "$PREFIX/$NAME:$VERSION"
docker push "$PREFIX/$NAME:$VERSION"
docker tag -f "$NAME:$VERSION" "$PREFIX/$NAME:latest"
docker push "$PREFIX/$NAME:latest"

echo "Pushed and tagged: $PREFIX/$NAME"
echo "$PREFIX/$NAME"
echo "$PREFIX/$NAME:$VERSION"
echo "$PREFIX/$NAME:latest"

