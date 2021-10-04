<template>
    <DropZone
        ref="dropzone"
        :url="url"
        :maxFiles="4"
        :uploadOnDrop="false"
        :multipleUpload="false"
        :parallelUpload="4"
        @uploaded="refreshData()"
    />
    <div class="row text-center">
        <!-- <div class="col">
            <button type="button" :disabled="isEmpty" @click="removeAllFiles()" class="btn btn-outline-danger"
                >Clear</button
            >
        </div> -->
        <div class="col">
            <button class="btn btn-outline-primary" :disabled="isEmpty" @click="uploadFiles()" role="button"
                >Upload</button
            >
        </div>
    </div>
</template>

<script>
import DropZone from 'dropzone-vue';

export default {
    components: {
        DropZone,
    },
    name: 'fileUpload',
    setup() {
        return {};
    },
    props: ['drive', 'driveid'],
    data() {
        return {
            url: '/userApi/file-upload?drive=' + this.drive + '&driveId=' + this.driveid,
            filesToUpload: [],
        };
    },
    methods: {
        uploadFiles() {
            this.$refs.dropzone.processQueue();
        },
        refreshData() {
            let filesObj = JSON.parse(JSON.stringify(this.$refs.dropzone.all));
            let fileArray = Object.keys(filesObj).map((key) => [filesObj[key]]);
            if (fileArray.every((obj) => obj[0].status === 'DONE')) {
                this.$emit('refreshpage');
            } else {
                this.$emit('refreshfile');
            }
        },
    },
    computed: {
        isEmpty() {
            return false;
            // return this.$refs.dropzone.all || this.$refs.dropzone.all.length === 0;
        },
    },
    watch: {
        url(newVal) {
            this.url = newVal;
            this.$forceUpdate();
        },
    },
};
</script>
