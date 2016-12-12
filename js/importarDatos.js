TEvento = function(){
	var itemEvento = null;
	var itemGrupo = null;
	
	var self = this;
	
	$.get("vistas/importar/general.tpl", function(plantilla){
		/*Aquí se asignan las plantillas */
		$("#modulo").html(plantilla);
		self.adminVistas("eventos");
		
		$.get("vistas/importar/evento.tpl", function(html){
			self.itemEvento = $(html);
		});
		
		$.get("vistas/importar/grupos.tpl", function(html){
			self.itemGrupo = $(html);
		});
	});
	
	this.getEventos = function(){
		var traerDatos = true;
		
		try{
			switch(navigator.connection.type){
				case Connection.UNKNOWN:
					alertify.error("Tu conexión a internet no ha sido identificada, ¿estás conectado a internet?");
					traerDatos = false;
				break;
				case Connection.ETHERNET: case Connection.WIFI:
				break;
				case Connection.CELL_2G: case Connection.CELL_3G: case Connection.CELL_4G: case Connection.CELL:
					alertify.log("Estás conectado por tu red de datos, te sugerimos conectarte a una red wifi para evitar el consumo de datos");
				break;
				case Connection.NONE:
					alertify.error("Tu dispositivo no está conectado a internet, no se puede seguir ");
					traerDatos = false;
				break;
			}
		}catch(e){
			console.log(e);
		}
		
		
		if (traerDatos){
			$.post(server + "listaEventos",{
				"movil": true
			}, function(resp){
				self.adminVistas("eventos");
				
				$("[action=show]").click(function(){
					self.adminVistas($(this).attr("vista"));
				});
				
				var plantilla = $("#modulo").find("[view=eventos]").find(".list-group");
				
				if (resp.length > 0){
					$.each(resp, function(i, evento){
						var item = self.itemEvento.clone();
						$.each(evento, function(campo, valor){
							item.find("[campo=" + campo + "]").text(valor);
						});
						
						item.click(function(){
							self.getGrupos(evento);
						});
						
						plantilla.append(item);
					});
					
				}else
					plantilla.append("<p>Sin datos disponibles</p>");
			}, "json");
		}
	}
	
	
	this.getGrupos = function(evento){
		self.adminVistas("grupos");
		vista = $("#modulo").find("[view=grupos]");
		
		vista.find("[campo=nombreEvento]").text(evento.titulo);
		$("#modulo").find("[view=grupos]").find("#txtFiltro").val("");
		
		vista.find(".list-group").html("");
		$.post(server + "listaGrupos",{
			"movil": true,
			"evento": evento.idEvento
		}, function(resp){
			var plantilla = $("#modulo").find("[view=grupos]").find(".list-group");
			alertify.log('<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Obteniendo datos, por favor espere...</span>');
			if (resp.length > 0){
				$.each(resp, function(i, grupo){
					var item = self.itemGrupo.clone();
					$.each(grupo, function(campo, valor){
						item.find("[campo=" + campo + "]").text(valor);
					});
					
					item.click(function(){
						alertify.confirm("<b>Estas solicitando el importar los datos de este</b> ¿Seguro?<br /> <small>Si existen datos de este curso guardados en el dispositivo, estos serán eliminados para cargar los nuevos</small>", function (e) {
							if (e) {
								self.adminVistas("consola");
								self.getParticipantes(grupo);
							}
						});
					});
					
					plantilla.append(item);
				});
				
			}else
				plantilla.append("<p>Sin datos disponibles</p>");
				
				
			$("#modulo").find("[view=grupos]").find("#txtFiltro").keyup(function(){
				var texto = $("#modulo").find("[view=grupos]").find("#txtFiltro").val().toUpperCase();
				
				plantilla.find(".list-group-item").each(function(){
					el = $(this);
					
					if (texto == '')
						el.show();
					else{
						el.hide();
						$.each(["nombre", "sede", "encargado"], function(i, campo){
							if (el.find("[campo=" + campo + "]").text().toUpperCase().indexOf(texto) >= 0)
								el.show();
						})
					}
				});
			});
		}, "json");
	}
	
	this.adminVistas = function(mostrar){
		$("[view]").hide();
		
		if (mostrar != '' || mostrar != undefined)
			$("[view=" + mostrar + "]").show();
		else
			console.log("Error en la vista");
	}
	
	this.getParticipantes = function(grupo){
		$("#log").html("Iniciando la solicitud de datos");
		addLog("------");
		function addLog(msg){
			$("#log").append($('<p>' + msg + '</p>'));
		}
		
		alertify.log("Se está realizando una conexión a oficinas centrales, este proceso puede tardar dependiendo de tu conexión a internet");
		$.post(server + "cAdministracionEventos", {
			"movil": true,
			"action": "inscritosGrupos",
			"grupo": grupo.idGrupo
		}, function(datos){
			addLog('Se recibieron ' + datos.length + ' registros de inscripción desde el servidor');
			
			db.transaction(function(tx){
				tx.executeSql("select idParticipante from participante where idGrupo = ?", [grupo.idGrupo], function(tx, res){
					for(var i = 0 ; i < res.rows.length ; i++){
						tx.executeSql("delete from asistencia where idParticipante = ?", [res.rows.item(i).idParticipante]);
						tx.executeSql("delete from justificacion where idParticipante = ?", [res.rows.item(i).idParticipante]);
						tx.executeSql("delete from participante where idParticipante = ?", [res.rows.item(i).idParticipante]);
					}
					
					tx.executeSql("delete from grupo where idGrupo = ?", [grupo.idGrupo], function(tx, res){
						addLog("Se eliminó el grupo de la base de datos");
						tx.executeSql("insert into grupo(idGrupo, nombre, sede, encargado) values (?, ?, ?, ?)", [grupo.idGrupo, grupo.nombre, grupo.sede, grupo.encargado], function(tx, res){
							addLog("Nuevo grupo creado");
							
							var cont = 0;
							$.each(datos, function(i, participante){
								var url = participante.foto.replace(" ", "%20");
								// we need to access LocalFileSystem
								window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fs){
									// create the download directory is doesn't exist
									fs.root.getDirectory('downloads', { create: true });
									
									// we will save file in .. downloads/phonegap-logo.png
									var filePath = fs.root.fullPath + '/downloads/' + url.split('/').pop();
									var fileTransfer = new window.FileTransfer();
									var uri = encodeURI(decodeURIComponent(url));
									
									fileTransfer.download(uri, filePath, function(entry){
									    console.log("Successfully downloaded file, full path is " + entry.fullPath);
									    db.transaction(function(tx){
									    	tx.executeSql("update participante set fotografia = ? where num_personal = ?", [entry.fullPath, participante.num_personal], function(tx, res){
									    	}, errorDB);
									    }, errorDB);
									},
									function(error){
									    console.log("Some error " + error.code + " for " + url);
									}, 
									false);
								});
							
							
								tx.executeSql("insert into participante (num_personal, idGrupo, nombre, fotografia, idPlantel, nombrePlantel, plaza, especialidad) values (?,?,?,?,?,?,?,?)", [participante.num_personal, grupo.idGrupo, participante.nombreTrabajador, '', participante.plantel, participante.nombrePlantel, participante.plaza, participante.especialidad == null?'':participante.especialidad], function(tx, res){
									addLog(participante.nombreTrabajador + " agregado a la base");
									cont++;
									if (cont >= datos.length){
										addLog("Proceso terminado");
										addLog("----");
										
										alertify.success("El proceso de importación a terminado para este grupo");
									}
								}, errorDB);
							});
							
						}, errorDB);
					}, errorDB);
				}, errorDB);
			});
			
		}, "json");
	}
}