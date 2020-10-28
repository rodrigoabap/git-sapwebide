/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"namespace/ADD_PACK_E_EXCLUIR_LINHA/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});