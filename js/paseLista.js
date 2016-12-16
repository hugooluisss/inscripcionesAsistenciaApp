TPaseLista = function(){
	var itemGrupo = "";
	var itemParticipante = "";
	
	var self = this;
	
	$.get("vistas/paseLista/grupo.tpl", function(html){
		self.itemGrupo = $(html);
		console.info("Vista Grupo obtenida");
		
		self.getGrupos();
	});
	
	$.get("vistas/paseLista/itemParticipante.tpl", function(html){
		self.itemParticipante = $(html);
		console.info("Vista Grupo participante");
	});
	
	$.get("vistas/paseLista/general.tpl", function(plantilla){
		/*Aquí se asignan las plantillas */
		$("#modulo").html(plantilla);
		self.adminVistas("grupos");
		
		$("#txtFecha").datepicker({
			showButtonPanel: true, 
			altFormat: "yy-mm-dd",
			showAnim: "slideDown",
			autoSize: true
		});
		
		$("[action=show]").click(function(){
			self.adminVistas($(this).attr("vista"));
			
			$(".page-tittle").html("Administración de grupos");
		});
		
		$("#txtFecha").change(function(){
			var fecha = $(this).val().split("/");
			fecha = fecha[2] + '-' + fecha[1] + '-' + fecha[0];
			$(this).val(fecha);
			
			var grupo = $("#grupo").val();
			$("#modulo").find("#lstParticipantes").find("[action=justificar]").show();
			db.transaction(function(tx){
				$("#modulo").find("#lstParticipantes").find("[idParticipante]").prop("checked", false);
				
				tx.executeSql("select * from participante join asistencia on participante.idParticipante = asistencia.idParticipante where idGrupo = ? and fecha = ? order by nombre", [grupo, fecha], function(tx, res){
					//Hay que checar las asistencias
					console.log("Total de asistencias registradas: " + res.rows.length);
					var chk = null;
					for (i = 0 ; i < res.rows.length ; i++){
						chk = $("#modulo").find("#lstParticipantes").find("[idParticipante=" + res.rows.item(i).idParticipante + "]");
						if (chk.length != 0){
							chk.prop("checked", true);
							chk.parent().parent().parent().parent().find("[action=justificar]").hide();
							console.info(res.rows.item(i));
						}else{
							tx.executeSql("delete from asistencia where idParticipante = ? and fecha = ?", [res.rows.item(i).idParticipante, fecha]);
							console.info("No se encontró a un participante en la lista, el registro fue borrado");
						}
					}
				});
			}, errorDB);
		});
		
		$("#getFoto").click(function(){
			navigator.camera.getPicture(function(imageURI){
					var img = $("<img />");
									
					win.find("#vistaPrevia").append(img);
					
					img.attr("src", "data:image/jpeg;base64," + imageURI);
					img.attr("fuente", imageURI);
				}, function(message){
					alertify.error("Ocurrio un error al subir la imagen");
				}, { 
					quality: 100,
					//destinationType: Camera.DestinationType.FILE_URI,
					destinationType: Camera.DestinationType.DATA_URL,
					encodingType: Camera.EncodingType.JPEG,
					targetWidth: 250,
					targetHeight: 250,
					correctOrientation: true,
					allowEdit: false
				});
		});
		
		
		win = $("#winJustificaciones");
		$("#winJustificaciones").on('shown.bs.modal', function () {
			win.find("#vistaPrevia").find("img").remove();
			win.find("#txtMotivo").val("");
			
			db.transaction(function(tx){
				tx.executeSql("select * from justificacion where fecha = ? and idParticipante = ?", [$("#txtFechaJustificacion").val(), $("#participante").val()], function(tx, res){
					if (res.rows.length > 0){
						console.log(res.rows.item(0).comprobante);
						if (res.rows.item(0).comprobante != null && res.rows.item(0).comprobante != '' && res.rows.item(0).comprobante == undefined){
							win.find("#vistaPrevia").find("img").remove();
							win.find("#vistaPrevia").append($('<img class="img-responsive" src="data:image/jpeg;base64,' + res.rows.item(0).comprobante + '" fuente="' + res.rows.item(0).comprobante + '" />'));
						}
						
						win.find("#txtMotivo").val(res.rows.item(0).motivo);
					}
					
				}, errorDB);
			});
		});
	    
		win.find("#btnGuardar").click(function(){
			if (win.find("#vistaPrevia").find("img").length == 0){
				alertify.error("Se debe de agregar una foto del justificante");
			}else{
				db.transaction(function(tx){
					alert(win.find("#vistaPrevia").find("img").attr("fuente"));
					tx.executeSql("select * from justificacion where fecha = ? and idParticipante = ?", [$("#txtFechaJustificacion").val(), $("#participante").val()], function(tx, res){
						if (res.rows.length == 0){
							tx.executeSql("insert into justificacion(fecha, idParticipante, motivo, comprobante) values (?, ?, ?, ?)", [$("#txtFechaJustificacion").val(), $("#participante").val(), win.find("#txtMotivo").val(), win.find("#vistaPrevia").find("img").attr("fuente")], function(tx, res){
								alertify.success("Justificación guardada");
								win.modal("hide");
							}, function(tx, res){
								alert(res);
								alertify.error("Ocurrió un error al guardar la justificación");
							});
						}else
							tx.executeSql("update justificacion set motivo = ?, comprobante = ? where idParticipante = ? and fecha = ?", [win.find("#txtMotivo").val(), win.find("#vistaPrevia").find("img").attr("fuente"), $("#participante").val(), $("#txtFechaJustificacion").val()], function(tx, res){
								alertify.success("Justificación guardada");
								win.modal("hide");
							}, function(tx, res){
								alert(res);
								alertify.error("Ocurrió un error al guardar la justificación");
							});
					}, errorDB);
				});
			}
		});
	});
	
	this.getGrupos = function(){		
		db.transaction(function(tx){
			alertify.log("Obteniendo la lista de grupos");
			tx.executeSql("select * from grupo", [], function(tx, res){
				var item = null;
				var plantilla = $("#modulo").find("[view=grupos]").find(".list-group");
				
				console.log("Total de grupos: " + res.rows.length);
				for(i = 0 ; i < res.rows.length ; i++){
					item = self.itemGrupo.clone();
					
					$.each(res.rows.item(i), function(campo, valor){
						item.find("[campo=" + campo + "]").text(valor);
					});
					
					item.find("[action=paseLista]").attr("idGrupo", res.rows.item(i).idGrupo);
					
					item.find("[action=paseLista]").click(function(){
						var item = $(this);
						self.adminVistas("listas");
						self.getParticipantes(item.attr("idGrupo"), "paseLista");
						$("#grupo").val(item.attr("idGrupo"));
						
						$(".page-tittle").html("Pase de lista");
					});
					
					item.find("[action=setCalificacion]").attr("idGrupo", res.rows.item(i).idGrupo);
					
					item.find("[action=setCalificacion]").click(function(){
						var item = $(this);
						self.adminVistas("listas");
						self.getParticipantes(item.attr("idGrupo"), "setCalificacion");
						$("#grupo").val(item.attr("idGrupo"));
						
						$(".page-tittle").html("Calificación final");
					});
					
					item.find("[action=sendOficinas]").attr("idGrupo", res.rows.item(i).idGrupo);
					
					item.find("[action=sendOficinas]").click(function(){
						var item = $(this);
						
						alertify.confirm("Esta acción enviará los datos a oficinas centrales y no podrán ser cambiadas, ¿estás seguro?", function (e) {
							if (e) {
								sendOficinas(item);
							}else{ 
								alertify.error("Has pulsado '" + alertify.labels.cancel + "'");
							}
						});
					});
					
					plantilla.append(item);
				}
			}, errorDB);
		});
	}
	
	this.getParticipantes = function(grupo, action){
		console.info("Grupo: " + grupo);
		db.transaction(function(tx){
			alertify.log("Obteniendo la lista de participantes");
			$("#txtFecha").val("");
			tx.executeSql("select * from participante where idGrupo = ? order by nombre", [grupo], function(tx, res){
				var item = null;
				var plantilla = $("#modulo").find("#lstParticipantes");
				$("#modulo").find("#lstParticipantes").html("");
				console.log("Total de participantes: " + res.rows.length);
				
				if (action == 'paseLista'){
					$("#setCalendar").show();
					$("#finder").removeClass("col-xs-12").addClass("col-xs-6");
				}else{
					$("#setCalendar").hide();
					$("#finder").removeClass("col-xs-6").addClass("col-xs-12");
				}
				
				for(i = 0 ; i < res.rows.length ; i++){
					item = self.itemParticipante.clone();
					
					$.each(res.rows.item(i), function(campo, valor){
						item.find("[campo=" + campo + "]").text(valor);
					});
					
					item.find(".calificacion").val(res.rows.item(i).calificacion);
					item.find(".calificacion").attr("anterior", res.rows.item(i).calificacion);
					
					if (res.rows.item(i).fotografia != '')
						item.find("img.media-object").prop("src", res.rows.item(i).fotografia);
					
					switch(action){
						case 'paseLista':
							item.find("[type=checkbox]").attr("idParticipante", res.rows.item(i).idParticipante);
							item.find("a[action=justificar]").attr("idParticipante", res.rows.item(i).idParticipante);
							item.find(".calificacion").hide();
							
							item.find("[type=checkbox]").change(function(){
								var el = $(this);
								if ($("#txtFecha").val() == ''){
									alertify.error("Selecciona una fecha");
									$("#txtFecha").focus();
									
									el.prop("checked", false);
								}else{					
									if (el.is(":checked"))
										db.transaction(function(tx){
											tx.executeSql("insert into asistencia (fecha, idParticipante) values (?, ?)", [$("#txtFecha").val(), el.attr("idParticipante")], function(tx, res){
												el.parent().parent().parent().parent().find("[action=justificar]").hide();
												
											}, function(tx, res){
												console.log(res);
												el.prop("checked", false);
												alertify.error("Error al registrar la asistencia");
											});
										});
									else
										db.transaction(function(tx){
											tx.executeSql("delete from asistencia where fecha = ? and idParticipante = ?", [$("#txtFecha").val(), el.attr("idParticipante")], function(tx, res){
												el.parent().parent().parent().parent().find("[action=justificar]").show();
												
											}, function(){
												el.prop("checked", true);
												alertify.error("Error al eliminar el registro de asistencia");
											});
										});
								}
							});
							
							item.find("[action=justificar]").click(function(){
								var participante = $(this).attr("idParticipante");
								
								$("#winJustificaciones").find("#participante").val(participante);
								$("#winJustificaciones").find("#txtFechaJustificacion").val($("#txtFecha").val());
								
								$("#winJustificaciones").modal();
							});
						break;
						case 'setCalificacion'://Si es calificación final
							item.find("[type=checkbox]").hide();
							item.find("[type=checkbox]").parent().hide();
							item.find("a[action=justificar]").hide();
							item.find(".calificacion").attr("idParticipante", res.rows.item(i).idParticipante);
							
							item.find(".calificacion").change(function(){
								var el = $(this);
								valor = el.val();
								if (isNaN(valor)){
									alertify.error("Esto no es un número");
									el.val(el.attr("anterior"));
								}else if(valor < 0 || valor > 10){
									alertify.error("Debe ser un valor dentro del rango de 0 a 10");
									el.val(el.attr("anterior"));
								}else{
									db.transaction(function(tx){
										tx.executeSql("update participante set calificacion = ? where idParticipante = ?", [valor, el.attr("idParticipante")], function(tx, res){
											el.attr("anterior", el.val());
											console.info("Calificacion registrada");
										}, function(){
											alertify.error("Error al registrar la calificación");
										});
									});
								}
							});
						break;
					}
					plantilla.append(item);
				}
				
				$("#modulo").find("[view=listas]").find("#txtFiltro").val("");
				
				$("#modulo").find("[view=listas]").find("#txtFiltro").keyup(function(){
					var texto = $("#modulo").find("[view=listas]").find("#txtFiltro").val().toUpperCase();
					
					plantilla.find(".media").each(function(){
						el = $(this);
						
						if (texto == '')
							el.show();
						else{
							el.hide();
							$.each(["nombrePlantel", "plaza", "especialidad", "nombre"], function(i, campo){
								if (el.find("[campo=" + campo + "]").text().toUpperCase().indexOf(texto) >= 0)
									el.show();
							})
						}
					});
				});
			}, errorDB);
		});
	}
	
	this.adminVistas = function(mostrar){
		$("[view]").hide();
		
		if (mostrar != '' || mostrar != undefined)
			$("[view=" + mostrar + "]").show();
		else
			console.log("Error en la vista");
	}
};


