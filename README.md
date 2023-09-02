# H-Sound: e-commerce con Calculadora de Envíos

<br> 

E-commerce de artículos de audio.
Muestra los productos de forma dinámica según su categoría.

Adicionalmente, cuenta con un simulador para cálculos de envíos, el cual se describe a continuación:

El principio de este simulador es calcular el valor de un envío, que puede ser de uno o varios productos. Su funcionamiento se basa en elegir la tarifa según el tipo de envío y se aplicará a las dimensiones o peso de los productos en el carrito, para después sumarle el seguro el cual es opcional.

Para el cálculo, el simulador tiene dos tarifas:

1. Envío Terrestre: USD 5 por kg.
2. Envío Aéreo: USD 8 por kg.

De acuerda a la tarifa elegida, el simulador se encargará de multiplicarla por lo que sea mayor entre el peso y el peso volumétrico (de acuerdo a las dimensiones precargadas en los productos) total de los productos.

Posteriormente, solicitará al usuario si quiere asegurar el envío, el cual será el equivalente al 10% del valor total del carrito.

Finalmente, en el detalle se mostrará la fecha máxima de entrega, según sea el caso. Además, imprime el resultado del valor total de los productos, sumado con el valor del envío y seguro. Dicho total, también es mostrado en pesos argentinos (valor generado mediante una API)