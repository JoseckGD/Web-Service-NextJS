import { NextResponse } from "next/server";

export async function GET(req, { params }) {

    const datos = {
        "operacion": params.datos[0],
        "valor1": parseFloat(params.datos[1]),
        "valor2": parseFloat(params.datos[2])
    };

    try {
        //Realizar la operacion
        const resultado = operacion(datos);

        //Crear la respuesta
        const response = NextResponse.json({ status: true, message: 'Hello from the API calculadora', resultado: resultado });

        // Configurar encabezados CORS
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');

        //Retornar la respuesta
        return response;
    } catch (error) {
        return NextResponse.json({ status: false, message: 'Error from the API! ' + error });
    }
}

const operacion = ({ operacion, valor1, valor2 }) => {
    let resultado = 0;
    switch (operacion) {
        case 'sumar':
            resultado = valor1 + valor2;
            break;
        case 'restar':
            resultado = valor1 - valor2;
            break;
        case 'multiplicar':
            resultado = valor1 * valor2;
            break;
        case 'dividir':
            resultado = valor1 / valor2;
            break;
        default:
            resultado = 'Operación no válida';
            break;
    }
    return resultado;
}