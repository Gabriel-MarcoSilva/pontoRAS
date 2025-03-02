<template>
    <section class="container" id="login">
        <div>
            <a @click="newCad()" class="setas">sig in</a>
        </div>
        <form id="formLogin" method='get' @submit.prevent="login()">
            <div>
                <img src="../assets/roboRAS.min.png" alt="roboRAS">
            </div>
            <div class="oneLabel">
                <label style="display: flex; flex-direction: column; color: #fff;">
                    <p style="text-align: start; width: 70%; font-size: 10pt;">Matrícula: <span
                            style="font-size: 8pt;">(somente números)</span></p>
                    <input v-model="matricula" name="matricula" type="text" placeholder="Matrícula" maxlength="10">
                </label>
            </div>
            <div class="oneLabel">
                <label style="display: flex; flex-direction: column; color: #fff;">
                    <p style="text-align: start; width: 70%; font-size: 10pt;">Senha:</p>
                    <input v-model="senha" name="senha" type="password" placeholder="Senha">
                </label>
            </div>
            <button type="submit">entrar</button>
        </form>
    </section>
    <Alert :message="message" :size="size" @close="this.message = ''" :key="message"/>

    <section class="container" id="error" style="display: none;"></section>
</template>

<script>

import { decodeToken } from '@/plugins/auth';
import { onAPI, setLogin } from '@/services';
import Alert from './Alert.vue';

export default{
    name: 'ComponentLogin',
    components: {
        Alert
    },
    emits: [ 'openMenu' ],
    data () {
        return {
            matricula: '',
            senha: '',
            message: '',
            size: 0
        }
    },
    mouted () {
        this.loading()
    },
    methods: {
        async loading() {
            await onAPI()

            const verify = localStorage.getItem('token') && localStorage.getItem('timeInit')
            if (!verify) {
                document.getElementById('formLogin').reset()
                localStorage.clear()
            } else {
                this.$router.push('/pontoRAS/inicio');
            }
        },

        async login() {
            const payload = {
                matricula: this.matricula,
                senha: this.senha
            }

            const login = await setLogin(payload);

            if (login.status) {
                localStorage.setItem('token', login.accessToken)
                const horarioMarcado = localStorage.getItem('timeInit')
                if (horarioMarcado !== null || horarioMarcado !== undefined) {
                    const hour = new Date()
                    localStorage.setItem('timeInit', hour.toLocaleTimeString())
                    localStorage.setItem('dataInit', hour.toLocaleDateString())
                }
                this.$emit('openMenu')
                decodeToken()
                this.$router.push('/pontoRAS/inicio')
            } else {
                this.message = 'Matrícula e/ou senha incorretas'
                this.size = 20
            }
        },

        newCad() {
            this.$router.push('/pontoRAS/cadastro')
        }
    }
}
</script>

<style scoped>
    @media (max-width: 400px) {
        .container {
            width: 70vw;
        }

        .setas {
            font-size: 8pt !important;
        }
    }
</style>