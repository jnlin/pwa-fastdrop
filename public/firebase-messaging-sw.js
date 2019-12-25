// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  projectId: 'lily-project-212614',
  messagingSenderId: '515097025141',
  apiKey: 'AIzaSyD7SbqDIJ0qz9Qg7OJh7i8QO5KtagfRuNQ',
  appId: '1:515097025141:web:a9e8415b56aa56c6ecb63c'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
