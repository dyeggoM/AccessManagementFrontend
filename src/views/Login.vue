<template>
	<v-container>
        <v-card class="mx-auto" flat v-if="!reveal && !signUp" >
            <v-card-title style="justify-content:center;">
                <h1 style="word-break: break-word;">Sign in</h1>
            </v-card-title>
            <v-card-text style="max-width:300px; min-height:200px;" class="mx-auto" >
                <v-row >
                    <v-col cols="12" style="padding:0px;">
                        <FacebookButton @logged="facebookLogin"></FacebookButton>
                    </v-col>
                    <v-col cols="12" style="padding:0px;">
                        <GoogleButton @logged="googleLogin"></GoogleButton>
                    </v-col>
                </v-row>
                <v-row class="mt-3">
                    <v-col cols="12">
                        <v-btn block color="primary" @click="reveal=true">Sign in</v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-btn block color="secondary" @click="signUpUser()">Create account</v-btn>
                    </v-col>
                </v-row>
                <v-row class="mt-3">
                    <v-col cols="12">
                        <v-btn block text color="primary" @click="rememberPasswordDialog=true">Remember password</v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-btn block text color="secondary" @click="emailValidationDialog=true">Resend email validation</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-else-if="reveal" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;" flat >
            <v-card-title style="justify-content:center;">
                <h1 style="word-break: break-word;">Sign in</h1>
            </v-card-title>

            <v-card-text class="pb-0">
                <v-form ref="form">
                    <v-text-field type="text" label="Email" v-model="form.email" :rules="emailRules"></v-text-field>
                    <v-text-field label="Password" v-model="form.password" :append-icon="typePassword?'mdi-eye':'mdi-eye-off'" @click:append="typePassword=!typePassword" :type="typePassword?'password':'text'" :rules="passwordLoginRules"></v-text-field>

                </v-form>
            </v-card-text>
            <v-card-actions >
                <v-btn text color="secondary" @click="reveal = false" >
                    Return
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login('login')" >
                    Continue
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-if="signUp" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;" flat >
            <v-card-title style="justify-content:center;">
                <h1 style="word-break: break-word;">Create account</h1>
            </v-card-title>

            <v-card-text class="pb-0">
                <v-form ref="signUpForm">
                    <v-text-field type="text" label="Email" v-model="signUpForm.email" :rules="emailRules"></v-text-field>
                    <v-text-field v-if="!socialRegister" label="Password" v-model="signUpForm.password" :append-icon="typePassword2?'mdi-eye':'mdi-eye-off'" @click:append="typePassword2=!typePassword2" :type="typePassword2?'password':'text'" :rules="passwordRules"></v-text-field>
                    
                </v-form>
            </v-card-text>
            <v-card-actions >
                <v-btn text color="secondary" @click="signUp = false; reveal=false" >
                    Return
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login('create')" >
                    Create account
                </v-btn>
            </v-card-actions>
        </v-card>
        <div class="text-center">
            <v-dialog v-model="rememberPasswordDialog" width="500" >
            <v-card>
                <v-card-title class="headline grey lighten-2">
                    Remember password
                </v-card-title>

                <v-card-text>
                    <v-text-field type="text" label="Email" v-model="rememberPasswordEmail" :rules="emailRules"></v-text-field>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-btn color="secondary" text @click="rememberPasswordDialog = false" >
                        Close
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="rememberPassword" >
                        Remember password
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </div>
        <div class="text-center">
            <v-dialog v-model="emailValidationDialog" width="500" >
            <v-card>
                <v-card-title class="headline grey lighten-2">
                    Resend email for validation
                </v-card-title>

                <v-card-text>
                    <v-text-field type="text" label="Email" v-model="emailValidationEmail" :rules="emailRules"></v-text-field>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-btn color="secondary" text @click="emailValidationDialog = false" >
                        Close
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="emailValidation" >
                        Resend email
                    </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </div>
	</v-container>
</template>

