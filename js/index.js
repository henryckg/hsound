////// Array vacio donde se van ingresando los productos

const productos = []

////// Clase para productos

class Producto{
    constructor (id, nombre, precio, categoria, imagen, alto, ancho, largo, peso){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
        this.cantidad = 1
        this.alto = alto;
        this.ancho = ancho;
        this.largo = largo;
        this.peso = peso;
        this.pesoVol = (this.alto * this.ancho * this.largo) / 5000;
    }
}

////// Ingreso de Productos

productos.push(new Producto("audifono-01", "AKG K240", 90, "Audífonos", "./img/akg-k240.jpeg", 32, 22, 12, 1.2))
productos.push(new Producto("audifono-02", "AudioTechnica ATHM50x", 170, "Audífonos", "./img/audiotechnica-athm50x.jpeg", 33, 23, 15, 1.4))
productos.push(new Producto("audifono-03", "Sony WH-1000XM4", 220, "Audífonos", "./img/sony-wh1000xm4.jpeg", 29, 21, 10, 1))
productos.push(new Producto("parlante-01", "Adam T7V", 330, "Parlantes", "./img/adam-t7v.jpeg", 42, 29, 34, 3.2))
productos.push(new Producto("parlante-02", "Genelec 8030C", 550, "Parlantes", "./img/genelec-8030c.jpeg", 37, 26, 30, 2.4))
productos.push(new Producto("parlante-03", "Yamaha HS8", 250, "Parlantes", "./img/yamaha-hs8.jpeg", 35, 22, 29, 1.8))
productos.push(new Producto("microfono-01", "Shure SM7B", 440, "Micrófonos", "./img/shure-sm7b.jpeg", 21, 22, 12, 1.2))
productos.push(new Producto("microfono-02", "AKG C414", 375, "Micrófonos", "./img/akg-c414.jpeg", 19, 12, 8, 1))
productos.push(new Producto("microfono-03", "Sennheiser MD421", 280, "Micrófonos", "./img/sennheiser-md421.jpeg", 17, 16, 9, 1.1))

////// LLAMADOS DEL DOM

const main = document.querySelector("#main")
const contenedorProductos = document.querySelector(".contenedor-productos")
const botonesMenu = document.querySelectorAll(".boton-categoria")
const botonTodosLosProductos = document.querySelector("#todos")
const botonAudifonos = document.querySelector("#audifonos")
const botonParlantes = document.querySelector("#parlantes")
const botonMicrofonos = document.querySelector("#microfonos")
const tituloCategoria = document.createElement("h2")
let botonAgregar // Variable declarada antes para luego asignarle los botones de 'Añadir al Carrito'


/////// FUNCIONES

function cargarTodosProductos(){

    contenedorProductos.innerHTML = ""
    tituloCategoria.innerText = "Todos los productos"

    productos.forEach(prod => {

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
        main.prepend(tituloCategoria)
    });
    
    agregarAlCarrito()
}


function cargarAudifonos(){

    contenedorProductos.innerHTML = ""

    const audifonos = productos.filter((prod) => prod.categoria === "Audífonos")
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

    const parlantes = productos.filter((prod) => prod.categoria === "Parlantes")
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

    const microfonos = productos.filter((prod) => prod.categoria === "Micrófonos")
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

function agregarAlCarrito(){

    botonAgregar = document.querySelectorAll(".boton-agregar")

    botonAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProducto)

        function agregarProducto(){
            const productoAgregado = productos.find(prod => prod.id == boton.id)
            
            if(arrayCarro.some(prod => prod.id == boton.id)){
                productoAgregado.cantidad++
            } else {
                arrayCarro.push(productoAgregado)
            }

            localStorage.setItem("carrito", JSON.stringify(arrayCarro))
        }   
    })
}


cargarTodosProductos()

///// EVENTOS

botonTodosLosProductos.addEventListener("click", cargarTodosProductos)
botonAudifonos.addEventListener("click", cargarAudifonos)
botonParlantes.addEventListener("click", cargarParlantes)
botonMicrofonos.addEventListener("click", cargarMicrofonos)

// Array para luego incluirlo en el LocalStorage
let arrayCarro
const carro = JSON.parse(localStorage.getItem("carrito"))

carro ? arrayCarro = carro : arrayCarro = []






