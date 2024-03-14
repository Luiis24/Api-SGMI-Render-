const { Pool } = require('pg');
const { CONFIG_BD } = require('../config/db');
const { rows } = require('pg/lib/defaults');
const express = require('express');
const pool = new Pool(CONFIG_BD)




// Instructor

// Registrar Un Instructor (Post):

const registerInstructor = (req, res) => {
  console.log(req.body);
  const { cc_instructor, nombre_instructor, email_instructor, telefono_instructor, password_instructor } = req.body;

  if (!cc_instructor || !nombre_instructor || !email_instructor || !telefono_instructor || !password_instructor) {
    return res.status(400).json({ error: 'Falta información requerida' });
  }

  // Validar formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email_instructor)) {
    return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
  }

  // Validar formato del número de teléfono
  const telefonoRegex = /^\d{10}$/; // 10 dígitos
  if (!telefonoRegex.test(telefono_instructor)) {
    return res.status(400).json({ error: 'Formato de número de teléfono inválido' });
  }

  // Convertir telefono_instructor a número entero
  const telefono_instructor_num = parseInt(telefono_instructor, 10);

  pool.query('SELECT * FROM instructores WHERE cc_instructor = $1 OR telefono_instructor = $2 OR email_instructor = $3', [cc_instructor, telefono_instructor_num, email_instructor], (error, result) => {
    if (error) {
      console.error('Error al consultar la base de datos', error);
      return res.status(501).json({ error: 'Error al registrar el Instructor', error });
    }

    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'El Instructor ya existe' });
    }

    pool.query('INSERT INTO instructores (cc_instructor, nombre_instructor, email_instructor, telefono_instructor, password_instructor) VALUES ($1, $2, $3, $4, $5)', [cc_instructor, nombre_instructor, email_instructor, telefono_instructor_num, password_instructor], (error) => {
      if (error) {
        console.error('Error al insertar el Instructor en la base de datos', error);
        return res.status(500).json({ error: 'Error al registrar el Instructor' });
      }

      res.status(201).json({ message: 'Instructor registrado exitosamente' });
    });
  });
};


// Ver Instructores (Get):

const getInstructores = (req, res) => {
  pool.query('SELECT * FROM instructores', (error, result) => {
    if (error) {
      console.error('Error al consultar la base de datos', error);
      return res.status(500).json({ error: 'Error al obtener la lista de instructores' });
    }

    res.status(200).json(result.rows);
  });
};



// Iniciar Sesion Instructor

const loginInstructor = (req, res) => {
  const { cc_instructor, password_instructor } = req.body;

  if (!cc_instructor || !password_instructor) {
    return res.status(400).json({ error: 'Falta información requerida' });
  }

  pool.query('SELECT * FROM instructores WHERE cc_instructor = $1 AND password_instructor = $2', [cc_instructor, password_instructor], (error, result) => {
    if (error) {
      console.error('Error al consultar la base de datos', error);
      return res.status(500).json({ error: 'Error al intentar iniciar sesión de instructor' });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  });
};





// Aprendiz

// Registrar Un Aprendiz (Post):


const registerAprendiz = (req, res) => {
  console.log(req.body);
  const { tipo_doc_aprendiz, num_doc_aprendiz, ficha_aprendiz, programa_aprendiz, nombre_aprendiz, email_aprendiz, telefono_aprendiz, equipo_aprendiz, password_aprendiz, id_instructor, estado } = req.body;

  if (!tipo_doc_aprendiz || !num_doc_aprendiz || !ficha_aprendiz || !programa_aprendiz || !nombre_aprendiz || !email_aprendiz || !telefono_aprendiz || !equipo_aprendiz || !password_aprendiz || !id_instructor) {
    return res.status(400).json({ error: 'Falta información requerida' });
  }

  // Validar formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email_aprendiz)) {
    return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
  }

  // Validar formato del número de teléfono
  const telefonoRegex = /^\d{10}$/; // 10 dígitos
  if (!telefonoRegex.test(telefono_aprendiz)) {
    return res.status(400).json({ error: 'Formato de número de teléfono inválido' });
  }

  // Convertir telefono_aprendiz a número entero
  const telefono_aprendiz_num = parseInt(telefono_aprendiz, 10);

  // Consultar si ya existe un aprendiz con el mismo número de documento, email o teléfono
  pool.query(
    'SELECT * FROM aprendices WHERE num_doc_aprendiz = $1 OR email_aprendiz = $2 OR telefono_aprendiz = $3',
    [num_doc_aprendiz, email_aprendiz, telefono_aprendiz_num],
    (error, result) => {
      if (error) {
        console.error('Error al consultar la base de datos', error);
        return res.status(500).json({ error: 'Error al registrar el Aprendiz' });
      }

      if (result.rows.length > 0) {
        return res.status(409).json({ error: 'El Aprendiz ya existe' });
      }

      // Si no hay conflictos, proceder con la inserción
      pool.query(
        'INSERT INTO aprendices (tipo_doc_aprendiz, num_doc_aprendiz, ficha_aprendiz, programa_aprendiz, nombre_aprendiz, email_aprendiz, telefono_aprendiz, equipo_aprendiz, password_aprendiz, id_instructor, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [tipo_doc_aprendiz, num_doc_aprendiz, ficha_aprendiz, programa_aprendiz, nombre_aprendiz, email_aprendiz, telefono_aprendiz_num, equipo_aprendiz, password_aprendiz, id_instructor, estado],
        (error) => {
          if (error) {
            console.error('Error al insertar el Aprendiz en la base de datos', error);
            return res.status(500).json({ error: 'Error al registrar el Aprendiz' });
          }

          res.status(201).json({ message: 'Aprendiz registrado exitosamente' });
        }
      );
    }
  );
};


// Ver un Aprendiz (Get):

const getAprendices = (req, res) => {
  pool.query('SELECT * FROM aprendices', (error, result) => {
    if (error) {
      console.error('Error al consultar la base de datos', error);
      return res.status(500).json({ error: 'Error al obtener la lista de aprendices' });
    }

    res.status(200).json(result.rows);
  });
};



// Iniciar sesion aprendiz:

