export function openMenu(isOpen) {
    let widthScreen = verifyScreen()
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
    return !isOpen
}

function verifyScreen() {
    let widthScreen = ''

    if (window.screen.width <= 400) {
        widthScreen = '70vw'
    } else {
        widthScreen = '30vw'
    }

    return widthScreen
}