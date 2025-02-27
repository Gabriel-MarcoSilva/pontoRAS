<template>
    <section class="container">
        <div style="display: flex; width: 100%; justify-content: space-between; cursor: pointer;">
            <a onclick="loading()">🔄</a>
            <a onclick="logout()">Sair</a>
        </div>
        <h1>Ponto RAS</h1>
        <div id="timer">
            <div id="container-timer" class="box">
                <div id="tempo">00:00:00</div>
                <div class="container-button">
                    <button onclick="finishTimer()" id="btnParar">Finalizar expediente</button>
                </div>
            </div>
            <div id="container-history" class="box">
                <div
                    style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; text-transform: capitalize;">
                    histórico</div>
            </div>
        </div>
        <div id="afazeres" style="display: none;">
            <form method="get" onsubmit="marcarHorario(event)" id="formHorario">
                <p>O que você fez durante seuexpediente?</p>
                <textarea onkeyup="habilityButton()" name="afazer" id="afazer" rows="6" cols="30"></textarea>
                <div class="container-button">
                    <button type="submit" id="btnMarcarHorario">enviar</button>
                    <button onclick="fecharPopUp()" type="button">cancelar</button>
                </div>
            </form>
        </div>
    </section>

    <section id="alert" style="display: none;"></section>

    <section id="openMenu" onclick="openMenu()">🔜</section>
    <section id="container-dataUser">
        <div id="dataUser">
            <div style="margin-bottom: 15px; display: none;" id="acessoAdmin">
                <hr>
                <p style="text-align: end; cursor: pointer;" onclick="goToAdmin()">Acesso Admin</p>
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
                    <input type="text" name="mebresia" maxlength="8">
                    <button type="submit">ok</button>
                    <button onclick="closeFormMembreship()" type="button">cancelar</button>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import API from '@/plugins/axios';

