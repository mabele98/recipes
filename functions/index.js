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
        'name': name
    })

    admin.database().ref('/users/' + user + '/pubs/owner').push({
        'id': id,
        'name': name
    })

    return id
});

exports.contributePub = functions.https.onCall((data, context) => {
    const user = context.auth.uid
    const name = data.name
    const pub = data.pub

    admin.database().ref('/pubs/' + pub).once('value', data => {
        if(!data.exists()) {
            throw new functions.https.HttpsError('invalid-argument', 'The pub id input ' +
            'does not exist');
        }
        else {
            let pending = {}
            let ref = admin.database().ref('/pubs/' + pub + '/pending')
            ref.once('value', data => {
                if(data.exists()) pending = data.val()
                if(!(user in pending)) pending[user] = name
                ref.set(pending)

                return user
            })
        }
    })
})
    