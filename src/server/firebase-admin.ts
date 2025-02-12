importScripts(
  "https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCZSfiKF9aTLykq3HllHZqzkoEKpxjNdCk",
  authDomain: "hobbymate-7069a.firebaseapp.com",
  projectId: "hobbymate-7069a",
  messagingSenderId: "855306376568",
  appId: "1:855306376568:web:240e10b43d2986b08d648d",
  databaseURL: "https://hobbymate-7069a-default-rtdb.firebaseio.com",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
