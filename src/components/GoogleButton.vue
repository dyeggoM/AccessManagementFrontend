<template>
	<v-container>
        <g-signin-button
            :params="googleSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError"
            class="v-btn v-btn--block v-btn--contained v-btn--is-elevated v-btn--has-bg theme--light v-size--default"
            style="background-color:#DB4437; color:#fff;"
        >
            <span class="v-btn__content">
                <v-icon color="white" class="mr-3">
                    mdi-google
                </v-icon>Google
            </span>
        </g-signin-button>
	</v-container>
</template>

<script>
    const clientId = process.env.VUE_APP_GOOGLE_ID;
	export default {
		name: 'GoogleButton',
		components: { },
		data: () => ({
            googleSignInParams: {
                client_id: clientId
            }
        }),
		methods: {
            onSignInSuccess (googleUser) {
                for(var key in googleUser){
                    if(googleUser[key].id_token != undefined){
                        this.$emit('logged', googleUser[key].id_token)
                        break;
                    }
                }
            },
            onSignInError (error) {
                console.log('Login error', error)
            }
        },
	}
</script>
<style>
.g-signin-button {
    background-color: #DB4437;
    color: #fff;
}
</style>