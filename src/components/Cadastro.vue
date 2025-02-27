<template>
    <section class="container" id="cadastro">
        <a @click="newCad()" class="setas" style="justify-content: flex-start !important; cursor: pointer;">voltar</a>
        <form id="formCadastro" @submit.prevent="cadastro()">
            <div class="doubleInput">
                <label>
                    <p>Nome: *</p><input v-model="nome" autocomplete="off" value="" type="text" placeholder="Nome" name="nome"
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
                    <p>Matrícula: <span style="font-size: 8pt;">(número apenas)</span>*</p><input v-model="matricula" autocomplete="off"
                        value="" type="text" maxlength="10" placeholder="Matrícula" name="matricula"
                        @input="updateCampo('matricula')">
                </label>
                <label>
                    <p>Curso: *</p><input v-model="curso" autocomplete="off" value="" type="text" placeholder="Curso" name="curso"
                        @input="updateCampo('curso')">
                </label>
            </div>
            <div class="oneLabel">
                <label>
                    <p>Nº Membresia: <span
                            style="font-size: 8pt; word-wrap: break-word; overflow-wrap: break-word;">(opcional número
                            apenas)</span></p><input v-model="membresia" autocomplete="off" value="" type="text" maxlength="8"
                        placeholder="Membresia (opcional)" name="membresia" @input="updateCampo('membresia')">
                </label>
            </div>
            <div class="oneLabel">
                <label>
                    <p>Email: *</p><input v-model="email" autocomplete="off" value="" type="email" placeholder="Email" name="email"
                        @input="updateCampo('email')">
                </label>
            </div>
            <div class="oneLabel">
                <label>
                    <p>Senha: *</p><input v-model="senha" autocomplete="off" value="" type="password" placeholder="Senha"
                        name="password" @input="updateCampo('password')">
                </label>
            </div>
            <button type="submit">Cadastrar</button>
        </form>
    </section>

    <section id="openMenu" @click="openMenu()" v-if="dataUser.length > 0">🔜</section>
    <section id="container-dataUser" v-if="dataUser.length > 0">
        <div id="dataUser">
            <div style="margin-bottom: 15px;" id="acessoAdmin">
                <hr>
                <p style="text-align: end; cursor: pointer;" @click="goToAdmin()">Voltar ao Ponto</p>
                <hr>
            </div>
            <p>Nome: <span id="nameUser"></span></p>
            <hr>
            <p>Curso: <span id="cursoUser"></span></p>
            <hr>
            <p>Matrícula: <span id="matriculaUser"></span></p>
            <hr>
            <p>Seu tempo na C11: <span id="tempoC11"></span></p>
            <hr>
            <div style="height: 8vh;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <p>Nº Membresia: <span id="membresiaUser"></span></p>
                    <button @click="openFormMembreship()" id="upMembreship">🖋️</button>
                </div>
                <form method="get" @submit.prevent="upMembreship(event)" id="formMembreship">
                    <input autocomplete="off" type="text" name="mebresia" maxlength="8">
                    <button type="submit">ok</button>
                    <button @click="closeFormMembreship()" type="button">cancelar</button>
                </form>
            </div>
        </div>
    </section>
    <section id="alert" style="display: none;">
        <p class="messageAlert" @key="message">{{ message }}</p>
    </section>
</template>

<script>

import API from '@/plugins/axios';
import { cadUser } from '@/services';

export default {
    name: 'ComponentCadastro',
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

            message: ''
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
                    this.alertCustomized('Não foi possível conectar', '25vw')
                })

                console.log(this.dataUser)
    
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
                    this.alertCustomized('Número de telefone inválido', '35vw')
                    this.byTag('name', 'telefone').style.borderColor = 'red'
                } else {
                    this.byTag('name', 'telefone').style.borderColor = 'rgb(138, 43, 226)'
                }

                if (payload.matricula.length < 9) {
                    this.alertCustomized('Número de matrícula inválido', '35vw')
                    this.byTag('name', 'matricula').style.borderColor = 'red'
                } else {
                    this.byTag('name', 'matricula').style.borderColor = 'rgb(138, 43, 226)'
                }

                if (payload.membresia && payload.membresia.length < 7) {
                    this.alertCustomized('Número de membresia inválido', '35vw')
                    this.byTag('name', 'membresia').style.borderColor = 'red'

                } else {
                    this.byTag('name', 'membresia').style.borderColor = 'rgb(138, 43, 226)'
                }

                if (!payload.email.match('@') && (!payload.email.match('.com') || !payload.email.match('.br'))) {
                    this.alertCustomized('Email inválido', '20vw')
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
                this.alertCustomized('Campos não preenchidos', '30vw')
            }

            const cad = await cadUser(payload)

            if (cad) {
                this.alertCustomized('Usuário cadastrado com sucesso!', '50vw')
                this.newCad()
            } else {
                this.alertCustomized('Não foi possível cadastrar o usuário', '60vw')
            }
        },

         goToAdmin() {
            window.location.href = "../dashboard/index.html";
        },

         updateCampo(param) {
            if (param == 'telefone') {
                this.byTag('name', param).value = this.byTag('name', 'telefone').value.replace(/\D/g, '')
            }
            this.byTag('name', param).style.borderColor = 'rgb(138, 43, 226)'
        },

        newCad () {
            this.$router.back()
        },

        openMenu() {
            this.verifyScreen()

            this.byTag('id', 'nameUser').innerText = this.dataUser[0].nome
            this.byTag('id', 'cursoUser').innerText = this.dataUser[0].curso
            this.byTag('id', 'matriculaUser').innerText = this.dataUser[0].matricula
            this.byTag('id', 'membresiaUser').innerText = this.dataUser[0].membresia.split('/')[0]


            if (!this.isOpen) {
                this.byTag('id', 'container-dataUser').style.transform = `translateX(${this.widthScreen})`
                this.byTag('id', 'openMenu').style.transform = `translateX(${this.widthScreen})`
                this.byTag('id', 'openMenu').innerText = '🔙'
            } else {
                this.byTag('id', 'container-dataUser').style.transform = 'translateX(0)'
                this.byTag('id', 'openMenu').style.transform = 'translateX(0)'
                this.byTag('id', 'openMenu').innerText = '🔜'
            }

            this.byTag('id', 'openMenu').style.transition = '0.4s'
            this.byTag('id', 'container-dataUser').style.transition = '0.4s'
            this.isOpen = !this.isOpen
        },

        verifyScreen() {
            if (window.screen.width <= 400) {
                this.widthScreen = '70vw'
            } else {
                this.widthScreen = '30vw'
            }
        },

        alertCustomized(message, size) {
            const alert = this.byTag('id', 'alert')
            alert.innerHTML = ""; // Limpa antes de renderizar

            alert.style.display = 'flex'
            alert.style.width = size

            const p = document.createElement("p")
            p.classList.add("messageAlert")
            p.innerHTML = message
            alert.appendChild(p)

            setInterval(() => {
                alert.style.display = 'none'
            }, 7000);
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
</style>