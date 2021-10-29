<template>
    <div class="overlay">
        <div class="modal show" style="display: block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add connnection</h5>
                        <button type="button" style="border: none; background: white" v-on:click="$emit('closemodal')">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Would you like to conenct with {{ name }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" v-on:click="$emit('closemodal')"
                            >Cancel</button
                        >
                        <button type="button" class="btn btn-success" v-on:click="connect()">Yes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'connect-modal-component',
    data() {
        return {
            name: '',
            uid: '',
        };
    },
    mounted() {
        this.$emit('isloading');
    },
    emits: ['closemodal', 'refresh', 'isloading'],
    methods: {
        connect() {
            this.$emit('isloading');
            axios
                .post('../services/Connect', {
                    uid: this.uid,
                })
                .then(({ data }) => {
                    this.$emit('isloading');
                    this.$emit('refresh');
                    toast('Your request has been sent!', {
                        position: 'top-right',
                        type: 'info',
                        showIcon: 'true',
                    });
                })
                .catch((error) => {
                    this.$emit('isloading');
                    toast(error.response.data.msg, {
                        position: 'top-right',
                        type: 'danger',
                        showIcon: 'true',
                    });
                });
        },
    },
};
</script>
