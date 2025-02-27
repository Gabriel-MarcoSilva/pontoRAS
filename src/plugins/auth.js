export async function decodeToken() {
    const token = localStorage.getItem('token')

    try {
        const base64Url = token.split('.')[1]; // Pega a parte do payload (segundo bloco)
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Ajusta caracteres especiais
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );

        localStorage.setItem('dataUser', jsonPayload)

        return await JSON.parse(jsonPayload); // Retorna o objeto JSON decodificado
    } catch (e) {
        return null;
    }
}