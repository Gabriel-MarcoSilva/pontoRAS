<template>
    <section class="container" id="cadastro">
        <a @click="newCad()" class="setas" style="justify-content: flex-start !important; cursor: pointer;">voltar</a>
        <form id="formCadastro" @submit.prevent="cadastro()">
            <div class="doubleInput">
                <label>
                    <p>Nome: *</p>
                    <input v-model="nome" autocomplete="off" value="" type="text" placeholder="Nome" name="nome"
                        @input="updateCampo('nome')">
                </label>
                <label>
                    <p>Telefone:<span style="font-size: 8pt;">(número apenas)</span>*</p>
                    <input v-model="telefone" autocomplete="off" value="" type="text" placeholder="Telefone" name="telefone" maxlength="11"
                        max="99999999999" min="00000000000" @input="updateCampo('telefone')">
                </label>
            </div>
            <div class="doubleInput">
                <label>
                    <p>Matrícula: <span style="font-size: 8pt;">(número apenas)</span>*</p>
                    <input v-model="matricula" autocomplete="off"
                        value="" type="text" maxlength="10" placeholder="Matrícula" name="matricula"
                        @input="updateCampo('matricula')">
                </label>
                <label>
                    <p>Curso: *</p>
                    <input v-model="curso" autocomplete="off" value="" type="text" placeholder="Curso" name="curso"
                        @input="updateCampo('curso')">
                </label>
            </div>
            <label class="oneInput">
                    <p>Nº Membresia:
                        <span style="font-size: 8pt; word-wrap: break-word; overflow-wrap: break-word;">(opcional números apenas)</span>
                    </p>
                <input v-model="membresia" autocomplete="off" value="" type="text" maxlength="8"
                    placeholder="Membresia (opcional)" name="membresia" @input="updateCampo('membresia')">
            </label>
            <label class="oneInput">
                <p>Email: *</p><input v-model="email" autocomplete="off" value="" type="email" placeholder="Email" name="email"
                    @input="updateCampo('email')">
            </label>
            <label class="oneInput">
                <p>Senha: *</p><input v-model="senha" autocomplete="off" value="" type="password" placeholder="Senha"
                    name="password" @input="updateCampo('password')">
            </label>
            <button type="submit">Cadastrar</button>
        </form>
    </section>
    <Alert :message="message" :size="size" @close="this.message = ''" :key="message"/>

</template>

<script>

import API from '@/plugins/axios';
import { cadUser } from '@/services';
import Alert from './Alert.vue';

