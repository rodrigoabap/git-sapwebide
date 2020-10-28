/*global QUnit*/

sap.ui.define([
	"namespace/ADD_PACK_E_EXCLUIR_LINHA/controller/V_Detail.controller"
], function (Controller) {
	"use strict";

	QUnit.module("V_Detail Controller");

	QUnit.test("I should test the V_Detail controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});