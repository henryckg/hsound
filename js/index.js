////// Array vacio donde se van ingresando los productos

let stockProductos = []

const cargaBaseDeDatos = async () => {
    const respuesta = await fetch('./base-de-datos.json')
    const datos = await respuesta.json()
    stockProductos = datos
    cargarTodosProductos()
}

cargaBaseDeDatos()


////// LLAMADOS DEL DOM

const body = document.body
const main = document.querySelector("#main")
const contenedorProductos = document.querySelector(".contenedor-productos")
const botonesMenu = document.querySelectorAll(".boton-categoria")
const botonTodosLosProductos = document.querySelector("#todos")
const botonAudifonos = document.querySelector("#audifonos")
const botonParlantes = document.querySelector("#parlantes")
const botonMicrofonos = document.querySelector("#microfonos")
const tituloCategoria = document.createElement("h2")
const numeroCarrito = document.querySelector('#numero-carro')
let botonAgregar // Variable declarada antes para luego asignarle los botones de 'Añadir al Carrito'


// Footer

const fecha = new Date()
const footer = document.createElement("footer")

footer.innerHTML = `
    <span>H-Sound - ${fecha.getFullYear()} Todos los derechos reservados</span>
`

footer.style.backgroundColor = '#3d3d3d'
footer.style.height = '3rem'
footer.style.color = 'white'
footer.style.display = 'flex'
footer.style.justifyContent = 'center'
footer.style.alignItems = 'center'

body.appendChild(footer)



/////// FUNCIONES

function cargarTodosProductos(){

    contenedorProductos.innerHTML = ""
    tituloCategoria.innerText = "Todos los productos"
    main.prepend(tituloCategoria)

    stockProductos.forEach(prod => {

        const div = document.createElement("div")
        div.classList.add("producto")
        div.innerHTML = `
            <img src="${prod.imagen}" class="imagen-producto" alt="${prod.nombre}">
            <div>
                <h3 class="nombre-producto">${prod.nombre}</h3>
                <p class="precio">USD $${prod.precio}</p>
                <button id="${prod.id}" class="boton-agregar">Añadir al carrito</button>
            </div>
        `
        contenedorProductos.appendChild(div)    
    });
    
    agregarAlCarrito()
}


function cargarAudifonos(){

    contenedorProductos.innerHTML = ""

    const audifonos = stockProductos.filter((prod) => prod.categoria === "Audífonos")
    audifonos.forEach(prod => {
    
        const div = document.createElement("div")
        div.classList.add("producto")
        div.innerHTML = `
            <img src="${prod.imagen}" class="imagen-producto" alt="${prod.nombre}">
            <div>
                <h3 class="nombre-producto">${prod.nombre}</h3>
                <p class="precio">USD $${prod.precio}</p>
                <button id="${prod.id}" class="boton-agregar">Añadir al carrito</button>
            </div>
        `
        contenedorProductos.appendChild(div)
    
    })
    
    tituloCategoria.innerText = "Audífonos"
    main.prepend(tituloCategoria)
    
    agregarAlCarrito()
}

function cargarParlantes(){

    contenedorProductos.innerHTML = ""

    const parlantes = stockProductos.filter((prod) => prod.categoria === "Parlantes")
    parlantes.forEach(prod => {
    
        const div = document.createElement("div")
        div.classList.add("producto")
        div.innerHTML = `
            <img src="${prod.imagen}" class="imagen-producto" alt="${prod.nombre}">
            <div>
                <h3 class="nombre-producto">${prod.nombre}</h3>
                <p class="precio">USD $${prod.precio}</p>
                <button id="${prod.id}" class="boton-agregar">Añadir al carrito</button>
            </div>
        `
        contenedorProductos.appendChild(div)
    })

    tituloCategoria.innerText = "Parlantes"
    main.prepend(tituloCategoria)
    
    agregarAlCarrito()
}

function cargarMicrofonos(){

    contenedorProductos.innerHTML = ""

    const microfonos = stockProductos.filter((prod) => prod.categoria === "Micrófonos")
    microfonos.forEach(prod => {
    
        const div = document.createElement("div")
        div.classList.add("producto")
        div.innerHTML = `
            <img src="${prod.imagen}" class="imagen-producto" alt="${prod.nombre}">
            <div>
                <h3 class="nombre-producto">${prod.nombre}</h3>
                <p class="precio">USD $${prod.precio}</p>
                <button id="${prod.id}" class="boton-agregar">Añadir al carrito</button>
            </div>
        `
        contenedorProductos.appendChild(div)
    })

    tituloCategoria.innerText = "Micrófonos"
    main.prepend(tituloCategoria)

    agregarAlCarrito()
}


cargarTodosProductos()

///// EVENTOS

botonTodosLosProductos.addEventListener("click", cargarTodosProductos)
botonAudifonos.addEventListener("click", cargarAudifonos)
botonParlantes.addEventListener("click", cargarParlantes)
botonMicrofonos.addEventListener("click", cargarMicrofonos)

// Array para luego incluirlo en el LocalStorage

let carro = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []

generarNumero()

function agregarAlCarrito(){

    let botonAgregar = document.querySelectorAll(".boton-agregar")

    botonAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProducto)

        function agregarProducto(){

            const productoAgregado = stockProductos.find(prod => prod.id == boton.id)
            
            if(carro.some(prod => prod.id === boton.id)){
                const index = carro.findIndex(prod => prod.id == boton.id)
                carro[index].cantidad++
                carro[index].pesoVol = ((carro[index].alto * carro[index].ancho * carro[index].largo) / 5000) * carro[index].cantidad
                console.log(carro)
            } else {
                carro.push(productoAgregado)
                productoAgregado.pesoVol = (productoAgregado.alto * productoAgregado.ancho * productoAgregado.largo) / 5000
            }

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
                onClick: function(){} // Callback after click
            }).showToast();

            localStorage.setItem("carrito", JSON.stringify(carro))
            generarNumero()
        }   
    })
}

function generarNumero() {
    let cantidadProductos = carro.reduce((acc, prod) => acc + prod.cantidad, 0)
    numeroCarrito.innerText = cantidadProductos
}
