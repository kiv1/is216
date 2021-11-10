<template>
    <div class="overlay">
        <div class="modal show" style="display: block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Rating & Review</h5>
                        <button type="button" style="border: none; background: white" v-on:click="closeModal()">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form">
                            <div class="row">
                                <label class="mb-1">How would you rate {{ name }}</label>

                                <div class="rating">
                                    <i
                                        v-if="ratingPreview == 0"
                                        @mouseover="ratingPreview = 1"
                                        class="bi bi-star me-1 text-warning"
                                    ></i>
                                    <i
                                        v-else
                                        @click="ratingConfirm = 1"
                                        @mouseover="ratingConfirm = 1"
                                        @mouseout="
                                            ratingConfirm != 1 ? (ratingPreview = ratingConfirm) : (ratingPreview = 1)
                                        "
                                        class="bi bi-star-fill me-1 text-warning"
                                    ></i>
                                    <i
                                        v-if="ratingPreview == 1 || ratingPreview < 2"
                                        @mouseover="ratingPreview = 2"
                                        class="bi bi-star me-1 text-warning"
                                    ></i>
                                    <i
                                        v-else
                                        @click="ratingConfirm = 2"
                                        @mouseover="ratingConfirm = 1"
                                        @mouseout="
                                            ratingConfirm != 1 ? (ratingPreview = ratingConfirm) : (ratingPreview = 1)
                                        "
                                        class="bi bi-star-fill me-1 text-warning"
                                    ></i>

                                    <i
                                        v-if="ratingPreview == 1 || ratingPreview < 3"
                                        @mouseover="ratingPreview = 3"
                                        class="bi bi-star me-1 text-warning"
                                    ></i>
                                    <i
                                        v-else
                                        @click="ratingConfirm = 3"
                                        @mouseover="ratingConfirm = 1"
                                        @mouseout="
                                            ratingConfirm != 1 ? (ratingPreview = ratingConfirm) : (ratingPreview = 1)
                                        "
                                        class="bi bi-star-fill me-1 text-warning"
                                    ></i>

                                    <i
                                        v-if="ratingPreview == 1 || ratingPreview < 4"
                                        @mouseover="ratingPreview = 4"
                                        class="bi bi-star me-1 text-warning"
                                    ></i>
                                    <i
                                        v-else
                                        @click="ratingConfirm = 4"
                                        @mouseover="ratingConfirm = 1"
                                        @mouseout="
                                            ratingConfirm != 1 ? (ratingPreview = ratingConfirm) : (ratingPreview = 1)
                                        "
                                        class="bi bi-star-fill me-1 text-warning"
                                    ></i>

                                    <i
                                        v-if="ratingPreview == 1 || ratingPreview < 5"
                                        @mouseover="ratingPreview = 5"
                                        class="bi bi-star me-1 text-warning"
                                    ></i>
                                    <i
                                        v-else
                                        @click="ratingConfirm = 5"
                                        @mouseover="ratingConfirm = 1"
                                        @mouseout="
                                            ratingConfirm != 1 ? (ratingPreview = ratingConfirm) : (ratingPreview = 1)
                                        "
                                        class="bi bi-star-fill me-1 text-warning"
                                    ></i>
                                </div>
                                <br />
                                <br />
                                <label>Leave a review for {{ name }}</label>
                                <div class="input-group">
                                    <textarea class="form-control" placeholder="Review" v-model="review"></textarea>
                                </div>
                                <p class="text-danger" v-if="reviewError">{{ reviewError }}</p>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" v-on:click="closeModal()"
                            >Cancel</button
                        >
                        <button
                            type="button"
                            :disabled="isSubmitDisabled"
                            class="btn btn-success"
                            v-on:click="submitReview()"
                            >Submit</button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'rating-modal-component',
    data() {
        return {
            ratingPreview: 1,
            ratingConfirm: 1,
            review: '',
            name: '',
            uid: '',
            reviewError: '',
        };
    },
    mounted() {},
    emits: ['closemodal', 'refresh', 'isLoading'],
    methods: {
        submitReview() {
            this.$emit('isloading');
            axios
                .post('../services/Review', {
                    uid: this.uid,
                    rating: this.ratingConfirm,
                    review: this.review,
                })
                .then(({ data }) => {
                    this.$emit('isloading');
                    this.reset();
                    this.$emit('refresh');
                    this.$emit('closemodal');
                    toast('Your review has been submitted', {
                        position: 'top-right',
                        type: 'info',
                        showIcon: 'true',
                    });
                })
                .catch((error) => {
                    this.$emit('isloading');
                    console.log(error);
                    toast(error.response.data.msg, {
                        position: 'top-right',
                        type: 'danger',
                        showIcon: 'true',
                    });
                });
        },
        closeModal() {
            this.reset();
            this.$emit('closemodal');
        },
        reset() {
            this.ratingPreview = 1;
            this.ratingConfirm = 1;
            this.reviewError = '';
            this.review = '';
        },
    },
    computed: {
        isSubmitDisabled() {
            this.review = this.review.replaceAll('^\\s+', '');
            if (this.ratingConfirm != 0 && this.review) {
                return false;
            } else {
                return true;
            }
        },
    },
};
</script>
