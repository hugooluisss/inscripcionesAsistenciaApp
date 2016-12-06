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
						chk = $("#modulo").find("#lstParticipantes").find("[idParticipante=" + res.rows.item(i).idParticipante +"]");
						chk.prop("checked", true);
						chk.parent().parent().parent().parent().find("[action=justificar]").hide();
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
					targetWidth: 200,
					targetHeight: 200,
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
					console.log(res.rows.length);
					if (res.rows.length > 0){
						if (res.rows.item(0).comprobante != null && res.rows.item(0).comprobante != ''){
							win.find("#vistaPrevia").find("img").remove();
							win.find("#vistaPrevia").append($('<img class="img-responsive" src="' + res.rows.item(0).comprobante + '" />'));
						}
						
						win.find("#txtMotivo").val(res.rows.item(0).motivo);
						
						console.info("Registro encontrado");
					}else
						console.info("Registro no encontrado");
					
				}, errorDB);
			});
		});
	    
		win.find("#btnGuardar").click(function(){
			if (win.find("#vistaPrevia").find("img").length == 0){
				alertify.error("Se debe de agregar una foto del justificante");
			}else{
				db.transaction(function(tx){
					tx.executeSql("select * from justificacion where fecha = ? and idParticipante = ?", [$("#txtFechaJustificacion").val(), $("#participante").val()], function(tx, res){
						if (res.rows.length > 0)
							tx.executeSql("insert into justificacion(fecha, idParticipante, motivo, comprobante) values (?, ?, ?, ?)", [$("#txtFechaJustificacion").val(), $("#participante").val(), win.find("#txtMotivo").val(), win.find("#vistaPrevia").find("img").attr("fuente")], function(tx, res){
								alertify.success("Justificación guardada");
							}, errorDB);
						else
							tx.executeSql("update justificacion set motivo = ?, comprobante = ? where idParticipante = ? and fecha = ?", [win.find("#txtMotivo").val(), win.find("#vistaPrevia").find("img").attr("fuente"), $("#participante").val(), $("#txtFechaJustificacion").val()], function(tx, res){
								alertify.success("Justificación guardada");
							}, errorDB);
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
					
					item.attr("idGrupo", res.rows.item(i).idGrupo);
					$("#grupo").val(res.rows.item(i).idGrupo);
					
					item.click(function(){
						var item = $(this);
						self.adminVistas("listas");
						self.getParticipantes(item.attr("idGrupo"));
					});
					
					plantilla.append(item);
				}
			}, errorDB);
		});
	}
	
	this.getParticipantes = function(grupo){
		db.transaction(function(tx){
			alertify.log("Obteniendo la lista de participantes");
			tx.executeSql("select * from participante where idGrupo = ? order by nombre", [grupo], function(tx, res){
				var item = null;
				var plantilla = $("#modulo").find("#lstParticipantes");
				console.log("Total de participantes: " + res.rows.length);
				
				for(i = 0 ; i < res.rows.length ; i++){
					item = self.itemParticipante.clone();
					
					$.each(res.rows.item(i), function(campo, valor){
						item.find("[campo=" + campo + "]").text(valor);
					});
					
					item.find("[type=checkbox]").attr("idParticipante", res.rows.item(i).idParticipante);
					item.find("a[action=justificar]").attr("idParticipante", res.rows.item(i).idParticipante);
					
					item.find("[type=checkbox]").change(function(){
						var el = $(this);
						if ($("#txtFecha").val() == ''){
							alertify.error("Selecciona una fecha");
							$("#txtFecha").focus();
							
							el.prop("checked", false);
						}else{					
							if (el.is(":checked"))
								db.transaction(function(tx){
									console.log($("#txtFecha").val() + " " + el.attr("idParticipante"));
									tx.executeSql("insert into asistencia (fecha, idParticipante) values (?, ?)", [$("#txtFecha").val(), el.attr("idParticipante")], function(tx, res){
										//alertify.success("Asistencia registrada");
										
										el.parent().parent().parent().parent().find("[action=justificar]").hide();
										
									}, function(){
										el.prop("checked", false);
										alertify.error("Error al registrar la asistencia");
									});
								});
							else
								db.transaction(function(tx){
									tx.executeSql("delete from asistencia where fecha = ? and idParticipante = ?", [$("#txtFecha").val(), el.attr("idParticipante")], function(tx, res){
										//alertify.success("Asistencia eliminada");
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
					
					plantilla.append(item);
				}
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
