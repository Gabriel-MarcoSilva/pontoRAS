<template>
<ComponentMenu />
  <router-view />
</template>

<script>
import ComponentMenu from './components/Menu.vue';


export default {
  name: 'App',
  components: {
    ComponentMenu
  }
}
</script>

<style>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
    background-color: #1b1b1b;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: 10px auto;
    background-color: #1b1b1b;
    min-height: 70vh;
    min-width: 30vh;
    height: 70vh;
    width: 30vw;
    border-radius: 5px;
    box-shadow: 0 0 50px rgba(138, 43, 226, 0.5);
}

.container form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
}

.container form input {
    height: 6vh;
    border: 2px solid #fff;
    border-radius: 5px;
    width: 70%;
    padding: 0 5px;
    color: rgb(138, 43, 226);
    font-weight: bold;
}

.container form button,
#menu button {
    height: 6vh;
    width: 40%;
    border: 3px solid rgb(138, 43, 226);
    background-color: #1b1b1b;
    color: rgb(138, 43, 226);
    font-weight: bold;
    cursor: pointer;
    text-transform: capitalize;
}

.container form button:hover,
#menu button:hover {
    border: 3px solid #1b1b1b;
    background-color: rgb(138, 43, 226);
    color: #1b1b1b;
}

div .setas {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: sans-serif;
    color: #fff;
    cursor: pointer;
}

.oneLabel {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 0;
}

.oneLabel label {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 15px;
}

.oneLabel label p {
    margin-right: 5px;
}

@media (max-width: 400px) {
    .oneLabel label {
        padding: 0;
        font-size: 8pt !important;
    }

    .oneLabel label span {
        font-size: 5pt !important;
    }

}
</style>