<script>
	import { mapState, mapActions } from "vuex";
    import GoogleButton from '../components/GoogleButton';
    import FacebookButton from '../components/FacebookButton';
    import axios from "axios";
    
    const baseURL = process.env.VUE_APP_BASE_URL_API;
    const captchaKey = process.env.VUE_APP_CAPTCHA_KEY;

	export default {
		name: 'Login',
		components: { GoogleButton, FacebookButton },
		data: () => ({
            signUp:false,
            socialRegister:false,
            typePassword:true,
            typePassword2:true,
            emailRules: [
                value => !!value || 'Email required.',
                value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Enter a valid email address.'
                },
            ],
            passwordLoginRules: [
                value => !!value || 'Password requiered.'
            ],
            passwordRules: [
                value => !!value || 'Password requiered.',
                value => value.length >= 6 || 'At least 6 characters required.',
                value => {
                    const pattern = /\d/
                    return pattern.test(value) || 'Number required.'
                },
                value => {
                    const pattern = /[a-z]/
                    return pattern.test(value) || 'Lowercase required.'
                },
                value => {
                    const pattern = /[A-Z]/
                    return pattern.test(value) || 'Uppercase required.'
                },
                value => {
                    const pattern = /[!@#$%^&*)(+=._-]/
                    return pattern.test(value) || 'Special character required.'
                },
            ],
            reveal:false,
            form:{
                email:'',//'test1@test1.com',
                password:'',//'Test1!',
                recaptcha:''
            },
            signUpForm:{
                email:'',//'test1@test1.com',
                password:'',//'Test1!',
                recaptcha:''
            },
            rememberPasswordDialog:false,
            rememberPasswordEmail:"",
            emailValidationDialog:false,
            emailValidationEmail:"",

        }),
		async mounted () {
            await this.loadRecaptcha(document, "script", "google-recaptcha");
		},
        computed:{
			...mapState("shoppingCart", ["app_token", "refresh_token", "checkoutClick"]),
        },
		methods: { 
			...mapActions("shoppingCart", ["setMutation"]),
            async loadRecaptcha(d, s, id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "https://www.google.com/recaptcha/api.js?render="+captchaKey;
                fjs.parentNode.insertBefore(js, fjs);
            },
            facebookLogin(value){
                this.externalLogin('Facebook',value);
            },
            googleLogin(value){
                this.externalLogin('Google',value);
            },
            externalLogin(provider,id_token){
                window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(captchaKey, {action: 'submit'})
                        .then((token) => {
                            this.externalLoginRequest(provider,id_token,token);
                        })
                        .error(e=>console.log('Captcha execution error',e));
                })
                .error(e=>console.log('Captcha ready error',e))
            },
            externalLoginRequest(provider,id_token,token){
                axios.post(`${baseURL}Account/${provider}-login`, {Provider:provider, IdToken:id_token, Recaptcha:token})
                    .then(res => {
                        if(res.status == 200){
                            if(res.data.status == "Redirect"){
                                this.socialRegister = true;
                                this.signUp = true;
                                this.signUpForm.email = res.data.message.email;
                            }
                            if(res.data.status == "Token"){
                                window.localStorage.setItem("app_token",res.data.message.token)
                                window.localStorage.setItem("refresh_token",res.data.message.refreshToken)
                                // this.setMutation({with:res.data.message.token, property:'app_token'});
                                // this.setMutation({with:res.data.message.refreshToken, property:'refresh_token'});
                                if(this.$route.query.redirect!=null){
                                    this.$router.push(this.$route.query.redirect)
                                }
                                else{
                                    this.$router.push('/secured');
                                }
                            }
                        }
                        if(res.status == 204){
                            // this.$router.push('/');
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            },
            signUpUser(){
                this.signUp = true;
            },
            login(type){
                if(type=="login"){
                    if(this.$refs.form.validate()){
                        window.grecaptcha.ready(() => {
                            window.grecaptcha.execute(captchaKey, {action: 'login'})
                                .then((token) => {
                                    this.form.recaptcha = token;
                                    this.signIn(this.form);
                                });
                        })
                    }
                }
                if(type=="create"){
                    if(this.$refs.signUpForm.validate()){
                        window.grecaptcha.ready(() => {
                            window.grecaptcha.execute(captchaKey, {action: 'submit'})
                                .then((token) => {
                                    this.signUpForm.recaptcha = token
                                    this.register(token);
                                });
                        })
                    }
                }
            },
            register(token){
                axios.post(`${baseURL}Account/Register`, this.signUpForm)
                    .then(res => {
                            if(res.data.status == "Success"){
                                var form = {
                                    email:this.signUpForm.email,
                                    password:this.signUpForm.password,
                                    recaptcha: token
                                }
                                this.signIn(form);
                            }
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            },
            signIn(form){
                if(this.socialRegister){
                    form.token
                }
                axios.post(`${baseURL}Account/Login`, form)
                    .then(res => {
                        if(res.status== 200){
                            console.log("signIn",res.data)
                            window.localStorage.setItem("app_token",res.data.message.token)
                            window.localStorage.setItem("refresh_token",res.data.message.refreshToken)
                            // this.setMutation({with:res.data.message.token, property:'app_token'});
                            // this.setMutation({with:res.data.message.refreshToken, property:'refresh_token'});
                            if(this.$route.query.redirect!=null){
                                this.$router.push(this.$route.query.redirect)
                            }
                            else{
                                this.$router.push('/secured');
                            }
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            },
            rememberPassword(){
                window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(captchaKey, {action: 'submit'})
                        .then((token) => {
                            this.rememberPasswordRequest(token);
                        });
                })
            },
            rememberPasswordRequest(token){
                axios.get(`${baseURL}Account/send-remember-password/${this.rememberPasswordEmail}?captcha=${token}`)
                    .then((res) => {
                        if(res.status == 200){
                            this.rememberPasswordDialog = false;
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            },
            emailValidation(){
                window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(captchaKey, {action: 'submit'})
                        .then((token) => {
                            this.emailValidationRequest(token);
                        });
                })
            },
            emailValidationRequest(token){
                axios.get(`${baseURL}Account/send-email-validation/${this.emailValidationEmail}?captcha=${token}`)
                    .then((res) => {
                        if(res.status == 200){
                            this.emailValidationDialog = false;
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            },
        },
	}
</script>
<style scoped>
    .information {
        margin-top: 100px;
        margin: auto;
        display: flex;
        flex-direction: column;
    }
    .well {
        background-color: rgb(191, 238, 229);
        margin: auto;
        padding: 50px 50px;
        border-radius: 20px;
    }
    .login {
        width: 200px;
        margin: auto;
    }
    .list-item:first-child {
        margin: 0;
    }
    .list-item {
        display: flex;
        align-items: center;
        margin-top: 20px;
    }
    .button {
        margin: auto;
        border-radius:5px;
    }
</style>