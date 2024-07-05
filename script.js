const hoje = new Date()
const mes = hoje.getMonth()
const ano = hoje.getFullYear()
const dia = hoje.getDate()

let isInLab = false;

calendario()
getLocation()

const API = axios.create(
    {
        baseURL: '',
        headers: { 'Content-Type': 'application/json' }
    }
)

let funcao = ''
let user = sessionStorage.getItem('user')

const dashboard = document.getElementById('dashboard')
const loginElement = document.getElementById('login')
const formDatas = document.getElementById('formDasDatas')
const regAuto = document.getElementById('regAuto')
const botoesAuto = document.getElementById('botoesReg')

function loading() {
    if (!user) {
        loginElement.style.display = 'flex'
        dashboard.style.display = 'none'
    } else {
        dashboard.style.display = 'flex'
        loginElement.style.display = 'none'
    }
}

function logout() {
    user = null
    document.getElementsByName("usuario")[0].value = ''
    document.getElementsByName("senha")[0].value = ''
    sessionStorage.removeItem('user')
    loading()
}

function login(e) {
    const form = document.getElementById('formLogin')

    e.preventDefault()
    const data = new FormData(form)

    const dados = new URLSearchParams(data)

    const payload = {
        user: [...dados.values()][0],
        password: [...dados.values()][1],
    }

    API.post('/login', payload)
        .then((res) => {
            sessionStorage.setItem('user', payload.user)
            user = sessionStorage.getItem('user')
            dashboard.style.display = 'flex'
            loginElement.style.display = 'none'
            registroData('entrada')
        })
        .catch((err) => {
            sessionStorage.setItem('user', payload.user)
            user = sessionStorage.getItem('user')
            dashboard.style.display = 'flex'
            loginElement.style.display = 'none'
            registroData('entrada')
            alert('ocorreu um erro, tente novamente mais tarde')
        })
}

function registroData(acao) {

    let data = ''
    let dados = null

    const form = document.getElementById('formData')

    data = new Date()

    dados = new URLSearchParams({
        dia: data.getFullYear() + '-' + 0 + Number(data.getMonth() + 1) + '-' + data.getDate(),
        periodo: acao,
        hora: data.getHours() + ':' + data.getMinutes()
    })
    
    let info = false;

    [...dados.values()].map((item) => {
        if (item == '') {
            info = true
        }
    })

    const payload = {
        data: [...dados.values()][0],
        hora: [...dados.values()][2],
        periodo: [...dados.values()][1],
        user: user
    }

    console.log(payload)

    if (info || !user || !isInLab) {
        alert('Dados incompletos')
    } else {
        try {
            API.post('/entrar', payload)
            .then(() => {
                alert('data cadastrada com sucesso')
            })
            .catch(() => {
                alert('houve um erro, tene novamente mais tarde')
            })
        } catch (error) {
            console.log('error')
        }
    }
}

function calendario() {
    const calendario = document.getElementById('calendario')

    const arrayMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const total = new Date(ano, mes, 0).getDate()
    const primeiroDia = new Date(ano, mes, 1).getDay()

    let html = `<h2 id="mes-ano">${arrayMeses[mes]} ${ano}</h2>`

    html += "<table><tr><th>Dom</th><th>Seg</th><th>Ter</th><th>Qua</th><th>Qui</th><th>Sex</th><th>Sáb</th></tr>"

    let day = 1
    for (let i = 0; i < 6; i++) {
        html += '<tr>'
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < primeiroDia) {
                html += '<td></td>'
            } else if (day > total) {
                break;
            } else {
                const classNames = []
                if (day === dia) {
                    classNames.push('today')
                } else {
                    if (j == 6 || j == 0 && day !== dia) {
                        classNames.push('fds')
                    }
                }
                html += `<td class=${classNames.join("")}>${day}</td>`
                day++
            }
        }
        html += '</tr>'
    }

    html += '</table>'

    calendario.innerHTML = html
}

function informa(props) {
    const info = document.getElementById('info')
    if (props) {
        info.style.display = 'flex'
    } else {
        info.style.display = 'none'
    }
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    if (latitude !== -12.657904 && longitude !== -39.093855) {
        isInLab = false;
        alert('você não está no C11')
    } else {
        isInLab = true;
    }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("Usuário negou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Informação de localização não está disponível.");
            break;
        case error.TIMEOUT:
            console.log("A solicitação para obter a localização expirou.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("Ocorreu um erro desconhecido.");
            break;
    }
}
