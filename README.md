# AsDimo Mobile

## Google sign-in and sign-up

Google OAuth uses three different client IDs. The web client ID is only for the browser; it cannot be used as the Android or iOS client ID.

1. In Google Cloud Console, create OAuth clients for:
   - Web application: add `http://localhost:8081/` as an authorized JavaScript origin and redirect URI for local web testing.
   - Android: package `com.swatibazal.asdimo` and the SHA-1 certificate of the build that is being tested.
   - iOS: bundle ID `com.swatibazal.asdimo`.
2. Put the three client IDs in `.env` as `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, and `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
3. Add the Android client ID to the backend `GOOGLE_CLIENT_IDS` allowlist. The backend verifies the ID token audience, so allowing only the web client ID will reject native sign-in.
4. Rebuild the native app after changing `.env` or native OAuth settings. `npx expo start --android` cannot update an already-installed standalone/development build.

The web redirect is `http://localhost:8081/`. The native Google redirect is `com.swatibazal.asdimo:/oauthredirect`, and Facebook uses `fb1083657204087096://authorize`. These schemes are configured in `app.json`; do not replace native client IDs with the browser client ID.

### Android testing requirements

Do not test this OAuth flow in Expo Go. Expo Go cannot use this app's custom `asdimo` scheme. Build and install a development or preview app instead:

```powershell
eas build --profile development --platform android
```

In Google Cloud Console, add the SHA-1 certificate belonging to the exact Android build you installed to the Android OAuth client. EAS and local builds can have different certificates, so add each fingerprint used for testing. Also set the OAuth consent screen to **Testing** and add the Google account used on the phone under **Test users**. The requested `openid`, `profile`, and `email` scopes do not require a production verification review.

For Facebook Android login, add an Android platform in Meta Developers with:

- Package name: `com.swatibazal.asdimo`
- Class name: `com.swatibazal.asdimo.MainActivity`
- Key hash generated from the SHA-1 certificate of the installed build

Enable **Facebook Login**, set the app to live or add the phone's Facebook account as a tester/developer, and rebuild after changing native settings. The backend Facebook token validation runs only after Meta has successfully returned an access token.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
