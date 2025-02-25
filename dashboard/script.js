let segundos = 0;
let intervalo;
let rodando = false;

let usuarioID, nome
let test = false
let tempoNaC11 = 0

let local
let deltaLatitude, deltaLongitude

let dataControle = new Date()

const API = axios.create(
    {
        baseURL: 'https://rrasponto.onrender.com',
        headers: { 'Content-Type': 'application/json' }
    }
)

API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Corrigido "Bearer"
    }
    return config;
})

// implementear: se passou de 10 hr ele olha a localização

function decodeToken() {
    const token = sessionStorage.getItem('token')

    try {
      const base64Url = token.split('.')[1]; // Pega a parte do payload (segundo bloco)
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Ajusta caracteres especiais
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload); // Retorna o objeto JSON decodificado
    } catch (e) {
      console.error('Erro ao decodificar o token:', e);
      return null;
    }
}

async function loading() {
    try {
        await obterLocalizacao(); // Aguarda a localização antes de continuar
        const verify = sessionStorage.getItem('token');

        // Verifica se está dentro da margem de erro (ajuste se necessário)
        const margemErro = 0.01; // Ajuste esse valor conforme necessário
        local = deltaLatitude < margemErro && deltaLongitude < margemErro;

        if (local) {
            sessionStorage.setItem('timeInit', (dataControle.getHours() < 10 ? '0' + dataControle.getHours() : dataControle.getHours()) + ':' + (dataControle.getMinutes() < 10 ? '0' + dataControle.getMinutes() : dataControle.getMinutes()) + ':' + (dataControle.getSeconds() < 10 ? '0'+dataControle.getSeconds() : dataControle.getSeconds()))
            if (verify) {
                initTimer();
                await getDate();
            } else {
                sessionStorage.clear();
                window.location.href = "../index.html";
            }
        } else {
            await getDate();
            document.getElementById('btnParar').disabled = true;
            atualizarDisplay();
        }

    } catch (error) {
        console.log("Erro ao carregar localização:", error);
    }
}

function logout () {
    const conf = segundos > 0 ? confirm('Deseja sair mesmo? Se sair agora seu progresso será perdido') : true
    if (conf) {
        window.location.href = "../index.html";
        sessionStorage.clear()
    }
}

function formatarTempo(segundos) {
    let horas = Math.floor(segundos / 3600);
    let minutos = Math.floor((segundos % 3600) / 60);
    let seg = segundos % 60;
    return (
        String(horas).padStart(2, '0') + ":" +
        String(minutos).padStart(2, '0') + ":" +
        String(seg).padStart(2, '0')
    );
}

function atualizarDisplay() {
    document.getElementById("tempo").textContent = formatarTempo(segundos);
    dias = Math.floor(tempoNaC11/86400) // para 24h
    document.getElementById('tempoC11').innerText = (dias > 0 ? dias.toString() + 'd ' : '') + formatarTempo(tempoNaC11 - dias*86400)
}

async function getDate () {

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

    let response = await API.get(`/buscainfo?usuarioId=${usuarioID}`).then(res => {
        return res.data
    }).catch(() => {
        alertCustomized('Não foi possível ver seu histórico', '60vw')
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
        tempoNaC11 += response[i].horas
    }
}

function dateVisual(date) {
    const data = date.split('T')[0]

    const dia = data.split('-')[2]
    const mes = data.split('-')[1]
    const ano = data.split('-')[0]
    return dia + '/' + mes + '/' + ano
}

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
function initTimer() {
    const hourMarked = sessionStorage.getItem('timeInit')

    const horaInicio = Number(hourMarked.split(':')[0])
    const minutoInicio = Number(hourMarked.split(':')[1])
    const segundoInicio = Number(hourMarked.split(':')[2])

    const horaAtual = new Date()

    const hora = horaAtual.getHours() - horaInicio
    const minuto = horaAtual.getMinutes() - minutoInicio
    const segundo = horaAtual.getSeconds() - segundoInicio

    segundos = hora*3600 + minuto*60 + segundo
    tempoNaC11 = segundos

    dados = decodeToken()
    usuarioID = dados.uid
    nome = dados.nome

    if (!rodando) {
        rodando = true;
        intervalo = setInterval(() => {
            segundos++;
            tempoNaC11++;
            atualizarDisplay();
        }, 1000);
    }
}

function marcarHorario (e) {
    e.preventDefault()
    const hour = new Date()
    const description = document.getElementsByName('afazer')[0].value

    const payload = {
        horas: segundos,
        horario: (hour.getHours() < 10 ? '0' + hour.getHours() : hour.getHours()) + ':' + (hour.getMinutes() < 10 ? '0' + hour.getMinutes() : hour.getMinutes()) + ':' + (hour.getSeconds() < 10 ? '0'+hour.getSeconds() : hour.getSeconds()),
        descricao: description.split('\n')[0],
        usuarioId:usuarioID
    }

    API.post('/horario', payload).then(() => {
        fecharPopUp()
        resetar()
        sessionStorage.setItem('timeInit', payload.horario)
        document.getElementById('formHorario').reset()
        loading()
    }).catch(() => {
        alertCustomized('Coloque uma descrição', '30vw')
    })
}

function finishTimer() {
    if (segundos > 180) {
        document.getElementById('afazeres').style.display = 'flex'
    } else {
        alertCustomized('Horário não cadastrado. Você ficou pouco tempo na C11', '50vw')
    }
}

function fecharPopUp () {
    document.getElementById('afazeres').style.display = 'none'
    document.getElementById('formHorario').reset()
}

function resetar() {
    clearInterval(intervalo);
    segundos = 0;
    rodando = false;
    atualizarDisplay();
}
    
function alertCustomized(message, size) {
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

function habilityButton() {
    const description = document.getElementsByName('afazer')[0].value
    const button = document.getElementById('btnMarcarHorario')

    if (description === '') {
        button.disabled = true
    } else {
        button.disabled = false
    }
}

async function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (posicao) {
                    const latitude = posicao.coords.latitude;
                    const longitude = posicao.coords.longitude;

                    deltaLatitude = Math.abs(Math.abs(latitude )- 12.656981);
                    deltaLongitude = Math.abs(Math.abs(longitude) - 39.094652);
                    
                    resolve(); // Finaliza a Promise quando a localização é obtida
                },
                function (erro) {
                    alertCustomized("Erro ao obter localização", "30vw")
                    reject(erro);
                }
            );
        } else {
            console.log("Geolocalização não é suportada neste navegador.");
            reject(new Error("Geolocalização não suportada"));
        }
    });
}