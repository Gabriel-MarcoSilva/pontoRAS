<template>
    <section class="container" id="menu" v-if="!isBusca">
        <button type="button" @click="newCad()">Cadastrar novo Membro</button>
        <button type="button" @click="isBusca = !isBusca">Buscar Usuário</button>
        <button type="button" @click="() => {isBusca = !isBusca; hasPeopleinC11 = true; buscaPessoas()}">Histórico</button>
    </section>

    <section class="container" id="ontem-na-c11" v-else-if="isBusca && hasPeopleinC11">
        <p @click="() => {isBusca = false; hasPeopleinC11 = false;}" style="cursor: pointer;"> voltar </p>
        <h1 style="width: 100%; text-align: center;">Histórico</h1>
        <div id="container-dates">
            <input type="date" name="dataInicio" v-model="dataInicio" class="date">
            <input type="date" name="dataFim" v-model="dataFim" class="date">
            <button class="btn" @click="buscaPessoas">Buscar</button>
        </div>

        <div id="container-pessoas">
            <div class="dados">
                <p>Matrícula</p>
                <p>| Nome</p>
                <p>Tempo</p>
                <p>| Saiu</p>
            </div>
            <hr>
            <div id="container-history-ontem" class="box" style="width: 100%; padding: 10px;">
                <div v-if="this.historico?.error">
                    {{ this.historico.error }}
                </div>
                <div v-else style="width: 100%;">
                    <div class="history-item" v-for="item in historico" :key="item">
                        <div class="dados">
                            <p>
                                {{ item.matricula }}
                            </p>
                            <p>
                                | {{ item.nome }}
                            </p>
                            <p>
                                {{ item.horas }}
                            </p>
                            <p>
                                | {{ item.horario }}
                            </p>
                        </div>
                        <br />
                        Descrição: {{ item.descricao }}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="container" id="container-admin" v-else>
        <a @click="() => {isBusca = !isBusca;}" class="setas"
            style="justify-content: flex-start !important; cursor: pointer; margin-left: 5px;">voltar</a>

        <div style="width: 100%; display: flex; align-items: center; justify-content: space-around; height: 20%;">
            <select v-model="select" name="select" id="select-admin">
                <option value="--" disabled>Selecione um usuário</option>
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
            <div class="container-button" v-if="nomeUser !== ''">
                <button @click="atribuirAdmin" class="btn" v-if="itsAdmin">
                    virar Admin
                </button>
                <button @click="removerUsuario" class="btn" v-if="!itsMe">
                    Remover
                </button>
            </div>
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

    <Alert :message="message" :size="size" @close="this.message = ''" :key="message"/>

</template>

<script>

import { attAdmin, buscaAdmin, getAllUsers, getDataUserLogged, getHoras, getUsersInPeriody, removeUser } from '@/services';
import Alert from './Alert.vue';

