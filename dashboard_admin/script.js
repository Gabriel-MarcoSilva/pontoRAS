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
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Corrigido "Bearer"
    }
    return config;
})

async function loading() {

    const dadosUser = JSON.parse(sessionStorage.getItem('dataUser'))
    usuarioID = dadosUser.uid

    dataUser = await API.get(`/usuario?id=${usuarioID}`).then(async (res) => {
        return await res.data
    }).catch((err) => {
        console.error(err)
    })

    console.log(dataUser)

    if (dataUser[0].role === 'admin') {
        document.getElementById('acessoAdmin').style.display = 'block'
    }
}

function openMenu() {
    verifyScreen()

    document.getElementById('nameUser').innerText = dataUser[0].nome
    document.getElementById('cursoUser').innerText = dataUser[0].curso
    document.getElementById('matriculaUser').innerText = dataUser[0].matricula
    document.getElementById('membresiaUser').innerText = dataUser[0].membresia.split('/')[0]


    if (!isOpen) {
        document.getElementById('container-dataUser').style.transform = `translateX(${widthScreen})`
        document.getElementById('openMenu').style.transform = `translateX(${widthScreen})`
        document.getElementById('openMenu').innerText = '🔙'
    } else {
        document.getElementById('container-dataUser').style.transform = 'translateX(0)'
        document.getElementById('openMenu').style.transform = 'translateX(0)'
        document.getElementById('openMenu').innerText = '🔜'
    }

    document.getElementById('openMenu').style.transition = '0.4s'
    document.getElementById('container-dataUser').style.transition = '0.4s'
    isOpen = !isOpen
}

function verifyScreen() {
    if (window.screen.width <= 400) {
        widthScreen = '70vw'
    } else {
        widthScreen = '30vw'
    }
}

function openFormMembreship() {
    if (confirm('Você possui membresia?')) {
        document.getElementById('formMembreship').style.display = 'flex'
        document.getElementsByName('mebresia')[0].value = dataUser[0].membresia.split('/')[0]
    }
}

function closeFormMembreship() {
    document.getElementById('formMembreship').style.display = 'none'
}

function upMembreship(e) {
    const form = document.getElementById('formMembreship')

    e.preventDefault()
    const data = new FormData(form)

    const dados = new URLSearchParams(data)

    const payload = {
        id: usuarioID,
        membresia: [...dados.values()][0] + '/ON',
    }

    API.post('/upmembresia', payload).then((res) => {
        dataUser[0].membresia = payload.membresia
        document.getElementById('membresiaUser').innerText = payload.membresia.split('/')[0]
        document.getElementById('formMembreship').style.display = 'none'
        alertCustomized('Membresia atualizada com sucesso!', '30vw')
    }).catch((err) => {
        console.log(err)
    })
}

function goToAdmin() {
    window.location.href = "../dashboard/index.html";
}