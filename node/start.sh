#!/bin/bash
NODE=

path_to_executable=$(which "node")
 if [ -x "$path_to_executable" ] ; then
    echo "It's here: $path_to_executable"
    NODE="$path_to_executable"
 fi

# if test -f "/usr/bin/node"; then
#   NODE="/usr/bin/node"
# fi
if test -f "/usr/bin/nodejs"; then
  echo "Found node at /usr/bin/nodejs"
  NODE="/usr/bin/nodejs"
fi
$NODE app.js
