<template>
    <section class="container" id="login">
        <div>
            <a onclick="newCad()" class="setas">sig in</a>
        </div>
        <form id="formLogin" onsubmit="login(event)">
            <div>
                <img src="../assets/roboRAS.min.png" alt="roboRAS">
            </div>
            <div class="oneLabel">
                <label style="display: flex; flex-direction: column; color: #fff;">
                    <p style="text-align: start; width: 70%; font-size: 10pt;">Matrícula: <span
                            style="font-size: 8pt;">(somente números)</span></p>
                    <input name="matricula" type="text" placeholder="Matrícula" maxlength="10">
                </label>
            </div>
            <div class="oneLabel">
                <label style="display: flex; flex-direction: column; color: #fff;">
                    <p style="text-align: start; width: 70%; font-size: 10pt;">Senha:</p>
                    <input name="senha" type="password" placeholder="Senha">
                </label>
            </div>
            <button type="submit">entrar</button>
        </form>
    </section>
    <section id="alert" style="display: none;"></section>
    <section class="container" id="error" style="display: none;"></section>
</template>

<script>

import API from '@/plugins/axios';

export default{
    name: 'ComponentLogin',
    data () {
        return {
        }
    },
    mouted () {
        this.loading()
    },
    methods: {

    loading() {
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
        },

        login(e) {
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
                this.alertCustomized('Matrícula e/ou senha incorretas', '20vw')
            })
        },

        alertCustomized(message, size) {
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
        },

        closeAlert() {
            document.getElementById('alert').style.display = 'none'
        },

        newCad() {
            window.location.href = './cadastro/index.html'
        }
    }
}
</script>

<style >

</style>