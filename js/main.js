//Llamado de distintos componentes del DOM para ser usados a lo largo del código
const header = document.querySelector("#header")
const main = document.querySelector("#main")
const contenedorProductos = document.querySelector(".contenedor-productos")
const botonTodosLosProductos = document.querySelector("#todos")
const botonAudifonos = document.querySelector("#audifonos")
const botonParlantes = document.querySelector("#parlantes")
const botonMicrofonos = document.querySelector("#microfonos")
const tituloCategoria = document.createElement("h2")
let notificacionToast = document.querySelector("#notificacion-toast")

//Creación del botón e ícono "carrito de compras"
const contenedorNroCarrito = document.createElement("div")
contenedorNroCarrito.classList.add("contenedor-boton-carrito")
contenedorNroCarrito.innerHTML = `
    <a href="./pages/cart.html" class="boton-carrito"><i class="bi bi-cart2"></i></a>
`
header.appendChild(contenedorNroCarrito)
const numeroCarrito = document.createElement("span")
contenedorNroCarrito.appendChild(numeroCarrito)

//Carga de productos por Fetch
let stockProductos = []
const cargarBaseDeDatos = async () => {
    const respuesta = await fetch('./base-de-datos.json')
    const datos = await respuesta.json()
    stockProductos = datos //Asignación de datos a variable global para manipulación fuera de la promesa
    cargarTodosProductos()
}
cargarBaseDeDatos()

//Eventos para imprimir productos según las categorías.
botonTodosLosProductos.addEventListener("click", cargarTodosProductos)
function cargarTodosProductos(){
    contenedorProductos.innerHTML = "" //Primero se vacia el contenedor para después imprimir productos según lo solicitado.
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
    agregarAlCarrito() //Función llamada para que pueda ser utilizada cada vez que se carguen los productos.
}

botonAudifonos.addEventListener("click", cargarAudifonos)
function cargarAudifonos(){
    contenedorProductos.innerHTML = ""
    tituloCategoria.innerText = "Audífonos"
    main.prepend(tituloCategoria)
    //Filtrado de productos según la categoría.
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

//Generación del carro de compras vacío o desde el Local Storage.
let carro = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
generarNumero()

function agregarAlCarrito(){
    let botonAgregar = document.querySelectorAll(".boton-agregar")

    botonAgregar.forEach(boton => {
        //Evento de botones de cada producto para agregar al carro 
        boton.addEventListener("click", agregarProducto)
        function agregarProducto(){
            const productoAgregado = stockProductos.find(prod => prod.id == boton.id) //Tomamos el producto que coincida su id con el de la base de datos.
            
            //Condicional para determinar si el producto es 'pusheado' al carro de compras o si se sube la cantidad solamente.
            if(carro.find(prod => prod.id === boton.id)){
                const productoEnCarro = carro.find(prod => prod.id == boton.id)
                productoEnCarro.cantidad++
                productoEnCarro.pesoVol = ((productoEnCarro.alto * productoEnCarro.ancho * productoEnCarro.largo) / 5000) * productoEnCarro.cantidad //Cálculo para generar el peso volumétrico del producto
            } else {
                carro.push(productoAgregado)
                productoAgregado.pesoVol = (productoAgregado.alto * productoAgregado.ancho * productoAgregado.largo) / 5000
            }
            
            //Actualizamos el carrito del Local Storage.
            localStorage.setItem("carrito", JSON.stringify(carro))

            //Notifica el producto que fue agregado al carro.
            function notificarToast(){
                let toast = document.createElement("div")
                toast.classList.add("toast")
                toast.innerHTML = `${productoAgregado.nombre} fue agregado al carro <i id="close" class="bi bi-x-lg"></i>
                `

                notificacionToast.appendChild(toast)

                setTimeout(() => { //Asincronía para que desaparezca la notificación
                    toast.classList.add("desaparecer-toast")
                    setTimeout(() => {
                        toast.remove()
                    }, 500)
                }, 3000)

                let cerrarToast = toast.querySelector("#close")
                //Evento para cerrar notificación de forma manual.
                cerrarToast.addEventListener("click", () => {toast.classList.add("desaparecer-toast")})
            }

            notificarToast()
            generarNumero()
        }   
    })
}

//Genera el número que indica visualmente la cantidad total de productos en el carro.
function generarNumero() {
    let cantidadProductos = carro.reduce((acc, prod) => acc + prod.cantidad, 0)
    numeroCarrito.innerText = cantidadProductos
}
