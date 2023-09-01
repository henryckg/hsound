const main = document.querySelector("#contenedor-principal")
const carroVacio = document.querySelector("#carro-vacio")
const contenedorCarro = document.querySelector("#contenedor-carro")
const carroProductos = document.querySelector("#carro-productos")
const carroAcciones = document.querySelector("#carro-acciones")
const cotizador = document.querySelector("#contenedor-cotizador")
const vaciarCarro = document.querySelector("#vaciar-carro")
const botonComprar = document.querySelector("#boton-comprar")
const totalCarrito = document.querySelector("#total")


let valorAsegurado = 0
let resultado = 0
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
                <i class="bi bi-x-square-fill"></i>
            </button>
        `
            carroProductos.appendChild(div)
        })

        eliminarProducto()
        validarTotal()
    } else{
        carroVacio.classList.remove("inactive")
        carroProductos.classList.add("inactive")
        carroAcciones.classList.add("inactive")
        cotizador.classList.add("inactive")
    }
    
}

cargarCarro()


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


let tarifaEnvio

const milisegundosPorDia = 86400000
const plazoTerrestre = 5 * milisegundosPorDia
const plazoAereo = 3 * milisegundosPorDia


function calcularFechaEnvio(plazo){
    //Función para generar fecha de entrega según el tipo de envío. El parámetro "plazo" será definido por las constantes "plazoTerrestre" y "plazoAereo"
        const hoy = new Date()
        const fechaFutura = new Date (hoy.getTime() + plazo)
    
        return fechaFutura.toLocaleDateString()
}

const botonAsegurar = document.querySelector("#asegurar");
const botonesRadio = document.querySelectorAll('input[name="envio"]');
const valorEnvio = document.querySelector("#valor-envio")
const valorSeguro = document.querySelector("#valor-seguro")

const fechaEnvio = document.querySelector("#fecha-envio")

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

            carro = JSON.parse(localStorage.getItem("carrito"))
            
            const totalPeso = carro.reduce((acumulador, prod) => acumulador + prod.peso, 0)
            const totalPesoVol = carro.reduce((acumulador, prod) => acumulador + prod.pesoVol, 0)

            resultado = calcularResultado(totalPeso, totalPesoVol, tarifaEnvio)
            valorEnvio.innerText = `Valor envío: USD $${resultado.toFixed(2)}`
            validarTotal()

        }
    })
})

const seguro = (x) => x * 10 / 100;

function asegurar(){
    botonAsegurar.addEventListener("change", () => {
        if (botonAsegurar.checked) {
            carro = JSON.parse(localStorage.getItem("carrito"))
            const totalPrecios = carro.reduce((acumulador, prod) => acumulador + (prod.precio * prod.cantidad), 0);
            valorAsegurado = seguro(totalPrecios)
            valorSeguro.innerText = `Valor seguro: USD $${valorAsegurado.toFixed(2)}`
            validarTotal()
            
        } else {
            valorAsegurado = 0
            valorSeguro.innerText = ""
            validarTotal()
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

const formularioCotizador = document.querySelector("#formulario-cotizador")

formularioCotizador.addEventListener("submit", (e) =>{
    
    e.preventDefault()

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
    main.appendChild(checkout)
    main.classList.add("efecto-checkout")

    
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


function validarTotal (){
    let totalValidado = carro.reduce((acc, prod) => acc + (prod.cantidad * prod.precio), 0)
    let valorTotal = totalValidado + valorAsegurado + resultado
    totalCarrito.innerText = `USD $${valorTotal.toFixed(2)}`
    }




// fetch("https://api.bluelytics.com.ar/v2/latest")
//     .then((res) => res.json())
//     .then((data) => {
//         validarTotal()
//         valorDolar = data.oficial;
//         const contenedorTotal = document.querySelector("#contenedor-total")
//         const contenedorTotalPesos = document.createElement("div")
//         contenedorTotal.appendChild(contenedorTotalPesos)
//         contenedorTotalPesos.innerHTML = `
//             <p>Total en pesos:</p>
//             <p class="total"> ARS $${valorDolar.value_avg * totalPrecios} </p>  
//         `
//     })



















