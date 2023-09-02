const body = document.body
const fecha = new Date()
const footer = document.createElement("footer")
body.appendChild(footer)

footer.innerHTML = `
    <span>H-Sound - ${fecha.getFullYear()} Todos los derechos reservados</span>
`
footer.style.backgroundColor = '#3d3d3d'
footer.style.height = '3rem'
footer.style.color = 'white'
footer.style.display = 'flex'
footer.style.justifyContent = 'center'
footer.style.alignItems = 'center'
