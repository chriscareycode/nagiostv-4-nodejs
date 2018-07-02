echo "Make sure you updated the version in app/pods/nagios/service.js."
echo "Deleting old dist folders..."
rm -rf dist
rm -rf ../dist
echo "Building Ember.js for release..."
ember build -prod
echo "Copying dist/ one folder up for release."
cp -r dist ..
