<template>
    <q-page class="flex flex-center">
        
        <div class="text-h4 text-white">
            Hello {{email}}
        </div>

    </q-page>
</template>

<script>

import Graphic from 'components/Graphic.vue'

export default {
    name: "PageTesting",
    components: {Graphic},

    data () {
        return {
            email: ''
        }
    },

    methods: {

    },

    mounted() {
        if (this.$auth.isSignInWithEmailLink(window.location.href)) {
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            this.email = this.$q.localStorage.getItem('emailForSignIn');
            console.log(this.email)
            if (!this.email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                this.email = window.prompt('Please provide your email for confirmation');
        }
        // The client SDK will parse the code from the link for you.
        this.$auth.signInWithEmailLink(this.email, window.location.href)
            .then(function(result) {
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
            })
            .catch(function(error) {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
            });
        }
    }
}
</script>