<template>
    <div v-if="mainCourses.length > 0">
        <h2>Principales</h2><hr>
        <div v-for="product in mainCourses" :key="product.id" class="mb-5">
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
    name:'Maincourses',
    computed: {
        products(){
            return this.$store.getters['products/list'];
        },
        mainCourses() {
            return this.products.filter(product => product.category.name.toLowerCase() == 'principales' && product.sellable);
        },
    },
    methods:{
        add(product) {
            this.$emit('add',product);
        },
    }
}
</script>

<style>

</style>