export default {
    name: 'ComponentDashboard',
    data () {
        return {
            segundos: 0,
            intervalo: 0,
            rodando: false,
            usuarioID: '',
            nome: '',
            tempoNaC11: 0,
            local: '',
            deltaLatitude: 0,
            deltaLongitude: 0,
            dataControle: new Date(),
            isOpen: false,
            dataUser: [],
            widthScreen: 0,

        }
    },
    mounted () {

    },
    methods: {
// implementear: se passou de 10 hr ele olha a localização
        decodeToken() {
            const token = localStorage.getItem('token')

            try {
                const base64Url = token.split('.')[1]; // Pega a parte do payload (segundo bloco)
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Ajusta caracteres especiais
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                        .join('')
                );

                localStorage.setItem('dataUser', jsonPayload)

                return JSON.parse(jsonPayload); // Retorna o objeto JSON decodificado
            } catch (e) {
                return null;
            }
        },

        async loading() {
            const verify = localStorage.getItem('token');
            if (verify) {
                this.initTimer();
                await this.getDate();
            }

            this.dataUser = await API.get(`/usuario?id=${this.usuarioID}`).then(async (res) => {
                return await res.data
            }).catch((err) => {
                return null
            })

            if (this.dataUser[0].role === 'admin') {
                document.getElementById('acessoAdmin').style.display = 'block'
            }
        },

        async loading2() {
            try {
                await this.obterLocalizacao(); // Aguarda a localização antes de continuar
                const verify = localStorage.getItem('token');

                // Verifica se está dentro da margem de erro (ajuste se necessário)
                const margemErro = 0.01; // Ajuste esse valor conforme necessário
                this.local = this.deltaLatitude < margemErro && this.deltaLongitude < margemErro;

                if (this.local) {
                    document.getElementById('btnParar').disabled = false;
                    if (!localStorage.getItem('timeInit')) {
                        localStorage.setItem('timeInit', (this.dataControle.getHours() < 10 ? '0' + this.dataControle.getHours() : this.dataControle.getHours()) + ':' + (this.dataControle.getMinutes() < 10 ? '0' + this.dataControle.getMinutes() : this.dataControle.getMinutes()) + ':' + (this.dataControle.getSeconds() < 10 ? '0' + this.dataControle.getSeconds() : this.dataControle.getSeconds()))
                    }
                    if (verify) {
                        this.initTimer();
                        await this.getDate();
                    }
                } else {
                    await this.getDate();
                    document.getElementById('btnParar').disabled = true;
                    this.atualizarDisplay();
                }

            } catch (error) {
                return null
            }
        },

        logout() {
            const conf = this.segundos > 0 ? confirm('Deseja sair mesmo? Se sair agora seu progresso será perdido') : true
            if (conf) {
                window.location.href = "../index.html";
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
            document.getElementById("tempo").textContent = formatarTempo(this.segundos);
            dias = Math.floor(this.tempoNaC11 / 86400) // para 24h
            document.getElementById('tempoC11').innerText = (dias > 0 ? dias.toString() + 'd ' : '') + formatarTempo(this.tempoNaC11 - dias * 86400)
        },

        async getDate() {

            /*const DateInicio = new Date();
            const PrimeiroDiaMes = new Date(
                DateInicio.getFullYear(),
                DateInicio.getMonth(),
                1
            );

            const dataFinal = formatDate(DateInicio);
            const dataInicio = formatDate(PrimeiroDiaMes);
            let response = await API.get(`/horario?dataInicio=${dataInicio}&dataFim=${dataFinal}`).then(res => {
            */

            let response = await API.get(`/buscainfo?this.usuarioId=${this.usuarioID}`).then(res => {
                return res.data
            }).catch(() => {
                this.alertCustomized('Não foi possível ver seu histórico', '60vw')
            })

            const container = document.getElementById("container-history");
            container.innerHTML = ""; // Limpa antes de renderizar

            for (let i = 0; i < response.length; i++) {
                const div = document.createElement("div");
                div.classList.add("history-item");
                div.innerHTML = `
                    <strong>Data:</strong>${dateVisual(response[i].data)} |
                    <strong>Tempo:</strong> ${formatarTempo(response[i].horas)} | 
                    <strong>Horário:</strong> ${response[i].horario}
                    <br/><br/> <strong>Descrição:</strong> ${response[i].descricao}`
                container.appendChild(div);
                this.tempoNaC11 += response[i].horas
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

        initTimer() {
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

            dados = decodeToken()
            this.usuarioID = dados.uid
            nome = dados.nome

            if (!this.rodando) {
                this.rodando = true;
                this.intervalo = setInterval(() => {
                    this.segundos++;
                    this.tempoNaC11++;
                    atualizarDisplay();
                }, 1000);
            }
        },

        marcarHorario(e) {
            e.preventDefault()
            const hour = new Date()
            const description = document.getElementsByName('afazer')[0].value

            const payload = {
                horas: this.segundos,
                horario: (hour.getHours() < 10 ? '0' + hour.getHours() : hour.getHours()) + ':' + (hour.getMinutes() < 10 ? '0' + hour.getMinutes() : hour.getMinutes()) + ':' + (hour.getSeconds() < 10 ? '0' + hour.getSeconds() : hour.getSeconds()),
                descricao: description.split('\n')[0],
                usuarioId: this.usuarioID
            }

            API.post('/horario', payload).then(() => {
                fecharPopUp()
                resetar()
                localStorage.setItem('timeInit', payload.horario)
                document.getElementById('formHorario').reset()
                document.getElementById('btnMarcarHorario').disabled = true
                this.alertCustomized('Registrado com sucesso!', '30vw')
                loading()
            }).catch(() => {
                this.alertCustomized('Coloque uma descrição', '30vw')
            })
            document.getElementById('btnMarcarHorario').disabled = false
        },

        finishTimer() {
            if (this.segundos > 180) {
                document.getElementById('afazeres').style.display = 'flex'
            } else {
                this.alertCustomized('Horário não cadastrado. Você ficou pouco tempo na C11', '50vw')
            }
        },

        fecharPopUp() {
            document.getElementById('afazeres').style.display = 'none'
            document.getElementById('formHorario').reset()
        },

        resetar() {
            clearInterval(this.intervalo);
            this.segundos = 0;
            this.rodando = false;
            atualizarDisplay();
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
        },

        habilityButton() {
            const description = document.getElementsByName('afazer')[0].value
            const button = document.getElementById('btnMarcarHorario')

            if (description === '') {
                button.disabled = true
            } else {
                button.disabled = false
            }
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
                            alertCustomized("Erro ao obter localização", "30vw")
                            reject(erro);
                        }
                    );
                } else {
                    alertCustomized("Geolocalização não é suportada neste navegador.", '40vw');
                    reject(new Error("Geolocalização não suportada"));
                }
            });
        },

        openMenu() {
            verifyScreen()

            document.getElementById('nameUser').innerText = this.dataUser[0].nome
            document.getElementById('cursoUser').innerText = this.dataUser[0].curso
            document.getElementById('matriculaUser').innerText = this.dataUser[0].matricula
            document.getElementById('membresiaUser').innerText = this.dataUser[0].membresia.split('/')[0]


            if (!this.isOpen) {
                document.getElementById('container-dataUser').style.transform = `translateX(${this.widthScreen})`
                document.getElementById('openMenu').style.transform = `translateX(${this.widthScreen})`
                document.getElementById('openMenu').innerText = '🔙'
            } else {
                document.getElementById('container-dataUser').style.transform = 'translateX(0)'
                document.getElementById('openMenu').style.transform = 'translateX(0)'
                document.getElementById('openMenu').innerText = '🔜'
            }

            document.getElementById('openMenu').style.transition = '0.4s'
            document.getElementById('container-dataUser').style.transition = '0.4s'
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
                document.getElementById('formMembreship').style.display = 'flex'
                document.getElementsByName('mebresia')[0].value = this.this.dataUser[0].membresia.split('/')[0]
            }
        },

        closeFormMembreship() {
            document.getElementById('formMembreship').style.display = 'none'
        },

        upMembreship(e) {
            const form = document.getElementById('formMembreship')

            e.preventDefault()
            const data = new FormData(form)

            const dados = new URLSearchParams(data)

            const payload = {
                id: this.usuarioID,
                membresia: [...dados.values()][0] + '/ON',
            }

            API.post('/upmembresia', payload).then((res) => {
                this.dataUser[0].membresia = payload.membresia
                document.getElementById('membresiaUser').innerText = payload.membresia.split('/')[0]
                document.getElementById('formMembreship').style.display = 'none'
                this.alertCustomized('Membresia atualizada com sucesso!', '30vw')
            }).catch((err) => {
                this.alertCustomized('Não foi possível atualizar sua membresia', '35vw')
            })
        },

        goToAdmin() {
            window.location.href = "../dashboard_admin/index.html";
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