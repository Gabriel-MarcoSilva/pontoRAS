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
    return await API.post('/usuario', payload).then(() => {
        return true
    }).catch(() => {
        return false
    })
}

export async function getAllUsers() {
    return await API.get(`/usuario`).then(res => {
        return res.data
    }).catch((err) => {
        return { status: false, error: err }
    })
}

export async function getHoras(idUser, dataInicio, dataFim) {
    return await API.get(`/calcular?usuarioId=${idUser}&dataInnicio=${dataInicio}&dataFim=${dataFim}`).then((res) => {
        return res.data
    }).catch(() => {
        return 0
    })
}

export async function buscaAdmin(matricula) {
    return await API.get(`/admin_busca?matricula=${matricula}`).then((res) => {
        return res.data
    }).catch(() => {
        return []
    })
}

export async function attAdmin(id) {
    return await API.post('/admin_role', { id: id, role: 'admin' }).then((res) => {
        res.data.status = true
        return res.data
    }).catch((err) => {
        return { status: false, error: err }
    })
}

export async function removeUser(id) {
    return await API.delete(`/admin_delete/${id}`).then(() => {
        return { status: true }
    }).catch(() => {
        return { status: false }
    })
}

export async function getUsersInPeriody(dataInicio, dataFim) {
    return await API.get(`/horario?dataInicio=${dataInicio}&dataFim=${dataFim}`).then((res) => {
        res.data.status = true
        return res.data
    }).catch((err) => {
        return { status: false, error: err }
    })
}