/*
*
* Centra verticalmente una ventana modal
*
*/
function reposition(modal) {
	dialog = modal.find('.modal-dialog');
	modal.css('display', 'block');
	
	// Dividing by two centers the modal exactly, but dividing by three 
	// or four works better for larger screens.
	dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

/*
*
* Crea la base de datos
*
*/
function crearBD(db, borrar = false){
	db.transaction(function(tx){
		if (borrar){
			tx.executeSql('DROP TABLE IF EXISTS grupo');
			tx.executeSql('DROP TABLE IF EXISTS participante');
			tx.executeSql('DROP TABLE IF EXISTS asistencia');
			tx.executeSql('DROP TABLE IF EXISTS justificacion');
		}
		tx.executeSql("PRAGMA foreign_keys=ON;", [], function(){}, errorDB);
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS grupo (idGrupo integer primary key, nombre text, sede text, encargado text)', [], function(){
			console.log("tabla grupo creada");
			tx.executeSql('CREATE TABLE IF NOT EXISTS participante (idParticipante integer primary key autoincrement, num_personal integer, idGrupo integer REFERENCES grupo(idGrupo) on update cascade on delete cascade, nombre text, fotografia text, idPlantel integer, nombrePlantel text, plaza text, especialidad text)', [], function(){
				console.log("tabla participante creada");
				
				tx.executeSql('CREATE TABLE IF NOT EXISTS asistencia(fecha text, idParticipante integer REFERENCES participante(idParticipante) on update cascade on delete cascade, primary key(fecha, idParticipante))', [], function(){
					console.log("tabla asistencia creada");
				}, errorDB);
				
				tx.executeSql('CREATE TABLE IF NOT EXISTS justificacion(fecha text, idParticipante integer REFERENCES participante(idParticipante) on update cascade on delete cascade, motivo text, comprobante blob, primary key(fecha, idParticipante))', [], function(){
					console.log("tabla justificacion creada");
				}, errorDB);
		
			}, errorDB);
		}, errorDB);
	});
}


/*
*
* Error en la base de datos
*
*/

function errorDB(tx, res){
	console.log(res);
}

/*
*
* Error control
*
*/

function errorSys(err){
	console.log("Error: " + err.code);
}

function readAsText(file) {
	var reader = new FileReader();
	reader.onloadend = function(evt) {
		console.log("Read as text");
		console.log(evt.target.result);
		alert("content : "+evt.target.result);
	};
	reader.readAsText(file);
}