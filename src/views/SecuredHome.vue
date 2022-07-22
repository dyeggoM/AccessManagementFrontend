<template>
	<v-container>
		<h1>Secured Data:</h1>
		<p>{{data}}</p>
	</v-container>
</template>

<script>
    import axios from "axios";
	import { mapState, mapActions } from "vuex";
    const baseURL = process.env.VUE_APP_BASE_URL_API;
	export default {
		name: 'SecuredHome',
		components: { },
		data: () => ({
			data:"... Loading ...",
			
			//InactiveState
            userActivityTimeout:null,
            userActivityThrottlerTimeout:null,
			checkTimeoutTimer:null,
            isInactive:false,
            inactiveTime:null,
            inactiveTimeout:null,
		}),
		mounted () { 
			this.getData();
			//RefreshToken
			this.startRefreshTokenTimer();
			//InactiveState
            this.activateActivityTracker();
		},
		computed:{
			...mapState("shoppingCart", ["app_token", "refresh_token"]),
		},
		methods: { 
			...mapActions("shoppingCart", ["setMutation"]),

			//InactiveState
            activateActivityTracker() {
                window.addEventListener("mousemove", this.userActivityThrottler);
                window.addEventListener("scroll", this.userActivityThrottler);
                window.addEventListener("keydown", this.userActivityThrottler);
                // window.addEventListener("resize", this.userActivityThrottler);
                window.addEventListener("beforeunload", this.deactivateActivityTracker);
            },
            deactivateActivityTracker() {
                window.removeEventListener("mousemove", this.userActivityThrottler);
                window.removeEventListener("scroll", this.userActivityThrottler);
                window.removeEventListener("keydown", this.userActivityThrottler);
                // window.removeEventListener("resize", this.userActivityThrottler);
                window.removeEventListener("beforeunload", this.deactivateActivityTracker);
            },
            resetUserActivityTimeout() {
				clearTimeout(this.checkTimeoutTimer);
                clearTimeout(this.userActivityTimeout);
                this.userActivityTimeout = setTimeout(() => {
                    this.userActivityThrottler();
                    this.inactiveUserAction();
                }, 2000);
            },
            userActivityThrottler() {
                if (this.isInactive) {
                    this.isInactive = false;
                    console.log("userActivityThrottler: ","User is inactive = false")
                    this.resetUserActivityTimeout();
                }
                if (!this.userActivityThrottlerTimeout) {
                    this.userActivityThrottlerTimeout = setTimeout(() => {
                        this.resetUserActivityTimeout();
                        clearTimeout(this.userActivityThrottlerTimeout);
                    }, 1000);
                }
            },
            inactiveUserAction() {
                this.isInactive = true;
                var inactiveTime = new Date();
                this.inactiveTime = new Date();
                this.inactiveTimeout = new Date(inactiveTime.setMinutes(inactiveTime.getMinutes()+1)) //Inactive timer to logout
                console.log('inactiveTime', this.inactiveTime)
                console.log('inactiveTimeout', this.inactiveTimeout)
                console.log("inactiveUserAction: ","User is inactive = true")
                this.checkTimeout();
            },
            checkTimeout(){
                if(new Date() < this.inactiveTimeout){
                    this.checkTimeoutTimer = setTimeout(() => {
                        console.log('checkTimeout.if')
                        this.checkTimeout();
                    }, 1000);
                }
                else{
					this.revokeToken();
                    console.log('checkTimeout.else')
                }
            },
			revokeToken(){
				axios.defaults.headers.common['Authorization'] = `Bearer ${this.app_token}`;
                axios.post(baseURL + 'Account/revoke-token')
                    .then(res => {
                        if(res.status == 204){
                            this.setMutation({with:null, property:'app_token'});
                            this.setMutation({with:null, property:'refresh_token'});
							window.location.href = '/';
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                    });
			},
			//RefreshToken
			startRefreshTokenTimer(){
				console.log('startRefreshTokenTimer.app_token',this.app_token)
				const jwtToken = JSON.parse(atob(this.app_token.split('.')[1]));
				const expires = new Date(jwtToken.exp * 1000);
				const timeout = expires.getTime() - Date.now() - (60 * 1000); //refresh token timer
				setTimeout(() => this.refreshToken(), timeout);
			},
			refreshToken(){
				var form = { token:this.app_token, refreshToken: this.refresh_token }
                axios.post(baseURL + 'Account/refresh-token', form )
                    .then(res => {
						console.log('refreshToken',res)
                        if(res.status == 200){
                            this.setMutation({with:res.data.token, property:'app_token'});
                            this.setMutation({with:res.data.refreshToken, property:'refresh_token'});
							setTimeout(() => this.startRefreshTokenTimer(), 10000); //refresh token timer
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                    });
			},

            getData(){
                //TODO: Pending implementation
				axios.defaults.headers.common['Authorization'] = `Bearer ${this.app_token}`;
                axios.get(baseURL + 'WeatherForecast')
                    .then(res => {
						console.log('getData',res)
                        if(res.status == 200){
							this.data = res.data;
                        }
                    })
                    .catch(error => { 
                        console.log(error);
                    });
            },
        },
	}
</script>
