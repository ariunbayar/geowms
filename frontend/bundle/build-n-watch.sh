#!/bin/sh

DIR=$(dirname "$(readlink -e "$0")")

while :; do
    (
        find "$DIR/src/" -type f -not -name '*.swp';
    ) | entr -d -s 'npm run watch'
done
