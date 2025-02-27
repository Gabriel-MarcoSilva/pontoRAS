<template>
  <router-view />
</template>

<script>

export default {
  name: 'App',
  components: {}
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

#alert {
    width: 80vw;
    min-height: 8vh;
    background-color: #fff;
    bottom: 0;
    left: 0vw;
    border-radius: 0 5px 5px 0;
    position: absolute;
    animation: moveIn 7s ease-in-out;
    display: flex;
    padding: 5px;
    justify-content: space-between;
}

.messageAlert {
    color: rgb(138, 43, 226);
    font-weight: bold;
    font-family: sans-serif;
}

div .setas {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: sans-serif;
    color: #fff;
    cursor: pointer;
}

.doubleInput {
    display: flex;
    width: 75%;
}

.doubleInput label {
    margin: 5px;
    width: 100%;
}

#cadastro .doubleInput input,
.oneLabel input {
    width: 100%;
    color: rgb(138, 43, 226);
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


@keyframes moveIn {
    0% {
        left: -80vw;
    }

    10% {
        left: 0;
    }

    90% {
        left: 0;
    }

    100% {
        left: -80vw;
    }
}

/*menu lateral*/

#container-dataUser {
    position: absolute;
    height: 100vh;
    width: 30vw;
    left: -30vw;
    top: 0;
    background-color: #1b1b1b;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    box-shadow: 5px 0px 10px rgb(138, 43, 226);
}

#openMenu {
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    margin: auto;
    display: flex;
    z-index: 1;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #1b1b1b;
    color: #fff;
    position: absolute;
    text-align: center;
    font-family: sans-serif;
    border-radius: 0 5px 5px 0;
    font-size: 15pt;
    box-shadow: 6px 0px 10px rgb(138, 43, 226);
}

#dataUser {
    margin: auto;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    height: 30vh;
    width: 100%;
    font-family: sans-serif;
}

#dataUser p {
    color: #fff;
}

#dataUser span {
    color: rgb(138, 43, 226);
}

#upMembreship {
    border: none;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
}

#upMembreship:hover {
    filter: drop-shadow(0 0 15px rgb(138, 43, 226));
    font-size: 12pt;
}

#formMembreship {
    margin-top: 5px;
    display: none;
    align-items: center;
}

#formMembreship input {
    height: 6vh;
    width: 50%;
    border-radius: 5px;
    border: 3px solid rgb(138, 43, 226);
    color: rgb(138, 43, 226);
    padding: 5px 10px;
    font-weight: bold;
}

#formMembreship button {
    color: rgb(138, 43, 226);
    height: 6vh;
    min-width: 20%;
    padding: 5px 15px;
    margin: auto;
    border: 3px solid rgb(138, 43, 226);
    cursor: pointer;
    font-weight: bold;
    background-color: #1b1b1b;
    border-radius: 2px;
}

#formMembreship button:hover {
    color: #1b1b1b;
    background-color: rgb(138, 43, 226);
    border: 3px solid #1b1b1b;
}
</style>
