<template>
	<v-container>
        <fb-signin-button
            :params="fbSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError"
            class="v-btn v-btn--block v-btn--contained v-btn--is-elevated v-btn--has-bg theme--light v-size--default"
            style="background-color:#4267b2; color:#fff;"
        >
            <span class="v-btn__content">
                <v-icon color="white" class="mr-3">
                    mdi-facebook
                </v-icon>Facebook
            </span>
        </fb-signin-button>
	</v-container>
</template>

<script>
    const appId = process.env.VUE_APP_FACEBOOK_ID;
	export default {
		name: 'FacebookButton',
		data: () => ({
            fbSignInParams: {
                scope: 'public_profile,email',
                return_scopes: false
            }
        }),
        async mounted(){
            await this.loadFacebookSDK(document, "script", "facebook-jssdk");
            await this.initFacebook();
        },
		methods: {
            
            async initFacebook() {
                window.fbAsyncInit = function() {
                    window.FB.init({
                    appId: appId, //You will need to change this
                    cookie: true, // This is important, it's not enabled by default
                    xfbml      : true,
                    version: "v9.0"
                    });
                };
            },
            async loadFacebookSDK(d, s, id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            },
            
            onSignInSuccess (response) {
                console.log("onSignInSuccess", response)
                if(response.status != "connected"){
                    window.FB.login(response => {
                        if (response.authResponse) {
                            console.log("authResponse", response.authResponse)
                        } 
                    });
                }
                else{
                    this.$emit('logged', response.authResponse.accessToken)
                }
            },
            onSignInError (error) {
                console.log('Login error', error)
            }
        },
	}
</script>
