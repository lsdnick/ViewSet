// ViewSet 0.5
// Lamma Studio Design
// 17-5-2021

#targetengine "session";
setPrefs();
setView();

function setView() {
	try {
//
// Clear away any old event listeners so we can reinstall them
//
		app.eventListeners.everyItem().remove();
		app.addEventListener(Document.AFTER_OPEN, afterOpenHandler);
//
// Handle the active document if there is one
//
		if (
			app.documents.length > 0 &&
			app.activeDocument &&
			app.activeDocument instanceof Document
		) {
			afterOpenHandler({
				target: app.activeDocument,
				eventType: Document.AFTER_OPEN
			});
			};
	} catch (err) {
		alert ("MainRoutine Error: " + [err,err.line]);
	};
};

function afterOpenHandler(evt) {
	try {
		if ((app.documents.item(0).windows.length < 2) && (app.documents.item(0).windows.length > 0)) {
			var savedSettings = eval(app.extractLabel("lsd_vs_usersettings"));
//			alert ("savedSettings: " + savedSettings);
			var doc = app.documents.item(0);
// Set Window to Galley
			app.documents.item(0).windows.item(0).viewTab = ViewTabs.GALLEY_VIEW;
// Open a new window
			app.documents.item(0).windows.add();
// Set it to Layout and fit it to page
			app.documents.item(0).windows.item(0).viewTab = ViewTabs.LAYOUT_VIEW;
			app.documents.item(0).windows.item(0).zoom = ZoomOptions.ACTUAL_SIZE;
// Tile the windows
			app.tileWindows(HorizontalOrVertical.HORIZONTAL);
//Switch on/off the guides
//Dialog choice or settings file to go here
			doc.gridPreferences.documentGridShown = savedSettings[0];
			doc.gridPreferences.baselineGridShown = savedSettings[1];
			doc.guidePreferences.guidesShown = savedSettings[2];
			doc.viewPreferences.showFrameEdges = savedSettings[3];
			doc.viewPreferences.showRulers = savedSettings[4];
			app.textPreferences.showInvisibles = savedSettings[5];
// subs need the notes so leave on
			doc.viewPreferences.showNotes = savedSettings[6];
// Code to do auto checkout
            app.activeDocument.stories.everyItem().checkOut();
		} else {
			return;
		};
	} catch (err) {
		alert ("EventHandler Error: " + [err,err.line]);
	};
};

function setPrefs() {
	try {
		var savedSettings = eval(app.extractLabel("lsd_vs_usersettings"));
//		alert ("savedSettings: " + savedSettings);
		if (savedSettings === undefined) {
///////////////////////////////////////////////////////////////////
///////////// Dialogue to ask you what you want to do /////////////
///////////////////////////////////////////////////////////////////
			var dlgAd = app.dialogs.add({name:"Preferences"});
			var dlcAd  = dlgAd.dialogColumns.add();

//////////////////////// Line type section ////////////////////////
			var bpnAd = dlcAd.borderPanels.add();
			bpnAd.staticTexts.add({staticLabel:"Show: "});

//////////////////// Line type radiobuttonGroup ///////////////////
			var docugd = bpnAd.checkboxControls.add({staticLabel:"DocumentGrid", checkedState:false});
			var basegd = bpnAd.checkboxControls.add({staticLabel:"BaselineGrid", checkedState:false});
			var guides = bpnAd.checkboxControls.add({staticLabel:"Guides", checkedState:false});
			var frames = bpnAd.checkboxControls.add({staticLabel:"FrameEdges", checkedState:false});
    	    var rulers = bpnAd.checkboxControls.add({staticLabel:"Rulers", checkedState:false});
			var invisi = bpnAd.checkboxControls.add({staticLabel:"Invisibles", checkedState:false});
        	var noters = bpnAd.checkboxControls.add({staticLabel:"Notes", checkedState:false});

///////////// Display dialog and capture user choices /////////////
			blnResult = dlgAd.show();
			if (blnResult == false){
				alert("Operation cancelled by user.");
				exit();
			} else {
				var docgd = docugd.checkedState;
				var basgd = basegd.checkedState;
				var guide = guides.checkedState;
				var frame = frames.checkedState;
				var ruler = rulers.checkedState;
				var invis = invisi.checkedState;
				var notes = noters.checkedState;
				var savedSettings = [docgd, basgd, guide, frame, ruler, invis, notes];
			};
			dlgAd.destroy();
            app.insertLabel("lsd_vs_usersettings", savedSettings.toSource());
		};
	} catch (err) {
		alert ("setPrefs Error: " + [err,err.line]);
	};
};
