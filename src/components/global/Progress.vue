<template>
    <div class="progress">
        <div :class="animation" role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100" :style="style"></div>
    </div>
</template>

<script>
export default {
    name:'Progress',
    props:['type','status_id'],
    data:function(){
        return {
            progress:{
                type:this.type,
                status_id:this.status_id
            },
            
        }
    },
    computed:{
        percentage() {
            return this.convert(this.status_id);
        },
        style() {
            return `width:${this.percentage}%`;
        },
        animation(){
            if(this.animatable(this.status_id)){
                return 'progress-bar progress-bar-striped progress-bar-animated'
            }else{
                let bg = null;
                if(this.status_id == 4) {
                    bg = 'bg-success';
                }else{
                    bg = 'bg-danger';
                }
                return `progress-bar ${bg}`;
            }
        },
        class() {
            return true;
        }
    },
    methods:{
        convert(status_id){
            let response = null;
            switch(status_id) {
                case 1: response = 25; break;
                case 2: response = 50; break;
                case 3: response = 75; break;
                case 4: response = 100; break;
                case 5: response = 100; break;
            }
            return response;
        },
        animatable(integer){
            if(integer == 5 || integer == 4){
                return false;
            }
            return true;
        }
    }
}
</script>

<style>

</style>