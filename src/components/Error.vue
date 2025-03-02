<template>
    <section id="container-error">
        <img src="../assets/roboRAS.min.png" alt="robô ras">
        <h1>Página não encontrada</h1>
        <h3 @click="$router.push('/')" class="click">clique aqui para retornar</h3>
    </section>
</template>

<script>
export default {
    name: 'ErrorComponent'
}
</script>

<style scoped>

#container-error {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.click {
    padding: 15px 20px;
    color: #000;
    cursor: pointer;
    background-color: rgba(255,255,255,0.5);
    font-family: sans-serif;
    border-radius: 5px;
}

.click:hover{
    background-color: #fff;
    font-weight: bold;
}
</style>