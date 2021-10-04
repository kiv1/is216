import * as Vue from 'vue';
global.Vue = Vue;
import axios from 'axios';
import bootstrap from 'bootstrap';
global.axios = axios;
import { createToast } from 'mosha-vue-toastify';
import { defineComponent } from 'vue';

import navbarComponent from './components/navbar';
import loadingComponent from './components/loading';
import modalComponent from './components/modal';
import footerComponent from './components/footer';
import createNewFolderModal from './components/createNewFolderModal';
import fileUpload from './components/fileUpload';

global.toast = createToast;
global.navbar = navbarComponent;
global.loadingPage = loadingComponent;
global.modal = modalComponent;
global.footer = footerComponent;
global.createNewFolderModal = createNewFolderModal;
global.fileUpload = fileUpload;
