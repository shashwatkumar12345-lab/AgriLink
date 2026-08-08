# AgriLink Native App

This project uses [Capacitor](https://capacitorjs.com/) to wrap the React web application into a native mobile app for Android and iOS.

## Prerequisites

1. **Node.js** installed.
2. **Android Studio** (for Android builds).
3. **Xcode** (for iOS builds - Mac only).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

## Building for Mobile

### Android

1. Build the web assets and sync with Android project:
   ```bash
   npm run cap:android
   ```
   *This command runs `npm run build`, installs the Android platform if missing, and syncs the native project.*

2. Open Android Studio to run the app:
   ```bash
   npm run cap:open:android
   ```

### iOS (Mac Only)

1. Build the web assets and sync with iOS project:
   ```bash
   npm run cap:ios
   ```

2. Open Xcode to run the app:
   ```bash
   npm run cap:open:ios
   ```

## Development Workflow

1. Make changes to your React code.
2. Run `npm run cap:sync` to rebuild the web app and copy files to native platforms.
3. Run the app again from Android Studio or Xcode.

## Native Configuration & Permissions

After adding the platforms, you must manually add the following permissions to ensure Camera, Microphone, and Geolocation features work correctly.

### Android (`android/app/src/main/AndroidManifest.xml`)

Add these lines inside the `<manifest>` tag:

```xml
<!-- Geolocation -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />

<!-- Camera & Photos -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- Audio Recording (Voice Assistant) -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### iOS (`ios/App/App/Info.plist`)

Add these keys to your Info.plist:

```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to diagnose crops and animals.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>We need access to save photos of your farm.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photos to upload crop images.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We use your location to provide local weather and market prices.</string>

<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for the voice assistant.</string>

<key>NSSpeechRecognitionUsageDescription</key>
<string>We use speech recognition for voice commands.</string>
```

## Plugins

This project is configured with the following Capacitor plugins:
- **Camera**: For taking photos of crops and animals.
- **Geolocation**: For localized weather and mapping.
- **Preferences**: For persistent local storage.
- **Filesystem**: For file management.

Wrappers for these plugins are located in `plugins/mobile.ts`.