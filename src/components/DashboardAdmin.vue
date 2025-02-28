<template>
    <section class="container" id="menu" v-if="!isBusca">
        <button type="button" @click="newCad()">Cadastrar novo Membro</button>
        <button type="button" @click="isBusca = !isBusca">buscar Usuário</button>
    </section>

    <section class="container" id="container-admin" v-else>
        <a @click="isBusca = !isBusca" class="setas"
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

import { attAdmin, buscaAdmin, getAllUsers, getDataUserLogged, getHoras, removeUser } from '@/services';
import Alert from './Alert.vue';

export default {
    name: 'DashboardAdmin',
    components: {
        Alert
    },
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
            size: 0,
            select: '--',
            users: [],
            membresia: '',
            itsMe: false,
            isBusca: false
        }
    },
    async mounted() {
        const dadosUser = JSON.parse(localStorage.getItem('dataUser'))
        this.usuarioID = dadosUser.uid
        this.membresia = dadosUser.membresia ?? ''
        this.getUsers()
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

                this.tempoUser = await getHoras(this.dataUserSearch[0].id)

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

.container-button {
    display: flex;
    width: 30%;
    justify-content: space-between;
    flex-direction: column;
}

.container-button button{
    width: 100%;
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