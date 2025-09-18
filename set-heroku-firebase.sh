#!/bin/bash

# Script to set Firebase environment variables on Heroku
# Run this script to configure your Heroku app with Firebase credentials

echo "Setting Firebase environment variables on Heroku..."

# Replace 'your-app-name' with your actual Heroku app name
APP_NAME="your-app-name"

# Set Firebase environment variables
heroku config:set FIREBASE_API_KEY="AIzaSyB9cEz5mh9UpeZV6SQxxnQUAG4P9v048RM" --app $APP_NAME
heroku config:set FIREBASE_AUTH_DOMAIN="tryitout-ai.firebaseapp.com" --app $APP_NAME
heroku config:set FIREBASE_PROJECT_ID="tryitout-ai" --app $APP_NAME
heroku config:set FIREBASE_STORAGE_BUCKET="tryitout-ai.firebasestorage.app" --app $APP_NAME
heroku config:set FIREBASE_MESSAGING_SENDER_ID="738070047997" --app $APP_NAME
heroku config:set FIREBASE_APP_ID="1:738070047997:web:c506496ccc115c29ca2294" --app $APP_NAME
heroku config:set FIREBASE_MEASUREMENT_ID="G-75GNMDW62V" --app $APP_NAME

echo "Firebase environment variables set successfully!"
echo "You can verify with: heroku config --app $APP_NAME"
