<div class="media">
	<div class="media-left">
		<a href="#">
			<img class="media-object" src="img/participante.jpg" alt="Participante" campo="fotografia">
		</a>
	</div>
	<div class="media-body">
		<h4 class="media-heading" campo="nombre"></h4>
		<p>
			<b>Plantel: </b><span campo="nombrePlantel" /> <br />
			<b>Plaza: </b><span campo="plaza" /><br />
			<b>Especialidad: </b><span campo="especialidad" /><br />
			<b>CURP: </b><span campo="curp" /><br />
		</p>
		<div class="row">
			<div class="col-xs-4">
				<span class="checkbox">
				<a href="#" class="btn btn-danger" action="justificar" style="display: none">Justificación</a>
				</span>
			</div>
			<div class="col-xs-4 text-center">
				<span class="checkbox btn btn-warning">
					<label><input type="checkbox" value="1" idParticipante="">Retardo</label>  
				</span>
			</div>
			<div class="col-xs-4 pull-right text-right">
				<div class="col-xs-9 col-xs-offset-1">
					<input type="number" class="calificacion form-control text-right">
				</div>
				<span class="checkbox btn btn-success">
					<label><input type="checkbox" value="0" idParticipante="">Asistió</label>  
				</span>
			</div>
		</div>
	</div>
</div>