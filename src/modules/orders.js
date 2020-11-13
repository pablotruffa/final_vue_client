import { fstore } from '../firestore/firestore'; 
export default {
    namespaced:true,
    state:{
        list:[],
        isOrdering:false,
        isFetching:false,
    },

    getters:{
        api: (state, getters, rootState) => {
            return rootState.api_route;
        },
        list: (state) => {
            return state.list;
        },
        byId: (state) => (id) => {
            return state.list.find(order => order.id == id);
        },
        byTrace: (state) => (trace) => {
            return state.list.find(order => order.trace == trace);
        },
        
    },

    mutations:{
        ORDERING(state,bool) {
        state.isOrdering = bool;
        },
        ADD_ORDER(state,payload) {
            state.list.push(payload);
        },
        SET_LIST(state,payload) {
            state.list = payload;
        },
        FETCHING(state, bool) {
            state.isFetching = bool;
        },
        EDIT_ORDER_STATUS(state,payload) {
            state.list[payload.index].status_id   = payload.status_id;
            state.list[payload.index].status.id   = payload.status_id;
            state.list[payload.index].status.name = payload.status_name;
        },
        

    },

    actions:{

        async get(context,client) {
            try {
                context.commit('FETCHING',true);
                let orders = await fetch(context.getters.api + `/client-orders/${client.id}`,{
                    method:'GET',
                    credentials:'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });

                let response = await orders.json();
                if(response.errors){return false}
                context.commit('SET_LIST',response);
                context.commit('FETCHING',false);
                return response;
            } catch (error) {
                console.log(error);
            }
        },

        async order(context,payload) {
            context.commit('ORDERING',true);
            try {
                let order = await fetch(context.getters.api + '/client-order', {
                    method:'POST',
                    credentials: 'include',    
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });
                
                let response = await order.json();
                if(response.errors){
                    return false;
                }else{

                    context.commit('ORDERING',false);
    
                    //Save order in Firebase...
                    let trace = ''+response.trace;
                    fstore.collection('orders').doc(payload.client)
                    .collection('bag').doc(trace)
                    .set({
                        client:payload.client,
                        created_at: response.created_at,
                        status:{
                            id:response.status_id,
                            name:response.status.name,
                        }
                    }).then(function(){
                        fstore.collection('notifications').doc(trace).set({
                            created_at:response.created_at,
                        })
                    });
    
                    return response;
                }
                
            } catch (error) {
                console.log(error);
                context.commit('ORDERING',false);
                return false;
            }

        },

    },

}