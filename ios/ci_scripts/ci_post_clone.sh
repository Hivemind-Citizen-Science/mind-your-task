#!/bin/sh

#  ci_post_clone.sh
#  Mind Your Task
#
# Navigate to the project root
cd ../../

# Check if the ios directory is incomplete or incorrect
if [ -d "ios" ] && [ ! -f "ios/Podfile" ]; then
  echo "Detected partial ios directory. Removing it..."
  rm -rf ios
fi

echo "===== Installling CocoaPods ====="
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods

echo "===== Installing Node.js 22 ====="
# Install Node.js 22 specifically
brew install node@22
# Link Node.js 22 as the default
brew link --force node@22
# Verify Node.js installation
node -v
npm -v
# echo "===== Installing yarn ====="
# brew install yarn

# Install dependencies
echo "===== Running npm install ====="
npm install 
npx expo prebuild

echo "===== Debug: iOS directory contents ====="
ls -la ios