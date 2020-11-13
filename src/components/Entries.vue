<template>
    <div v-if="entries.length > 0">
        <h2>Entradas</h2><hr>
        <div v-for="product in entries" :key="product.id" class="mb-5">
            <p><strong><i>{{product.name}}</i></strong></p>
            <div v-if="product.picture">
                <img :src="product.blob" alt="imagen de la comida" width="300px">
            </div>
             <p>{{product.description}}</p>
            <p>${{product.price}} ARS</p>
            <button class="btn btn-primary" @click="add(product)">Agregar</button>
        </div>
    </div>
</template>

<script>
export default {
    name:'Entries',
    data:function(){
        return {
            pictures:[],
        }
    },
    computed: {
        products(){
            return this.$store.getters['products/list'];
        },
        entries() {
            return this.products.filter(product => product.category.name.toLowerCase() == 'entradas' && product.sellable);
        },
    },
    methods:{
        add(product) {
            this.$emit('add',product);
        },
    },
   
}
</script>

<style>

</style>