export default {
    name: 'DashboardAdmin',
    components: {
        Alert
    },
    emits: ['openMenu'],
    data () {
        return {
            isOpen: false,
            dataUser: [],
            widthScreen: 0,
            usuarioID: '',
            historico: [],
            historicoUser: [],
            dataUserSearch: [],
            
            tempoUser: '00:00:00',
            nomeUser: '',
            matriculaUser: '',
            itsAdmin: false,
            idUserSearch: '',

            message: '',
            size: 0,
            select: '--',
            users: [],
            membresia: '',
            itsMe: false,
            isBusca: false,
            hasPeopleinC11: false,
            dataInicio: null,
            dataFim: null
        }
    },
    async mounted() {
        const dadosUser = JSON.parse(localStorage.getItem('dataUser'))
        this.usuarioID = dadosUser.uid
        this.membresia = dadosUser.membresia ?? ''
        this.getUsers()
        this.$emit('openMenu')
    },
    methods: {
        closeFormMembreship() {
            this.byTag('id', 'formMembreship').style.display = 'none'
        },
        
        async getUsers () {
            this.users = await getAllUsers()
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
                this.itsMe = this.select === this.usuarioID
                this.dataUserSearch = await getDataUserLogged(this.select)

                this.tempoUser = await getHoras(this.dataUserSearch[0].id,'','')

                if (this.tempoUser !== '00:00:00') {
                    this.historicoUser = await buscaAdmin(this.dataUserSearch[0].matricula)
                    for (let i = 0; i < this.historicoUser.length; i++) {
                        this.historicoUser[i].data = await this.dateVisual(this.historicoUser[i].data)
                        this.historicoUser[i].horas = await this.formatarTempo(this.historicoUser[i].horas)
                    }
                } else {
                    this.historicoUser = []
                }

                this.preencheTabela()
            }
        },

        async buscaPessoas () {
            const dateToday = new Date()
            this.historico = []
            
            if(!this.dataInicio && !this.dataFim) {
                this.dataInicio = this.altDateToInput(dateToday.toLocaleDateString())
                this.dataFim = this.dataInicio
            }

            this.historico = await getUsersInPeriody(this.dataInicio, this.dataFim)

            for (let i = 0; i < this.historico.length; i++){
                this.historico[i].horas = await this.formatarTempo(this.historico[i].horas)
                const user = await getDataUserLogged(this.historico[i].usuarioId)
                this.historico[i].nome = user[0].nome
                this.historico[i].matricula = user[0].matricula
            }

        },

        altDateToInput(date) {
            const dia = date.split('/')[0]
            const mes = date.split('/')[1]
            const ano = date.split('/')[2]
            return `${ano}-${mes}-${dia}`
        },

        preencheTabela() {
            this.nomeUser = this.dataUserSearch[0].nome
            this.matriculaUser = this.dataUserSearch[0].matricula
            this.tempoUser = this.tempoUser ? this.formatarTempo(this.tempoUser) : '00:00:00'
            this.itsAdmin = this.dataUserSearch[0].role !== 'admin'
            this.idUserSearch = this.dataUserSearch[0].id
        },

        async atribuirAdmin () {
            if (confirm('Deseja atribuir administrador a este usuário? ')) {
                const att = await attAdmin(this.idUserSearch)
    
                if(att.status) {
                    this.message = 'Atribuido com sucesso!! '
                    this.size = 30
                    this.itsAdmin = true
                }else {
                    this.message = 'Não foi possível atribuir'
                    this.size = 30
                }
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

        async removerUsuario () {
            if (confirm('Deseja remover este usuário?')) {
                const deleteUser = await removeUser(this.select)
                if (deleteUser) {
                    this.message = 'Usuário removido com sucesso!'
                    this.size = 20
                    this.getUsers()
                    this.select = '--'
                    this.nomeUser = ''
                    this.historicoUser = []
                } else {
                    this.message = 'Não foi possível remover o uusário'
                    this.size = 30
                }
            }
        }
    }
}
</script>

<style scoped>
.container {
    width: 40vw !important;
    color: #fff;
}

#container-admin,
#ontem-na-c11 {
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

#ontem-na-c11 {
    justify-content: flex-start;
}

#menu button {
    width: 80% !important;
    margin: 20px auto;
}

#container-pessoas {
    height: 60%
}

#container-history,
#container-history-ontem {
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

#container-history-ontem {
    height: 100%;
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

#select-admin,
#container-dates input {
    width: 70%;
    padding: 5px 10px;
    font-weight: bold;
    color: rgb(138, 43, 226);
    border: 3px solid rgb(138, 43, 226);
    border-radius: 5px;
}

#container-dates {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin-top: 15px;
}

#container-dates input {
    width: 35%;
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

.container-button {
    display: flex;
    width: 30%;
    justify-content: space-between;
    flex-direction: column;
}

.container-button button{
    width: 100%;
}

.dados {
    display: grid; grid-template-columns: 20% 49% 15% 16%; width: 100%; align-items: center;
}

@media (max-width: 400px) {

    #container-dataUser {
        width: 70vw;
        left: -70vw;
    }

    .container {
        width: 70vw !important;
    }

    #infoUser {
        flex-direction: column;
        font-size: 10pt !important;
        justify-content: space-around;
    }

    #infoUser button {
        margin: 5px;
    }

    .container-button {
        width: 100%;
        flex-direction: row;
    } 

    .history-item {
        font-size: 10pt !important;
    }

    .dados {
        grid-template-columns: repeat(2, 50%)
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