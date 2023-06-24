const mysql = require('mysql');

// Configura los parámetros de conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos no está en localhost
    user: 'root', // Cambia esto si tu usuario de MySQL es diferente
    password: '', // Cambia esto por tu contraseña de MySQL
    port: 3307, // Cambia por tu puerto de conexión si es necesario
    database: 'bd_web_service_nextjs', // Cambia esto por el nombre de tu base de datos
});

module.exports = connection;
