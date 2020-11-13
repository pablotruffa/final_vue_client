<template>
  <div class="container mt-3">
      <header>
          <h1>Mis pedidos</h1><hr>
      </header>
      <main>
          <MyOrders/>
      </main>
  </div>
</template>

<script>
import MyOrders from '@/components/MyOrders'; 
export default {
    name:'Orders',
    components:{MyOrders}
}
</script>

<style>

</style>