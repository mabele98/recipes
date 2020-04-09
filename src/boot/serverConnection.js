import * as firebase from 'firebase'

export default async () => {
  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyB7JlRAeih93d_PkawJGhCPcYJJtiWx7W4",
    authDomain: "recipes-ad241.firebaseapp.com",
    databaseURL: "https://recipes-ad241.firebaseio.com",
    storageBucket: "recipes-ad241.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();
}
