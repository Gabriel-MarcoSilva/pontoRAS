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

    console.log(dataUser)

    if (dataUser[0].role === 'admin') {
        byTag('id', 'acessoAdmin').style.display = 'block'
    }
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

function openFormMembreship() {
    if (confirm('Você possui membresia?')) {
        byTag('id', 'formMembreship').style.display = 'flex'
        byTag('name', 'mebresia').value = dataUser[0].membresia.split('/')[0]
    }
}

function closeFormMembreship() {
    byTag('id', 'formMembreship').style.display = 'none'
}

function upMembreship(e) {
    const form = byTag('id', 'formMembreship')

    e.preventDefault()
    const data = new FormData(form)

    const dados = new URLSearchParams(data)

    const payload = {
        id: usuarioID,
        membresia: [...dados.values()][0] + '/ON',
    }

    API.post('/upmembresia', payload).then((res) => {
        dataUser[0].membresia = payload.membresia
        byTag('id', 'membresiaUser').innerText = payload.membresia.split('/')[0]
        byTag('id', 'formMembreship').style.display = 'none'
        alertCustomized('Membresia atualizada com sucesso!', '30vw')
    }).catch((err) => {
        console.log(err)
    })
}

function goToAdmin() {
    window.location.href = "../dashboard/index.html";
}


async function addSelect() {
    const select = byTag('id', 'select-admin')

    try {
        const users = await API.get('/usuario').then(res => res.data)
        console.log(users)

        const option = document.createElement("option")
        option.value = '--' // Define o valor da opção
        option.textContent = 'Selecione o usuário' // Define o texto visível
        select.appendChild(option)

        for (let i = 0; i < users.length; i++) {
            // console.log(users[i].role)
            const option = document.createElement("option")
            option.value = users[i].id // Define o valor da opção
            option.textContent = users[i].nome // Define o texto visível
            select.appendChild(option)
        }
    } catch (err) {
        alertCustomized("Erro ao buscar usuários:", "30vw")
    }
}

async function openAdmin() {
    if (byTag('id', 'container-admin').style.display == 'flex') {
        byTag('id', 'menu').style.display = 'flex'
        byTag('id', 'container-admin').style.display = 'none'

    } else {
        byTag('id', 'menu').style.display = 'none'
        byTag('id', 'container-admin').style.display = 'flex'
        await addSelect()
    }
}

function byTag(type, tag) {
    if (type == 'id') {
        return document.getElementById(tag)
    } else if (type == 'name') {
        return document.getElementsByName(tag)[0]
    }
}

function newCad() {
    window.location.href = "../cadastro/index.html";
}

let historicoUser = []
let dataUserSearch = []
let tempoUser = 0

async function buscarUser() {
    const select = byTag('id', 'select-admin').value

    if (select !== '--') {
        dataUserSearch = await API.get(`/usuario?id=${select}`).then((res) => {
            return res.data
        }).catch((err) => {
            console.error(err)
        })

        console.log(dataUserSearch[0])

        tempoUser = await API.get(`/calcular?usuarioId=${dataUserSearch[0].id}`).then((res) => {
            return res.data
        }).catch((err) => {
            console.error(err)
            return 0
        })

        historicoUser = await API.get(`/admin_busca?matricula=${dataUserSearch[0].matricula}`).then((res) => {
            return res.data
        }).catch((err) => {
            console.error(err)
            return []
        })

        preencheTabela()
    }

    loading()
}

function preencheTabela() {
    const container = byTag('id', "container-history");
    const infoUser = byTag('id', 'infoUser')

    infoUser.innerHTML = ''

    container.innerHTML = ""; // Limpa antes de renderizar

    const div2 = document.createElement("div");
    div2.classList.add("infoUser");
    div2.innerHTML = `
        <strong>Nome:</strong> ${dataUserSearch[0].nome} <br/>
        <strong>Matrícula:</strong> ${dataUserSearch[0].matricula} <br/>
        <strong>Tempo na C11:</strong> ${tempoUser ? formatarTempo(tempoUser) : '00:00:00'}`
    infoUser.appendChild(div2);

    if (dataUserSearch[0].role !== 'admin') {
        const button = document.createElement("button")
        button.classList.add('btn')
        button.textContent = 'Atribuir administrador' // Use textContent para definir o texto visível
        button.addEventListener("click", () => {
            API.post(' /admin_role', { id: dataUserSearch[0].id, role: 'admin' }).then(() => {
                alertCustomized('Atribuido com sucesso!! ', '30vw')
            }).catch(() => {
                alertCustomized('Não foi possível atribuir', '30vw')
            })
        });
        infoUser.appendChild(button);
    }

    if (historicoUser) {
        for (let i = 0; i < historicoUser.length; i++) {
            const div = document.createElement("div");
            div.classList.add("history-item");
            div.innerHTML = `
                <strong>Data:</strong>${dateVisual(historicoUser[i].data)} |
                <strong>Tempo:</strong> ${formatarTempo(historicoUser[i].horas)} | 
                <strong>Horário:</strong> ${historicoUser[i].horario}
                <br/><br/> <strong>Descrição:</strong> ${historicoUser[i].descricao}`
            container.appendChild(div);
        }
    }
}

function dateVisual(date) {
    const data = date.split('T')[0]

    const dia = data.split('-')[2]
    const mes = data.split('-')[1]
    const ano = data.split('-')[0]
    return dia + '/' + mes + '/' + ano
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
