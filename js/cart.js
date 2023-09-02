//Llamado de distintos elementos del DOM para ser usados a lo largo del código
const main = document.querySelector("#contenedor-principal")
const header = document.querySelector("#header")
const contenedorGrid = document.querySelector("#contenedor-grid")
const cotizador = document.querySelector("#contenedor-cotizador")
const totalCarrito = document.querySelector("#total")
const montoPesos = document.querySelector("#monto-pesos")

//Se declaran variables de scope global
let botonEliminarProducto
let montoSeguro = 0
let resultado = 0

//Creación de elementos HTML.
const contenedorBtnCarrito = document.createElement("div")
contenedorBtnCarrito.classList.add("contenedor-boton-carrito")
contenedorBtnCarrito.innerHTML = `
    <a href="./pages/cart.html" class="boton-carrito"><i class="bi bi-cart2"></i></a>
`
header.appendChild(contenedorBtnCarrito)

const contenedorCarro = document.createElement("section")
contenedorCarro.classList.add("contenedor-carro")
contenedorGrid.prepend(contenedorCarro)

const carroVacio = document.createElement("p")
carroVacio.classList.add("carro-vacio")
carroVacio.innerText = "El carro de compras está vacío"
contenedorCarro.prepend(carroVacio)

const carroProductos = document.createElement("div")
carroProductos.classList.add("carro-productos")
carroProductos.classList.add("inactive")
contenedorCarro.append(carroProductos)

const carroAcciones = document.createElement("div")
carroAcciones.classList.add("carro-acciones")
carroAcciones.classList.add("inactive")
carroAcciones.innerHTML = `<button id="vaciar-carro" class="vaciar-carro">Vaciar Carrito</button>`
const vaciarCarro = carroAcciones.querySelector("#vaciar-carro")
contenedorCarro.appendChild(carroAcciones)

//Este elemento será incluido en el HTML cuando sea accionado el evento del "formularioCotizador" en la calculadora de envíos.
const checkout = document.createElement("div")
checkout.innerHTML = `
        <form id="formulario-checkout" class="formulario-checkout">
            <span class="text-checkout">Ingrese sus datos de contacto</span>
            <input type="text" placeholder="Nombre completo" class="text-input-checkout" required>
            <input type="email" placeholder="E-mail" class="text-input-checkout" required>
            <input type="text" placeholder="Dirección de envío" class="text-input-checkout" required>
            <span class="text-checkout">Ingrese su tarjeta</span>
            <input type="text" placeholder="Número de tarjeta" class="text-input-checkout" required>
            <input type="text" placeholder="CVC" class="text-input-checkout" required>
            <input type="text" placeholder="MM/YY" class="text-input-checkout" required>
            <input type="submit" class="btn-checkout" id="btn-checkout" value="Finalizar compra">
        </form>
    `
checkout.classList.add("contenedor-checkout")

//Carga de productos desde el Local Storage.
let carro = JSON.parse(localStorage.getItem("carrito"))

function cargarCarro(){
    //Condicional para determinar si se imprimen productos o se muestra mensaje de carro vacío.
    if (carro && carro.length >= 1) {
        carroVacio.classList.add("inactive")
        carroProductos.classList.remove("inactive")
        carroAcciones.classList.remove("inactive")
        cotizador.classList.remove("inactive")

        carroProductos.innerHTML = "" //Primero vaciamos el contenedor para evitar que se dupliquen los elementos cada vez que entramos al carro.

        carro.forEach(prod => { //Imprimimos los productos en el contenedor.
            const card = document.createElement("div")
            card.classList.add("carro-producto")
            card.innerHTML = `
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
                <i class="bi bi-x-square-fill"></i>
            </button>
        `
            carroProductos.appendChild(card)
        })
        eliminarProducto()
        validarTotal()
    } else{
        carroVacio.classList.remove("inactive")
        carroProductos.classList.add("inactive")
        carroAcciones.classList.add("inactive")
        cotizador.classList.add("inactive")
        checkout.classList.add("inactive")
    }
}

cargarCarro()

