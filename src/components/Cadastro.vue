<template>
    <section class="container" id="cadastro">
        <a onclick="newCad()" class="setas" style="justify-content: flex-start !important; cursor: pointer;">voltar</a>
        <form id="formCadastro" onsubmit="cadastro(event)">
            <div class="doubleInput">
                <label>
                    <p>Nome: *</p><input autocomplete="off" value="" type="text" placeholder="Nome" name="nome"
                        oninput="updateCampo('nome')">
                </label>
                <label>
                    <p>Telefone:<span style="font-size: 8pt;">(número apenas)</span>*</p>
                    <input autocomplete="off" value="" type="text" placeholder="Telefone" name="telefone" maxlength="11"
                        max="99999999999" min="00000000000" oninput="updateCampo('telefone')">
                </label>
            </div>
            <div class="doubleInput">
                <label>
                    <p>Matrícula: <span style="font-size: 8pt;">(número apenas)</span>*</p><input autocomplete="off"
                        value="" type="text" maxlength="10" placeholder="Matrícula" name="matricula"
                        oninput="updateCampo('matricula')">
                </label>
                <label>
                    <p>Curso: *</p><input autocomplete="off" value="" type="text" placeholder="Curso" name="curso"
                        oninput="updateCampo('curso')">
                </label>
            </div>
            <div class="oneLabel">
                <label>
                    <p>Nº Membresia: <span
                            style="font-size: 8pt; word-wrap: break-word; overflow-wrap: break-word;">(opcional número
                            apenas)</span></p><input autocomplete="off" value="" type="text" maxlength="8"
                        placeholder="Membresia (opcional)" name="membresia" oninput="updateCampo('membresia')">
                </label>
            </div>
            <div class="oneLabel">
                <label>
                    <p>Email: *</p><input autocomplete="off" value="" type="email" placeholder="Email" name="email"
                        oninput="updateCampo('email')">
                </label>
            </div>
            <div class="oneLabel">
                <label>
                    <p>Senha: *</p><input autocomplete="off" value="" type="password" placeholder="Senha"
                        name="password" oninput="updateCampo('password')">
                </label>
            </div>
            <button type="submit">Cadastrar</button>
        </form>
    </section>

    <section id="openMenu" onclick="openMenu()">🔜</section>
    <section id="container-dataUser">
        <div id="dataUser">
            <div style="margin-bottom: 15px;" id="acessoAdmin">
                <hr>
                <p style="text-align: end; cursor: pointer;" onclick="goToAdmin()">Voltar ao Ponto</p>
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
                    <button onclick="openFormMembreship()" id="upMembreship">🖋️</button>
                </div>
                <form method="get" onsubmit="upMembreship(event)" id="formMembreship">
                    <input autocomplete="off" type="text" name="mebresia" maxlength="8">
                    <button type="submit">ok</button>
                    <button onclick="closeFormMembreship()" type="button">cancelar</button>
                </form>
            </div>
        </div>
    </section>
    <section id="alert" style="display: none;"></section>
</template>

<script>

import API from '@/plugins/axios';

export default {
    name: 'ComponentCadastro',
    data () {
        return {
            isOpen :false,
            dataUser :[],
            widthScreen :0,
            usuarioID :''
        }
    },
    mounted() {
        this.loading()
    },
    methods: {
        async loading() {

            const dadosUser = JSON.parse(localStorage.getItem('dataUser'))
            this.usuarioID = dadosUser.uid

            this.dataUser = await API.get(`/usuario?id=${this.usuarioID}`).then(async (res) => {
                return await res.data
            }).catch((err) => {
                this.alertCustomized('Não foi possível conectar', '25vw')
            })

            this.byTag('id', 'formCadastro').reset()

            if (this.dataUser[0].role === 'admin') {
                this.byTag('id', 'acessoAdmin').style.display = 'block'
            }
        },
        byTag(type, tag) {
            if (type == 'id') {
                return document.getElementById(tag)
            } else if (type == 'name') {
                return document.getElementsByName(tag)[0]
            }
        },

        cadastro(e) {
            const form = this.byTag('id', 'formCadastro')

            e.preventDefault()
            const data = new FormData(form)

            const dados = new URLSearchParams(data)

            const payload = {
                nome: [...dados.values()][0],
                telefone: [...dados.values()][1],
                matricula: [...dados.values()][2],
                curso: [...dados.values()][3],
                membresia: [...dados.values()][4].length > 0 ? [...dados.values()][4] + '/ON' : '101010/OFF',
                role: 'user',
                email: [...dados.values()][5],
                senha: [...dados.values()][6]
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

            API.post('/usuario', payload).then(() => {
                this.alertCustomized('Usuário cadastrado com sucesso!', '50vw')
                newCad()
            }).catch((err) => {
                this.alertCustomized('Não foi possível cadastrar o usuário', '60vw')
            })
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

         newCad() {
            window.location.href = "../dashboard_admin/index.html";
        },

        openMenu() {
            this.verifyScreen()

            this.byTag('id', 'nameUser').innerText = this.dataUser[0].nome
            this.byTag('id', 'cursoUser').innerText = this.dataUser[0].curso
            this.byTag('id', 'matriculaUser').innerText = this.dataUser[0].matricula
            this.byTag('id', 'membresiaUser').innerText = this.dataUser[0].membresia.split('/')[0]


            if (!isOpen) {
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
            isOpen = !isOpen
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