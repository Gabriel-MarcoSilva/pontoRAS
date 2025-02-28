<template>
    <section id="alert" :style="`width:${size}vw`" v-if="mensagem !== ''" :key="mensagem">
        <p class="messageAlert">{{ mensagem }}</p>
    </section>
</template>

<script>
export default {
    name: 'AlertComponent',
    props: {
        size: Number,
        message: String
    },
    emits: [
        'close'
    ],
    data () {
        return {
            mensagem: ''
        }
    },
    async mounted () {
        this.mensagem = this.message
    
        await setInterval(() => {
            this.$emit('close')
        }, 7000)
    }
}
</script>

<style scoped>

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

</style>