function sendOficinas(elemento){
	db.transaction(function(tx){
		$("#over").css("display", 'block');
		$("#fade").css("display", 'block');
		
		alertify.log("Se está construyendo el objeto de exportación");
		tx.executeSql("select num_personal, calificacion, a.idParticipante, b.fecha, c.motivo, c.comprobante, c.fecha as fechaJust from participante a left join asistencia b on a.idParticipante = b.idParticipante left join justificacion c on a.idParticipante = c.idParticipante where idGrupo = ? order by nombre", [elemento.attr("idGrupo")], function(tx, res){
			var datos = [];
			var row = null;
			var num_personal = null;
			
			for(var i = 0 ; i < res.rows.length ; i++){
				row = res.rows.item(i);
				if (row.num_personal != num_personal){
					if (num_personal != null){
						datos.push(el);
					}
					
					var el = new Object;
					el.num_personal = row.num_personal;
					el.calificacion = row.calificacion;
					el.asistencias = [];
					el.justificaciones = [];
					
					num_personal = row.num_personal;
				}
				
				if (row.fecha != null)
					el.asistencias.push(row.fecha);
				
				if (row.fechaJust != null){
					var just = new Object;
					
					just.fecha = row.fechaJust;
					just.motivo = row.motivo;
					just.comprobante = row.comprobante == undefined?'':row.comprobante;
					
					el.justificaciones.push(just);
				}
			}
			
			datos.push(el);
			
			$.post(server + "?mod=cAdministracionEventos&action=importarDevice", {
				"participantes": JSON.stringify(datos),
				"idGrupo": elemento.attr("idGrupo"),
				"movil": true
			}, function(resp){
				$("#over").css("display", 'none');
				$("#fade").css("display", 'none');
				
				alertify.success("El proceso terminó con éxito");
			}, "json");
		}, errorDB);
	});
	
	
}