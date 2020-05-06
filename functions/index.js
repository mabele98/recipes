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

    admin.database().ref('/users/' + owner + '/pubs/owner/' + id).remove()

    for(let friend in contributors) {
        admin.database().ref('/users/' + friend + '/pubs/contribute/' + id).remove()
    }

});

exports.createRecipe = functions.https.onCall((data, context) => {
    const id = data.id
    const recipe = data.recipe
    const ingredients = data.ingredients
    const pub = data.pub
    const user = context.auth.uid
    
    if(pub !== null) {
        admin.database().ref('/pubs/' + pub + '/owner').once('value', data => {
            if(data.val() === user) {
                admin.database().ref('/pubs/' + pub + '/recipes').push(recipe)
                .then((snap) => {
                    const key =  snap.key
                    for(let item in ingredients) {
                        admin.database().ref('/pubs/' + pub + '/recipes/' + key + '/ingredients').push(ingredients[item])
                    }
                    return('success')
                })
                .catch((error) => {
                    throw new functions.https.HttpsError(error);
                })
            }
            else {
                admin.database().ref('/pubs/' + pub + '/recipes/pending').push(recipe)
                .then((snap) => {
                    const key = snap.key
                    for(let item in ingredients) {
                        admin.database().ref('/pubs/' + pub + '/recipes/pending/' + key + '/ingredients').push(ingredients[item])
                    }
                    return('success')
                })
                .catch((error) => {
                    throw new functions.https.HttpsError(error);
                })
            }
        })
    }
    else{
        admin.database().ref('/users/' + user + '/admin').once('value', data => {
            if(!data.val()) {
                throw new functions.https.HttpsError('user not admin', 'The function must be called ' +
                'while authenticated.');
            }
            admin.database().ref('/recipes/' + id).push(recipe)
            .then((snap) => {
                const key = snap.key
                for(let item in ingredients) {
                    admin.database().ref('/recipes/' + id + '/' + key + '/ingredients').push(ingredients[item])
                    .then((shot) => {
                        const k = shot.key
                        admin.database().ref('/ingredients/').once('value', info => {
                            const type = ingredients[item].type
                            const name = ingredients[item].name
                            let found = false
                            for(let id in info.val()) {
                                if(info.val().type === type) {
                                    if(info.val().name === name) {
                                        admin.database().ref('/ingredients/' + id + '/keys/').push(k)
                                        found = true
                                    }
                                }
                            }
                            if(!found){
                                admin.database().ref('/ingredients/').push({
                                    'name': name,
                                    'type': type
                                }).then((value) => {
                                    admin.database().ref('/ingredients/' + value.key + '/keys/').push(k)
                                    return('success')
                                }).catch(error => {
                                    throw new functions.https.HttpsError(error);
                                })
                            }
                        })
                        return('success')
                    })
                    .catch((error) => {
                        throw new functions.https.HttpsError(error);
                    })
                }
                return('success')
            })
            .catch((error) => {
                throw new functions.https.HttpsError(error);
            })
        })
    }
})
    