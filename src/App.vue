<template>
  <div id="app">
    <div id="nav">
      <MainNavBar id="navbar"/>
      <Notification
      v-if="hasContent"
      :title="notify.title"
      :message="notify.message"
      :bClass="notify.bClass"
      @close="clearNotification"
      />
    </div>
    <router-view />
  </div>
</template>

<script>

  import Notification from '@/components/global/Notification.vue';
  import MainNavBar from '@/components/global/MainNavBar.vue';
  import { fstore } from './firestore/firestore';
  
  export default {
    name: 'App',
    components: {Notification,MainNavBar},
    computed: {
      hasContent() {
        let hasContent = this.$store.getters.notification.title != null ? true : false;
        return hasContent;
      },
      notify() {
        return this.$store.getters.notification;
      },
      client() {
        return this.$store.getters['authentication/client'];
      }
      

    },
    methods: {
      clearNotification() {
        this.$store.commit('SET_NOTIFICATION_NULL');
      },

      async logOut() {
        let disconnect = await this.$store.dispatch('authentication/logout');
              
        if(disconnect == true) {
            this.$router.push('/login').then(()=>{
              this.$store.commit('SET_NOTIFICATION',{
                title:'Sesión cerrada.',
                message:'Comuniquese con la recepción para poder solicitar pedidos al cuarto. Muchas gracias.',
                bClass:'info',
              },{root:true})
          });
        }
      },

      checkPermits() {
        let client = this.client.email;
        fstore.collection("clients")
        .onSnapshot(snapshot => {
          
            let clientList = [];

            snapshot.forEach(doc => {
                clientList.push(doc.id);
            });

            if(!clientList.includes(client)){
              this.logOut();
            }

        });
      }
    },
    mounted() {
      
      
    },
    watch:{
      client(client) {
        if(client != null || client != 'undefined') {
          this.checkPermits();
        }
      }
    }
  }
  
</script>

<style>
#navbar {
  margin-bottom: 5em;
}
</style>
