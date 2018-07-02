rm releases/nagiostv-1.0.0.tar.gz
tar --exclude='./node/settings.js' --exclude='./node/settings-json.js' --exclude='./node/node_modules' --exclude='./node/.gitignore' -zcvf releases/nagiostv-1.0.0.tar.gz dist node
echo Now rename releases/nagiostv-1.0.0.tar.gz to the new version name
