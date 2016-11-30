TPaseLista = function(){
	var itemGrupo = null;
	
	var self = this;
	
	$.get("vistas/paseLista/general.tpl", function(plantilla){
		/*Aquí se asignan las plantillas */
		$("#modulo").html(plantilla);
		self.adminVistas("grupos");
		
		$.get("vistas/paseLista/grupo.tpl", function(html){
			self.itemGrupo = $(html);
		});
		$("#txtFecha").datepicker();
		//$("#txtFecha").datepicker("option", "altFormat", "yyyy-mm-dd");
		var fecha = new Date();
		var dia = fecha.getDay() < 10?("0" + fecha.getDay()):fecha.getDay();
		var mes = fecha.getMonth() < 10?("0" + fecha.getMonth()):fecha.getMonth();
		
		//$("#txtFecha").datepicker("setDate", mes + '/' + dia + '/' + fecha.getFullYear());
		//$("#txtFecha").datepicker("setDate", fecha.getFullYear() + '-' + mes + '-' + dia);
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
					
					item.click(function(){
						self.adminVistas("listas");
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
