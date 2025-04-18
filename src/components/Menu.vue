<template>
    <section id="container-dataUser" v-if="isLogged">
        <section id="openMenu" @click="openMenu">
            <v-icon v-if="!isOpen">mdi-arrow-right-bold</v-icon>
            <v-icon v-else>mdi-arrow-left-bold</v-icon>
        </section>
        <div id="dataUser">
            <div style="margin-bottom: 15px;" id="acessoAdmin" v-if="isAdmin">
                <hr>
                <p style="text-align: end; cursor: pointer;" @click="goToAdmin('dashboard-admin')" v-if="this.$route.path === '/inicio'">Acesso Admin</p>
                <p style="text-align: end; cursor: pointer;" @click="goToAdmin('inicio')" v-else>Voltar ao dashboard</p>
                <hr>
            </div>
            <div v-for="item in dataUser" :key="item">
                <p>Nome: <span id="nameUser">{{ item.nome }}</span></p>
                <hr>
                <p>Curso: <span id="cursoUser"> {{ item.curso }}</span></p>
                <hr>
                <!-- <p>Matrícula: <span id="matriculaUser"> {{ item.matricula }}</span></p>
                <hr> -->
                <p>Seu tempo na C11: <span id="tempoC11"> {{ auxTempoC11 }}</span></p>
                <hr>
                <div style="height: 8vh;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <p>Nº Membresia: <span id="membresiaUser">{{ item.membresia.split('/')[0] }}</span></p>
                        <button @click="openFormMembreship()" id="upMembreship"><v-icon>mdi-pencil</v-icon></button>
                    </div>
                    <form method="get" @submit.prevent="upMembreship()" id="formMembreship" v-if="isEditMembresia">
                        <input v-model="membresia" type="text" name="mebresia" maxlength="8">
                        <button type="submit">ok</button>
                        <button @click="isEditMembresia = false" type="button">cancelar</button>
                    </form>
                </div>
            </div>
        </div>
        <div id="container-password" style="width: 100%;">
            <div v-if="!openFormPassword" style="display: flex; align-items: center; justify-content: space-between;">
                <p>Alterar senha</p>
                <button @click="openFormPassword = true"><v-icon>mdi-pencil</v-icon></button>
            </div>
            <div v-else style="width: 100%;">
                <form id="formPassword" method="get" @submit.prevent="submitPassword"
                    style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                        "
                >
                    <div style="display: flex; align-items: center; justify-content: space-around; width: 100%;">
                        <input v-if="isEyes" type="password" v-model="novaSenha" name="senha" placeholder="insira nova senha">
                        <input v-else type="text" v-model="novaSenha" name="senha" placeholder="insira nova senha">
                        <div style="margin-left: 10px">
                            <v-icon v-if="isEyes" @click="isEyes = false">mdi-eye</v-icon>
                            <v-icon v-else @click="isEyes = true"> mdi-eye-off</v-icon>
                        </div>
                        <button type="submit"><v-icon>mdi-check</v-icon></button>
                        <button @click="openFormPassword = false"><v-icon>mdi-close</v-icon></button>
                    </div>
                </form>
            </div>
        </div>

        <Alert :message="message" :size="size" @close="this.message = ''" :key="message"/>
    </section>
</template>

<script>
import { getDataUserLogged, getHoras, upDataUser } from '@/services';
import Alert from './Alert.vue';

