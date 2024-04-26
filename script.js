
// form.addEventListener('submit', )
calendario()

const API = axios.create(
    {
        baseURL: '',
        headers: { 'Content-Type': 'application/json' }
    }
)

let funcao = ''

function login(e) {
    const form = document.getElementById('formLogin')
    // se login então document.getelement = display none

    e.preventDefault()
    const data = new FormData(form)

    const payload = new URLSearchParams(data)

    API.post('/login', payload)
        .then((res) => {
            document.getElementById('dashboard').style.display = 'flex'
            document.getElementById('login').style.display = 'none'
        })
        .catch((err) => {
            alert('houve um erro, tente novamente mais tarde')
        })
}

function registroData(e, props, acao) {

    e.preventDefault()
    let data = ''
    let payload = null

    const form = document.getElementById('formData')

    if (props === 'auto') {
        data = new Date()

        payload = new URLSearchParams({
            dia: data.getDate() + '-' + 0 + Number(data.getMonth() + 1) + '-' + data.getFullYear(),
            periodo: acao,
            hora: data.getHours() + ':' + data.getMinutes()
        })
    } else {
        document.getElementById("periodo").value = funcao == 1 ? 'entrada' : 'saida'
        data = new FormData(form)
        payload = new URLSearchParams(data)
    }

    let info = false;

    [...payload.values()].map((item) => {
        if (item == '') {
            info = true
        }
    })

    if (info) {
        alert('Dados incompletos')
    } else {
        API.post('/entrar', payload)
            .then(() => {
                document.getElementById("periodo").value = ''
                document.getElementById("data").value = ''
                document.getElementById("hora").value = ''
                document.getElementById('regAuto').style.display = 'flex'
                document.getElementById('formDasDatas').style.display = 'none'
                document.getElementById('botoesReg').style.display = 'block'
            })
            .catch(() => {
                alert('houve um erro, tene novamente mais tarde')
            })
    }
}

function revelarForm(props) {
    if (props != 2) {
        funcao = props
        document.getElementById('formDasDatas').style.display = 'flex'
        document.getElementById('regAuto').style.display = 'none'
        document.getElementById('botoesReg').style.display = 'none'
    } else {
        document.getElementById('formDasDatas').style.display = 'none'
        document.getElementById('regAuto').style.display = 'flex'
        document.getElementById('botoesReg').style.display = 'block'
    }
}

function calendario() {
    const calendario = document.getElementById('calendario')
    const hoje = new Date()
    const mes = hoje.getMonth()
    const ano = hoje.getFullYear()
    const dia = hoje.getDate()

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
    if (props) {
        document.getElementById('info').style.display = 'flex'
    } else {
        document.getElementById('info').style.display = 'none'
    }
}
