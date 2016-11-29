<div view="eventos">
	<div class="page-header">
		<h1>Lista de eventos</h1>
	</div>
	<div class="list-group"></div>
</div>

<div view="grupos">
	<div class="page-header">
		<h1>Grupos de evento</h1>
		<small campo="nombreEvento"></small>
	</div>
	<form class="form-horizontal" id="frmFiltro">
		<div class="input-group">
			<span class="input-group-addon">
				<i class="fa fa-search" aria-hidden="true"></i>
			</span>
			<input id="txtFiltro" placeholder="Buscar" class="form-control" />
		</div>
	</form>

	<div class="list-group"></div>
	
	<a href="#" action="show" vista="eventos" class="botonPie">
		<span class="fa-stack fa-2x in">
			<i class="fa fa-circle fa-stack-2x"></i>
			<i class="fa fa-arrow-left fa-stack-1x fa-inverse"></i>
		</span>
	</a>
</div>