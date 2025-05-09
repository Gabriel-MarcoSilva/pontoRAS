<template>
    <div class="container-altera-dados">
        <form id="formCadastro" @submit.prevent="alteraDados()">

            <div class="container-inputs">
                <p class="p">Nome: </p>
                <input class="input" type="text" v-model="nome" placeholder="Nome">
            </div>
            <div class="container-inputs">
                <p class="p">Matricula: </p>
                <input class="input" @input="matricula = matricula.replace(/\D/g, '')" maxlength="10" type="text" v-model="matricula" placeholder="Matrícula">
            </div>
            <div class="container-inputs">
                <p class="p">Curso: </p>
                <input class="input" type="text" v-model="curso" placeholder="Curso">
            </div>
            <div class="container-inputs">
                <p class="p">Número Membresia: </p>
                <input class="input" type="text" @input="numMembresia = numMembresia.replace(/\D/g, '')" maxlength="8" v-model="numMembresia" placeholder="Membresia">
            </div>
            <div class="container-inputs">
                <p class="p">Senha: </p>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <input class="input" v-if="!verSenha" type="password" v-model="senha" placeholder="Senha">
                    <input class="input" v-else type="text" v-model="senha" placeholder="Senha">
                    <div class="container-eyes">
                        <v-icon @click="verSenha = !verSenha" v-if="!verSenha" >mdi-eye</v-icon>
                        <v-icon @click="verSenha = !verSenha" v-else >mdi-eye-off</v-icon>
                    </div>
                </div>
            </div>

            <div class="contianer-button-altera">
                <button type="submit">Alterar</button>
                <button type="button" @click="closeModal">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<script>
import { upDataUser } from '@/services'

export default {
    name: 'AlteraDados',
    emits: ['close', 'message'],
    data () {
        return {
            nome: '',
            curso: '',
            numMembresia:'',
            senha: '',
            matricula: '',

            verSenha: false,
            dadosUser: {}
        }
    },
    mounted () {
        this.dadosUser = JSON.parse(localStorage.getItem('dataUser'))

        if(!this.dadosUser) {
            localStorage.clear()
        }
    },
    methods: {
        async alteraDados () {
            const payload = {
                id: this.dadosUser.uid,
                matricula: this.matricula,
                curso: this.curso,
                membresia: this.numMembresia !== '' ? this.numMembresia + '/ON' : '101010/OFF',
                nome: this.nome,
                senha: this.senha
            }

            const update = await upDataUser(payload)

            if (update.status) {
                this.$emit('message', {message: 'Dados atualizados com sucesso!', size: 60})
                this.closeModal()
            } else {
                this.$emit('message', {message: 'Não foi possível atualizar seus dados, tente novamente mais tarde', size: 90})
            }


        },

        closeModal () {
            this.$emit('close')
        }
    }
}
</script>


<style scoped>

#formCadastro{
    width: 100%;
}

.container-altera-dados{
    width: 40vw;
    height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: #1b1b1b;
    position: absolute;
    border: 20px;
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
}

.container-inputs {
    width: 80%;
}

.container-eyes {
    width: 20%; display: flex; align-items: center; justify-content: center;
    color: #8a2be2;
}

.container-eyes:hover {
    color: #fff;
}

.contianer-button-altera {
    display: flex;
    width: 80%;
    justify-content: space-between;
}

.input {
    width: 100%;
}

@media (max-width: 500px) {
    .container-altera-dados{
        width: 70vw;
        height: 70vh;
    }

    .p,
    .input,
    .contianer-button-altera button,
    .container-eyes {
        font-size: 10pt;
    }

    .container-inputs,
    .contianer-button-altera {
        width: 100%;
    }
}
</style>