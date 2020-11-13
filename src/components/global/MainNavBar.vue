<template>
  <div>
  <b-navbar toggleable="lg" type="dark" variant="info" fixed="top">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <div class="container">
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <router-link to="/products" class="nav-link">Productos</router-link>
        <router-link to="/orders" class="nav-link">Mis Pedidos</router-link>
        <a v-if="connected" class="nav-link" @click="logout" id="logout">Cerrar sesión</a>
      </b-navbar-nav>
    </b-collapse>
    </div>
  </b-navbar>
</div>
</template>

<script>
export default {
    name:"MainNavBar",
    computed:{
      connected() {
        return this.$store.state.auth.logged;
      }
    },
    methods:{
      async logout(){
        let disconnect = await this.$store.dispatch('authentication/logout');
        if(disconnect == true) {
          this.$router.push('/login').then(()=>{
            this.$store.commit('SET_NOTIFICATION',{
              title:'Sesión cerrada.',
              message:'Hasta la próxima!',
              bClass:'success',
            },{root:true})
          });
        }else{
          this.$store.commit('SET_NOTIFICATION',{
              title:'Error.',
              message:'No se pudo cerrar la sesión!',
              bClass:'danger',
            },{root:true})
        }
      }
    }
}
</script>

<style>
#logout {
  cursor: pointer;
}
</style>