const loginAprendiz = (req, res) => {
  const { num_doc_aprendiz, password_aprendiz } = req.body;

  if (!num_doc_aprendiz || !password_aprendiz) {
    return res.status(400).json({ error: 'Falta información requerida de Aprendiz' });
  }

  // Consultar si existe un aprendiz con el número de documento y contraseña proporcionados
  pool.query(
    'SELECT * FROM aprendices WHERE num_doc_aprendiz = $1 AND password_aprendiz = $2',
    [num_doc_aprendiz, password_aprendiz],
    (error, result) => {
      if (error) {
        console.error('Error al consultar la base de datos', error);
        return res.status(500).json({ error: 'Error en el servidor de Aprendiz' });
      }

      if (result.rows.length === 1) {
        // Inicio de sesión exitoso
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
      } else {
        // Credenciales inválidas
        return res.status(401).json({ error: 'Credenciales inválidas de Aprendiz' });
      }
    }
  );
};



// Hoja de inspeccion:


// Registro hoja de inspeccion (Post):

// Hoja de inspeccion:

// Registro hoja de inspeccion (Post):

const registerHojaInspeccion = async (req, res) => {
  console.log(req.body);
  const { fecha, hora_inicio, hora_fin, estadosComponentes, id_maquina } =
    req.body;

  if (
    !fecha ||
    !hora_inicio ||
    !hora_fin ||
    !estadosComponentes ||
    estadosComponentes.length === 0
  ) {
    return res.status(400).json({ error: "Falta información requerida" });
  }
  pool.query("BEGIN", async (error) => {
    if (error) {
      console.error("Error al iniciar la transacción", error);
      return res.status(500).json({
        error:
          "Error al registrar el Hoja de inspección y estados de componentes",
      });
    }

    try {
      const result = await pool.query(
        "INSERT INTO hoja_inspeccion (fecha, hora_inicio, hora_fin, id_maquina) VALUES ($1, $2, $3, $4) RETURNING id_inspeccion",
        [fecha, hora_inicio, hora_fin, id_maquina]
      );

      const idInspeccion = result.rows[0].id_inspeccion;

      const estadosQuery = estadosComponentes.map(
        ({ id_componente, estado_componente }) =>
          pool.query(
            "INSERT INTO checklist (estado_componente, id_inspeccion, id_componente) VALUES ($1, $2, $3)",
            [estado_componente, idInspeccion, id_componente]
          )
      );

      await Promise.all(estadosQuery);

      pool.query("COMMIT", (error) => {
        if (error) {
          console.error("Error al confirmar la transacción", error);
          return res
            .status(500)
            .json({ error: "Error al confirmar la transacción" });
        }

        res.status(201).json({
          message:
            "Hoja de inspección y estados de componentes registrados exitosamente",
        });
      });
    } catch (error) {
      pool.query("ROLLBACK", (rollbackError) => {
        if (rollbackError) {
          console.error("Error al revertir la transacción", rollbackError);
        }

        console.error(
          "Error al registrar el Hoja de inspección y estados de componentes",
          error
        );
        res.status(500).json({
          error:
            "Error al registrar el Hoja de inspección y estados de componentes",
        });
      });
    }
  });
};

// ComponentesChecklist (Post)

// Registrar un componente en la tabla componentes_checklist
const registerComponenteChecklist = (req, res) => {
  console.log(req.body);
  const { tipo_componente, nombre_componente } = req.body;

  if (!tipo_componente || !nombre_componente) {
    return res.status(400).json({ error: "Falta información requerida" });
  }

  // Obtener la id de la última máquina creada
  pool.query(
    "SELECT id_maquina FROM maquinas ORDER BY id_maquina DESC LIMIT 1",
    (selectError, selectResult) => {
      if (selectError) {
        console.error("Error al obtener la última máquina", selectError);
        return res.status(500).json({ error: "Error al registrar el componente del checklist" });
      }

      const idMaquina = selectResult.rows[0].id_maquina;

      // Insertar el componente del checklist con la id de la última máquina
      pool.query(
        "INSERT INTO componentes_checklist (tipo_componente, nombre_componente, id_maquina) VALUES ($1, $2, $3)",
        [tipo_componente, nombre_componente, idMaquina],
        (insertError) => {
          if (insertError) {
            console.error(
              "Error al insertar el componente del checklist en la base de datos",
              insertError
            );
            return res
              .status(500)
              .json({ error: "Error al registrar el componente del checklist" });
          }

          res
            .status(201)
            .json({ message: "Componente del checklist registrado exitosamente" });
        }
      );
    }
  );
};


// Obtener la lista de componentes de la tabla componentes_checklist

const getComponenteChecklist = (req, res) => {
  pool.query("SELECT * FROM componentes_checklist", (error, result) => {
    if (error) {
      console.error("Error al consultar la base de datos", error);
      return res
        .status(500)
        .json({ error: "Error al obtener la lista de componentes" });
    }

    res.status(200).json(result.rows);
  });
};

// Check List - Estado de los componentes (Post):

