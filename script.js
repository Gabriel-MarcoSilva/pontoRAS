
// form.addEventListener('submit', )

function login(e) {
    const form = document.getElementById('formLogin')
    // se login então document.getelement = display none

    e.preventDefault()
    const data = new FormData(form)

    const payload = new URLSearchParams(data)

    console.log([...payload])

    document.getElementById('dashboard').style.display = 'flex'
    document.getElementById('login').style.display = 'none'

    // fetch("", {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: data
    // }) 
    // .then((res) => res.JSON()).then((data) => form.style.display = 'none')
}


function registroData(e, props) {

    e.preventDefault()
    let data = ''
    let payload = null
    
    const form = document.getElementById('formData')
    
    if (props === 'auto') {
        data = new Date()
        
        payload = new URLSearchParams({
            dia: data.getDate() + '-' + 0 + Number(data.getMonth() + 1) + '-' + data.getFullYear(),
            hora: data.getHours() + ':' + data.getMinutes()
        })
    } else {
        data = new FormData(form)
        payload = new URLSearchParams(data)
    }

    
    let info = false;
    
    [...payload.values()].map((item) => {
        if (item == ''){
            info = true
        }
    })
    
    if (info){
        alert('Dados incompletos')
    } else {
        document.getElementById('regAuto').style.display = 'flex'
        document.getElementById('formDasDatas').style.display = 'none'
    }
    
    //enviar payload
    console.log([...payload.values()])
    
}

function revelarForm (){
    document.getElementById('formDasDatas').style.display = 'flex'
    document.getElementById('regAuto').style.display = 'none'
}