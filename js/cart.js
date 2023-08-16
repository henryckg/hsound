const carroVacio = document.querySelector("#carro-vacio")
const contenedorCarro = document.querySelector("#contenedor-carro")
const carroProductos = document.querySelector("#carro-productos")
const carroAcciones = document.querySelector("#carro-acciones")
const cotizador = document.querySelector("#contenedor-cotizador")
const vaciarCarro = document.querySelector("#vaciar-carro")
const botonComprar = document.querySelector("#boton-comprar")
const msjComprado = document.querySelector("#carro-comprado")
let totalValidado
let botonEliminarProducto // Variable declarada antes para luego asignarle los botones de 'Eliminar Producto'

let carro = JSON.parse(localStorage.getItem("carrito"))

function cargarCarro(){
    if (carro.length >= 1) {
        carroVacio.classList.add("inactive")
        carroProductos.classList.remove("inactive")
        carroAcciones.classList.remove("inactive")
        cotizador.classList.remove("inactive")

        carroProductos.innerHTML = ""

        carro.forEach(prod => {
            const div = document.createElement("div")
            div.classList.add("carro-producto")
            div.innerHTML = `
            <img src=".${prod.imagen}" class="imagen-producto-carrito" alt="${prod.nombre}">
            <div class="carro-producto-nombre">
                <p>Producto</p>
                <h4>${prod.nombre}</h4>
            </div>
            <div class="carro-producto-cantidad">
                <p>Cantidad</p>
                <h4>${prod.cantidad}</h4>
            </div>
            <div class="carro-producto-precio">
                <p>Precio</p>
                <h4>USD $${prod.precio}</h4>
            </div>
            <div class="carro-producto-subtotal">
                <p>Subtotal</p>
                <h4>USD $${prod.precio * prod.cantidad}</h4>    
            </div>
            <button id="${prod.id}" class="carro-producto-eliminar">
                <i class="bi bi-trash"></i>
            </button>
        `
            carroProductos.appendChild(div)
        })
    } else{
        carroVacio.classList.remove("inactive")
        carroProductos.classList.add("inactive")
        carroAcciones.classList.add("inactive")
        cotizador.classList.add("inactive")
    }
    eliminarProducto()
    validarTotal()
}

cargarCarro()



vaciarCarro.onclick = () =>{
    localStorage.clear()
    carroVacio.classList.remove("inactive")
    carroProductos.classList.add("inactive")
    carroAcciones.classList.add("inactive")
    cotizador.classList.add("inactive")
}


function eliminarProducto(){
    botonEliminarProducto = document.querySelectorAll(".carro-producto-eliminar")

    botonEliminarProducto.forEach(boton => {
        boton.addEventListener("click", eliminarItem)

        function eliminarItem() {
            const productoEliminado = carro.findIndex(prod => prod.id == boton.id);
            carro.splice(productoEliminado, 1);

            localStorage.setItem("carrito", JSON.stringify(carro));
            cargarCarro();

        }
    })

    
}


////// CALCULADORA DE ENVIOS

let resultado = 0
let tarifaEnvio
let valorAsegurado = 0
const milisegundosPorDia = 86400000
const plazoTerrestre = 5 * milisegundosPorDia
const plazoAereo = 3 * milisegundosPorDia

function calcularFechaEnvio(plazo){
    //Función para generar fecha de entrega según el tipo de envío. El parámetro "plazo" será definido por las constantes "plazoTerrestre" y "plazoAereo"
        const hoy = new Date
        const fechaFutura = new Date (hoy.getTime() + plazo)
    
        return fechaFutura.toLocaleDateString()
}

const seguro = (x) => x * 10 / 100;

const botonAsegurar = document.querySelector("#asegurar");
const botonesRadio = document.querySelectorAll('input[name="envio"]');
const valorEnvio = document.querySelector("#valor-envio")
const valorSeguro = document.querySelector("#valor-seguro")
const totalCarrito = document.querySelector("#total")
const fechaEnvio = document.querySelector("#fecha-envio")


const totalPeso = carro.reduce((acumulador, prod) => acumulador + prod.peso, 0);
const totalPesoVol = carro.reduce((acumulador, prod) => acumulador + prod.pesoVol, 0);
const totalPrecios = carro.reduce((acumulador, prod) => acumulador + (prod.precio * prod.cantidad), 0);

botonesRadio.forEach(boton => {
    boton.addEventListener("change", () => {
        if (boton.checked) {
            if (boton.value === "aereo") {
                tarifaEnvio = 8
                fechaEnvio.innerText = `Fecha máxima de entrega: ${calcularFechaEnvio(plazoAereo)}`
            } else if (boton.value === "terrestre") {
                tarifaEnvio = 5
                fechaEnvio.innerText = `Fecha máxima de entrega: ${calcularFechaEnvio(plazoTerrestre)}`
            }

            asegurar()
            
            resultado = calcularResultado(totalPeso, totalPesoVol, tarifaEnvio)
            valorEnvio.innerText = `Valor envío: USD $${resultado.toFixed(2)}`
            actualizarTotal()

        }
    })
})

function asegurar(){
    botonAsegurar.addEventListener("change", () => {
        if (botonAsegurar.checked) {
            valorAsegurado = seguro(totalPrecios)
            valorSeguro.innerText = `Valor seguro: USD $${valorAsegurado.toFixed(2)}`
            actualizarTotal()
        } else {
            valorAsegurado = 0
            valorSeguro.innerText = ""
            actualizarTotal()
        }
    })

}

function calcularResultado(peso, pesoVol, tarifa) {
    if (peso >= pesoVol) {
        return peso * tarifa
    } else {
        return pesoVol * tarifa
    }
}

function actualizarTotal() {
    const total = resultado + valorAsegurado + totalPrecios
    totalCarrito.innerText = `USD $${total.toFixed(2)}`
}

actualizarTotal()


botonComprar.addEventListener("click", comprarCarro)
function comprarCarro(){
    msjComprado.classList.remove("inactive")
    cotizador.classList.add("inactive")
    contenedorCarro.classList.add("inactive")   
    localStorage.clear()
}



function validarTotal(){
    totalValidado = carro.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0)
    console.log(totalValidado)
}