export default {
    name: 'ComponentMenu',
    components: {
        Alert
    },
    data() {
        return {
            isOpen: false,
            dataUser: [],
            membresia: '',
            usuarioID: '',
            auxTempoC11: 0,
            isAdmin: false,
            isEditMembresia: false,
            widthScreen: 30,
            tempoNaC11: 0,
            isLogged: false,

            openFormPassword: false,
            novaSenha: '',
            isEyes: true,

            message: '',
            size: 0
        }
    },
    mounted () {
        this.loading()
    },
    methods: {
        async loading() {
            const dadosUser = JSON.parse(localStorage.getItem('dataUser'))

            if (dadosUser) {
                this.usuarioID = dadosUser.uid
                
                this.dataUser = await getDataUserLogged(this.usuarioID)
                this.membresia = this.dataUser[0].membresia ?? ''
                this.isAdmin = this.dataUser[0].role === 'admin'
    
                this.initTimer()
                this.tempoNaC11 += Number(await getHoras(this.usuarioID,'',''))
                this.isLogged = true
            } else {
                this.isLogged = false
            }
        },

        async initTimer() {
            const hourMarked = localStorage.getItem('timeInit')

            const horaInicio = Number(hourMarked.split(':')[0])
            const minutoInicio = Number(hourMarked.split(':')[1])
            const segundoInicio = Number(hourMarked.split(':')[2])

            const horaAtual = new Date()

            const hora = horaAtual.getHours() - horaInicio
            const minuto = horaAtual.getMinutes() - minutoInicio
            const segundo = horaAtual.getSeconds() - segundoInicio

            this.segundos = hora * 3600 + minuto * 60 + segundo
            this.tempoNaC11 = this.segundos

            if (!this.rodando) {
                this.rodando = true;
                this.intervalo = setInterval(() => {
                    this.segundos++;
                    this.tempoNaC11++;
                    this.atualizarDisplay();
                }, 1000);
            }
        },

        atualizarDisplay() {
            this.tempo = this.formatarTempo(this.segundos);
            this.dias = Math.floor(this.tempoNaC11 / 86400) // para 24h
            this.auxTempoC11 = (this.dias > 0 ? this.dias.toString() + 'd ' : '') + this.formatarTempo(this.tempoNaC11 - this.dias * 86400)
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

        openMenu() {
            this.verifyScreen()
            if (!this.isOpen) {
                document.getElementById('container-dataUser').style.transform = `translateX(${this.widthScreen}vw)`
                document.getElementById('openMenu').style.transform = `translateX(0vw)`
            } else {
                document.getElementById('container-dataUser').style.transform = 'translateX(0)'
                document.getElementById('openMenu').style.transform = 'translateX(0)'
            }

            document.getElementById('openMenu').style.transition = '0.4s'
            document.getElementById('container-dataUser').style.transition = '0.4s'
            this.isOpen =  !this.isOpen
        },

        verifyScreen() {
            this.widthScreen = ''

            if (window.screen.width <= 400) {
                this.widthScreen = 70
            } else {
                this.widthScreen = 30
            }
        },

        openFormMembreship() {
            if (confirm('Você possui membresia ativa?')) {
                this.isEditMembresia = true
                this.membresia = this.dataUser[0].membresia.split('/')[0]
            }
        },

        async submitPassword() {
            if (this.novaSenha != '') {
                const payload = {
                    id: this.usuarioID,
                    senha: this.novaSenha,
                }
    
                this.upData(payload)
            }
        },
        
        async upMembreship() {
            const payload = {
                id: this.usuarioID,
                membresia: this.membresia + '/ON',
            }

            this.upData(payload)
        },

        async upData (payload) {
            const update = await upDataUser(payload)
            
            if(update.status) {
                if (payload.membresia) {
                    this.dataUser[0].membresia = payload.membresia
                    this.membresia = payload.membresia.split('/')[0]
                    this.isEditMembresia = false
                    this.message = 'Membresia atualizada com sucesso!'
                    this.size = 30
                } else if (payload.senha) {
                    this.novaSenha = ''
                    this.openFormPassword = false
                    this.message = 'Senha atualizada com sucesso!'
                    this.size = 30
                }
            } else {
                this.message = 'Não foi possível atualizar'
                this.size = 35
            }
        },


        goToAdmin(route) {
            this.openMenu()
            this.$router.push(route)
        }

    }
}
</script>

<style scoped>
#container-dataUser {
    position: absolute;
    height: 100vh;
    width: 30vw;
    left: -30vw;
    top: 0;
    background-color: #1b1b1b;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    box-shadow: 5px 0px 10px rgb(138, 43, 226);
}

#container-password {
    color: #fff;
}

#openMenu {
    top: 0;
    left: 30vw;
    width: 50px;
    height: 50px;
    margin: auto;
    display: flex;
    z-index: 1000 !important;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #1b1b1b;
    color: #fff;
    position: absolute;
    text-align: center;
    font-family: sans-serif;
    border-radius: 0 5px 5px 0;
    font-size: 15pt;
    box-shadow: 6px 0px 10px rgb(138, 43, 226);
}

#dataUser {
    margin: auto;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    height: 30vh;
    width: 100%;
    font-family: sans-serif;
}

#dataUser p {
    color: #fff;
}

#dataUser span {
    color: rgb(138, 43, 226);
}

#upMembreship {
    border: none;
    color: #fff;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
}

#upMembreship:hover {
    color: rgb(138, 43, 226);
    filter: drop-shadow(0 0 15px rgb(138, 43, 226));
    font-size: 12pt;
}

#formMembreship {
    margin-top: 5px;
    display: flex;
    align-items: center;
}

#formMembreship input,
#formPassword input {
    height: 6vh;
    width: 50%;
    border-radius: 5px;
    border: 3px solid rgb(138, 43, 226);
    color: rgb(138, 43, 226);
    padding: 5px 10px;
    font-weight: bold;
}

#formMembreship button,
#formPassword button {
    color: rgb(138, 43, 226);
    height: 6vh;
    min-width: 20%;
    padding: 5px 15px;
    margin: auto;
    border: 3px solid rgb(138, 43, 226);
    cursor: pointer;
    font-weight: bold;
    background-color: #1b1b1b;
    border-radius: 2px;
}

#formPassword button {
    margin: 0 10px !important;
    padding: 0 !important;
    min-width: 10% !important;
}

#formMembreship button:hover {
    color: #1b1b1b;
    background-color: rgb(138, 43, 226);
    border: 3px solid #1b1b1b;
}

@media (max-width: 400px){
    #container-dataUser {
        width: 70vw;
        left: -70vw;
    }

    #openMenu {
        left: 70vw
    }
}
</style>