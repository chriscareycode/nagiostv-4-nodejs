#!/bin/bash
NODE=

path_to_executable=$(which "node")
 if [ -x "$path_to_executable" ] ; then
    echo "Running Node.js from here: $path_to_executable"
    NODE="$path_to_executable"
 fi

# if test -f "/usr/bin/node"; then
#   NODE="/usr/bin/node"
# fi
if test -f "/usr/bin/nodejs"; then
  echo "Found node at /usr/bin/nodejs"
  NODE="/usr/bin/nodejs"
fi

echo "**********************************************************************************************"
echo "Make sure to run 'npm install' first, which will install all the files needed for this to run."
echo "**********************************************************************************************"

$NODE app.js
