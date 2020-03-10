import Flurry from 'react-native-flurry-sdk';
import { FLURRY_ANDROID_API_KEY,FLURRY_IOS_API_KEY } from '../Utilities/Constants';


export function runFlurry () {
    // new Flurry.Builder()
    // .withCrashReporting(true)
    // .withLogEnabled(true)
    // .withLogLevel(Flurry.LogLevel.DEBUG)
    // .build(FLURRY_ANDROID_API_KEY, FLURRY_IOS_API_KEY);
    // // const flurry = Flurry.Builder()
    // // Set, get, log Flurry events in anywhere of your codes.
    // // Example to get Flurry versions.
    // Flurry.getVersions().then((versions) => {
    // console.log('Versions: ' + versions.agentVersion + ' : ' + versions.releaseVersion + ' : ' + versions.sessionId);
    // });

    // // Set user preferences.
    // // Flurry.setAge(36);
    // // Flurry.setGender(Flurry.Gender.FEMALE);
    // Flurry.setReportLocation(true);
    new Flurry.Builder()
    .withCrashReporting(true)
    .withLogEnabled(true)
    .withLogLevel(2)
    .build(FLURRY_ANDROID_API_KEY, FLURRY_IOS_API_KEY);

    console.log('this shit!!')
}

// Set user properties.
// Flurry.UserProperties.set(Flurry.UserProperties.PROPERTY_REGISTERED_USER, 'True');


// / Log Flurry events.
// Flurry.logEvent('React Native Event');
// Flurry.logEvent('React Native Timed Event', {param: 'true'}, true);
// Flurry.endTimedEvent('React Native Timed Event');

// Example to get Flurry Remote Configurations.
// Flurry.addConfigListener((event) => {
//   if (event.Type === Flurry.ConfigStatus.SUCCESS) {
//     // Data fetched, activate it.
//     Flurry.activateConfig();
//   } else if (event.Type === Flurry.ConfigStatus.ACTIVATED) {
//     // Received cached data, or newly activated data.
//     Flurry.getConfigString('welcome_message', 'Welcome!').then((value) => {
//       console.log((event.isCache ? 'Received cached data: ' : 'Received newly activated data: ') + value.welcome_message);
//     });
//   } else if (event.Type === Flurry.ConfigStatus.UNCHANGED) {
//     // Fetch finished, but data unchanged.
//     Flurry.getConfigString('welcome_message', 'Welcome!').then((value) => {
//       console.log('Received unchanged data: ' + value.welcome_message);
//     });
//   } else if (event.Type === Flurry.ConfigStatus.ERROR) {
//     // Fetch failed.
//     console.log('Fetch error! Retrying: ' + event.isRetrying);
//   }
// });

// Flurry.fetchConfig();

// To enable Flurry Messaging for Android, please duplicate Builder setup in your MainApplication.java.
// Call additional withMessaging(true) in your Flurry init. 
// new Flurry.Builder()
//   .withMessaging(true)


// Optionally add a listener to receive messaging events, and handle the notification.
// Please call required Flurry.willHandleMessage(boolean) when received event types of
// MessageType.RECEIVED or MessageType.CLICKED as soon as possible to avoid delay.
// Flurry.addMessagingListener((message) => {
//   if (message.Type === Flurry.MessageType.RECEIVED) {
//     Flurry.willHandleMessage(false);
//   } else if (message.Type === Flurry.MessageType.CLICKED) {
//     Flurry.willHandleMessage(false);
//   }

//   Flurry.printMessage(message);
// });