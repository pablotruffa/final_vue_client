<template>
  <div>
      <h2>Mi pedido</h2><hr>
      <ul>
          <li v-for="item in cart.products" :key="item.id">
              {{item.name}} x {{item.quantity}}
          </li>
          <li>
              Total: ${{total}} ARS.
          </li>
      </ul>
      <div>
          <b-button v-b-modal.cartModal block variant="success">Ver Pedido</b-button>
          <b-modal id="cartModal" size="xl" title="Tu pedido">
            <div v-for="item in cart.products" :key="item.id" class="mb-3">
                <b-button @click="remove(item)" size="sm" variant="danger" title="eliminar">x</b-button> {{item.name}} x <strong>{{item.quantity}}</strong> (${{ item.price * item.quantity}} ARS)
                <b-button @click="decrease(item)" size="sm" class="ml-3" variant="outline-secondary" title="quitar">-</b-button>
                <b-button @click="add(item)" size="sm" class="ml-1" variant="outline-secondary" title="agregar">+</b-button>
            </div>
            <div>
                <p id="total">Total: ${{total}} ARS</p>
            </div>
            <p>Queres aclarar algo sobre el pedido?</p>
            <textarea class="form-control mb-3" cols="30" rows="5" v-model="cart.clarification"></textarea>
            <template v-slot:modal-footer>
                <b-button variant="secondary" @click="$bvModal.hide('cartModal')">Seguir comprando</b-button>
                <b-button variant="primary" @click="sendOrder">Enviar pedido</b-button>
            </template>
                
          </b-modal>
          </div>
  </div>
</template>

<script>
export default {
    name:'CartPreview',
    props:['products'],
    data:function(){
        return {
            cart:{
                products:this.products,
                clarification:null
            }
        }
    },
    computed:{
        total(){
            let total = 0;
            if(this.cart.products.length > 0){
                this.cart.products.forEach(item => {
                    total += parseInt(item.price) * item.quantity
                });
                return total;
            }
            return 0;
        },
    },
    methods:{
        add(item){
            this.$emit('add',item);
        },

        decrease(item){
            this.$emit('decrease',item);
        },

        remove(item){
            this.$emit('remove',item);
        },
        
        async sendOrder() {
            this.cart.client = this.$store.state.authentication.client.email; 
            this.cart.total = this.total;
            let response = await this.$store.dispatch('orders/order',this.cart);
            if(response.errors || response.status == 'denied') {
                this.$bvModal.hide('cartModal');
                this.$store.commit('SET_NOTIFICATION',{
                        title:'Pedido rechazado.',
                        message:'No se pudo entregar el pedido. Reintente a la brevedad.',
                        bClass: 'danger'
                });
            }else{
                this.$bvModal.hide('cartModal');
                this.$store.commit('SET_NOTIFICATION',{
                        title:'Pedido enviado.',
                        message:'Gracias por ordenar.',
                        bClass: 'success'
                });
                this.cart.products = [];
                this.cart.clarification = null;
                
                this.$store.commit('orders/ADD_ORDER',response);

            }
            
        }

    },
    watch:{
        cart:function(cart) {
            if(cart.products.length == 0){
                this.$bvModal.hide('cartModal')
            }
        }
    }
}
</script>

<style>
#cart-ul {
    list-style: none;
}

#total {
    font-size: 2rem;
}

</style>