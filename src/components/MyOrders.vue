<template>
    <div>
        <div v-for="order in orders" :key="order.id" class="mb-3">
        <b-card :title="'#'+order.trace" sub-title="Detalles">
        <b-card-text>
            <div v-for="product in order.cart.products" :key="product.id">
                - {{product.name}} x {{product.quantity}}
            </div>
            <div v-if="order.cart.clarification">
                -  Aclaraciones: {{order.cart.clarification}}
            </div>
            <div>
                <p>- <strong>Total:</strong> ${{order.cart.total}} ARS</p>
            </div>
        </b-card-text>
        Estado: {{order.status.name}}
        <Progress
        class="mt-1"
        :status_id="order.status.id"
        />
        </b-card>
        </div>
    </div>
</template>

<script>
import { fstore } from '../firestore/firestore';
import Progress from '../components/global/Progress';
export default {
    name:'MyOrders',
    components:{Progress},
    data:function(){
        return {
            cloud:{
                orders:[],
            }
        }
    },
    methods:{
        updateOrders(payload){
            let dataToUpdate = {
                index:null,
                status_id:null,
                status_name:null,
            }
            
            this.cloud.orders.forEach(cloudOrder => {
                if(cloudOrder.trace == payload[0].trace) {
                    
                    //Buscamos el index del elemento en el array asi lo modificamos...
                    this.orders.forEach((order,index) =>{
                        if(order.trace == payload[0].trace){
                            dataToUpdate.index = index;
                            dataToUpdate.status_id = cloudOrder.data.status.id;
                            dataToUpdate.status_name = cloudOrder.data.status.name;
                            return true;
                        }
                    });
                    
                  
                }
            });

            if(dataToUpdate.index != null) {
                this.$store.commit('orders/EDIT_ORDER_STATUS',dataToUpdate);
            }

          
            
        },

        balanceOrders() {
            let orders = this.orders;
            orders.forEach( (order,index) => {
                if(!this.cloudTraces.includes(order.trace)){
                    orders.splice(index,1);
                }
            });

            this.$store.commit('orders/SET_LIST',orders);
        }

        
    },
    computed: {
        orders() {
            return this.$store.getters['orders/list'];
        },
        client() {
            return this.$store.getters['authentication/client'];
        },
        cloudTraces() {
            let data = [];
                this.cloud.orders.forEach(order => {
                    data.push(parseInt(order.trace));
                });
            return data;    
        },
        ordersToUpdate() {
            let ordersToUpdate = [];
            this.cloud.orders.forEach( order => {
                let localOrder = this.$store.getters['orders/byTrace'](order.trace)
                if(localOrder) {
                    if(localOrder.status_id != order.data.status.id) {
                        ordersToUpdate.push(localOrder);
                    }

                }
            })

            return ordersToUpdate;
        }
        
    },
    created() {
        
        fstore.collection("orders").doc(this.client.email)
        .collection('bag')
        .onSnapshot(snapshot => {
            
            let data = [];
            snapshot.forEach(doc => {
                data.push({
                    trace:doc.id,
                    data:doc.data(),
                });
            });
            this.cloud.orders = data;

        });
        

    },

    watch: {
       ordersToUpdate(orders){

            if(orders.length > 0) {
                this.updateOrders(orders);
            }
       },
       cloud: {
            handler(newData){
                
                if(newData.orders.length < this.orders.length){
                    this.balanceOrders();
                }
            },
            deep: true
       }
    }
    
}
</script>

<style>

</style>