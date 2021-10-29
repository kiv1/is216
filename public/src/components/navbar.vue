<template>
    <nav class="navbar navbar-expand-lg navbar-fixed-top">
        <div class="container-xxl">
            <a class="navbar-brand" href="/">LOGO</a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                @click="isOpen = !isOpen"
            >
                <i class="bi" :class="{ 'bi-list': !isOpen, 'bi-x': isOpen }"></i>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/about">About</a>
                    </li>
                    <li v-if="isLogin" class="nav-item">
                        <a class="nav-link" href="/user/dashboard">Dashboard</a>
                    </li>
                    <li v-if="isLogin" class="nav-item">
                        <a class="nav-link" href="/user/mybuddy">My Buddy</a>
                    </li>
                </ul>
                <div>
                    <div v-show="isLoading" class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div v-show="!isLoading">
                        <div v-if="!isLogin" class="d-grid gap-2 text-center">
                            <a class="login" href="/user" role="button">Login</a>
                        </div>
                        <div v-else>
                            <ul class="navbar-nav d-grid gap-2">
                                <li class="nav-item dropdown">
                                    <a
                                        class="nav-link dropdown-toggle text-break text-wrap"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <img
                                            :src="pictureUrl"
                                            class="rounded-circle profile-img mx-2"
                                            alt="Profile Picture"
                                            onerror="this.onerror=null;this.src='/img/user.png';"
                                        />
                                        {{ name }}
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <a class="nav-link dropdown-item" href="/user/profile">My Profile</a>
                                        </li>
                                        <li>
                                            <a class="nav-link dropdown-item" href="/user/logout">Logout</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'navbar-component',
    data() {
        return {
            isLoading: false,
            isLogin: false,
            email: '',
            name: '',
            pictureUrl: '/img/user.png',
            isOpen: false,
        };
    },
    mounted() {
        this.isLoading = true;
        let getData = [this.getUserData()];
        Promise.all(getData).then(() => {
            this.isLoading = false;
        });
    },
    methods: {
        getUserData() {
            return axios
                .get('../services/GetUserData')
                .then(({ data }) => {
                    this.email = data.email;
                    this.name = data.email;

                    if ('name' in data) {
                        this.name = data.name;
                    }

                    if ('picture' in data) {
                        this.pictureUrl = data.picture;
                    }
                    this.isLogin = true;
                })
                .catch((error) => {
                    this.isLogin = false;
                });
        },
    },
};
</script>
