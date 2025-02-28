<template>
    <section class="container" id="menu">
        <button type="button" @click="newCad()">Cadastrar novo Membro</button>
        <button type="button" @click="openAdmin()">buscar Usuário</button>
    </section>

    <section class="container" id="container-admin" style="display: none;">
        <a @click="openAdmin()" class="setas"
            style="justify-content: flex-start !important; cursor: pointer; margin-left: 5px;">voltar</a>

        <div style="width: 100%; display: flex; align-items: center; justify-content: space-around; height: 20%;">
            <select v-model="select" name="select" id="select-admin">
                <option v-for="item in users" :key="item" :value="item.id">{{ item.nome }}</option>
            </select>

            <button type="button" @click="buscarUser()" class="btn">buscar</button>
        </div>

        <div id="infoUser">
            <div v-if="nomeUser !== ''">
                <p>Nome: {{ nomeUser }}</p>
                <p>Matricula: {{ matriculaUser }}</p>
                <p>Tempo na C11: {{ tempoUser }}</p>
            </div>
            <button @click="atribuirAdmin" class="btn" v-if="itsAdmin">
                Atribuir Admin
            </button>
        </div>

        <div id="container-history" class="box">
                <div v-if="this.historicoUser?.error">
                    {{ this.historicoUser.error }}
                </div>
                <div v-else style="width: 100%;">
                    <div class="history-item" v-for="item in historicoUser" :key="item">
                        <div style="display: grid; grid-template-columns: repeat(3, 33%); gap: 1%; width: 100%;">
                            <p>
                                Data: {{ item.data }}
                            </p>
                            <p>
                                Tempo: {{ item.horas }}
                            </p>
                            <p>
                                Horário: {{ item.horario }}
                            </p>
                        </div>
                        <br />
                        Descrição: {{ item.descricao }}
                    </div>
                </div>
            </div>
    </section>

    <section id="openMenu" @click="abrirMenu()">🔜</section>
    <section id="container-dataUser">
        <div id="dataUser">
            <div style="margin-bottom: 15px;" id="acessoAdmin" v-if="isAdmin">
                <hr>
                <p style="text-align: end; cursor: pointer;" @click="goToAdmin()">Acesso Admin</p>
                <hr>
            </div>
            <div v-for="item in dataUser" :key="item">
                <p>Nome: <span id="nameUser">{{ item.nome }}</span></p>
                <hr>
                <p>Curso: <span id="cursoUser"> {{ item.curso }}</span></p>
                <hr>
                <p>Matrícula: <span id="matriculaUser"> {{ item.matricula }}</span></p>
                <hr>
                <p>Seu tempo na C11: <span id="tempoC11"> {{ auxTempoC11 }}</span></p>
                <hr>
                <div style="height: 8vh;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <p>Nº Membresia: <span id="membresiaUser">{{ item.membresia.split('/')[0] }}</span></p>
                        <button @click="openFormMembreship()" id="upMembreship">🖋️</button>
                    </div>
                    <form method="get" @submit.prevent="upMembreship()" id="formMembreship" v-if="isEditMembresia">
                        <input v-model="membresia" type="text" name="mebresia" maxlength="8">
                        <button type="submit">ok</button>
                        <button @click="closeFormMembreship()" type="button">cancelar</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
    <section id="alert" style="display: none;">
        <p class="messageAlert" @key="message">{{ message }}</p>
    </section>
</template>

<script>

import API from '@/plugins/axios';
import { openMenu } from '@/plugins/openMenu';
import { buscaAdmin, getAllUsers, getDataUserLogged, getHoras, upMembresia } from '@/services';

