import API from "./plugins/axios"

export async function onAPI() {
    return await API.get('/').then(() => {
        return console.log('api on')
    }).catch(() => {
        return console.log('api off')
    })
}

export async function setLogin(payload) {
    return await API.post('/login', payload).then((res) => {
        res.data.status = true
        return res.data
    }).catch((err) => {
        return { status: false, error: err }
    })
}

export async function setHorario(payload) {
    return await API.post('/horario', payload).then((res) => {
        res.data.status = true
        return res.data
    }).catch((err) => {
        return { status: false, error: err }
    })
}

export async function getDataUserLogged(idUser) {
    return await API.get(`/usuario?id=${idUser}`).then((res) => {
        res.data.status = true
        return res.data
    }).catch((err) => {
        return { status: false, error: err }
    })
}

export async function buscaTimeUser(idUser) {
    return await API.get(`/buscainfo?usuarioId=${idUser}`).then(res => {
        res.status = true
        return res
    }).catch((err) => {
        return { status: false, error: err }
    })
}

export async function upMembresia(payload) {
    return await API.post('/upmembresia', payload).then((res) => {
        res.data.status = true
        return res.data
    }).catch((err) => {
        return { status: false, error: err }
    })
}

export async function cadUser(payload) {
    return await API.post('/usuario', payload).then((res) => {
        res.status = true
        return res.status
    }).catch((err) => {
        return { status: false, error: err }
    })
}