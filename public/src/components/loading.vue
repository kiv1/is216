<template>
    <div class="overlay max-z">
        <div class="d-flex flex-column h-100 justify-content-center align-items-center">
            <div class="spinner-grow text-secondary" role="status" style="width: 4rem; height: 4rem; z-index: 20">
                <span class="sr-only visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading-component',
    data() {
        return {};
    },
    mounted() {},
    methods: {},
};
</script>
