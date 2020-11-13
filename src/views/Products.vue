<template>
  <div class="container mt-3">
      <header>
          <h1>Menu</h1><hr>
      </header>
      <main>
          <ProductSelection/>
      </main>
  </div>
</template>

<script>
import ProductSelection from '@/components/ProductSelection'
export default {
    name: 'ClientProducts',
    components: {ProductSelection}
}
</script>

<style>

</style>