// const main = document.querySelector("#contenedor-principal")
// const carroVacio = document.querySelector("#carro-vacio")
// const contenedorCarro = document.querySelector("#contenedor-carro")
// const carroProductos = document.querySelector("#carro-productos")
// const carroAcciones = document.querySelector("#carro-acciones")
// const cotizador = document.querySelector("#contenedor-cotizador")
// const vaciarCarro = document.querySelector("#vaciar-carro")
// const botonComprar = document.querySelector("#boton-comprar")
// const totalCarrito = document.querySelector("#total")


// let valorAsegurado = 0
// let resultado = 0
// let botonEliminarProducto // Variable declarada antes para luego asignarle los botones de 'Eliminar Producto'

// let carro = JSON.parse(localStorage.getItem("carrito"))

// function cargarCarro(){
//     if (carro.length >= 1) {
//         carroVacio.classList.add("inactive")
//         carroProductos.classList.remove("inactive")
//         carroAcciones.classList.remove("inactive")
//         cotizador.classList.remove("inactive")

//         carroProductos.innerHTML = ""

//         carro.forEach(prod => {
//             const div = document.createElement("div")
//             div.classList.add("carro-producto")
//             div.innerHTML = `
//             <img src=".${prod.imagen}" class="imagen-producto-carrito" alt="${prod.nombre}">
//             <div class="carro-producto-nombre">
//                 <p>Producto</p>
//                 <h4>${prod.nombre}</h4>
//             </div>
//             <div class="carro-producto-cantidad">
//                 <p>Cantidad</p>
//                 <h4>${prod.cantidad}</h4>
//             </div>
//             <div class="carro-producto-precio">
//                 <p>Precio</p>
//                 <h4>USD $${prod.precio}</h4>
//             </div>
//             <div class="carro-producto-subtotal">
//                 <p>Subtotal</p>
//                 <h4>USD $${prod.precio * prod.cantidad}</h4>    
//             </div>
//             <button id="${prod.id}" class="carro-producto-eliminar">
//                 <i class="bi bi-x-square-fill"></i>
//             </button>
//         `
//             carroProductos.appendChild(div)
//         })

//         eliminarProducto()
//         validarTotal()
//     } else{
//         carroVacio.classList.remove("inactive")
//         carroProductos.classList.add("inactive")
//         carroAcciones.classList.add("inactive")
//         cotizador.classList.add("inactive")
//     }
    
// }

// cargarCarro()


// vaciarCarro.onclick = () =>{
//     Swal.fire({
//         title: '¿Estás seguro?',
//         text: `${carro.reduce((acc, prod) => acc + prod.cantidad, 0)} productos están por ser eliminados del carrito.`,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#949494',
//         confirmButtonText: 'Sí, vaciar',
//         cancelButtonText: 'No, cancelar',
//     }).then((result) => {
//         if (result.isConfirmed) {
//             localStorage.clear()
//             carroVacio.classList.remove("inactive")
//             carroProductos.classList.add("inactive")
//             carroAcciones.classList.add("inactive")
//             cotizador.classList.add("inactive")
//             Swal.fire(
//                 'Carrito vacío.',
//                 'Los productos han sido eliminados',
//                 'success'
//             )
//         }
//     })
// }


// function eliminarProducto(){
//     botonEliminarProducto = document.querySelectorAll(".carro-producto-eliminar")

//     botonEliminarProducto.forEach(boton => {
//         boton.addEventListener("click", eliminarItem)

//         function eliminarItem() {
//             const productoEliminado = carro.findIndex(prod => prod.id == boton.id);
//             carro.splice(productoEliminado, 1);

//             localStorage.setItem("carrito", JSON.stringify(carro));
//             cargarCarro();
//         }
        
//     })

    
// }


// ////// CALCULADORA DE ENVIOS


// let tarifaEnvio

// const milisegundosPorDia = 86400000
// const plazoTerrestre = 5 * milisegundosPorDia
// const plazoAereo = 3 * milisegundosPorDia


// function calcularFechaEnvio(plazo){
//     //Función para generar fecha de entrega según el tipo de envío. El parámetro "plazo" será definido por las constantes "plazoTerrestre" y "plazoAereo"
//         const hoy = new Date()
//         const fechaFutura = new Date (hoy.getTime() + plazo)
    
