<div view="grupos">
	<div class="list-group"></div>
</div>

<div view="listas">
	<div class="row page-header fixed">
		<br />
		<div class="col-xs-6" id="setCalendar">
			<div class="input-group">
				<span class="input-group-addon">
					<i class="fa fa-calendar" aria-hidden="true"></i>
				</span>
				<input type="text" class="form-control" value="" id="txtFecha" readonly="true"/>
			</div>
		</div>
		<div class="col-xs-6" id="finder">
			<form class="form-horizontal" id="frmFiltro" onsubmit="javascript: return false">
				<div class="input-group">
					<span class="input-group-addon">
						<i class="fa fa-search" aria-hidden="true"></i>
					</span>
					<input id="txtFiltro" placeholder="Buscar" class="form-control" />
				</div>
			</form>
		</div>
		<br />
		<br />
	</div>
	<br /><br /><br /><br />
	<div class="row" id="lstParticipantes"></div>
	<br /><br /><br /><br />
	<a href="#" action="show" vista="grupos" class="botonPie">
		<span class="fa-stack fa-2x in">
			<i class="fa fa-circle fa-stack-2x"></i>
			<i class="fa fa-arrow-left fa-stack-1x fa-inverse"></i>
		</span>
	</a>
	<a href="#" class="botonPie" style="right: 80px" data-toggle="modal" data-target="#winAddParticipante">
		<span class="fa-stack fa-2x in">
			<i class="fa fa-circle fa-stack-2x"></i>
			<i class="fa fa-plus fa-stack-1x fa-inverse"></i>
		</span>
	</a>
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
						<label for="txtFechaJustificacion" class="label-control col-xs-4">Fecha:</label>
						<div class="col-xs-6">
							<input type="text" class="form-control input-sm" id="txtFechaJustificacion" readonly="true">
						</div>
					</div>
					
					<div class="form-group row">
						<label for="txtMotivo" class="label-control col-xs-4">Motivo:</label>
						<div class="col-xs-8">
							<textarea id="txtMotivo" class="form-control"></textarea>
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

<div class="modal fade" id="winAddParticipante">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Agregar participante</h4>
			</div>
			<div class="modal-body">
				<div class="alert alert-danger">
					Mediante el presente el trabajador quedará registrado en el presente grupo, sin embargo, para ser válido este debe de ser aprobado por el departamento de docencia mediante el sistema "Inscripciones del IEBO". Recuerda notificarlo antes de entregar tu información
				</div>
				
				<div class="form-group row">
					<label for="txtNombre" class="label-control col-xs-4">Nombre:</label>
					<div class="col-xs-8">
						<input type="text" class="form-control input-sm" id="txtNombre">
					</div>
				</div>
				<div class="form-group row">
					<label for="txtCURP" class="label-control col-xs-4">CURP:</label>
					<div class="col-xs-6">
						<input type="text" class="form-control input-sm" id="txtCURP">
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" id="btnAgregarGuardar">Guardar</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div>

<input id="actionAux" type="hidden" />

<div class="modal fade" id="winResultExportacion">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Resultado de la exportación</h4>
			</div>
			<div class="modal-body">
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div>
