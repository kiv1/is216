import * as Vue from 'vue';
global.Vue = Vue;
import axios from 'axios';
import bootstrap from 'bootstrap';
global.axios = axios;
import { createToast } from 'mosha-vue-toastify';
import { defineComponent } from 'vue';
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import navbarComponent from './components/navbar';
import loadingComponent from './components/loading';
import modalComponent from './components/modal';
import footerComponent from './components/footer';
import telegramModalComponent from './components/telegrammodal';
import connectModalComponent from './components/connectmodal';

import '../css/custom.css'

global.toast = createToast;
global.navbar = navbarComponent;
global.loadingPage = loadingComponent;
global.modal = modalComponent;
global.footer = footerComponent;
global.telegramModalComponent = telegramModalComponent;
global.connectModalComponent = connectModalComponent;

global.perfectScrollbar = PerfectScrollbar;