//         return fechaFutura.toLocaleDateString()
// }

// const botonAsegurar = document.querySelector("#asegurar");
// const botonesRadio = document.querySelectorAll('input[name="envio"]');
// const valorEnvio = document.querySelector("#valor-envio")
// const valorSeguro = document.querySelector("#valor-seguro")

// const fechaEnvio = document.querySelector("#fecha-envio")

// const totalPeso = carro.reduce((acumulador, prod) => acumulador + prod.peso, 0);
// const totalPesoVol = carro.reduce((acumulador, prod) => acumulador + prod.pesoVol, 0);
// const totalPrecios = carro.reduce((acumulador, prod) => acumulador + (prod.precio * prod.cantidad), 0);

// botonesRadio.forEach(boton => {
//     boton.addEventListener("change", () => {
//         if (boton.checked) {
//             if (boton.value === "aereo") {
//                 tarifaEnvio = 8
//                 fechaEnvio.innerText = `Fecha máxima de entrega: ${calcularFechaEnvio(plazoAereo)}`
//             } else if (boton.value === "terrestre") {
//                 tarifaEnvio = 5
//                 fechaEnvio.innerText = `Fecha máxima de entrega: ${calcularFechaEnvio(plazoTerrestre)}`
//             }

//             asegurar()
            
//             resultado = calcularResultado(totalPeso, totalPesoVol, tarifaEnvio)
//             valorEnvio.innerText = `Valor envío: USD $${resultado.toFixed(2)}`
//             validarTotal()

//         }
//     })
// })

// const seguro = (x) => x * 10 / 100;

// function asegurar(){
//     botonAsegurar.addEventListener("change", () => {
//         if (botonAsegurar.checked) {
//             valorAsegurado = seguro(totalPrecios)
//             valorSeguro.innerText = `Valor seguro: USD $${valorAsegurado.toFixed(2)}`
//             validarTotal()
            
//         } else {
//             valorAsegurado = 0
//             valorSeguro.innerText = ""
//             validarTotal()
//         }
//     })

// }

// function calcularResultado(peso, pesoVol, tarifa) {
//     if (peso >= pesoVol) {
//         return peso * tarifa
//     } else {
//         return pesoVol * tarifa
//     }
// }


// const formularioCotizador = document.querySelector("#formulario-cotizador")

// formularioCotizador.addEventListener("submit", (e) =>{
    
//     e.preventDefault()

//     const checkout = document.createElement("div")
//     checkout.innerHTML = `
//         <form id="formulario-checkout" class="formulario-checkout">
//             <span class="text-checkout">Ingrese sus datos de contacto</span>
//             <input type="text" placeholder="Nombre completo" class="text-input-checkout" required>
//             <input type="email" placeholder="E-mail" class="text-input-checkout" required>
//             <input type="text" placeholder="Dirección de envío" class="text-input-checkout" required>
//             <input type="submit" class="btn-checkout" id="btn-checkout" value="Finalizar compra">
//         </form>
//     `

//     checkout.classList.add("contenedor-checkout")
//     main.appendChild(checkout)
//     main.classList.add("efecto-checkout")

    
//     const formularioCheckout = document.querySelector("#formulario-checkout")
//     formularioCheckout.addEventListener("submit", hacerCheckout)

//     function hacerCheckout(e){
//         e.preventDefault()
    
//         Swal.fire(
//             '¡Compra exitosa!',
//             'Muchas gracias por tu compra. Te esperamos pronto',
//             'success'
//         )
        
//         carroVacio.classList.remove("inactive")
//         checkout.classList.add("inactive")
//         cotizador.classList.add("inactive")
//         carroProductos.classList.add("inactive")
//         carroAcciones.classList.add("inactive")   
//         main.classList.remove("efecto-checkout")
//         localStorage.clear()
//     }
// })

// function validarTotal (){
//     let totalValidado = carro.reduce((acc, prod) => acc + (prod.cantidad * prod.precio), 0)
//     let valorTotal = totalValidado + valorAsegurado + resultado
//     totalCarrito.innerText = `USD $${valorTotal.toFixed(2)}`
// }


// console.log(carro)
// console.log(totalPeso)
// console.log(totalPesoVol)
// console.log(totalPrecios)