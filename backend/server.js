const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// conexión a tu base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // tu contraseña si tienes
  database: 'js_salon'
});

// prueba de conexión
db.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// endpoint de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// obtener citas
app.get('/citas', (req, res) => {
  db.query(`
    SELECT citas.*, servicios.nombre AS servicio_nombre
    FROM citas
    JOIN servicios ON citas.servicio_id = servicios.id
  `, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
// obtener servicios
app.get('/servicios', (req, res) => {
  db.query('SELECT * FROM servicios', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener servicios');
    } else {
      res.json(results); 
    }
  });
});

app.post('/citas', (req, res) => {
  const { cliente_id, servicio_id, fecha, hora } = req.body;

  const sql = `
    INSERT INTO citas (cliente_id, servicio_id, fecha, hora, estado)
    VALUES (?, ?, ?, ?, 'pendiente')
  `;

  db.query(sql, [cliente_id, servicio_id, fecha, hora], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al guardar cita');
    } else {
      res.send('Cita guardada');
    }
  });
});
 // eliminar cita
app.delete('/citas/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM citas WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al eliminar');
    } else {
      res.send('Cita eliminada');
    }
  });
});

// SIEMPRE AL FINAL
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});