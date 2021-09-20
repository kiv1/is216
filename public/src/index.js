import * as Vue from 'vue';
global.Vue = Vue;
import axios from 'axios';
global.axios = axios;
import bootstrap from 'bootstrap';

import navbarComponent from './components/navbar';
import loadingComponent from './components/loading';
import modalComponent from './components/modal';

global.navbar = navbarComponent;
global.loadingPage = loadingComponent;
global.modal = modalComponent;
