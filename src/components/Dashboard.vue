<template>
    <section class="container">
        <div style="display: flex; width: 100%; justify-content: space-between; cursor: pointer;">
            <a @click="loading()">🔄</a>
            <a @click="logout()">Sair</a>
        </div>
        <h1>Ponto RAS</h1>
        <div id="timer">
            <div id="container-timer" class="box">
                <div id="tempo">{{ tempo }}</div>
                <div class="container-button">
                    <button @click="finishTimer()" @disabled="disabledButton" id="btnParar">Finalizar expediente</button>
                </div>
            </div>
            <div id="container-history" class="box">
                <div v-if="this.historicoUser.data?.error">
                    {{ this.historicoUser.data.error }}
                </div>
                <div v-else style="width: 100%;">
                    <div class="history-item" v-for="item in historicoUser.data" :key="item">
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
        </div>
        <div id="afazeres" v-if="isOpenPopUp">
            <form method="get" @submit.prevent="marcarHorario()" id="formHorario">
                <p>O que você fez durante seuexpediente?</p>
                <textarea @keyup="habilityButton()" v-model="descricao" name="afazer" id="afazer" rows="6" cols="30"></textarea>
                <div class="container-button">
                    <button type="submit" id="btnMarcarHorario" @disabled="disabledButtonHorario">enviar</button>
                    <button @click="fecharPopUp()" type="button">cancelar</button>
                </div>
            </form>
        </div>
        <Alert :message="message" :size="size" @close="this.message = ''" :key="message"/>
    </section>
</template>

<script>

import { decodeToken } from '@/plugins/auth';
import { buscaTimeUser, getDataUserLogged, setHorario, upMembresia } from '@/services';
import Alert from './Alert.vue';

export default {
    name: 'ComponentDashboard',
    components: {
        Alert
    },
    data () {
        return {
            nome: '',
            isAdmin: false,
            rodando: false,
            dataUser: [],
            usuarioID: '',

            tempo: '00:00:00',
            segundos: 0,
            intervalo: 0,
            tempoNaC11: 0,
            auxTempoC11: '',

            local: '',
            deltaLatitude: 0,
            deltaLongitude: 0,

            isOpen: false,
            widthScreen: 0,
            dataControle: new Date(),
            isEditMembresia: false,

            message: '',
            size: 0,
            descricao: '',
            membresia: '',
            isOpenPopUp: false,
            historicoUser: [],
            disabledButton: false,
            disabledButtonHorario: false
        }
    },
    async mounted () {
        this.dados = await decodeToken()
        this.usuarioID = this.dados.uid
        this.nome = this.dados.nome

        this.loading()
    },
    methods: {
        async loading() {
            const verify = localStorage.getItem('token');
            if (verify) {
                this.initTimer();
                await this.getDate();
            }

            this.dataUser = await getDataUserLogged(this.usuarioID)
            this.isAdmin = this.dataUser[0].role === 'admin'
        },

        async loading2() {
            try {
                await this.obterLocalizacao(); // Aguarda a localização antes de continuar
                const verify = localStorage.getItem('token');

                // Verifica se está dentro da margem de erro (ajuste se necessário)
                const margemErro = 0.01; // Ajuste esse valor conforme necessário
                this.local = this.deltaLatitude < margemErro && this.deltaLongitude < margemErro;

                if (this.local) {
                    this.disableButton(false);
                    if (!localStorage.getItem('timeInit')) {
                        localStorage.setItem('timeInit', (this.dataControle.getHours() < 10 ? '0' + this.dataControle.getHours() : this.dataControle.getHours()) + ':' + (this.dataControle.getMinutes() < 10 ? '0' + this.dataControle.getMinutes() : this.dataControle.getMinutes()) + ':' + (this.dataControle.getSeconds() < 10 ? '0' + this.dataControle.getSeconds() : this.dataControle.getSeconds()))
                    }
                    if (verify) {
                        this.initTimer();
                        await this.getDate();
                    }
                } else {
                    await this.getDate();
                    this.disableButton(true);
                    this.atualizarDisplay();
                }

            } catch (error) {
                return null
            }
        },

        logout() {
            const conf = this.segundos > 0 ? confirm('Deseja sair mesmo? Se sair agora seu progresso será perdido') : true
            if (conf) {
                this.$router.push('/login')
                localStorage.clear()
            }
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

        atualizarDisplay() {
            this.tempo = this.formatarTempo(this.segundos);
            this.dias = Math.floor(this.tempoNaC11 / 86400) // para 24h
            this.auxTempoC11 = (this.dias > 0 ? this.dias.toString() + 'd ' : '') + this.formatarTempo(this.tempoNaC11 - this.dias * 86400)
        },

        async getDate() {

            this.historicoUser = await buscaTimeUser(this.usuarioID)

            
            if (this.historicoUser.status) {
                for (let i = 0; i < this.historicoUser.data.length; i++) {
                    this.tempoNaC11 += this.historicoUser.data[i].horas
                    this.historicoUser.data[i].data = await this.dateVisual(this.historicoUser.data[i].data)
                    this.historicoUser.data[i].horas = await this.formatarTempo(this.historicoUser.data[i].horas)
                }
            } else if (this.historicoUser.data?.error) {
                this.message = 'Não há registros'
                this.size = 60
            } else {
                this.message = 'Não foi possível ver seu histórico'
                this.size = 60
            }
        },

        dateVisual(date) {
            const data = date.split('T')[0]

            const dia = data.split('-')[2]
            const mes = data.split('-')[1]
            const ano = data.split('-')[0]
            return dia + '/' + mes + '/' + ano
        },

        formatDate (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
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

        async marcarHorario() {
            const hour = new Date()

            const payload = {
                horas: this.segundos,
                horario: (hour.getHours() < 10 ? '0' + hour.getHours() : hour.getHours()) + ':' + (hour.getMinutes() < 10 ? '0' + hour.getMinutes() : hour.getMinutes()) + ':' + (hour.getSeconds() < 10 ? '0' + hour.getSeconds() : hour.getSeconds()),
                descricao: this.descricao,
                usuarioId: this.usuarioID
            }

            const cadHorario = await setHorario(payload)

            if (cadHorario) {
                localStorage.setItem('timeInit', payload.horario)
                this.disableButton(true)

                this.message = 'Registrado com sucesso!'
                this.size = 30

                this.fecharPopUp()
                this.resetar()
                this.descricao = ''
                this.loading()
            } else {
                this.message = 'Coloque uma descrição'
                this.size = 30
            }
        },

        disableButton (status) {
            this.disabled = status
        },

        finishTimer() {
            if (this.segundos > 180) {
                this.isOpenPopUp = true
            } else {
                this.message = 'Horário não cadastrado. Você ficou pouco tempo na C11'
                this.size = 60
            }
        },

        fecharPopUp() {
            this.isOpenPopUp = false
            this.descricao = ''
        },

        resetar() {
            clearInterval(this.intervalo);
            this.segundos = 0;
            this.rodando = false;
            this.atualizarDisplay();
        },

        habilityButton() {
            this.disabledButtonHorario = this.descricao === ''
        },

        async obterLocalizacao() {
            return new Promise((resolve, reject) => {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                            function (posicao) {
                            const latitude = posicao.coords.latitude;
                            const longitude = posicao.coords.longitude;

                            this.deltaLatitude = Math.abs(Math.abs(latitude) - 12.656981);
                            this.deltaLongitude = Math.abs(Math.abs(longitude) - 39.094652);

                            resolve(); // Finaliza a Promise quando a localização é obtida
                        },
                        function(erro) {
                            this.message = "Erro ao obter localização"
                            this.size = 30
                            reject(erro);
                        }
                    );
                } else {
                    this.message = "Geolocalização não é suportada neste navegador."
                    this.size = 40
                    reject(new Error("Geolocalização não suportada"));
                }
            });
        },

        openFormMembreship() {
            if (confirm('Você possui membresia?')) {
                this.isEditMembresia = true
                this.membresia = this.dataUser.membresia.split('/')[0]
            }
        },

        closeFormMembreship() {
            document.getElementById('formMembreship').style.display = 'none'
        },

        async upMembreship() {
            const payload = {
                id: this.usuarioID,
                membresia: this.membresia + '/ON',
            }

            const upgrade = await upMembresia(payload)

            if (upgrade.status) {
                this.dataUser.membresia = payload.membresia
                this.isEditMembresia = false
                this.message = 'Membresia atualizada com sucesso!'
                this.size = 30
            }else {
                this.message = 'Não foi possível atualizar sua membresia'
                this.size = 35
            }

            
        },

        goToAdmin() {
            this.$router.push('/dashboard-admin')
        },

        newCad () {
            this.$router.back()
        }
    }
}
</script>

