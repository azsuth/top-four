echo deploying production
firebase deploy --token "$FIREBASE_TOKEN" --only hosting:prod