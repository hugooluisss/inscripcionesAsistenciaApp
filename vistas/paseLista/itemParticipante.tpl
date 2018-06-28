<div class="media">
	<div class="media-left">
		<a href="#">
			<img class="media-object img-circle" src="img/participante.jpg" alt="Participante" campo="fotografia" data-toggle="modal" data-target="#winDetalleTrabajador">
		</a>
	</div>
	<div class="media-body">
		<h5 class="media-heading" campo="nombre"></h5>
		<p>
			<b>Plantel: </b><span campo="nombrePlantel" /> <br />
		</p>
		<a href="#" class="btn btn-danger btn-xs" action="justificar" style="display: none">Justificación</a>
		
		<span class="checkbox btn btn-success btn-xs">
			<label><input type="checkbox" value="0" idParticipante="">Asistió</label>  
		</span>
		<span class="checkbox btn btn-warning btn-xs">
			<label><input type="checkbox" value="1" idParticipante="">Retardo</label>  
		</span>
		
		<div class="text-right">
			<input type="number" class="calificacion text-right input-xs">
		</div>
		
		<!--
		<p>
			<b>Plantel: </b><span campo="nombrePlantel" /> <br />
			<b>Plaza: </b><span campo="plaza" /><br />
			<b>Especialidad: </b><span campo="especialidad" /><br />
			<b>CURP: </b><span campo="curp" /><br />
		</p>
		-->
	</div>
</div>
<hr />