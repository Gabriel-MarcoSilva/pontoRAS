let auxAlert = false

const API = axios.create(
    {
        baseURL: 'https://rrasponto.onrender.com',
        headers: { 'Content-Type': 'application/json' }
    }
)

function loading() {
    API.get('/').then(() => {
        console.log('api on')
    }).catch(() => {
        console.log('api off')
    })
    const verify = sessionStorage.getItem('token') && sessionStorage.getItem('timeInit')
    if (!verify) {
        document.getElementById('formLogin').reset()
        document.getElementById('formCadastro').reset()
    } else {
        window.location.href = "./dashboard/index.html";
    }
}

function login(e) {
    const form = document.getElementById('formLogin')

    e.preventDefault()
    const data = new FormData(form)

    const dados = new URLSearchParams(data)

    const payload = {
        matricula: [...dados.values()][0],
        senha: [...dados.values()][1],
    }

    API.post('/login', payload).then((res) => {
        sessionStorage.setItem('token', res.data.accessToken)

        const horarioMarcado = sessionStorage.getItem('timeInit')

        if (horarioMarcado !== null || horarioMarcado !== undefined) {
            const hour = new Date()
            sessionStorage.setItem('timeInit', (hour.getHours() < 10 ? '0' + hour.getHours() : hour.getHours()) + ':' + (hour.getMinutes() < 10 ? '0' + hour.getMinutes() : hour.getMinutes()) + ':' + (hour.getSeconds() < 10 ? '0' + hour.getSeconds() : hour.getSeconds()))
        }
        window.location.href = "./dashboard/index.html";
    }).catch(() => {
        alertCustomized('Matrícula e/ou senha incorretas', '20vw')
    })
}

function cadastro(e) {
    const form = document.getElementById('formCadastro')

    e.preventDefault()
    const data = new FormData(form)

    const dados = new URLSearchParams(data)

    const payload = {
        nome: [...dados.values()][0],
        telefone: [...dados.values()][1],
        matricula: [...dados.values()][2],
        curso: [...dados.values()][3],
        email: [...dados.values()][4],
        senha: [...dados.values()][5]
    }

    API.post('/usuario', payload).then(() => {
        alertCustomized('Usuário cadastrado com sucesso!', '50vw')
        newCad()
    }).catch(() => {
        alertCustomized('Não foi possível cadastrar o usuário', '60vw')
    })
}

function newCad() {
    if (document.getElementById('cadastro').style.display == 'flex') {
        document.getElementById('login').style.display = 'flex'
        document.getElementById('cadastro').style.display = 'none'
        document.getElementById('formLogin').reset()

    } else {
        document.getElementById('login').style.display = 'none'
        document.getElementById('cadastro').style.display = 'flex'
        document.getElementById('formCadastro').reset()
    }
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

function closeAlert() {
    document.getElementById('alert').style.display = 'none'
}