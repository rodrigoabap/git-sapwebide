sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("ZApp_Deep_Structure.controller.V_Detail", {

		//	**************************onInit Function**********************************
		//	************************************************************************		
		onInit: function() {

			var oModel = new JSONModel();
			this.getView().byId("packItem").setModel(oModel);

		},

		//	**************************ADD Function**********************************
		//	************************************************************************
		onAdd: function() {

			// Get the values of the header input fields
			var ComCode = this.getView().byId("inputCC").getValue();
			var Plant = this.getView().byId("inputPlant").getValue();

			if (ComCode === "" && Plant === "") {
				alert("Company Code and Plant cannot be blank");
			}

			// Get the values of the input fields.
			var mat = this.getView().byId("inMaterial").getValue();
			var bat = this.getView().byId("inBath").getValue();
			var qty = this.getView().byId("inQty").getValue();
			var uom = this.getView().byId("inUOM").getValue();

			if (mat !== "" && bat !== "" && qty !== "" && uom !== "") {
				// Push this entry into array and bind it to the table
				var itemRow = {
					Material: mat,
					Bath: bat,
					Quantity: qty,
					Unit: uom
				};

				// Get the Model for the packItem table defined in the Detail.View screen
				var oModel = this.getView().byId("packItem").getModel();
				// Get the Model Property for '/data'
				var itemData = oModel.getProperty("/data");

				// If the data is in good format
				if (typeof itemData !== "undefined" && itemData !== null && itemData.length > 0) {
					// Append the data using .push
					itemData.push(itemRow);
				} else {
					// If data is not good, add blank line
					itemData = [];
					// Append empty row
					itemData.push(itemRow);
				}

				// Set Model
				oModel.setData({
					data: itemData
				});

				// Clear the input fields.
				this.getView().byId("inMaterial").setValue("");
				this.getView().byId("inBath").setValue("");
				this.getView().byId("inQty").setValue("");
				this.getView().byId("inUOM").setValue("");

			} else {
				alert("Material/Bath/Quantity/UOM cannot be blank");
			};

		}, // End of onAdd function

		//	************************Delete Function***************************************
		//	*****************************************************************************
		onDelete: function() {
			var oTable = this.getView().byId("packItem");
			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().data;
			var aContexts = oTable.getSelectedContexts();

			// Loop backward from the Selected Rows			
			for (var i = aContexts.length - 1; i >= 0; i--) {
				// Selected Row 
				var oThisObj = aContexts[i].getObject();

				// $.map() is used for changing the values of an array.
				// Here we are trying to find the index of the selected row
				// refer - http://api.jquery.com/jquery.map/
				var index = $.map(aRows, function(obj, index) {
					if (obj === oThisObj) {
						return index;
					}
				});
				// The splice() method adds/removes items to/from an array
				// Here we are deleting the selected index row
				// https://www.w3schools.com/jsref/jsref_splice.asp
				aRows.splice(index, 1);

			}
			// Set the Model with the Updated Data
			oModel2.setData({
				data: aRows
			});
			// Reset table selection in UI5
			oTable.removeSelections(true);
		},

		//	************************Save Function***************************************
		//	*****************************************************************************
		onSave: function() {

			//Create all the records added to table via Json model
			var oTable = this.getView().byId("packItem");
			// Get the table Model
			var oModel = oTable.getModel();
			// Get Items of the Table
			var aItems = oTable.getItems();
			// Define an empty Array
			var itemData = [];

			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {
				var l_material = oModel.getProperty("Material", aItems[iRowIndex].getBindingContext());
				var l_bath = oModel.getProperty("Bath", aItems[iRowIndex].getBindingContext());
				var l_quantity = oModel.getProperty("Quantity", aItems[iRowIndex].getBindingContext());
				var l_unit = oModel.getProperty("Unit", aItems[iRowIndex].getBindingContext());

				itemData.push({
					Bath: l_bath,
					Matnr: l_material,
					Qty: l_quantity,
					Uom: l_unit,
				});
			}

			// Get the values of the header input fields
			var ComCode = this.getView().byId("inputCC").getValue();
			var Plant = this.getView().byId("inputPlant").getValue();

			// Create one emtpy Object
			var oEntry1 = {};

			oEntry1.Bukrs = ComCode;
			oEntry1.Werks = Plant;

			//Using Deep entity the data is posted as shown below .

			// Link Pack items to the Pack header
			// Very very Important. Here the name should be exactly like the Entity Set at Backend OData
			// Stack_HU_Pack_MatSet is the same name at back end
			oEntry1.Stack_HU_Pack_MatSet = itemData;

			// Some have issue and use "proxy" like below
			// var oModel1 = new sap.ui.model.odata.ODataModel("proxy/http/mdt2ds05.corp.xxxxxonic.com:8000/sap/opu/odata/sap/ZHUPACK_HUSTO_SRV");
			// Success Model
			// var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHUPACK_HUSTO_SRV/");			
			// But, we were able to use the Service directly
			var oModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZITEM_PACK_SRV/");

			this.getView().setModel(oModel1);

			oModel1.setHeaders({
				"X-Requested-With": "X"
			});

			oModel1.create("/Stack_HU_HeadSet", oEntry1, {
				success: function(oData, oResponse) {
					alert("The backend SAP System is Connected Successfully");

					// var successObj = oResponse.data.lr_head_item_response;
					// var message = "Batch : " + successObj + "  " + "updated successfully";
					// var message = "Batch : " + successObj + "  " + "updated successfully";

					var succFailBlank = oResponse.data.Bukrs;	// Success Failure Blank flag sent from BackEnd
					var message;
					// Success
					if (succFailBlank === "S") {
						message = "Database Tables updated Successfully";
					}
					// Failure
					if (succFailBlank === "F") {
						message = "Database Tables were not Updated";
					}
					// Blank
					if (succFailBlank === "B") {
						message = "Blank Table(s) were sent. Nothing Updated";
					}

					jQuery.sap.require("sap.m.MessageBox");

					sap.m.MessageBox.show(message, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Backend Table(s) Update Status",
						actions: [sap.m.MessageBox.Action.OK]
					});

				},

				error: function(oError) {
					alert("Failure - OData Service could not be called. Please check the Network Tab at Debug.");
				}
			});
		}

	});
});