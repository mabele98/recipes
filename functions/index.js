// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


exports.createUser = functions.auth.user().onCreate((user) => {

    admin.database().ref('/users/' + user.uid).set({
        "admin": false
    });

});

exports.createPub = functions.https.onCall((data, context) => {
    
    
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }

    const user = context.auth.uid
    const name = data.name
    const id = data.id

    if (!(typeof name === 'string')) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
            'one arguments "text" containing the message text to add.');
    }

    admin.database().ref('/pubs/' + id).set({
        'owner': user,
        'name': name,
        'disable': true
    })

    admin.database().ref('/users/' + user + '/pubs/owner/' + id).set(name)

    return id
});

exports.removePub = functions.https.onCall((data, context) => {
    const owner = context.auth.uid
    const id = data.id
    const contributors = data.contributors

    admin.database().ref('/pubs/' + id).remove()

    admin.database().ref('/users/' + owner + '/pubs/owner').once('value', data => {
        var key = null
        for(let item in data.val()) {
            if(data.val()[item].id === id) key = item
        }

        admin.database().ref('/users/' + owner + '/pubs/owner/' + key).remove()
    })

    for(let friend in contributors) {
        admin.database().ref('/users/' + friend + '/pubs/contribute/' + id).remove()
    }

});
    