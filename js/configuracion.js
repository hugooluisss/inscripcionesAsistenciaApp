TConfiguracion = function(){
	var self = this;
	
	this.getPlantilla = function(){
		$.get("vistas/configuracion/panel.tpl", function(plantilla){
			/*Aquí se asignan las plantillas */
			$("#modulo").html(plantilla);
			
			$("#resetBD").click(function(){
				alertify.confirm("¿Estas seguro de querer borrar todos los datos registrados?", function (e) {
					if (e) {
						crearBD(db, true);
						alertify.success("Base de datos limpia");
					}
				});
			});
		});
	};
};