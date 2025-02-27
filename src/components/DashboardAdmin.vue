<template>
    <section class="container" id="menu">
        <button type="button" @click="newCad()">Cadastrar novo Membro</button>
        <button type="button" @click="openAdmin()">buscar Usuário</button>
    </section>

    <section class="container" id="container-admin" style="display: none;">
        <a @click="openAdmin()" class="setas"
            style="justify-content: flex-start !important; cursor: pointer; margin-left: 5px;">voltar</a>

        <div style="width: 100%; display: flex; align-items: center; justify-content: space-around; height: 20%;">
            <select name="select" id="select-admin">
            </select>

            <button type="button" @click="buscarUser()" class="btn">buscar</button>
        </div>

        <div id="infoUser">
        </div>

        <div id="container-history" class="box">
            <div
                style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; text-transform: capitalize;">
                histórico</div>
        </div>
    </section>

    <section id="openMenu" @click="openMenu()">🔜</section>
    <section id="container-this.dataUser">
        <div id="this.dataUser">
            <div style="margin-bottom: 15px;" id="acessoAdmin">
                <hr>
                <p style="text-align: end; cursor: pointer;" v-if="isAdmin" @click="goToAdmin()">Voltar ao Dashboard</p>
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
import { getDataUserLogged } from '@/services';

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
            tempoUser: 0,

            message: '',
            isAdmin: false
        }
    },
    mounted() {
        this.loading()
    },
    methods: {
async loading() {

    const dadosUser = JSON.parse(localStorage.getItem('dataUser'))
    this.usuarioID = dadosUser.uid

    this.dataUser = await getDataUserLogged(this.usuarioID)
    this.isAdmin = this.dataUser[0].role === 'admin'
},
openMenu() {
    this.verifyScreen()

    this.byTag('id', 'nameUser').innerText = this.dataUser[0].nome
    this.byTag('id', 'cursoUser').innerText = this.dataUser[0].curso
    this.byTag('id', 'matriculaUser').innerText = this.dataUser[0].matricula
    this.byTag('id', 'membresiaUser').innerText = this.dataUser[0].membresia.split('/')[0]

    if (!this.isOpen) {
        this.byTag('id', 'container-this.dataUser').style.transform = `translateX(${this.widthScreen})`
        this.byTag('id', 'openMenu').style.transform = `translateX(${this.widthScreen})`
        this.byTag('id', 'openMenu').innerText = '🔙'
    } else {
        this.byTag('id', 'container-this.dataUser').style.transform = 'translateX(0)'
        this.byTag('id', 'openMenu').style.transform = 'translateX(0)'
        this.byTag('id', 'openMenu').innerText = '🔜'
    }

    this.byTag('id', 'openMenu').style.transition = '0.4s'
    this.byTag('id', 'container-this.dataUser').style.transition = '0.4s'
    this.isOpen = !this.isOpen
},
verifyScreen() {
    if (window.screen.width <= 400) {
        this.widthScreen = '70vw'
    } else {
        this.widthScreen = '30vw'
    }
},
openFormMembreship() {
    if (confirm('Você possui membresia?')) {
        this.byTag('id', 'formMembreship').style.display = 'flex'
        this.byTag('name', 'mebresia').value = this.dataUser[0].membresia.split('/')[0]
    }
},
closeFormMembreship() {
    this.byTag('id', 'formMembreship').style.display = 'none'
},
upMembreship(e) {
    const form = this.byTag('id', 'formMembreship')

    e.preventDefault()
    const data = new FormData(form)

    const dados = new URLSearchParams(data)

    const payload = {
        id: this.usuarioID,
        membresia: [...dados.values()][0] + '/ON',
    }

    API.post('/upmembresia', payload).then(() => {
        this.dataUser[0].membresia = payload.membresia
        this.byTag('id', 'membresiaUser').innerText = payload.membresia.split('/')[0]
        this.byTag('id', 'formMembreship').style.display = 'none'
        this.alertCustomized('Membresia atualizada com sucesso!', '30vw')
    }).catch(() => {
        this.alertCustomized('Não foi possível atualizar a membresia', '35vw')
    })
},
goToAdmin() {
    this.$router.back()
}


,async addSelect() {
    const select = this.byTag('id', 'select-admin')

    try {
        const users = await API.get('/usuario').then(res => res.data)
        const option = document.createElement("option")
        option.value = '--' // Define o valor da opção
        option.textContent = 'Selecione o usuário' // Define o texto visível
        select.appendChild(option)

        for (let i = 0; i < users.length; i++) {
            const option = document.createElement("option")
            option.value = users[i].id // Define o valor da opção
            option.textContent = users[i].nome // Define o texto visível
            select.appendChild(option)
        }
    } catch (err) {
        this.alertCustomized("Erro ao buscar usuários:", "30vw")
    }
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
    const select = this.byTag('id', 'select-admin').value

    if (select !== '--') {
        this.dataUserSearch = await API.get(`/usuario?id=${select}`).then((res) => {
            return res.data
        }).catch((err) => {
            console.error(err)
        })

        this.tempoUser = await API.get(`/calcular?usuarioId=${this.dataUserSearch[0].id}`).then((res) => {
            return res.data
        }).catch(() => {
            return 0
        })

        if (this.tempoUser !== 0) {
            this.historicoUser = await API.get(`/admin_busca?matricula=${this.dataUserSearch[0].matricula}`).then((res) => {
                return res.data
            }).catch(() => {
                return []
            })
        }

        this.preencheTabela()
    }
},
preencheTabela() {
    const container = this.byTag('id', "container-history");
    const infoUser = this.byTag('id', 'infoUser')

    infoUser.innerHTML = ''

    container.innerHTML = ""; // Limpa antes de renderizar

    const div2 = document.createElement("div");
    div2.classList.add("infoUser");
    div2.innerHTML = `
        <strong>Nome:</strong> ${this.dataUserSearch[0].nome} <br/>
        <strong>Matrícula:</strong> ${this.dataUserSearch[0].matricula} <br/>
        <strong>Tempo na C11:</strong> ${this.tempoUser ? this.formatarTempo(this.tempoUser) : '00:00:00'}`
    infoUser.appendChild(div2);

    if (this.dataUserSearch[0].role !== 'admin') {
        const button = document.createElement("button")
        button.classList.add('btn')
        button.textContent = 'Atribuir administrador' // Use textContent para definir o texto visível
        button.addEventListener("click", () => {
            API.post('/admin_role', { id: this.dataUserSearch[0].id, role: 'admin' }).then(() => {
                this.alertCustomized('Atribuido com sucesso!! ', '30vw')
            }).catch(() => {
                this.alertCustomized('Não foi possível atribuir', '30vw')
            })
        });
        infoUser.appendChild(button);
    }

    if (this.historicoUser) {
        for (let i = 0; i < this.historicoUser.length; i++) {
            const div = document.createElement("div");
            div.classList.add("history-item");
            div.innerHTML = `
                <strong>Data:</strong>${this.dateVisual(this.historicoUser[i].data)} |
                <strong>Tempo:</strong> ${this.formatarTempo(this.historicoUser[i].horas)} | 
                <strong>Horário:</strong> ${this.historicoUser[i].horario}
                <br/><br/> <strong>Descrição:</strong> ${this.historicoUser[i].descricao}`
            container.appendChild(div);
        }
    } else {
        container.innerHTML = ''
    }
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

    #container-this.dataUser {
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