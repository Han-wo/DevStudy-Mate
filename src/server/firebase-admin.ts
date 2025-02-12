/* eslint-disable */

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const sendPushNotification = async (token: string, message: string) => {
  try {
    await admin.messaging().send({
      token,
      notification: {
        title: "HobbyMate 알림",
        body: message,
      },
    });

    console.log("Push notification sent successfully!");
  } catch (error) {
    console.error("Error sending push notification", error);
  }
};

export default sendPushNotification;