export default {
    name: 'DashboardAdmin',
    data () {
        return {
            isOpen: false,
            dataUser: [],
            widthScreen: 0,
            usuarioID: '',
            historicoUser: [],
            dataUserSearch: [],
            
            tempoUser: '00:00:00',
            nomeUser: '',
            matriculaUser: '',
            itsAdmin: false,
            idUserSearch: '',

            message: '',
            isAdmin: false,
            select: '',
            users: [],
            membresia: '',

            isEditMembresia: false,
            auxTempoC11: 0
        }
    },
    mounted() {
        this.loading()
    },
    methods: {
        async loading() {

            const dadosUser = JSON.parse(localStorage.getItem('dataUser'))
            this.usuarioID = dadosUser.uid
            this.membresia = dadosUser.membresia ?? ''

            this.dataUser = await getDataUserLogged(this.usuarioID)
            this.isAdmin = this.dataUser[0].role === 'admin'
        },

        abrirMenu () {
            this.isOpen = openMenu(this.isOpen)
        },

        openFormMembreship() {
            if (confirm('Você possui membresia?')) {
                this.isEditMembresia = true
                this.membresia = this.dataUser[0].membresia.split('/')[0]
            }
        },

        closeFormMembreship() {
            this.byTag('id', 'formMembreship').style.display = 'none'
        },

        async upMembreship() {
            const payload = {
                id: this.usuarioID,
                membresia: this.membresia + '/ON',
            }

            const update = await upMembresia()

            if(update.status) {
                this.dataUser[0].membresia = payload.membresia
                this.membresia = payload.membresia.split('/')[0]
                this.isEditMembresia = false
                this.alertCustomized('Membresia atualizada com sucesso!', '30vw')
            } else {
                this.alertCustomized('Não foi possível atualizar a membresia', '35vw')
            }
        },
        goToAdmin() {
            this.$router.back()
        }


        ,async addSelect() {
            this.users = await getAllUsers()
            console.log(this.users)
        },

        async openAdmin() {
            if (this.byTag('id', 'container-admin').style.display == 'flex') {
                this.byTag('id', 'menu').style.display = 'flex'
                this.byTag('id', 'container-admin').style.display = 'none'

            } else {
                this.byTag('id', 'menu').style.display = 'none'
                this.byTag('id', 'container-admin').style.display = 'flex'
                await this.addSelect()
            }
        },
        byTag(type, tag) {
            if (type == 'id') {
                return document.getElementById(tag)
            } else if (type == 'name') {
                return document.getElementsByName(tag)[0]
            }
        },
        newCad() {
            this.$router.push('/cadastro')
        },
        async buscarUser() {

            if (this.select !== '--') {
                this.dataUserSearch = await getDataUserLogged(this.select)

                this.tempoUser = await getHoras(this.dataUserSearch[0].id)

                if (this.tempoUser !== 0) {
                    this.historicoUser = await buscaAdmin(this.dataUserSearch[0].matricula)
                }

                this.preencheTabela()
            }
        },
        preencheTabela() {
            this.nomeUser = this.dataUserSearch[0].nome
            this.matriculaUser = this.dataUserSearch[0].matricula
            this.tempoUser = this.tempoUser ? this.formatarTempo(this.tempoUser) : '00:00:00'
            this.itsAdmin = this.dataUserSearch[0].role !== 'admin'
            this.idUserSearch = this.dataUserSearch[0].id
        },
        atribuirAdmin () {
            API.post('/admin_role', { id: this.idUserSearch, role: 'admin' }).then(() => {
                this.alertCustomized('Atribuido com sucesso!! ', '30vw')
            }).catch(() => {
                this.alertCustomized('Não foi possível atribuir', '30vw')
            })
        },
        dateVisual(date) {
            const data = date.split('T')[0]

            const dia = data.split('-')[2]
            const mes = data.split('-')[1]
            const ano = data.split('-')[0]
            return dia + '/' + mes + '/' + ano
        },
        formatarTempo(segundos) {
            let horas = Math.floor(segundos / 3600);
            let minutos = Math.floor((segundos % 3600) / 60);
            let seg = segundos % 60;
            return (
                String(horas).padStart(2, '0') + ":" +
                String(minutos).padStart(2, '0') + ":" +
                String(seg).padStart(2, '0')
            );
        },
        alertCustomized(message, size) {
            const alert = document.getElementById('alert')
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
.container {
    width: 40vw !important;
    color: #fff;
}

#container-admin {
    width: 80vw !important;
    height: 80vh !important;
    padding: 10px;
    color: #fff !important;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
}

#menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 80vh;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 0 20px rgb(138, 43, 226);
}

#menu button {
    width: 80% !important;
    margin: 20px auto;
}

#container-history {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: Arial, sans-serif;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    height: 60%;
    justify-content: flex-start;
}

.history-item {
    padding: 10px;
    width: 100%;
    border-bottom: 1px solid #ccc;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.history-item:nth-child(even) {
    background-color: white;
    /* Branco */
    color: #1b1b1b;
}

.history-item:nth-child(odd) {
    background-color: transparent;
    /* Transparente */
}

#select-admin {
    width: 70%;
    padding: 5px 10px;
    font-weight: bold;
    color: rgb(138, 43, 226);
    border: 3px solid rgb(138, 43, 226);
    border-radius: 5px;
}

.btn {
    height: 6vh;
    min-width: 20%;
    padding: 5px 10px;
    border: 3px solid rgb(138, 43, 226);
    background-color: #1b1b1b;
    color: rgb(138, 43, 226);
    font-weight: bold;
    cursor: pointer;
    text-transform: capitalize;
}

.btn:hover {
    border: 3px solid #1b1b1b;
    background-color: rgb(138, 43, 226);
    color: #1b1b1b;
}

#infoUser {
    height: 30%;
    display: flex;
    padding: 20px;
    justify-content: space-between;
}

@media (max-width: 400px) {

    #container-dataUser {
        width: 70vw;
        left: -70vw;
    }
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