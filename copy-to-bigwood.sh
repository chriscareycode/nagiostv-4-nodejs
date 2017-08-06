#!/bin/bash

rm -rf dist

# build
ember build --environment=production

# copy dist
rsync -av dist/* pi@bigwood:nagiostv/dist/

# copy node server
rsync -av --exclude=node_modules node pi@bigwood:nagiostv/
