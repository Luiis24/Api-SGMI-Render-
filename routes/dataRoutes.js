const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataControllers');

router.post('/registerInstructor', dataController.registerInstructor);
router.get('/instructores', dataController.getInstructores);

router.post('/login', dataController.login);

router.post('/registerAprendiz', dataController.registerAprendiz);
router.post('/actualizarAprendiz', dataController.actualizarAprendiz);
router.post('/actualizarFicha', dataController.actualizarFicha);
router.get('/aprendices', dataController.getAprendices);

router.post('/registerHojaInspeccion', dataController.registerHojaInspeccion);
router.post('/registerComponenteChecklist', dataController.registerComponenteChecklist);
router.get('/componenteChecklist', dataController.getComponenteChecklist);

// Componente segun la id:

router.get('/componenteChecklist/:idMaquina',dataController.getComponentesByMaquina);

router.get('/GetUltimoRegistro/:idMaquina', dataController.getUltimoRegistro);
router.get('/GetHistorialRegistros/:idMaquina', dataController.getHistorialRegistros);

router.post('/registerChecklist', dataController.registerChecklist);
router.get('/getUltimosEstados', dataController.getUltimosEstados);

router.post('/crearMaquina',dataController.crearMaquina);
router.get('/getMaquinas',dataController.getMaquinas);
router.post('/actualizarMaquina',dataController.actualizarMaquina);

router.post('/crearTipoMaquina', dataController.crearTipoMaquina);
router.get('/tipoMaquinas', dataController.getTipoMaquinas);
router.post('/actualizarTipoMaquina',dataController.actualizarTipoMaquina);

router.get('/ordenDeTrabajo/:id_maquina', dataController.getOrdenTrabajoById);
router.get('/checklist/:id_maquina', dataController.getOrdenTrabajoById);
router.get('/hojaVida/:id_maquina', dataController.getHojaVidaById);

router.post('/registerOrdenTrabajo', dataController.registerOrdenTrabajo);
router.post('/registerInsumosUtilizados', dataController.registerInsumosUtilizados);
router.post('/getInsumosUtilizados', dataController.getInsumosUtilizados);
router.post('/getInsumosUtilizadosAlmacen', dataController.getInsumosUtilizadosAlmacen);
router.get('/insumos', dataController.getInsumos); //no va

router.post('/crearCaracteristicasMotor',dataController.crearCaracteristicasMotor);
router.get('/GetCaracteristicasMotor',dataController.GetCaracteristicasMotor);

router.post('/crearHistorialReparaciones',dataController.crearHistorialReparaciones);
router.get('/GetHistorialReparaciones',dataController.GetHistorialReparaciones);

router.post('/registrarEquipo',dataController.registrarEquipo);
router.get('/GetDescripcion_equio',dataController.GetDescripcion_equio);

router.post('/crear_caracteristica_maquina',dataController.crear_caracteristica_maquina)
router.post('/actualizar_funcion_maquina',dataController.actualizar_funcion_maquina)
router.get('/GetCaracteristicasMaquina', dataController.GetCaracteristicasMaquina)

// informes
router.get('/getOrdenesTrabajo', dataController.GetOrdenesTrabajo);
router.post('/getOrdenTrabajo', dataController.GetOrdenTrabajo);

//Ultima maquina:
router.get('/ultimaMaquina', dataController.ultimaMaquina)


const {
    getDescripcionEquipoById,
    getCaracteristicasMaquinaById,
    getCaracteristicasMotorById,
    getHistorialReparacionesById,
  } = require('../controllers/dataControllers.js');
  
  router.get('/getDescripcionEquipoById/:id_maquina', async (req, res) => {
    const id_maquina = req.params.id_maquina;
    try {
      const descripcionEquipo = await getDescripcionEquipoById(id_maquina);
      res.status(200).json(descripcionEquipo);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la descripción del equipo por id_maquina' });
    }
  });
  
  router.get('/getCaracteristicasMaquinaById/:id_maquina', async (req, res) => {
    const id_maquina = req.params.id_maquina;
    try {
      const caracteristicasMaquina = await getCaracteristicasMaquinaById(id_maquina);
      res.status(200).json(caracteristicasMaquina);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las características de la máquina por id_maquina' });
    }
  });
  
  router.get('/getCaracteristicasMotorById/:id_maquina', async (req, res) => {
    const id_maquina = req.params.id_maquina;
    try {
      const caracteristicasMotor = await getCaracteristicasMotorById(id_maquina);
      res.status(200).json(caracteristicasMotor);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las características del motor por id_maquina' });
    }
  });
  
  router.get('/getHistorialReparacionesById/:id_maquina', async (req, res) => {
    const id_maquina = req.params.id_maquina;
    try {
      const historialReparaciones = await getHistorialReparacionesById(id_maquina);
      res.status(200).json(historialReparaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el historial de reparaciones por id_maquina' });
    }
  });

  // Insumos:

router.post('/RegistrarInsumo', dataController.RegistrarInsumo);
router.post('/SalidaInsumo', dataController.actualizarSalidaInsumo);
router.get('/GetInsumos', dataController.GetInsumos);

router.post('/UsarInsumo/:id_insumo', dataController.UsarInsumo);

router.get('/GetInsumoById/:id_insumo', dataController.getInsumoById);

router.post('/DevolverInsumo/:id', dataController.devolverInsumo);

// router.get('/insumosADevolver', dataController.insumosADevolver);
router.get('/componentesAAlertar', dataController.componentesAAlertar);




module.exports = router;
