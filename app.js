import express from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql';
import bodyParser from 'body-parser';

import cors from 'cors';


const app = express();
app.use(cors());
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'proyectoweb'
});

connection.connect(error => {
    if (error) {
        console.error('Error al conectar a la base de datos: ' + error.stack);
        return;
    }
    console.log('Conectado a la base de datos con el ID ' + connection.threadId);
});
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        connection.query('INSERT INTO usuario (correo, contraseña) VALUES (?, ?)', [email, hash], (error) => {
            if (error) {
                return res.status(500).send('Error en el servidor');
            }
            res.send('Registro completado');
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT contraseña FROM usuario WHERE correo = ?', [email], (error, results) => {
        if (error) {
            return res.status(500).send('Error en el servidor');
        }
        if (results.length > 0) {
            bcrypt.compare(password, results[0].contraseña, (err, result) => {
                if (err) {
                    return res.status(500).send('Error en el servidor');
                }
                if (result) {
                    res.send('Inicio de sesión exitoso');
                } else {
                    res.status(401).send('Correo electrónico o contraseña incorrecta');
                }
            });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    });
});

 app.post('/invertir', (req, res) => {
     const { producto_id, cantidad_invertida } = req.body;

     // Lógica para actualizar en la base de datos
     const query = 'UPDATE producto SET recaudado = recaudado + ? WHERE id = ?';

     connection.query(query, [parseFloat(cantidad_invertida), producto_id], (error, results) => {
         if (error) {
             console.error('Error en la base de datos:', error);
             return res.status(500).send('Error al procesar la inversión');
         }

         if (results.affectedRows === 0) {
             // No se encontró el producto con ese ID
             return res.status(404).send('Producto no encontrado');
         }

        console.log('Inversión actualizada con éxito para el producto ID:', producto_id);
        res.json({ mensaje: 'Inversión realizada con éxito', producto_id: producto_id, cantidad_invertida: cantidad_invertida });
    });
 });