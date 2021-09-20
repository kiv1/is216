<template>
    <div class="overlay">
        <div class="modal show" style="display:block;" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{title}}</h5>
                        <button type="button" style="border:none;background:white;" v-on:click="$emit('closemodal')">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>{{message}}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn" :class="leftButtonColor">{{leftButtonMessage}}</button>
                        <button type="button" class="btn" :class="rightButtonColor">{{rightButtonMessage}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
    name: 'modal-component',
        data() {
            return {
                title:'',
                message:'',
                rightButtonColor:'btn-secondary',
                rightButtonMessage:'',
                leftButtonColor:'btn-primary',
                leftButtonMessage:'',
            };
        },
        mounted() {
        },
        emits: ['closemodal'],
        methods: { 
        }
    }
</script>