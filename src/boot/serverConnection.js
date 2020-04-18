import firebase from 'firebase'

export default async ({Vue}) => {
  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyB7JlRAeih93d_PkawJGhCPcYJJtiWx7W4",
    authDomain: "recipes-ad241.firebaseapp.com",
    projectId: 'recipes-ad241',
    databaseURL: "https://recipes-ad241.firebaseio.com",
    storageBucket: "recipes-ad241.appspot.com"
  };
  firebase.initializeApp(config);


  // Get a reference to the database service
  //var database = firebase.database();

  Vue.prototype.$database = firebase.database();
  Vue.prototype.$auth = firebase.auth();

  Vue.prototype.$storage = firebase.storage();
  Vue.prototype.$functions = firebase.functions();
}

