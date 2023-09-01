const body = document.body
const header = document.querySelector("#header")
const main = document.querySelector("#main")
const contenedorProductos = document.querySelector(".contenedor-productos")
const botonTodosLosProductos = document.querySelector("#todos")
const botonAudifonos = document.querySelector("#audifonos")
const botonParlantes = document.querySelector("#parlantes")
const botonMicrofonos = document.querySelector("#microfonos")
const tituloCategoria = document.createElement("h2")
let botonAgregar

const contenedorNroCarrito = document.createElement("div")
contenedorNroCarrito.classList.add("contenedor-boton-carrito")
contenedorNroCarrito.innerHTML = `
    <a href="./pages/cart.html" class="boton-carrito"><i class="bi bi-cart2"></i></a>
`
header.appendChild(contenedorNroCarrito)
const numeroCarrito = document.createElement("span")
contenedorNroCarrito.appendChild(numeroCarrito)

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


let stockProductos = []

const cargaBaseDeDatos = async () => {
    const respuesta = await fetch('./base-de-datos.json')
    const datos = await respuesta.json()
    stockProductos = datos
    cargarTodosProductos()
}

cargaBaseDeDatos()


botonTodosLosProductos.addEventListener("click", cargarTodosProductos)

function cargarTodosProductos(){
    contenedorProductos.innerHTML = ""
    tituloCategoria.innerText = "Todos los productos"
    main.prepend(tituloCategoria)

    stockProductos.forEach(prod => {
        const prodCard = document.createElement("div")
        prodCard.classList.add("producto")
        prodCard.innerHTML = `
            <img src="${prod.imagen}" class="imagen-producto" alt="${prod.nombre}">
            <div class="detalles-producto">
                <h3 class="nombre-producto">${prod.nombre}</h3>
                <p class="precio">USD $${prod.precio}</p>
                <button id="${prod.id}" class="boton-agregar">Añadir al carrito</button>
            </div>
        `
        contenedorProductos.appendChild(prodCard)    
    });
    agregarAlCarrito()
}

botonAudifonos.addEventListener("click", cargarAudifonos)

function cargarAudifonos(){
    contenedorProductos.innerHTML = ""
    tituloCategoria.innerText = "Audífonos"
    main.prepend(tituloCategoria)
    const audifonos = stockProductos.filter((prod) => prod.categoria === "Audífonos")

    audifonos.forEach(prod => {    
        const prodCard = document.createElement("div")
        prodCard.classList.add("producto")
        prodCard.innerHTML = `
            <img src="${prod.imagen}" class="imagen-producto" alt="${prod.nombre}">
            <div class="detalles-producto">
                <h3 class="nombre-producto">${prod.nombre}</h3>
                <p class="precio">USD $${prod.precio}</p>
                <button id="${prod.id}" class="boton-agregar">Añadir al carrito</button>
            </div>
        `
        contenedorProductos.appendChild(prodCard)
    })
    agregarAlCarrito()
}

botonParlantes.addEventListener("click", cargarParlantes)

function cargarParlantes(){
    contenedorProductos.innerHTML = ""
    tituloCategoria.innerText = "Parlantes"
    main.prepend(tituloCategoria)
    const parlantes = stockProductos.filter((prod) => prod.categoria === "Parlantes")

    parlantes.forEach(prod => {
        const prodCard = document.createElement("div")
        prodCard.classList.add("producto")
        prodCard.innerHTML = `
            <img src="${prod.imagen}" class="imagen-producto" alt="${prod.nombre}">
            <div class="detalles-producto">
                <h3 class="nombre-producto">${prod.nombre}</h3>
                <p class="precio">USD $${prod.precio}</p>
                <button id="${prod.id}" class="boton-agregar">Añadir al carrito</button>
            </div>
        `
        contenedorProductos.appendChild(prodCard)
    })
    agregarAlCarrito()
}

botonMicrofonos.addEventListener("click", cargarMicrofonos)

function cargarMicrofonos(){
    contenedorProductos.innerHTML = ""
    tituloCategoria.innerText = "Micrófonos"
    main.prepend(tituloCategoria)
    const microfonos = stockProductos.filter((prod) => prod.categoria === "Micrófonos")

    microfonos.forEach(prod => {
        const prodCard = document.createElement("div")
        prodCard.classList.add("producto")
        prodCard.innerHTML = `
            <img src="${prod.imagen}" class="imagen-producto" alt="${prod.nombre}">
            <div class="detalles-producto">
                <h3 class="nombre-producto">${prod.nombre}</h3>
                <p class="precio">USD $${prod.precio}</p>
                <button id="${prod.id}" class="boton-agregar">Añadir al carrito</button>
            </div>
        `
        contenedorProductos.appendChild(prodCard)
    })
    agregarAlCarrito()
}

cargarTodosProductos()


let carro = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
generarNumero()

function agregarAlCarrito(){
    let botonAgregar = document.querySelectorAll(".boton-agregar")

    botonAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProducto)

        function agregarProducto(){
            const productoAgregado = stockProductos.find(prod => prod.id == boton.id)
            
            if(carro.find(prod => prod.id === boton.id)){
                const productoEnCarro = carro.find(prod => prod.id == boton.id)
                productoEnCarro.cantidad++
                productoEnCarro.pesoVol = ((productoEnCarro.alto * productoEnCarro.ancho * productoEnCarro.largo) / 5000) * productoEnCarro.cantidad
            } else {
                carro.push(productoAgregado)
                productoAgregado.pesoVol = (productoAgregado.alto * productoAgregado.ancho * productoAgregado.largo) / 5000
            }
            
            localStorage.setItem("carrito", JSON.stringify(carro))

            Toastify({
                text: `${productoAgregado.nombre} fue agregado al carro`,
                duration: 3000,
                destination: "./pages/cart.html",
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                background: "linear-gradient(to right, #3d3d3d, #939393)",
                },
                onClick: function(){}
            }).showToast();

            generarNumero()
        }   
    })
}

function generarNumero() {
    let cantidadProductos = carro.reduce((acc, prod) => acc + prod.cantidad, 0)
    numeroCarrito.innerText = cantidadProductos
}