const registerChecklist = async (req, res) => {
  try {
    const { id_maquina, fecha, hora_inicio, hora_fin, estadosComponentes, ficha_aprendiz, operario, num_doc_aprendiz, programa_aprendiz, equipo_aprendiz, observacion } = req.body;

    // console.log('Datos recibidos en el controlador:', {
    //   id_maquina,
    //   fecha,
    //   hora_inicio,
    //   hora_fin,
    //   estadosComponentes,
    //   ficha_aprendiz, 
    //   operario, 
    //   num_doc_aprendiz, 
    //   programa_aprendiz, 
    //   equipo_aprendiz
    // });

    // Obtener el número de inspección actual para esa máquina
    const { rows } = await pool.query(
      'SELECT COALESCE(MAX(num_inspeccion), 0) + 1 AS nuevo_num_inspeccion FROM checklist WHERE id_maquina = $1',
      [id_maquina]
    );

    const nuevoNumInspeccion = rows[0].nuevo_num_inspeccion;

    // Construir la consulta SQL para insertar en la tabla checklist
    const query = `
      INSERT INTO checklist (id_maquina, num_inspeccion, fecha, hora_inicio, hora_fin, estado_componente, id_componente, ficha_aprendiz, operario, num_doc_aprendiz, programa_aprendiz, equipo_aprendiz, observacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;

    // Ejecutar la consulta para cada estadoComponente
    for (const estadoComponente of estadosComponentes) {
      const values = [
        id_maquina,
        nuevoNumInspeccion,
        fecha,
        hora_inicio,
        hora_fin,
        estadoComponente.estado_componente,
        estadoComponente.id_componente,
        ficha_aprendiz,
        operario,
        num_doc_aprendiz,
        programa_aprendiz,
        equipo_aprendiz,
        observacion
      ];
      console.log(values)

      await pool.query(query, values);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al registrar en checklist:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};





// ...

const getUltimosEstados = (req, res) => {
  pool.query(
    "SELECT c.id_componente, c.tipo_componente, c.nombre_componente, cl.estado_componente, hi.fecha, hi.hora_inicio, hi.hora_fin " +
    "FROM checklist cl " +
    "JOIN componentes_checklist c ON cl.id_componente = c.id_componente " +
    "JOIN hoja_inspeccion hi ON cl.id_inspeccion = hi.id_inspeccion " +
    "WHERE cl.id_checklist IN (" +
    "SELECT MAX(id_checklist) " +
    "FROM checklist " +
    "GROUP BY id_componente" +
    ")",
    (error, results) => {
      if (error) {
        console.error("Error al obtener los últimos estados", error);
        return res
          .status(500)
          .json({ error: "Error al obtener los últimos estados" });
      }

      const ultimosEstados = {};
      results.rows.forEach((row) => {
        const componenteInfo = {
          tipo: row.tipo_componente,
          nombre: row.nombre_componente,
          estado: row.estado_componente,
          fecha: row.fecha,
          horaInicio: row.hora_inicio,
          horaFin: row.hora_fin,
        };

        ultimosEstados[row.id_componente] = componenteInfo;
      });

      res.status(200).json(ultimosEstados);
    }
  );
};














// obtener insumos (GET):

const getInsumos = (req, res) => {
  pool.query('SELECT * FROM insumos', (error, result) => {
    if (error) {
      console.error('Error al consultar la base de datos', error);
      return res.status(500).json({ error: 'Error al obtener la lista de componentes' });
    }

    res.status(200).json(result.rows);
  });
};


// obtener Maquinas (GET)

const getMaquinas = (req, res) => {
  pool.query('SELECT * FROM maquinas', (error, result) => {
    if (error) {
      console.error('Error al consultar la base de datos', error);
      return res.status(500).json({ error: 'Error al obtener la lista de maquinas' });
    }

    res.status(200).json(result.rows);
  });
};

// obtener tipos de maquinas (GET)

const getTipoMaquinas = (req, res) => {
  pool.query('SELECT * FROM tipo_maquina', (error, result) => {
    if (error) {
      console.error('Error al consultar la base de datos', error);
      return res.status(500).json({ error: 'Error al obtener la lista de tipos de maquinas' });
    }

    res.status(200).json(result.rows);
  });
};

// obtener orden de trabajo por maquina

const getOrdenTrabajoById = (req, res) => {
  const id_maquina = req.params.id_maquina;


  pool.query('SELECT * FROM maquinas WHERE id_maquina = $1', [id_maquina], (error, result) => {
    if (error) {
      console.error('Error al obtener el producto', error);
      res.status(500).json({ error: 'Error al obtener el producto' });
    } else {
      if (result.rows.length === 1) {
        const maquina = result.rows[0];
        res.status(200).json(maquina);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    }
  });
};

// orden de trabajo nova

const registerOrdenTrabajo = (req, res) => {
  console.log(req.body);
  const { fecha_inicio_ot, hora_inicio_ot, fecha_fin_ot, hora_fin_ot, total_horas_ot, precio_hora, total_mano_obra, tipo_de_trabajo, tipo_de_mantenimiento, tipo_de_sistema, descripcion_de_trabajo, subtotal_ot, iva, total_precio_horas, costo_mantenimiento, id_maquina, id_aprendiz, programa_formacion_ot, ficha_ot, operarios_ot } = req.body;

  pool.query(
    'INSERT INTO public.orden_de_trabajo(fecha_inicio_ot, hora_inicio_ot, fecha_fin_ot, hora_fin_ot, total_horas_ot, precio_hora, total_mano_obra, tipo_de_trabajo, tipo_de_mantenimiento, tipo_de_sistema, descripcion_de_trabajo, subtotal_ot, iva, total_precio_horas, costo_mantenimiento, id_maquina, id_aprendiz, programa_formacion_ot, ficha_ot, operarios_ot) VALUES ($1, $2, $3,$4, $5, $6,$7, $8, $9,$10, $11, $12,$13, $14, $15, $16, $17, $18, $19, $20)',
    [fecha_inicio_ot, hora_inicio_ot, fecha_fin_ot, hora_fin_ot, total_horas_ot, precio_hora, total_mano_obra, tipo_de_trabajo, tipo_de_mantenimiento, tipo_de_sistema, descripcion_de_trabajo, subtotal_ot, iva, total_precio_horas, costo_mantenimiento, id_maquina, id_aprendiz, programa_formacion_ot, ficha_ot, operarios_ot],
    (error) => {
      if (error) {
        console.error('Error al registrar orden de trabajo en la base de datos', error);
        return res.status(500).json({ error: 'Error al registrar la orden detrabajo' });
      }

       // Después de insertar los datos, realizar una consulta para obtener el id_orden_de_trabajo
       pool.query(
        'SELECT id_orden_de_trabajo FROM public.orden_de_trabajo WHERE fecha_inicio_ot = $1 AND hora_inicio_ot = $2 AND descripcion_de_trabajo = $3',
        [fecha_inicio_ot, hora_inicio_ot, descripcion_de_trabajo],
        (error, result) => {
          if (error) {
            console.error('Error al obtener el id_orden_de_trabajo de la base de datos', error);
            return res.status(500).json({ error: 'Error al obtener el id_orden_de_trabajo' });
          }

        const id_orden_de_trabajo = result.rows[0].id_orden_de_trabajo;

      res.status(201).json({ message: 'Orden de trabajo registrado exitosamente', id_orden_de_trabajo });
        });
    }
  );
};

// registrar insumos utilizados en la base de datos

const registerInsumosUtilizados = (req, res) => {
  console.log(req.body);
  const { nombre_insumo_ot, cantidad_insumo_ot, unidad_insumo_ot, valor_insumo_ot, subtotal_insumo_ot, total_precio_insumo_ot, origen_insumo_ot, id_orden_de_trabajo, id_insumos } = req.body;

  pool.query(
    'INSERT INTO insumos_usados_ot(nombre_insumo_ot, cantidad_insumo_ot, unidad_insumo_ot, valor_insumo_ot, subtotal_insumo_ot, total_precio_insumo_ot, origen_insumo_ot, id_orden_de_trabajo, id_insumos) VALUES ($1, $2, $3 ,$4, $5, $6 ,$7, $8, $9)',
    [nombre_insumo_ot, cantidad_insumo_ot, unidad_insumo_ot, valor_insumo_ot, subtotal_insumo_ot, total_precio_insumo_ot, origen_insumo_ot, id_orden_de_trabajo, id_insumos],
    (error) => {
      if (error) {
        console.error('Error al registrar los insumos utilizados en la orden de trabajo en la base de datos', error);
        return res.status(500).json({ error: 'Error al registrar los insumos utilizados en la orden de trabajo' });
      }

      res.status(201).json({ message: 'Insumo utilizado registrado exitosamente' });
    }
  );
};

// get insumos utilizados

const getInsumosUtilizados = (req, res) => {
  const {id_orden_de_trabajo} = req.body
  pool.query('SELECT * FROM insumos_usados_ot WHERE id_orden_de_trabajo = $1', [id_orden_de_trabajo], (error, results) => {
    if (error) {
      console.error('Error al obtener los insumos utilizados', error);
      return res.status(500).json({ error: 'Error al obtener los insumos utilizados' });
    }

    res.status(200).json(results.rows);
  });
}

const getInsumosUtilizadosAlmacen = (req, res) => {
  const {id_insumo} = req.body
  pool.query('SELECT * FROM insumos_usados_ot WHERE id_insumos = $1 AND id_orden_de_trabajo IN (SELECT id_orden_de_trabajo FROM orden_de_trabajo WHERE fecha_fin_ot > CURRENT_DATE)', [id_insumo], (error, results) => {
    if (error) {
      console.error('Error al obtener los insumos utilizados', error);
      return res.status(500).json({ error: 'Error al obtener los insumos utilizados' });
    }

    res.status(200).json(results.rows);
  });
}


// obtener checklist por maquina

const getChecklistById = (req, res) => {
  const id_maquina = req.params.id_maquina;


  pool.query('SELECT * FROM maquinas WHERE id_maquina = $1', [id_maquina], (error, result) => {
    if (error) {
      console.error('Error al obtener el checklist', error);
      res.status(500).json({ error: 'Error al obtener el checklist' });
    } else {
      if (result.rows.length === 1) {
        const maquina = result.rows[0];
        res.status(200).json(maquina);
      } else {
        res.status(404).json({ error: 'checklist no encontrado' });
      }
    }
  });
};

// obtener hoja de vida por maquina

const getHojaVidaById = (req, res) => {
  const id_maquina = req.params.id_maquina;


  pool.query('SELECT * FROM maquinas WHERE id_maquina = $1', [id_maquina], (error, result) => {
    if (error) {
      console.error('Error al obtener el Hoja de vida', error);
      res.status(500).json({ error: 'Error al obtener el Hoja de vida' });
    } else {
      if (result.rows.length === 1) {
        const maquina = result.rows[0];
        res.status(200).json(maquina);
      } else {
        res.status(404).json({ error: 'Hoja de vida no encontrada' });
      }
    }
  });
};


// crear tipo de maquina

const crearTipoMaquina = async (req, res) => {
  const { nombre_tipo_maquina, descripcion_tipo_maquina } = req.body;

  if (!nombre_tipo_maquina || !descripcion_tipo_maquina) {
    return res.status(400).json({ error: 'Falta información requerida' });
  }

  try{
  const existeTipoMaquina = await pool.query(
    'SELECT * FROM tipo_maquina WHERE nombre_tipo_maquina = $1',
    [nombre_tipo_maquina]
  );

  if (existeTipoMaquina.rows.length > 0) {
    // Si ya existe un tipo de máquina con el mismo nombre, devolver un error
    return res.status(400).json({ error: 'Ya existe un tipo de máquina con el mismo nombre' });
  }

  await pool.query(
    'INSERT INTO tipo_maquina (nombre_tipo_maquina, descripcion_tipo_maquina) VALUES ($1, $2)',
    [nombre_tipo_maquina, descripcion_tipo_maquina]
    );

    res.status(201).json({ message: 'Tipo de máquina registrado exitosamente' });
} catch(error){
  console.error('Error al insertar el tipo de máquina en la base de datos', error);
  return res.status(500).json({ error: 'Error al registrar el tipo de máquina' });
}
};


// crear maquina

const crearMaquina = async (req, res) => {
  const { nombre_maquina, manual_maquina, id_tipo_maquina } = req.body;

  try {
    // Verificar si ya existe una máquina con el mismo nombre
    const existeMaquina = await pool.query(
      'SELECT * FROM maquinas WHERE nombre_maquina = $1',
      [nombre_maquina]
    );

    if (existeMaquina.rows.length > 0) {
      // Si ya existe una máquina con el mismo nombre, devolver un error
      return res.status(400).json({ error: 'Ya existe una máquina con el mismo nombre' });
    }




    // Insertar la nueva máquina
    await pool.query(
      'INSERT INTO maquinas (nombre_maquina, manual_maquina, id_tipo_maquina) VALUES ($1, $2, $3)',
      [nombre_maquina, manual_maquina, id_tipo_maquina]
    );

    res.status(201).json({ message: 'Máquina registrada exitosamente' });
  } catch (error) {
    console.error('Error al registrar la máquina', error);
    res.status(500).json({ error: 'Error al registrar la nueva máquina' });
  }
};

// login de aprendiz e instructor

const login = (req, res) => {
  const { nId, password } = req.body;
  const estado = 'activo'

  if (!nId || !password) {
    return res.status(400).json({ error: 'Falta información requerida' });
  }

  pool.query(
    'SELECT * FROM aprendices WHERE num_doc_aprendiz = $1 AND password_aprendiz = $2 AND estado = $3',
    [nId, password, estado],
    (error, aprendizResult) => {
      if (error) {
        console.error('Error al consultar la base de datos', error);
        return res.status(500).json({ error: 'Error en el servidor' });
      }

      if (aprendizResult.rows.length === 1) {
        return res.status(200).json(aprendizResult.rows[0]);
      }

      pool.query(
        'SELECT * FROM instructores WHERE cc_instructor = $1 AND password_instructor = $2',
        [nId, password],
        (error, instructorResult) => {
          if (error) {
            console.error('Error al consultar la base de datos', error);
            return res.status(500).json({ error: 'Error en el servidor' });
          }

          if (instructorResult.rows.length === 1) {
            return res.status(200).json(instructorResult.rows[0]);
          }

          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
      );
    }
  );
};

// obtener hoja de vida

const getHojas_de_vida = (req, res) => {
  pool.query('SELECT * FROM hoja_de_vida', (error, results) => {
    if (error) {
      console.error('Error al obtener las hojas de vida', error);
      return res.status(500).json({ error: 'Error al obtener hojas de vida' });
    }

    res.status(200).json(results.rows);
  });
};

// crear caracteristicas de motor de la maquina

const crearCaracteristicasMotor = async (req, res) => {
  const {
    id_maquina,
    marca_motor,
    modelo_motor,
    descripcion_motor,
    serie_motor,
    tamaño_motor,
    potencia_motor,
    rpm_motor,
    voltaje_motor,
    amp_motor,
  } = req.body;

  try {
    await pool.query(
      'INSERT INTO caracteristicas_motor (id_maquina, marca_motor, modelo_motor, descripcion_motor, serie_motor, tamaño_motor, potencia_motor, rpm_motor, voltaje_motor, amp_motor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id_maquina, marca_motor, modelo_motor, descripcion_motor, serie_motor, tamaño_motor, potencia_motor, rpm_motor, voltaje_motor, amp_motor]
    );

    res.status(201).json({ message: 'Características del motor registradas exitosamente' });
  } catch (error) {
    console.error('Error al registrar las características del motor', error);
    res.status(500).json({ error: 'Error al registrar las características del motor' });
  }
};


// obtener caracteristicas de motor de la maquina

const GetCaracteristicasMotor = async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM caracteristicas_motor');
    const caracteristicasMotor = response.rows;

    res.status(200).json(caracteristicasMotor);
  } catch (error) {
    console.error('Error al obtener las características del motor', error);
    res.status(500).json({ error: 'Error al obtener las características del motor' });
  }
};



// Historial de reparaciones
// Guardar historial (Post):

const crearHistorialReparaciones = async (req, res) => {
  const {
    id_maquina,
    procedimiento_historial,
    insumos_usados_historial,
    observaciones_historial,
    fecha_historial,
  } = req.body;

  try {
    await pool.query(
      "INSERT INTO historial_reparaciones (id_maquina, procedimiento_historial, insumos_usados_historial, observaciones_historial, fecha_historial) VALUES ($1, $2, $3, $4, $5)",
      [
        id_maquina,
        procedimiento_historial,
        insumos_usados_historial,
        observaciones_historial,
        fecha_historial,
      ]
    );

    res
      .status(201)
      .json({ message: "Registro en el historial de reparaciones exitoso" });
  } catch (error) {
    console.error("Error al registrar en el historial de reparaciones", error);
    res
      .status(500)
      .json({ error: "Error al registrar en el historial de reparaciones" });
  }
};



const GetHistorialReparaciones = async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM historial_reparaciones ORDER BY fecha_historial DESC');
    const historialReparaciones = response.rows;

    res.status(200).json(historialReparaciones);
  } catch (error) {
    console.error('Error al obtener el historial de reparaciones', error);
    res.status(500).json({ error: 'Error al obtener el historial de reparaciones' });
  }
};


// Descripcion del equipo (Post)

const registrarEquipo = async (req, res) => {

  const { nombre_equipo, marca_equipo, fecha_fabricacion_equipo, fabricante_equipo, ubicacion_equipo, caracteristicas_equipo, codigo_equipo, modelo_equipo, num_serie_equipo, prioridad_equipo, voltaje_equipo, corriente_equipo, frecuencia_equipo, capacidad_equipo, peso_equipo, alimentacion_equipo, sistema_electrico_equipo, sistema_electronico_equipo, sistema_mecanico_equipo, sistema_neumatico_equipo, sistema_hidraulico_equipo, sistema_termico_equipo, id_maquina } = req.body;

  try {

    const resultado = await pool.query(
      'INSERT INTO descripcion_del_equipo_hv (nombre_equipo, marca_equipo, fecha_fabricacion_equipo, fabricante_equipo, ubicacion_equipo, caracteristicas_equipo, codigo_equipo, modelo_equipo, num_serie_equipo, prioridad_equipo, voltaje_equipo, corriente_equipo, frecuencia_equipo, capacidad_equipo, peso_equipo, alimentacion_equipo, sistema_electrico_equipo, sistema_electronico_equipo, sistema_mecanico_equipo, sistema_neumatico_equipo, sistema_hidraulico_equipo, sistema_termico_equipo, id_maquina) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)',
      [nombre_equipo, marca_equipo, fecha_fabricacion_equipo, fabricante_equipo, ubicacion_equipo, caracteristicas_equipo, codigo_equipo, modelo_equipo, num_serie_equipo, prioridad_equipo, voltaje_equipo, corriente_equipo, frecuencia_equipo, capacidad_equipo, peso_equipo, alimentacion_equipo, sistema_electrico_equipo, sistema_electronico_equipo, sistema_mecanico_equipo, sistema_neumatico_equipo, sistema_hidraulico_equipo, sistema_termico_equipo, id_maquina]
    );

    res.json({ mensaje: 'Equipo registrado correctamente' });

  } catch (error) {
    console.log(error);
    res.status(500).json('Error registrando equipo');
  }

}

// Descripcion del equipo (Get)

const GetDescripcion_equio = async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM descripcion_del_equipo_hv');
    const Descripcion_equioi = response.rows;

    res.status(200).json(Descripcion_equioi);
  } catch (error) {
    console.error('Error al obtener el historial de reparaciones', error);
    res.status(500).json({ error: 'Error al obtener el historial de reparaciones' });
  }
};



// Caracteristicas maquina (Post)

const crear_caracteristica_maquina = (req, res) => {
  const { id_maquina, nombre_caracteristica, descripcion_caracteristica } = req.body;

  if (!id_maquina || !nombre_caracteristica || !descripcion_caracteristica) {
    return res.status(400).json({ error: 'Falta información requerida' });
  }

  pool.query(
    'INSERT INTO caracteristicas_maquina (id_maquina, nombre_caracteristica, descripcion_caracteristica) VALUES ($1, $2, $3)',
    [id_maquina, nombre_caracteristica, descripcion_caracteristica],
    (error) => {
      if (error) {
        console.error('Error al insertar la característica de la máquina en la base de datos', error);
        return res.status(500).json({ error: 'Error al registrar la característica de la máquina' });
      }

      res.status(201).json({ message: 'Característica de la máquina registrada exitosamente' });
    }
  );
};

const actualizar_funcion_maquina = (req, res) => {
  const { id_maquina, funcion_maquina } = req.body;

  if (!id_maquina || !funcion_maquina) {
    return res.status(400).json({ error: 'Falta información requerida' });
  }

  pool.query(
    'UPDATE caracteristicas_maquina SET funcion_maquina = $1 WHERE id_maquina = $2',
    [funcion_maquina, id_maquina],
    (error) => {
      if (error) {
        console.error('Error al actualizar la función de la máquina en la base de datos', error);
        return res.status(500).json({ error: 'Error al actualizar la función de la máquina' });
      }

      res.status(200).json({ message: 'Función de la máquina actualizada exitosamente' });
    }
  );
};





// Caracteristicas maquina (Get)

const GetCaracteristicasMaquina = (req, res) => {
  pool.query('SELECT * FROM caracteristicas_maquina', (error, results) => {
    if (error) {
      console.error('Error al obtener los tipos de máquina', error);
      return res.status(500).json({ error: 'Error al obtener los tipos de máquina' });
    }

    res.status(200).json(results.rows);
  });
};

// Obtener la descripción del equipo por id_maquina
const getDescripcionEquipoById = async (id_maquina) => {
  try {
    const response = await pool.query('SELECT * FROM descripcion_del_equipo_hv WHERE id_maquina = $1', [id_maquina]);
    return response.rows;
  } catch (error) {
    console.error('Error al obtener la descripción del equipo', error);
    throw error;
  }
};

// Obtener las características de la máquina por id_maquina
const getCaracteristicasMaquinaById = async (id_maquina) => {
  try {
    const response = await pool.query('SELECT * FROM caracteristicas_maquina WHERE id_maquina = $1', [id_maquina]);
    return response.rows;
  } catch (error) {
    console.error('Error al obtener las características de la máquina', error);
    throw error;
  }
};

// Obtener las características del motor por id_maquina
const getCaracteristicasMotorById = async (id_maquina) => {
  try {
    const response = await pool.query('SELECT * FROM caracteristicas_motor WHERE id_maquina = $1', [id_maquina]);
    return response.rows;
  } catch (error) {
    console.error('Error al obtener las características del motor', error);
    throw error;
  }
};

// Obtener el historial de reparaciones por id_maquina
const getHistorialReparacionesById = async (id_maquina) => {
  try {
    const response = await pool.query('SELECT * FROM historial_reparaciones WHERE id_maquina = $1 ORDER BY fecha_historial DESC', [id_maquina]);
    return response.rows;
  } catch (error) {
    console.error('Error al obtener el historial de reparaciones', error);
    throw error;
  }
};





// Ordenes de trabajo (Get)

const GetOrdenesTrabajo = async (req, res) => {
  pool.query('SELECT orden_de_trabajo.*, maquinas.nombre_maquina FROM orden_de_trabajo JOIN maquinas ON orden_de_trabajo.id_maquina = maquinas.id_maquina ORDER BY orden_de_trabajo.fecha_fin_ot DESC;', (error, result) => {
    if (error) {
      console.error('Error al consultar la base de datos', error);
      return res.status(500).json({ error: 'Error al obtener la lista de ordenes de trabajo' });
    }

    res.status(200).json(result.rows);
  });
};

// Orden de trabajo para modal (Get)

const GetOrdenTrabajo = async (req, res) => {
  const { id } = req.body;
  pool.query('SELECT orden_de_trabajo.*, maquinas.nombre_maquina FROM orden_de_trabajo JOIN maquinas ON orden_de_trabajo.id_maquina = maquinas.id_maquina WHERE orden_de_trabajo.id_orden_de_trabajo = $1;', [id],
    (error, result) => {
      if (error) {
        console.error('Error al consultar la base de datos', error);
        return res.status(500).json({ error: 'Error al obtener la orden de trabajo' });
      }

      res.status(200).json(result.rows);
    });
};

// registrar insumo

const RegistrarInsumo = (req, res) => {
  const {
    nombre_insumo,
    fecha_llegada_insumo,
    cantidad_insumo,
    proveedor_insumo,
    tipo
  } = req.body;

  if (
    !nombre_insumo ||
    !fecha_llegada_insumo ||
    !cantidad_insumo ||
    !proveedor_insumo ||
    !tipo
  ) {
    return res.status(400).json({ error: "Falta información requerida" });
  }

  // Verificar si ya existe un insumo con el mismo nombre
  pool.query(
    "SELECT * FROM insumos WHERE nombre_insumo = $1",
    [nombre_insumo],
    (error, result) => {
      if (error) {
        console.error("Error al buscar el insumo en la base de datos", error);
        return res.status(500).json({ error: "Error al registrar insumos" });
      }

      if (result.rows.length > 0) {
        // Si ya existe, actualiza la cantidad y la fecha
        pool.query(
          "UPDATE insumos SET cantidad_insumo = cantidad_insumo + $1, fecha_llegada_insumo = $2 WHERE nombre_insumo = $3",
          [cantidad_insumo, fecha_llegada_insumo, nombre_insumo],
          (updateError) => {
            if (updateError) {
              console.error(
                "Error al actualizar la cantidad y la fecha del insumo existente",
                updateError
              );
              return res
                .status(500)
                .json({ error: "Error al registrar insumos" });
            }

            res.status(200).json({
              message: "La cantidad y la fecha del insumo existente fueron actualizadas exitosamente",
            });
          }
        );
      } else {
        // Si no existe, inserta un nuevo insumo
        pool.query(
          "INSERT INTO insumos (nombre_insumo, fecha_llegada_insumo, cantidad_insumo, proveedor_insumo, tipo) VALUES ($1, $2, $3, $4, $5)",
          [nombre_insumo, fecha_llegada_insumo, cantidad_insumo, proveedor_insumo, tipo],
          (insertError) => {
            if (insertError) {
              console.error(
                "Error al insertar los insumos en la base de datos",
                insertError
              );
              return res
                .status(500)
                .json({ error: "Error al registrar insumos" });
            }

            res.status(201).json({
              message: "Los insumos fueron registrados exitosamente",
            });
          }
        );
      }
    }
  );
};

//Insumos (Get)

const GetInsumos = (req, res) => {
  pool.query("SELECT * FROM insumos", (error, results) => {
    if (error) {
      console.error("Error al obtener la lista de los insumos", error);
      return res
        .status(500)
        .json({ error: "Error al obtener la lista de los insumos" });
    }

    res.status(200).json(results.rows);
  });
};

// Usar insumo

const UsarInsumo = async (req, res) => {
  const { id_insumo, nombre_insumo, cantidad } = req.body;
  console.log("Recibido: ", id_insumo, cantidad);
  try {
    console.log("ID del insumo:", id_insumo);
    console.log("Nombre del insumo:", nombre_insumo);
    console.log("Cantidad:", cantidad);
    const result = await pool.query(
      "SELECT * FROM insumos WHERE id_insumos = $1",
      [id_insumo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Insumo no encontrado" });
    }


    const cantidadActual = result.rows[0].insumos_en_uso || 0;


    await pool.query(
      "UPDATE insumos SET insumos_en_uso = $1 WHERE id_insumos = $2",
      [cantidadActual + parseInt(cantidad), id_insumo]
    );

    console.log("Insumo usado exitosamente");
    res.status(200).json({ message: "Insumo usado exitosamente" });
  } catch (error) {
    console.error("Error al usar insumo", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Ver insumo con la id

const getInsumoById = async (req, res) => {
  const id_insumo = req.params.id_insumo;

  try {
    const result = await pool.query(
      "SELECT * FROM insumos WHERE id_insumos = $1",
      [id_insumo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Insumo no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener insumo por ID", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Devolver insumo

const devolverInsumo = async (req, res) => {
  const { id } = req.params;
  const { cantidad, nota } = req.body;

  try {
    // Verificar si el insumo existe
    const insumoExistente = await pool.query('SELECT * FROM insumos WHERE id_insumos = $1', [id]);

    if (insumoExistente.rows.length === 0) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    const insumo = insumoExistente.rows[0];
    const cantidadEnUso = insumo.insumos_en_uso || 0;

    // Verificar si la cantidad a devolver no supera la cantidad en uso
    if (cantidad > cantidadEnUso) {
      return res.status(400).json({ message: 'La cantidad ingresada supera la cantidad en uso' });
    }

    const cantidad_final = cantidadEnUso - cantidad
    // Realizar la devolución de insumo
    await pool.query('UPDATE insumos SET insumos_en_uso = $1, nota_insumo = $2 WHERE id_insumos = $3', [cantidad_final, nota, id]);

    res.status(200).json({ message: 'Insumo devuelto exitosamente' });
  } catch (error) {
    console.error('Error al devolver insumo', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



const ultimaMaquina = (req, res) => {
  pool.query(
    "SELECT * FROM maquinas ORDER BY id_maquina DESC LIMIT 1",
    (error, result) => {
      if (error) {
        console.error("Error al obtener la última máquina registrada", error);
        return res
          .status(500)
          .json({ error: "Error al obtener la última máquina registrada" });
      }

      res.status(200).json(result.rows[0]);
    }
  );
};

// Coimponenetes de la maquina por ID

const getComponentesByMaquina = async (req, res) => {
  const idMaquina = req.params.idMaquina;

  try {
    // Realiza la consulta a la base de datos para obtener los componentes de la máquina específica
    const response = await pool.query(
      'SELECT * FROM componentes_checklist WHERE id_maquina = $1',
      [idMaquina]
    );

    res.json(response.rows);
  } catch (error) {
    console.error('Error al obtener los componentes de la máquina', error);
    res.status(500).json({ error: 'Error al obtener los componentes de la máquina' });
  }
};

// Ver registros del checklist

const getUltimoRegistro = async (req, res) => {
  const { idMaquina } = req.params;

  try {
    const response = await pool.query(
      'SELECT * FROM checklist WHERE id_maquina = $1 ORDER BY num_inspeccion DESC LIMIT 1',
      [idMaquina]
    );

    res.json(response.rows[0]);
  } catch (error) {
    console.error('Error al obtener el último registro', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getHistorialRegistros = async (req, res) => {
  const { idMaquina } = req.params;

  try {
    const response = await pool.query(
      'SELECT * FROM checklist WHERE id_maquina = $1 ORDER BY num_inspeccion DESC LIMIT 50',
      [idMaquina]
    );

    res.json(response.rows);
  } catch (error) {
    console.error('Error al obtener el historial de registros', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// actualizar informacion maquina

const actualizarMaquina = async (req, res) => {
  const { id_maquina, nombre_maquina, manual_maquina} = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM maquinas WHERE id_maquina = $1",
      [id_maquina]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Maquina no encontrada" });
    }

    await pool.query(
      "UPDATE maquinas SET nombre_maquina=$1 , manual_maquina=$2 WHERE id_maquina = $3",
      [nombre_maquina, manual_maquina, id_maquina]
    );

    res.status(200).json({ message: "Informacion de maquina actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// actualizar informacion tipo maquina

const actualizarTipoMaquina = async (req, res) => {
  const { id_tipo_maquina, nombre_tipo_maquina, descripcion_tipo_maquina} = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM tipo_maquina WHERE id_tipo_maquina = $1",
      [id_tipo_maquina]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tipo de maquina no encontrada" });
    }

    await pool.query(
      "UPDATE tipo_maquina SET nombre_tipo_maquina=$1, descripcion_tipo_maquina=$2 WHERE id_tipo_maquina = $3;",
      [nombre_tipo_maquina, descripcion_tipo_maquina, id_tipo_maquina]
    );

    res.status(200).json({ message: "Informacion de tipo de maquina actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// actualizar estado de aprendiz
const actualizarAprendiz = async (req, res) => {
  const { aprendizSelected, estado} = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM aprendices WHERE id_aprendiz = $1",
      [aprendizSelected]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "aprendiz no encontrado" });
    }

    await pool.query(
      "UPDATE aprendices SET estado = $1 WHERE id_aprendiz = $2",
      [estado, aprendizSelected]
    );

    res.status(200).json({ message: "Informacion de aprendiz actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// actualizar estado de ficha
const actualizarFicha = async (req, res) => {
  const { ficha_aprendiz, estado} = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM aprendices WHERE ficha_aprendiz = $1",
      [ficha_aprendiz]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ficha no encontrada" });
    }

    await pool.query(
      "UPDATE aprendices SET estado = $1 WHERE ficha_aprendiz = $2;",
      [estado, ficha_aprendiz]
    );

    res.status(200).json({ message: "Estado de ficha actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// actualizar cantidad Salida
const actualizarSalidaInsumo = async (req, res) => {
  const { id_insumo, cantidad_insumo, nota } = req.body;
  try {

    const currentInsumo = await pool.query(
      "SELECT cantidad_insumo FROM insumos WHERE id_insumos = $1",
      [id_insumo]
    );

    // Asegurar que el insumo exista
    if (currentInsumo.rows.length === 0) {
      return res.status(404).json({ message: "Insumo no encontrado" });
    }

    // Calcular que cantidad queda
    const updatedQuantity = currentInsumo.rows[0].cantidad_insumo - cantidad_insumo;

    await pool.query(
      "UPDATE insumos SET cantidad_insumo = $1, nota_insumo = $2 WHERE id_insumos = $3;",
      [updatedQuantity, nota, id_insumo]
    );

    res.status(200).json({ message: "Cantidad de insumo actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const actualizarSalidaInsumoEnUso = async (req, res) => {
  const { id_insumo, cantidad_insumo, nota } = req.body;
  try {

    const currentInsumo = await pool.query(
      "SELECT cantidad_insumo, insumos_en_uso FROM insumos WHERE id_insumos = $1",
      [id_insumo]
    );

    // Asegurar que el insumo exista
    if (currentInsumo.rows.length === 0) {
      return res.status(404).json({ message: "Insumo no encontrado" });
    }

    // Calcular que cantidad queda
    const updatedQuantity = currentInsumo.rows[0].cantidad_insumo - cantidad_insumo;
    const updatedInsumosEnUso = currentInsumo.rows[0].insumos_en_uso - cantidad_insumo
    await pool.query(
      "UPDATE insumos SET cantidad_insumo = $1, insumos_en_uso = $2, nota_insumo = $3 WHERE id_insumos = $4;",
      [updatedQuantity, updatedInsumosEnUso, nota, id_insumo]
    );

    res.status(200).json({ message: "Cantidad de insumo actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// const insumosADevolver = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT iuot.id_insumos, iuot.cantidad_insumo_ot FROM insumos_usados_ot iuot JOIN orden_de_trabajo ot ON iuot.id_orden_de_trabajo = ot.id_orden_de_trabajo WHERE ot.fecha_fin_ot <= NOW();"
//     )
//     res.status(200).json(result.rows)
//   } catch(error){
//     res.status(500).json({message: "Error en la base de datos"})
//   }
// }

// componentes en mal estado
const componentesAAlertar = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT c.*, m.*, cc.* FROM checklist c INNER JOIN ( SELECT id_maquina, MAX(num_inspeccion) AS max_num_inspeccion FROM checklist GROUP BY id_maquina ) t ON c.id_maquina = t.id_maquina AND c.num_inspeccion = t.max_num_inspeccion INNER JOIN maquinas m ON c.id_maquina = m.id_maquina INNER JOIN componentes_checklist cc ON c.id_componente = cc.id_componente WHERE c.estado_componente = 'alertar'"
    )
    res.status(200).json(result.rows)
  } catch(error){
    res.status(500).json({message: "Error en la base de datos"})
  }
}


module.exports = {
  registerInstructor,
  getInstructores,
  loginInstructor,
  registerAprendiz,
  getAprendices,
  loginAprendiz,
  registerHojaInspeccion,
  registerComponenteChecklist,
  getComponenteChecklist,
  registerChecklist,
  getInsumos,
  getMaquinas,
  getOrdenTrabajoById,
  registerOrdenTrabajo,
  getUltimosEstados,
  getTipoMaquinas,
  getChecklistById,
  getHojaVidaById,
  crearTipoMaquina,
  crearMaquina,
  login,
  crearCaracteristicasMotor,
  GetCaracteristicasMotor,
  crearHistorialReparaciones,
  GetHistorialReparaciones,
  registrarEquipo,
  GetDescripcion_equio,
  crear_caracteristica_maquina,
  actualizar_funcion_maquina,
  GetCaracteristicasMaquina,
  getHojas_de_vida,


  getDescripcionEquipoById,
  getCaracteristicasMaquinaById,
  getCaracteristicasMotorById,
  getHistorialReparacionesById,

  RegistrarInsumo,
  GetInsumos,
  UsarInsumo,
  getInsumoById,
  devolverInsumo,
  ultimaMaquina,
  getComponentesByMaquina,
  getHistorialRegistros,
  getUltimoRegistro,

  GetOrdenesTrabajo,
  GetOrdenTrabajo,

  actualizarMaquina,
  actualizarTipoMaquina,
  actualizarAprendiz,
  actualizarFicha,
  registerInsumosUtilizados,
  getInsumosUtilizados,
  getInsumosUtilizadosAlmacen,
  // insumosADevolver,
  actualizarSalidaInsumo,
  actualizarSalidaInsumoEnUso,
  componentesAAlertar
};

