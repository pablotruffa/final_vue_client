export default {
    namespaced:true,
    state:{
        list:[],
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
            return state.list.find(product => product.id == id);
        },
        byName: (state) => (name) => {
            let items = state.list;
            return items.find(product => product.name.toLowerCase() == name.toLowerCase());
        },

    },
    mutations:{
        FETCHING(state, bool) {
            state.isFetching = bool;
        },
        SET_LIST(state, payload) {
            state.list = payload;
        },
    },
    actions:{
        async get(context) {
          try {
            context.commit('FETCHING', true);
            let products = await fetch(context.getters.api + '/client-products',{
              method:'GET',
              credentials:'include',
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
              }
            });
            let productsToJson = await products.json();
            context.commit('FETCHING', false);
            context.commit('SET_LIST', productsToJson);
            return true;
          
          } catch (error) {
            console.log(error);  
            return false;
          }
        },
    
    },
}