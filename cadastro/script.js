let isOpen = false
let dataUser = []
let widthScreen = 0
let usuarioID = ''

const API = axios.create(
    {
        baseURL: 'https://rrasponto.onrender.com',
        headers: { 'Content-Type': 'application/json' }
    }
)

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Corrigido "Bearer"
    }
    return config;
})

async function loading() {

    const dadosUser = JSON.parse(localStorage.getItem('dataUser'))
    usuarioID = dadosUser.uid

    dataUser = await API.get(`/usuario?id=${usuarioID}`).then(async (res) => {
        return await res.data
    }).catch((err) => {
        console.error(err)
    })

    byTag('id', 'formCadastro').reset()

    if (dataUser[0].role === 'admin') {
        byTag('id', 'acessoAdmin').style.display = 'block'
    }
}
function byTag(type, tag) {
    if (type == 'id') {
        return document.getElementById(tag)
    } else if (type == 'name') {
        return document.getElementsByName(tag)[0]
    }
}

function cadastro(e) {
    const form = byTag('id', 'formCadastro')

    e.preventDefault()
    const data = new FormData(form)

    const dados = new URLSearchParams(data)

    const payload = {
        nome: [...dados.values()][0],
        telefone: [...dados.values()][1],
        matricula: [...dados.values()][2],
        curso: [...dados.values()][3],
        membresia: [...dados.values()][4].length > 0 ? [...dados.values()][4] + '/ON' : '101010/OFF',
        role: 'user',
        email: [...dados.values()][5],
        senha: [...dados.values()][6]
    }

    const isEmpty = !payload.nome || !payload.telefone || !payload.matricula || !payload.curso || !payload.email || !payload.senha

    if (!isEmpty) {
        if (payload.telefone.length < 11) {
            alertCustomized('Número de telefone inválido', '35vw')
            byTag('name', 'telefone').style.borderColor = 'red'
        } else {
            byTag('name', 'telefone').style.borderColor = 'rgb(138, 43, 226)'
        }

        if (payload.matricula.length < 9) {
            alertCustomized('Número de matrícula inválido', '35vw')
            byTag('name', 'matricula').style.borderColor = 'red'
        } else {
            byTag('name', 'matricula').style.borderColor = 'rgb(138, 43, 226)'
        }

        if (payload.membresia && payload.membresia.length < 7) {
            alertCustomized('Número de membresia inválido', '35vw')
            byTag('name', 'membresia').style.borderColor = 'red'

        } else {
            byTag('name', 'membresia').style.borderColor = 'rgb(138, 43, 226)'
        }

        if (!payload.email.match('@') && (!payload.email.match('.com') || !payload.email.match('.br'))) {
            alertCustomized('Email inválido', '20vw')
            byTag('name', 'email').style.borderColor = 'red'
        } else {
            byTag('name', 'email').style.borderColor = 'rgb(138, 43, 226)'
        }
    } else {
        byTag('name', 'nome').style.borderColor = 'red'
        byTag('name', 'curso').style.borderColor = 'red'
        byTag('name', 'telefone').style.borderColor = 'red'
        byTag('name', 'matricula').style.borderColor = 'red'
        byTag('name', 'email').style.borderColor = 'red'
        byTag('name', 'password').style.borderColor = 'red'
        alertCustomized('Campos não preenchidos', '30vw')

    }
    console.log(payload)

    API.post('/usuario', payload).then(() => {
        alertCustomized('Usuário cadastrado com sucesso!', '50vw')
        newCad()
    }).catch((err) => {
        console.error(err)
        alertCustomized('Não foi possível cadastrar o usuário', '60vw')
    })
}

function goToAdmin() {
    window.location.href = "../dashboard/index.html";
}

function updateCampo(param) {
    if (param == 'telefone') {
        byTag('name', param).value = byTag('name', 'telefone').value.replace(/\D/g, '')
    }
    byTag('name', param).style.borderColor = 'rgb(138, 43, 226)'
}

function newCad() {
    window.location.href = "../dashboard_admin/index.html";
}

function openMenu() {
    verifyScreen()

    byTag('id', 'nameUser').innerText = dataUser[0].nome
    byTag('id', 'cursoUser').innerText = dataUser[0].curso
    byTag('id', 'matriculaUser').innerText = dataUser[0].matricula
    byTag('id', 'membresiaUser').innerText = dataUser[0].membresia.split('/')[0]


    if (!isOpen) {
        byTag('id', 'container-dataUser').style.transform = `translateX(${widthScreen})`
        byTag('id', 'openMenu').style.transform = `translateX(${widthScreen})`
        byTag('id', 'openMenu').innerText = '🔙'
    } else {
        byTag('id', 'container-dataUser').style.transform = 'translateX(0)'
        byTag('id', 'openMenu').style.transform = 'translateX(0)'
        byTag('id', 'openMenu').innerText = '🔜'
    }

    byTag('id', 'openMenu').style.transition = '0.4s'
    byTag('id', 'container-dataUser').style.transition = '0.4s'
    isOpen = !isOpen
}

function verifyScreen() {
    if (window.screen.width <= 400) {
        widthScreen = '70vw'
    } else {
        widthScreen = '30vw'
    }
}

function alertCustomized(message, size) {
    const alert = byTag('id', 'alert')
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