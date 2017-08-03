#!/bin/bash
set -ev

echo "${TRAVIS_BRANCH}"
echo "${TRAVIS_PULL_REQUEST_BRANCH}"
echo "${TRAVIS_PULL_REQUEST}"

if [ "${TRAVIS_PULL_REQUEST_BRANCH}" = "master" ] && ! [ "${TRAVIS_PULL_REQUEST}" ]; then
    npm run deploy:prod
else
    npm run deploy:stage
fi
