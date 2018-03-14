/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var server = "http://www.iebo.edu.mx/interno/inscripciones/";
var server = "http://187.157.111.26/interno/inscripciones/";
//var server = "http://172.10.22.5/inscripcionesBootstrap/";
var db = null;

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		//Esto es para web
		try{
			//db = openDatabase({name: "inter.db"});
			db = window.sqlitePlugin.openDatabase({name: 'intersem.db', location: 1, androidDatabaseImplementation: 2});
			console.log("Conexión desde phonegap OK");
			crearBD(db, false);
		}catch(err){
			console.log("No se pudo crear la base de datos");
			db = window.openDatabase("intersem.db", "1.0", "Just a Dummy DB", 200000);
			crearBD(db, false);
			console.log("Se inicio la conexión a la base para web");
		}
		
		$("[action=acercaDe]").click(function(){
			$("#acercaDe").modal();
		});
		
		$("#acercaDe").on('show.bs.modal', function(){
			reposition($("#acercaDe"));
		});
		
		$("[action=viewGrupos]").click(function(){
			clickMenu();
			var plantilla = new TEvento;
			plantilla.getEventos();
			
			$(".page-tittle").html("Importar grupos");
		});
		
		$("[action=viewPaseLista]").click(function(){
			clickMenu();
			var plantilla = new TPaseLista;
			
			$(".page-tittle").html("Administración de grupos");
		});
		
		$("[action=viewConfiguracion]").click(function(){
			clickMenu();
			var plantilla = new TConfiguracion;
			
			plantilla.getPlantilla();
		});
	}
};

function clickMenu(){
	$("#menuPrincipal").removeClass("in");
}

$(document).ready(function(){
	//app.onDeviceReady();
	
	$.ajaxSetup({
		error: function( jqXHR, textStatus, errorThrown ) {
			alertify.error("No se pudo establecer conexión con el servidor, verifica tu conexión a internet");
			
			$("#over").css("display", 'none');
			$("#fade").css("display", 'none');
		}
	});

});

app.initialize();