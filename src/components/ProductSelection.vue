<template>
  <div v-if="products">
    
    <div class="row mb-5">
    
      <div class="col col-xs-10 col-sm-9">
        <Entries @add="add" v-if="entries"/>
        <MainCourses @add="add" v-if="mainCourses"/>
        <Desserts @add="add" v-if="desserts"/>
        <Beverages @add="add" v-if="beverages"/>
        <Breakfast @add="add" v-if="breakfast"/>
      </div>

    </div>

    <div id="myOrder">
      <CartButton
      v-if="selectedProducts.length > 0"
      :products="selectedProducts"
       @add="add"
       @decrease="decrease"
       @remove="remove"
       @clearProducts="clearProducts"
      />
    </div>
  </div>
</template>

<script>
import CartButton from '@/components/CartButton'
import Entries from '@/components/Entries'
import MainCourses from '@/components/MainCourses'
import Desserts from '@/components/Desserts'
import Beverages from '@/components/Beverages'
import Breakfast from '@/components/Breakfast'
export default {
    name:'ProductSelection',
    components:{CartButton,Entries,MainCourses,Desserts,Beverages,Breakfast},
    data:function(){
      return {
        selectedProducts:[],
      }
    },
    methods: {
      
       add(product) {
        let item = {
          id:product.id,
          price:product.price,
          name:product.name,
          quantity:1,
        }
        if(this.selectedProducts.length == 0) {
          this.selectedProducts.push(item);
          
        }else{
          let exists = this.selectedProducts.find(prod => prod.id == item.id);
          
          if(!exists){
            this.selectedProducts.push(item);
            
          }else{
            let index = this.selectedProducts.findIndex(prod => prod.id ==item.id)
            this.selectedProducts[index].quantity ++
          }

        }  
      }, 

      decrease(product) {
       
        if(this.selectedProducts.length == 0){return false}
        
        let item = {
          id:product.id,
          name:product.name,
          quantity:1,
        }

       
        let toDecrease = this.selectedProducts.find(prod => prod.id == item.id);
        if(toDecrease) {
          
          let index = this.selectedProducts.findIndex(prod => prod.id ==item.id);
          if(this.selectedProducts[index].quantity == 1) {
            this.selectedProducts.splice(index,1);
          }else{
            this.selectedProducts[index].quantity--;
          }
        }
        
      },

      remove(product) {
        if(this.selectedProducts.length == 0){return false}
        
        let item = {
          id:product.id,
          name:product.name,
          quantity:1,
        }
      
        let toRemove = this.selectedProducts.find(prod => prod.id == item.id);
        if(toRemove) {
          let index = this.selectedProducts.findIndex(prod => prod.id ==item.id);
          this.selectedProducts.splice(index,1);
        }
      
      },
      clearProducts() {
        this.selectedProducts = [];
      }

    },
    computed: {
        products(){
            return this.$store.getters['products/list'];
        },
        entries() {
          return this.products.filter(product => product.category.name.toLowerCase() == 'entradas' && product.sellable);
        },
        mainCourses() {
          return this.products.filter(product => product.category.name.toLowerCase() == 'principales' && product.sellable);
        },
        desserts() {
          return this.products.filter(product => product.category.name.toLowerCase() == 'postres' && product.sellable);
        },
        beverages() {
          return this.products.filter(product => product.category.name.toLowerCase() == 'bebidas' && product.sellable);
        },
        breakfast() {
          return this.products.filter(product => product.category.name.toLowerCase() == 'cafeteriaydesayuno' && product.sellable);
        },

    }
}
</script>

<style>
  #myOrder {
    position: fixed;
    bottom:1em;
    width: 90vw;
    left: 5vw;
    
  }
</style>