export default {
    name: 'ComponentCadastro',
    components: {
        Alert
    },
    data () {
        return {
            isOpen :false,
            dataUser :[],
            widthScreen :0,
            usuarioID :'',

            nome: '',
            email: '',
            telefone: '',
            matricula: '',
            membresia: '',
            curso: '',
            senha: '',

            message: '',
            size: 0
        }
    },
    mounted() {
        this.loading()
    },
    methods: {
        async loading() {
            if (localStorage.getItem('dataUser')) {

                const dadosUser = JSON.parse(localStorage.getItem('dataUser'))
                this.usuarioID = dadosUser.uid
    
                this.dataUser = await API.get(`/usuario?id=${this.usuarioID}`).then(async (res) => {
                    return await res.data
                }).catch(() => {
                    this.message = 'Não foi possível conectar'
                    this.size = 25
                })

                this.byTag('id', 'formCadastro').reset()
            }
        },
        byTag(type, tag) {
            if (type == 'id') {
                return document.getElementById(tag)
            } else if (type == 'name') {
                return document.getElementsByName(tag)[0]
            }
        },

        async cadastro() {
            
            const payload = {
                nome: this.nome,
                telefone: this.telefone,
                matricula: this.matricula,
                curso: this.curso,
                membresia: this.membresia !== '' ? this.membresia + '/ON' : '101010/OFF',
                role: 'user',
                email: this.email,
                senha: this.senha
            }

            const isEmpty = !payload.nome || !payload.telefone || !payload.matricula || !payload.curso || !payload.email || !payload.senha

            if (!isEmpty) {
                if (payload.telefone.length < 11) {
                    this.message = 'Número de telefone inválido'
                    this.size = 35
                    this.byTag('name', 'telefone').style.borderColor = 'red'
                } else {
                    this.byTag('name', 'telefone').style.borderColor = 'rgb(138, 43, 226)'
                }

                if (payload.matricula.length < 9) {
                    this.message = 'Número de matrícula inválido'
                    this.size = 35
                    this.byTag('name', 'matricula').style.borderColor = 'red'
                } else {
                    this.byTag('name', 'matricula').style.borderColor = 'rgb(138, 43, 226)'
                }

                if (payload.membresia && payload.membresia.length < 7) {
                    this.message = 'Número de membresia inválido'
                    this.size = 35
                    this.byTag('name', 'membresia').style.borderColor = 'red'

                } else {
                    this.byTag('name', 'membresia').style.borderColor = 'rgb(138, 43, 226)'
                }

                if (!payload.email.match('@') && (!payload.email.match('.com') || !payload.email.match('.br'))) {
                    this.message = 'Email inválido'
                    this.size = 20
                    this.byTag('name', 'email').style.borderColor = 'red'
                } else {
                    this.byTag('name', 'email').style.borderColor = 'rgb(138, 43, 226)'
                }
            } else {
                this.byTag('name', 'nome').style.borderColor = 'red'
                this.byTag('name', 'curso').style.borderColor = 'red'
                this.byTag('name', 'telefone').style.borderColor = 'red'
                this.byTag('name', 'matricula').style.borderColor = 'red'
                this.byTag('name', 'email').style.borderColor = 'red'
                this.byTag('name', 'password').style.borderColor = 'red'
                this.message = 'Campos não preenchidos'
                this.size = 30
            }

            const cad = await cadUser(payload)

            if (cad) {
                this.message = 'Usuário cadastrado com sucesso!'
                this.size = 50
                this.newCad()
            } else {
                this.message = 'Não foi possível cadastrar o usuário'
                this.size = 60
            }
        },

         updateCampo(param) {
            if (param == 'telefone') {
                this.telefone = this.telefone.replace(/\D/g, '')
            } else if (param == 'membresia') {
                this.membresia = this.membresia.replace(/\D/g, '')
            } else if (param == 'matricula' ) {
                this.matricula = this.matricula.replace(/\D/g, '')
            }
            this.byTag('name', param).style.borderColor = 'rgb(138, 43, 226)'
        },

        newCad () {
            this.$router.back()
        }
    }
}
</script>

<style scoped>
#cadastro {
    width: 60vw;
    height: 80vh;
    color: rgb(138, 43, 226);
}

div .setas {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: sans-serif;
    color: #fff;
    cursor: pointer;
}

#label-admin {
    display: flex;
    align-items: center;
    margin-top: 15px;
}

.doubleInput,
.oneInput {
    display: flex;
    justify-content: space-between;
    width: 70%;
}

.oneInput {
    flex-direction: column;
}

.doubleInput label {
    width: 100%;
}

.doubleInput label input{
    width: 95%;
}

.oneInput input {
    width: 97%;
}

@media (max-width: 400px) {
    .setas{
        font-size: 8pt;
    }

    #cadastro {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    #formCadastro {
        height: 90%;
        width: 100%;
    }

    .doubleInput {
        flex-direction: column;
    }

    .oneInput,
    .doubleInput {
        width: 100%;
        margin-bottom: 5px;
    }

    .oneInput p,
    .doubleInput label p,
    #formCadastro button {
        font-size: 8pt;
    }

    .oneInput span,
    .doubleInput label span {
        font-size: 5pt !important;
    }

    .oneInput input,
    .doubleInput label input {
        height: 5vh;
        font-size: 8pt;
        padding: 3px;
    }
}

</style>