# Ecommerce con Calculadora de Envíos

<br> 

Este Ecommerce cuenta con un simulador para cálculos de envíos, el cual se describe a continuación:

El principio de este simulador es calcular el valor de un envío, que puede ser de uno o varios productos. Su funcionamiento se basa en elegir la tarifa según el tipo de envío y se aplicará a las dimensiones o peso de los productos en el carrito, para después sumarle el seguro el cual es opcional.

Para el cálculo, el simulador tiene dos tarifas:

1. Envío Terrestre: USD 5 por kg.
2. Envío Aéreo: USD 8 por kg.

De acuerda a la tarifa elegida, el simulador se encargará de multiplicarla por lo que sea mayor entre el peso y el peso volumétrico (de acuerdo a las dimensiones precargadas en los productos) total de los productos.

Posteriormente, solicitará al usuario si quiere asegurar el envío, el cual será el equivalente al 10% del valor total del carrito.

Finalmente, mostrará el resultado con el valor del envío, seguro y fecha máxima de entrega, según sea el caso.