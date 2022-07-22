<template>
  <v-app>
		<v-app-bar app :color="scrolled?'white':'transparent'" v-if="isMobile || this.$vuetify.breakpoint.name=='xs' || this.$vuetify.breakpoint.name=='sm'" >
			<div class="d-flex align-center" v-scroll="handleScroll" style="margin:0px;">
				<img alt="logo" src="./assets/logo.png" class="navBarLogo" />
			</div>
			<v-spacer></v-spacer>
			<v-speed-dial
				v-model="fab"
				direction="bottom"
				transition="slide-y-transition"
			>
				<template v-slot:activator>
					<v-btn
						v-model="fab"
						color="transparent"
						fab
						small
					>
						<v-icon v-if="fab">
							mdi-close
						</v-icon>
						<v-icon v-else>
							mdi-dots-vertical
						</v-icon>
					</v-btn>
				</template>
				<v-list elevation=5>
					<v-list-item v-if="app_token == null">
							<a @click="$router.push('/')" class="nav-button" :class="{'text-yellow':this.$route.path=='/'}">
								Login
							</a>	
					</v-list-item>
					<v-list-item v-if="app_token != null">
							<a @click="signOut" class="nav-button">
								Logout
							</a>	
					</v-list-item>

				</v-list>
			</v-speed-dial>

		</v-app-bar>

		<v-app-bar app :color="scrolled?'white':'transparent'" v-else elevate-on-scroll shrink-on-scroll prominent>
			<div class="d-flex align-center" v-scroll="handleScroll" style="margin:0px;">
				<img v-if="scrolled" alt="logo" src="./assets/logo.png" class="navBarLogo" />
				<img v-else alt="logo" src="./assets/logo.png" class="navBarLogoFirst" />
			</div>
			<v-spacer></v-spacer>
			<v-btn v-if="app_token == null" text :x-large="!scrolled" :outlined="this.$route.path=='/'" @click="$router.push('/')">
				Login
			</v-btn>
			<v-btn v-if="app_token != null" text :x-large="!scrolled" @click="signOut">
				Logout
			</v-btn>
		</v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: 'App',
  components: {  },
  data: () => ({
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
    scrolled: false,
    direction: 'top',
    fab: false,
    transition: 'slide-y-reverse-transition',
  }),
  mounted(){
  },
  methods:{
    ...mapActions("shoppingCart", ["logout", "setMutation"]),
    handleScroll(){
      if(window.scrollY > 1){
        this.scrolled = true;
      }
      else{
        this.scrolled = false;
      }
    },
    signOut(){
      this.logout();
      this.$router.push('/login');
    }
  },
  computed:{
    ...mapState("shoppingCart", ["app_token",  ]),
  },
};
</script>

<style>
a{
	text-decoration: none;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* text-align: center; */
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: white;
}

#nav a.router-link-exact-active {
	color: #7fbef1;
}
.noSelect{
	user-select: none;
}
</style>