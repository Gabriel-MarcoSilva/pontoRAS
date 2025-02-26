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
    const verify = localStorage.getItem('token') && localStorage.getItem('timeInit')
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
        localStorage.setItem('token', res.data.accessToken)

        const horarioMarcado = localStorage.getItem('timeInit')

        if (horarioMarcado !== null || horarioMarcado !== undefined) {
            const hour = new Date()
            localStorage.setItem('timeInit', (hour.getHours() < 10 ? '0' + hour.getHours() : hour.getHours()) + ':' + (hour.getMinutes() < 10 ? '0' + hour.getMinutes() : hour.getMinutes()) + ':' + (hour.getSeconds() < 10 ? '0' + hour.getSeconds() : hour.getSeconds()))
        }
        window.location.href = "./dashboard/index.html";
    }).catch(() => {
        alertCustomized('Matrícula e/ou senha incorretas', '20vw')
    })
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

function newCad() {
    window.location.href = './cadastro/index.html'
}