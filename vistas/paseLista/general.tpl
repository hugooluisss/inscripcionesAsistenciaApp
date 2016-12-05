<div view="grupos">
	<div class="page-header">
		<h1>Grupos disponibles</h1>
	</div>
	<div class="list-group"></div>
</div>

<div view="listas">
	<div class="row page-header">
		<h1>Pase de lista</h1>
		<div class="col-xs-5 text-right">
			<b>Fecha</b>
		</div>
		<div class="col-xs-5">
			<input type="text" class="form-control" value="" id="txtFecha" readonly="true"/>
		</div>
	</div>
	<br />
	<br />
	<div class="row" id="lstParticipantes">
	</div>
</div>

<input type="hidden" value="" id="grupo" />


<div class="modal fade" id="winJustificaciones">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Justificaciones</h4>
			</div>
			<div class="modal-body">
					<div class="form-group row">
						<div class="col-xs-6 text-center" id="getFoto">
							<span class="fa-stack fa-3x">
								<i class="fa fa-square fa-stack-2x"></i>
								<i class="fa fa-camera fa-stack-1x fa-inverse"></i>
							</span>
						</div>
						<div class="col-xs-6" id="vistaPrevia"></div>
					</div>
					
					<div class="form-group row">
						<label for="txtFecha" class="label-control col-xs-4">Fecha:</label>
						<div class="col-xs-4">
							<input type="email" class="form-control" id="txtFechaJustificacion" readonly="true">
						</div>
					</div>
					
					<div class="form-group row">
						<label for="txtFecha" class="label-control col-xs-4">Motivo:</label>
						<div class="col-xs-8">
							<textarea id="txtDescripcion" class="form-control"></textarea>
						</div>
					</div>
					
					
					<input type="hidden" id="participante" value="" />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" id="btnGuardar">Guardar</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div>