//Evento del botón "vaciar carro"
vaciarCarro.onclick = () =>{
    Swal.fire({
        title: '¿Estás seguro?',
        text: `${carro.reduce((acc, prod) => acc + prod.cantidad, 0)} productos están por ser eliminados del carrito.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#949494',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'No, cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear()
            carroVacio.classList.remove("inactive")
            carroProductos.classList.add("inactive")
            carroAcciones.classList.add("inactive")
            cotizador.classList.add("inactive")
            checkout.classList.add("inactive")
            Swal.fire(
                'Carrito vacío.',
                'Los productos han sido eliminados',
                'success'
            )
        }
    })
}

function eliminarProducto(){
    botonEliminarProducto = document.querySelectorAll(".carro-producto-eliminar")
    botonEliminarProducto.forEach(boton => {
        //Evento de los botones-ícono "x"
        boton.addEventListener("click", eliminarItem)

        function eliminarItem() {
            //Tomamos el índice del producto seleccionado en el carro para eliminarlo del mismo.
            const productoEliminado = carro.findIndex(prod => prod.id == boton.id); 
            carro.splice(productoEliminado, 1);

            localStorage.setItem("carrito", JSON.stringify(carro)) //Guardamos en el Local Storage las modificaciones.
            cargarCarro()

            //Se resetean valores del seguro en la calculadora de envíos.
            botonAsegurar.checked = false
            valorSeguro.innerText = ""
        }
    })
}

////// Sección "Calculadora de Envíos"

//Llamados de elementos
const formularioCotizador = document.querySelector("#formulario-cotizador")
const botonAsegurar = document.querySelector("#asegurar")
const botonesRadio = document.querySelectorAll('input[name="envio"]')
const detalleEnvio = document.querySelector("#detalle-envio")

//Creación de elementos
const valorEnvio = document.createElement("p")
detalleEnvio.appendChild(valorEnvio)
const valorSeguro = document.createElement("p")
detalleEnvio.appendChild(valorSeguro)
const fechaEnvio = document.createElement("p")
detalleEnvio.appendChild(fechaEnvio)

//Generación de fecha de entrega del envío.
const milisegundosPorDia = 86400000
const plazoTerrestre = 5 * milisegundosPorDia
const plazoAereo = 3 * milisegundosPorDia

function calcularFechaEnvio(plazo){
        const hoy = new Date()
        const fechaFutura = new Date (hoy.getTime() + plazo)
        return fechaFutura.toLocaleDateString()
}

//Evento de botones radio para la elección del tipo de envío.
botonesRadio.forEach(boton => {
    boton.addEventListener("change", () => {
        if (boton.checked) {
            let tarifaEnvio
            if (boton.value === "aereo") {
                tarifaEnvio = 8
                fechaEnvio.innerText = `Fecha máxima de entrega: ${calcularFechaEnvio(plazoAereo)}`
            } else if (boton.value === "terrestre") {
                tarifaEnvio = 5
                fechaEnvio.innerText = `Fecha máxima de entrega: ${calcularFechaEnvio(plazoTerrestre)}`
            }

            //Llamamos productos del Local Storage por si existen modificaciones después de elegir la tarifa de envío.
            carro = JSON.parse(localStorage.getItem("carrito"))
            
            //Suma de propiedades del total de los productos en el carro de compra.
            const totalPeso = carro.reduce((acumulador, prod) => acumulador + prod.peso, 0)
            const totalPesoVol = carro.reduce((acumulador, prod) => acumulador + prod.pesoVol, 0)

            resultado = calcularResultado(totalPeso, totalPesoVol, tarifaEnvio)
            valorEnvio.innerText = `Valor envío: USD $${resultado.toFixed(2)}`
            validarTotal()
            asegurar() //Llamamos a la función para que el seguro se genere sólo si se elige tarifa de envío.
        }
    })
})

//Determina el tipo de peso a multiplicar por la tarifa
function calcularResultado(peso, pesoVol, tarifa) { 
    if (peso >= pesoVol) {
        return peso * tarifa
    } else {
        return pesoVol * tarifa
    }
}

const seguro = (x) => x * 10 / 100;

//Imprime el valor del seguro.
function asegurar(){
    botonAsegurar.addEventListener("change", () => {
        if (botonAsegurar.checked) {
            carro = JSON.parse(localStorage.getItem("carrito"))
            const totalPrecios = carro.reduce((acumulador, prod) => acumulador + (prod.precio * prod.cantidad), 0);
            montoSeguro = seguro(totalPrecios)
            valorSeguro.innerText = `Valor seguro: USD $${montoSeguro.toFixed(2)}`
            validarTotal()
        } else {
            montoSeguro = 0
            valorSeguro.innerText = ""
            validarTotal()
        }
    })
}

//Evento del formulario de la calculadora de envíos.
formularioCotizador.addEventListener("submit", (e) =>{
    e.preventDefault()
    
    main.appendChild(checkout) //Se incluye elemento creado previamente al inicio del código.

    //Creación y evento del formulario checkout
    const formularioCheckout = document.querySelector("#formulario-checkout")
    formularioCheckout.addEventListener("submit", hacerCheckout)

    function hacerCheckout(e){
        e.preventDefault()
        Swal.fire(
            '¡Compra exitosa!',
            'Muchas gracias por tu compra. Te esperamos pronto',
            'success'
        )
        carroVacio.classList.remove("inactive")
        checkout.classList.add("inactive")
        cotizador.classList.add("inactive")
        carroProductos.classList.add("inactive")
        carroAcciones.classList.add("inactive")   
        main.classList.remove("efecto-checkout")
        localStorage.clear()
    }
})

function validarTotal (){ //Suma el precio de todos los productos en el carro más el envío y monto del seguro.
    let totalValidado = carro.reduce((acc, prod) => acc + (prod.cantidad * prod.precio), 0)
    let valorTotal = totalValidado + montoSeguro + resultado
    let totalDolares = valorTotal.toFixed(2)
    totalCarrito.innerText = `Total: USD $${totalDolares}`

    fetch("https://api.bluelytics.com.ar/v2/latest") //API para imprimir el total en pesos argentinos.
    .then((res) => res.json())
    .then((data) => {
        datoDolar = data.oficial;
        valorDolar = datoDolar.value_avg;
        let cambioEnPesos = totalDolares * valorDolar
        let totalPesos = cambioEnPesos.toFixed(2)
        montoPesos.innerText = `(Valor en ARS: $${totalPesos})`
    })
}
