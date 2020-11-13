import { fauth } from '../firestore/firestore';
export default {
    namespaced: true,
    state:{
        isLogginIn:false,
        isLogginOut:false,
        client: {
            id:null,
            room_number:null
        }
    },

    getters:{
        api: (state, getters, rootState) => {
            return rootState.api_route;
        },
        client: (state) => {
            return state.client;
        }
    },

    mutations:{
        LOGIN(state,bool) {
            state.isLogginIn = bool;
        },
        LOGING_OUT(state,bool) {
            state.isLogginOut = bool;
        },
        SET_CLIENT(state, payload) {
            state.client = payload
        }
    },

    actions:{
        async login(context,clientCredentials) {
            try {
                context.commit('LOGIN',true);
                const laravelAuth = await fetch(context.getters.api + '/client-login',{
                    method:'POST',
                    credentials:'include',
                    body:JSON.stringify(clientCredentials),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                }).then(res => res.json());

                await fauth.signInWithEmailAndPassword(clientCredentials.email, clientCredentials.password).catch(function(error) {
                    // Handle Errors here.
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    // ...
                });

                if(laravelAuth.status == 'logged-in' && laravelAuth.email === fauth.currentUser.email) {
                    
                    context.commit('SET_CLIENT',{
                        id:laravelAuth.id,
                        client:laravelAuth.client,
                        email:laravelAuth.email,
                    });
                    context.commit('SET_AUTH',{
                        logged:true,
                        level:'client',
                    },{root:true});
                    return laravelAuth;
                }else if(laravelAuth.status == 'logged-in' && fauth.currentUser == null) {
                    return 'network-issue';
                }else{
                    return false;
                }
                
            } catch (error) {
                console.log(error);
                return false;
            }
        },

        async logout(context) {
            try {
                context.commit('LOGING_OUT',true);
                const laravelLogout = await fetch(context.getters.api + '/client-logout',{
                    method:'GET',
                    credentials:'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    }

                });

                await fauth.signOut()
                .catch(function(error) {
                    console.log(error);
                });
                  
                

               
                if(laravelLogout.errors){
                    return false;
                }else{
                    context.commit('LOGING_OUT',false);
                    context.commit('SET_AUTH',{
                    logged:null,
                    level:null,
                    },{root:true});
                    context.commit('SET_CLIENT',{
                        id:null,
                        client:null,
                    });
                    return true;
                    
                }
                
                
            } catch (error) {
              return false;
            }
        }

    },

}