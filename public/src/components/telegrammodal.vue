<template>
    <div class="overlay">
        <div class="modal show" style="display: block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Telegram Handle Update</h5>
                        <button type="button" style="border: none; background: white" v-on:click="$emit('closemodal')">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form">
                            <div class="row">
                                <label>Telegram Handle</label>
                                <div class="input-group mb-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Telegram Handle"
                                        v-model="userTelegram"
                                        required
                                        :disabled="hasUserClickVerify"
                                    />
                                    <button
                                        type="button"
                                        :disabled="isTelegramVerifyButtonDisabled || hasUserClickVerify"
                                        @click="verifyUsername"
                                        class="btn btn-primary float-end"
                                        >Verify</button
                                    >
                                </div>
                                <p v-if="userTelegramError" class="text-danger">{{ userTelegramError }}</p>

                                <template v-if="hasUserClickVerify">
                                    <label>OTP</label>

                                    <div class="input-group mb-3">
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="OTP"
                                            v-model="userOTP"
                                            required
                                            :disabled="usernameVerified"
                                        />
                                        <button
                                            type="button"
                                            :disabled="usernameVerified"
                                            @click="verifyUsername"
                                            class="btn btn-primary float-end"
                                            >Resend</button
                                        >
                                        <button
                                            type="button"
                                            :disabled="!userOTP || usernameVerified"
                                            @click="verifyOTP"
                                            class="btn btn-success float-end"
                                            >Confirm</button
                                        >
                                    </div>
                                </template>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'telegram-modal-component',
    data() {
        return {
            userTelegram: '',
            usernameVerified: false,
            userOTP: '',
            hasUserClickVerify: false,
            userTelegramError: '',
        };
    },
    mounted() {},
    emits: ['closemodal', 'refresh', 'isLoading'],
    methods: {
        verifyUsername() {
            return axios
                .post('../services/CheckTelegramHandle', {
                    handle: this.userTelegram,
                })
                .then(({ data }) => {
                    this.hasUserClickVerify = true;
                    toast('OTP has been sent to the Telegram handle', {
                        position: 'top-right',
                        type: 'info',
                        showIcon: 'true',
                    });
                })
                .catch((error) => {
                    toast(error.response.data.msg, {
                        position: 'top-right',
                        type: 'danger',
                        showIcon: 'true',
                    });
                });
        },
        verifyOTP() {
            return axios
                .post('../services/VerifyOTP', {
                    handle: this.userTelegram,
                    otp: this.userOTP,
                })
                .then(({ data }) => {
                    this.usernameVerified = true;
                    this.resetTelegram();
                    this.$emit('refresh');
                    toast('Telegram has been verified', {
                        position: 'top-right',
                        type: 'info',
                        showIcon: 'true',
                    });
                })
                .catch((error) => {
                    toast(error.response.data.msg, {
                        position: 'top-right',
                        type: 'danger',
                        showIcon: 'true',
                    });
                });
        },
        resetTelegram() {
            this.userTelegram = '';
            this.usernameVerified = false;
            this.userOTP = '';
            this.hasUserClickVerify = false;
        },
    },
    computed: {
        isTelegramVerifyButtonDisabled() {
            this.userTelegram = this.userTelegram.trim();
            this.userTelegramError = '';
            if (!this.userTelegram) {
                return true;
            } else {
                if (this.userTelegram.startsWith('@')) {
                    this.userTelegramError = 'Please remove the @ character';
                    return true;
                } else {
                    return false;
                }
            }
        },
    },
};
</script>
