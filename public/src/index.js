import * as Vue from 'vue';
global.Vue = Vue;
import axios from 'axios';
import bootstrap from 'bootstrap';
global.axios = axios;
import { createToast } from 'mosha-vue-toastify';
import { defineComponent } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

import navbarComponent from './components/navbar';
import loadingComponent from './components/loading';
import modalComponent from './components/modal';
import footerComponent from './components/footer';
import telegramModalComponent from './components/telegrammodal';
import connectModalComponent from './components/connectmodal';
import ratingModalComponent from './components/ratingmodal';
import googleMap from './components/googleMap';

global.mapLoader = Loader;
global.toast = createToast;
global.navbar = navbarComponent;
global.loadingPage = loadingComponent;
global.modal = modalComponent;
global.footer = footerComponent;
global.telegramModalComponent = telegramModalComponent;
global.connectModalComponent = connectModalComponent;
global.ratingModalComponent = ratingModalComponent;
global.googleMap = googleMap;
