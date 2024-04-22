const form = document.getElementById('formLogin')

// form.addEventListener('submit', )

function login(e) {
    // se login então document.getelement = display none

    e.preventDefault()
    const data = new FormData(form)

    const payload = new URLSearchParams(data)

    console.log([...payload])
    
    // fetch("", {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: data
    // }) 
    // .then((res) => res.JSON()).then((data) => form.style.display = 'none')
}