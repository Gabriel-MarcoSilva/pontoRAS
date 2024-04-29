const hoje = new Date()
const mes = hoje.getMonth()
const ano = hoje.getFullYear()
const dia = hoje.getDate()

calendario()

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
        })
        .catch((err) => {
            sessionStorage.setItem('user', payload.user)
            user = sessionStorage.getItem('user')
            dashboard.style.display = 'flex'
            loginElement.style.display = 'none'
            alert('ocorreu um erro, tente novamente mais tarde')
        })
}

function registroData(e, props, acao) {

    e.preventDefault()
    let data = ''
    let dados = null

    const form = document.getElementById('formData')

    if (props === 'auto') {
        data = new Date()

        dados = new URLSearchParams({
            dia: data.getFullYear() + '-' + 0 + Number(data.getMonth() + 1) + '-' + data.getDate(),
            periodo: acao,
            hora: data.getHours() + ':' + data.getMinutes()
        })
    } else {
        document.getElementById("periodo").value = funcao == 1 ? 'entrada' : 'saida'
        data = new FormData(form)
        dados = new URLSearchParams(data)
    }

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

    if (info || !user) {
        alert('Dados incompletos')
    } else if (payload.data){
        let diaD = payload.data.split('-')
        let date = new Date()
        if(Number(diaD[2]) > Number(dia) || Number(diaD[1]) > Number(mes) + 1){
            alert('Ainda não inventamos uma máquina do tempo')
        }
        if (payload.hora) {
            let horaD = payload.hora.split(':')
            if (Number(horaD[0]) > date.getHours()){
                alert('espere mais um pouco')
            }
        }
    } else {
        API.post('/entrar', payload)
            .then(() => {
                document.getElementById("periodo").value = ''
                document.getElementById("data").value = ''
                document.getElementById("hora").value = ''
                regAuto.style.display = 'flex'
                formDatas.style.display = 'none'
                botoesAuto.style.display = 'flex'
            })
            .catch(() => {
                alert('houve um erro, tene novamente mais tarde')
            })
    }
}

function revelarForm(props) {
    if (props != 2) {
        funcao = props
        formDatas.style.display = 'flex'
        regAuto.style.display = 'none'
        botoesAuto.style.display = 'none'
    } else {
        formDatas.style.display = 'none'
        regAuto.style.display = 'flex'
        botoesAuto.style.display = 'flex'
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