<style scoped>
.container {
    width: 80vw !important;
    height: 80vh !important;
    padding: 10px;
    color: #fff !important;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}

#timer {
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
}

.box {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    width: 50%;
    height: 100%;
    margin: 0 5px;
    border: 5px solid #fff;
}

#container-timer {
    height: 100%;
}

#tempo {
    background-color: #fff;
    padding: 10px 20px;
    color: #424242;
    font-weight: bold;
    font-family: sans-serif;
    font-size: 30pt;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.container-button {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
}

#container-timer button,
#afazeres form button {
    height: 6vh;
    width: 60%;
    border: 3px solid white;
    background-color: #1b1b1b;
    color: white;
    font-weight: bold;
    cursor: pointer;
    text-transform: capitalize;
}

#container-timer button:hover,
#afazeres form button:hover {
    color: #1b1b1b;
    border: 5px solid #1b1b1b;
    background: #fff;
}

#afazeres {
    position: absolute;
    margin: auto;
    height: 50vh;
    width: 40vw;
    background-color: #1b1b1b;
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
}

#afazeres form {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.afazeres form p {
    text-align: center;
    margin-bottom: 20px;
    font-size: 15pt;
}

#afazeres form button {
    width: 40%;
}

textarea {
    padding: 10px;
}

#container-history {
    width: 100%;
    font-family: Arial, sans-serif;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    height: 100%;
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

@media (max-width: 400px) {

    .container {
        width: 80vw;
        height: 90vh;
    }

    #tempo {
        font-size: 20pt;
    }

    #timer {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .box {
        width: 100%;
        margin: 5px 0;
    }

    #afazeres {
        height: 60vh;
        width: 90vw;
    }

    #afazeres form p {
        font-size: 15pt !important;
        text-align: center;
        margin-bottom: 20px;
    }

    #container-dataUser {
        width: 70vw;
        left: -70vw;
    }
}
</style>