<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-fixed-top">
        <div class="container-xxl">
            <a class="navbar-brand" href="#">Navbar</a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
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
                        <a class="nav-link" href="/user/demo">Demo</a>
                    </li>
                </ul>
                <div>
                    <div v-show="isLoading" class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div v-show="!isLoading" >
                        <div v-if="!isLogin" class="d-grid gap-2">
                            <a class="btn btn-outline-light" href="/user" role="button">Login</a>
                        </div>
                        <div v-else>
                            <ul class="navbar-nav d-grid gap-2">
                                <li class="nav-item dropdown">
                                    <a
                                        class="nav-link dropdown-toggle text-end text-break text-wrap"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <img :src="pictureUrl" class="rounded-circle profile-img mx-2" alt="Profile Picture">
                                        {{name}}
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li>
                                            <a class="dropdown-item" href="/user/logout">Logout</a>
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
                isLoading:false,
                isLogin:false,
                email: '',
                name:'',
                pictureUrl:'',
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
                    .get('../userApi/GetUserData')
                    .then(({ data }) => {
                        this.email = data.email;
                        this.name = data.name;
                        this.pictureUrl = data.picture;
                        this.isLogin = true;
                    })
                    .catch((error) => {
                        this.isLogin = false;
                    });
            },
        }
    }
</script>