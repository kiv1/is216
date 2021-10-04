<template>
    <div class="overlay">
        <div class="modal show" style="display: block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ title }}</h5>
                        <button type="button" style="border: none; background: white" @click="resetModal">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input type="text" class="form-control" v-model="newFolderName" placeholder="Folder Name" />
                    </div>
                    <div class="modal-footer">
                        <div class="row w-100 text-center">
                            <div class="col">
                                <button @click="resetModal" type="button" class="btn" :class="leftButtonColor">{{
                                    leftButtonMessage
                                }}</button>
                            </div>
                            <div class="col">
                                <button @click="createNewFolder" type="button" class="btn" :class="rightButtonColor">{{
                                    rightButtonMessage
                                }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'create-new-folder-modal',
    data() {
        return {
            title: 'Create new folder',
            newFolderName: '',
            folderId: '',
            drive: '',
            rightButtonColor: 'btn-outline-primary',
            rightButtonMessage: 'Confirm',
            leftButtonColor: 'btn-outline-danger',
            leftButtonMessage: 'Cancel',
            errorMsg: '',
        };
    },
    mounted() {},
    emits: ['closemodal', 'isloading'],
    methods: {
        createNewFolder() {
            this.$emit('isloading');
            axios
                .post('../userApi/CreateNewFolder', {
                    folderId: this.folderId,
                    newFolderName: this.newFolderName,
                    drive: this.drive,
                })
                .then((response) => {
                    //console.log(response);
                    location.reload();
                })
                .catch((error) => {
                    //console.log(error);
                    this.$emit('isloading');
                    this.errorMsg = error.response.data.msg;
                });
        },
        resetModal() {
            this.newFolderName = '';
            this.$emit('closemodal');
        },
    },
};
</script>
