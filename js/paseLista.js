TPaseLista = function(){
	var itemGrupo = null;
	var itemParticipante = null;
	
	var self = this;
	
	$.get("vistas/paseLista/general.tpl", function(plantilla){
		/*Aquí se asignan las plantillas */
		$("#modulo").html(plantilla);
		self.adminVistas("grupos");
		
		$.get("vistas/paseLista/grupo.tpl", function(html){
			self.itemGrupo = $(html);
		});
		
		$.get("vistas/paseLista/itemParticipante.tpl", function(html){
			self.itemParticipante = $(html);
		});
		
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
					for (i = 0 ; i < res.rows.length ; i++){
						$("#modulo").find("#lstParticipantes").find("[idParticipante=" + res.rows.item(i).idParticipante +"]").prop("checked", true);
					}
				});
			}, errorDB);
		});
		
		
		
		$("#winJustificaciones").on('show.bs.modal', function () {
            alert('The modal is fully shown.');
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
									tx.executeSql("insert into asistencia (fecha, idParticipante) values (?, ?)", [$("#txtFecha").val(), el.attr("idParticipante")], function(tx, res){
										//alertify.success("Asistencia registrada");
									}, function(){
										el.prop("checked", false);
										alertify.error("Error al registrar la asistencia");
									});
								});
							else
								db.transaction(function(tx){
									tx.executeSql("delete from asistencia where fecha = ? and idParticipante = ?", [$("#txtFecha").val(), el.attr("idParticipante")], function(tx, res){
										//alertify.success("Asistencia eliminada");
									}, function(){
										el.prop("checked", true);
										alertify.error("Error al eliminar el registro de asistencia");
									});
								});
						}
					});
					
					item.find("[action=justificar]").click(function(){
						var participante = $(this).attr("idParticipante");
						
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
