# Preview Link
### [Preview][previewLink]
> Note: Building on server takes at least 10 - 20 minutes. Do be patient

# Prerequisite

**Please install the following first**

### - [Node js][nodelink]

### - [Yarn][yarnlink]

### - [VsCode][vscodelink]

> Note: Ensure that VsCode has the Prettier plugin
> VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

[nodelink]: https://nodejs.org/dist/v14.17.6/node-v14.17.6-x64.msi
[yarnlink]: https://yarnpkg.com/getting-started/install
[vscodelink]: https://code.visualstudio.com
[previewLink]: https://is216.azurewebsites.net/

# After clonning the repo

```sh
npm install
yarn watch
```

# Running the project

### Do ensure you get the enviroment variable from me first

> Note: `node app.js` is to be executed on the folder.

```sh
. "path/to/enviromentVariable.sh"
node app.js
```

# Project Structure

`logic` folder contains the logic for backend api  
`src` folder contains the components and the `index.js` for webpack to bundle  
`routes` folder is to route user link to the appropriate resources  
`viewApis` folder is to get api from the backend by using axios  

# Things to note

To add component do ensure that `index.js`has the component registered and is available globally.
Ensure `yarn watch` is running or executed after registering the component.

```sh
import navbarComponent from './components/navbar';
global.navbar = navbarComponent;
```

To use component on a page ensure that the component is registered on the HTML page

```sh
<navbar-component></navbar-component>
app.component('navbar-component', navbar);
```

Vue has already been installed and bundled in the `bundle.js`
Every HTML page should have the following in the head

```sh
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="/css/bootstrap.min.css" />
    <script src="/dist/bundle.js"></script>
    <link rel="stylesheet" href="/css/bootstrap-icons.css" />
```

The following script should be at the bottom

```sh
    <script>
        const app = Vue.createApp({
            el: '#app',
            data() {
                return {
                    isLoading: false,
                };
            },
            mounted() {
            },
            methods: {},
        });
        app.component('navbar-component', navbar);
        app.component('loading-component', loadingPage);
        app.mount('#app');
    </script>
```

To add custom css please add it in `style.css` found in **public/stylesheets**
