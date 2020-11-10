/*!
 * VisualEditor UserInterface MWWavedromDialog class.
 *
 * @copyright 2011-2015 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */
/**
 * Dialog for editing MW maps.
 *
 * @class
 * @extends ve.ui.MWExtensionDialog
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
ve.ui.MWWavedromDialog = function VeUiMWWavedromDialog() {
	// Parent constructor
	ve.ui.MWWavedromDialog.super.apply( this, arguments );

	this.updateGeoJson = $.debounce( 300, $.proxy( this.updateGeoJson, this ) );
	this.resetMapPosition = $.debounce( 300, $.proxy( this.resetMapPosition, this ) );
};

/* Inheritance */

OO.inheritClass( ve.ui.MWWavedromDialog, ve.ui.MWExtensionDialog );

/* Static Properties */

ve.ui.MWWavedromDialog.static.name = 'mwWavedrom';

ve.ui.MWWavedromDialog.static.title = OO.ui.deferMsg( 'visualeditor-mwwavedromdialog-title' );

ve.ui.MWWavedromDialog.static.size = 'larger';

ve.ui.MWWavedromDialog.static.allowedEmpty = true;

ve.ui.MWWavedromDialog.static.modelClasses = [ ve.dm.MWWavedromNode, ve.dm.MWWavedromInlineNode ];
//ve.ui.MWWavedromDialog.static.modelClasses = [ ve.dm.MWWavedromNode ];

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.MWWavedromDialog.prototype.initialize = function () {
	var panel,
		positionPopupButton,
		$currentPositionTable;

	// Parent method
	ve.ui.MWWavedromDialog.super.prototype.initialize.call( this );


		var panel2 = $( '<div>' ).addClass( 've-ui-mwWavedromDialog-waveWidget' );
		panel2.css( {'border':'1px solid black', 'border-radius': '5px'});

/*
		$( '<div>' );
		panel2.css( { height: '80%', /* LMP-FIXME height * / width: '80%', overflow:'auto' } );
		$( '<div>' ).addClass( 've-ui-mwWavedromDialog-waveWidget' ).appendTo( panel2 );
*/
/*
		 new OO.ui.PanelLayout( {
			align: 'right',
			label: ve.msg( 'visualeditor-mwwavedromdialog-size' ),

		    expanded: false,
		    framed: true,
		    padded: true,
				scrollable: true,
		    $content: $( '<div>' ).addClass( 've-ui-mwWavedromDialog-waveWidget' )
		} );
*/

	// this.$mapContainer = $( '<div>' ).addClass( 've-ui-mwWavedromDialog-waveWidget' );
	this.$mapContainer = $( '<div>' ).addClass( 've-ui-mwWavedromDialog-waveContainer');
	this.$mapContainer.appendTo( panel2 );

	// LMP-FIXME:  Fill in the waveform stuff here, then process via Wavedrom.process-all
	this.$wavedromdiv=$( '<script type=WaveDrom id="InputJSON_9999">' ).appendTo( this.$mapContainer );
	// this.$wavedromdiv.text('{ signal: [ { name: "clk",  wave: "p......" }, { name: "bus",  wave: "x.34.5x",   data: "head body tail" },  { name: "wire", wave: "0.1..0." },]}');
	// this.$wavedromdiv.text( this.selectedNode && this.selectedNode.getAttribute( 'mw' )) ;

	this.$wavedromdiv.text( '' ) ;

	this.$map = $( '<div id=WaveDrom_Display_9999>' ).appendTo( this.$mapContainer );

	this.map = null;
	this.scalable = null;
	this.updatingGeoJson = false;

	this.dimensions = new ve.ui.DimensionsWidget();

	this.align = new ve.ui.AlignWidget( {
		dir: this.getDir()
	} );

	this.input = new ve.ui.MWAceEditorWidget( {
		autosize: true,
		maxRows: 10,
		classes: [ 've-ui-mwWavedromDialog-waveJSONWidget' ]
	} )
		.setLanguage( 'json' )
		.toggleLineNumbers( false )
		.setDir( 'ltr' );

	this.resetMapButton = new OO.ui.ButtonWidget( {
		label: ve.msg( 'visualeditor-mwwavedromdialog-reset-map' )
	} );

	panel = new OO.ui.PanelLayout( {
		padded: true,
		expanded: false
	} );

	this.dimensionsField = new OO.ui.FieldLayout( this.dimensions, {
		align: 'right',
		label: ve.msg( 'visualeditor-mwwavedromdialog-size' )
	} );

	this.alignField = new OO.ui.FieldLayout( this.align, {
		align: 'right',
		label: ve.msg( 'visualeditor-mwwavedromdialog-align' )
	} );


	/* LMP START */
	this.alignCheckbox = new OO.ui.CheckboxInputWidget();
	this.alignCheckboxField = new OO.ui.FieldLayout( this.alignCheckbox, {
	        $overlay: this.$overlay,
	        align: 'right',
	        label: ve.msg( 'visualeditor-dialog-media-position-checkbox' ),
	        help: ve.msg( 'visualeditor-dialog-media-position-checkbox-help' )
	} );
	this.alignFieldset = new OO.ui.FieldsetLayout( {
	        $overlay: this.$overlay,
	        label: ve.msg( 'visualeditor-dialog-media-position-section' ),
	        help: ve.msg( 'visualeditor-dialog-media-position-section-help' ),
	        icon: 'parameter'
	} );

	// Build position fieldset
	this.alignFieldset.$element.append(
	        this.alignCheckboxField.$element,
	        this.alignField.$element
	);
	/* LMP END */


    // Wavedrom Style selection input
        this.typeFieldset = new OO.ui.FieldsetLayout( {
            $overlay: this.$overlay,
            label: ve.msg( 'visualeditor-mwwavedrom-style-title' ),
	    help: ve.msg( 'visualeditor-mwwavedrom-style-title-help' ),
            icon: 'parameter'
        } );
    

        this.typeSelectDropdown = new OO.ui.DropdownWidget( { $overlay: this.$overlay } );
        this.typeSelect = this.typeSelectDropdown.getMenu();
        this.typeSelect.addItems( [
                // TODO: Inline images require a bit of further work, will be coming soon
                new OO.ui.MenuOptionWidget( {
                        data: 'thumb',
                        icon: 'image-thumbnail',
                        label: ve.msg( 'visualeditor-mwwavedrom-pulldownA' )
                } ),
                new OO.ui.MenuOptionWidget( {
                        data: 'frameless',
                        icon: 'image-frameless',
                        label: ve.msg( 'visualeditor-mwwavedrom-pulldownB' )
                } ),
                new OO.ui.MenuOptionWidget( {
                        data: 'frame',
                        icon: 'image-frame',
                        label: ve.msg( 'visualeditor-mwwavedrom-pulldownC' )
                } )
        ] );

    // Build type fieldset
        this.typeFieldset.$element.append(
                this.typeSelectDropdown.$element
        );

    // FIXME> Select the correct pulldown for the style, or select the "default"
    // this.typeSelect.selectItemByData( this.imageModel.getType() || 'none' );

	this.$mapPositionContainer = $( '<div>' ).addClass( 've-ui-mwMapsDialog-position' );

	this.geoJsonField = new OO.ui.FieldLayout( this.input, {
		align: 'top',
		label: ve.msg( 'visualeditor-mwwavedromdialog-wavejson' )
	} );

	panel.$element.append(
		this.dimensionsField.$element,
		this.alignFieldset.$element,
//		this.alignField.$element,
//		this.$mapContainer,
	   panel2,
//		this.$mapPositionContainer.append( this.typeSelectDropdown.$element, this.resetMapButton.$element ),
		this.$mapPositionContainer.append( this.typeFieldset.$element, this.resetMapButton.$element ),
		this.geoJsonField.$element
	);
	this.$body.append( panel.$element );

	// LMP-FIXME: Do this via the updte/resize boxes
	//WaveDrom.ProcessAll();
	//WaveDrom.RenderWaveForm(9999, WaveDrom.eva('InputJSON_9999'), 'WaveDrom_Display_');
};

/**
 * Handle change events on the dimensions widget
 *
 * @param {string} newValue
 */
ve.ui.MWWavedromDialog.prototype.onDimensionsChange = function () {
	var dimensions, center;

	dimensions = this.dimensions.getDimensions();
	// this.scalable.getBoundedDimensions(	this.dimensions.getDimensions()	);

	// center = this.map && this.map.getCenter();
	center = null ;

	// Set container width for centering
//	this.$mapContainer.css( { height: 300, /* LMP-FIXME height */ width: dimensions.width } );
//	this.$mapContainer.css( { height: 400, /* LMP-FIXME height */ width: 600 } );
//	this.$mapContainer.css( { height: '80%', /* LMP-FIXME height */ width: '80%' } );
	this.$map.css( dimensions );
	this.updateSize();

/*
	if ( center ) {
		this.map.setView( center, this.map.getZoom() );
	}
*/

//	WaveDrom.ProcessAll(); // LMP-FIXME
WaveDrom.RenderWaveForm(9999, WaveDrom.eva('InputJSON_9999'), 'WaveDrom_Display_');

	// this.map.invalidateSize();
	this.updateActions();
};

/**
 * Reset the map's position
 */
ve.ui.MWWavedromDialog.prototype.resetMapPosition = function () {
	var position,
		dialog = this;

	if ( !this.map ) {
		return;
	}

	position = this.getInitialMapPosition();
	this.map.setView( position.center, position.zoom );

	this.updateActions();
	this.resetMapButton.setDisabled( true );

	this.map.once( 'moveend', function () {
		dialog.resetMapButton.setDisabled( false );
	} );
};

/**
 * Update action states
 */
ve.ui.MWWavedromDialog.prototype.updateActions = function () {
	var newMwData, modified,
		mwData = this.selectedNode && this.selectedNode.getAttribute( 'mw' );

	if ( mwData ) {
		newMwData = ve.copy( mwData );
		this.updateMwData( newMwData );
		modified = !ve.compare( mwData, newMwData );
	} else {
		modified = true;
	}

	// Did the align buttons get changed?
	/*
	if( this.align.getSelectedItem().getData() )
	{

	}
	*/

	this.actions.setAbilities( { done: modified } );
};

/**
 * @inheritdoc ve.ui.MWExtensionWindow
 */
ve.ui.MWWavedromDialog.prototype.insertOrUpdateNode = function () {
	// Parent method
	ve.ui.MWWavedromDialog.super.prototype.insertOrUpdateNode.apply( this, arguments );

	// Update scalable
	this.scalable.setCurrentDimensions(
		this.scalable.getBoundedDimensions(
			this.dimensions.getDimensions()
		)
	);
};

/**
 * @inheritdoc ve.ui.MWExtensionWindow
 */
ve.ui.MWWavedromDialog.prototype.updateMwData = function ( mwData ) {
	var center, scaled, latitude, longitude, zoom,
		dimensions = // this.scalable.getBoundedDimensions(
			this.dimensions.getDimensions()
		;//);

	// Parent method
	ve.ui.MWWavedromDialog.super.prototype.updateMwData.call( this, mwData );

/*
	if ( this.map ) {
		center = this.map.getCenter();
		zoom = this.map.getZoom();
		scaled = this.map.getScaleLatLng( center.lat, center.lng, zoom );
		latitude = scaled[ 0 ];
		longitude = scaled[ 1 ];
	} else {
		// Map not loaded in insert, can't insert
		//return;
	}
*/

	// mwData.attrs.latitude = latitude.toString();
	// mwData.attrs.longitude = longitude.toString();
	// mwData.attrs.zoom = zoom.toString();

	var currentModelAlignment = mwData.attrs.align;
	// this.alignCheckbox.setSelected( alignment !== 'none' );
	var isSelected = this.alignCheckbox.isSelected() ;

	// LMP: Disable alignment selection if "wrap text" is not selected
	this.align.setDisabled( !isSelected );

	if ( !( this.selectedNode instanceof ve.dm.MWWavedromInlineNode ) ) {
		mwData.attrs.width = dimensions.width.toString();
		mwData.attrs.height = dimensions.height.toString();

	    if( isSelected ) {
		// LMP: Case of just freshly un-selecting the wrap button, this is null - default to left
		//			var selected=this.align.getSelectedItem();
		var selected=this.align.findSelectedItem();
		if( selected === null ) selected=this.align.selectItemByData( 'left' );
		
		mwData.attrs.align = selected.getData();
	    }
	    else
	    {
		mwData.attrs.align = 'none' ;
	    }
	}
};

/**
 * @inheritdoc
 */
ve.ui.MWWavedromDialog.prototype.getReadyProcess = function ( data ) {

	// https://www.mediawiki.org/wiki/OOUI/Windows
	// https://www.mediawiki.org/wiki/OOUI/Windows/Process_Dialogs
	this.$wavedromdiv.text( this.input.getValue() ) ;

	return ve.ui.MWWavedromDialog.super.prototype.getReadyProcess.call( this, data )
		.next( function () {
			this.setupWavedromRender();
		}, this );
};

/**
 * @inheritdoc
 */
ve.ui.MWWavedromDialog.prototype.getSetupProcess = function ( data ) {
	data = data || {};
	return ve.ui.MWWavedromDialog.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
			var inline = this.selectedNode instanceof ve.dm.MWWavedromInlineNode,
				mwAttrs = this.selectedNode && this.selectedNode.getAttribute( 'mw' ).attrs || {};

			this.input.clearUndoStack();

			this.actions.setMode( this.selectedNode ? 'edit' : 'insert' );

			if ( this.selectedNode && !inline ) {
				//this.scalable = this.selectedNode.getScalable();

				var scalable = new ve.dm.Scalable( {
					// LMP-FIXME: For now fix it so that we have fixed aspect ratiop
					fixedRatio: false,

					currentDimensions: {
						width: (this.selectedNode.getElement()).attributes.width,
						height: (this.selectedNode.getElement()).attributes.height
					},
					minDimensions: {
						width: 200,
						height: 100
					},
					maxDimensions: {
						width: 1000,
						height: 1000
					}
				} );
				this.scalable = scalable ;

			} else {
				this.scalable = ve.dm.MWWavedromNode.static.createScalable(
					{ width: 850, height: 400 }
//					inline ? { width: 850, height: 400 } : { width: 400, height: 300 }
				);
			}

			// Events
			this.input.connect( this, {
				change: 'updateGeoJson',
				resize: 'updateSize'
			} );
			this.dimensions.connect( this, {
				widthChange: 'onDimensionsChange',
				heightChange: 'onDimensionsChange'
			} );
			this.align.connect( this, { choose: 'updateActions' } );
			this.alignCheckbox.connect( this, { change: 'updateActions' } );

			this.resetMapButton.connect( this, { click: 'resetMapPosition' } );

			this.dimensionsField.toggle( !inline );

			this.alignField.toggle( !inline );

			// TODO: Support block/inline conversion
			this.align.selectItemByData( mwAttrs.align || 'right' );

			this.resetMapButton.$element.toggle( !!this.selectedNode );

			this.dimensions.setDimensions( this.scalable.getCurrentDimensions() );

			this.updateActions();
		}, this );
};

/**
 * Setup the map control
 */
ve.ui.MWWavedromDialog.prototype.setupWavedromRender = function () {
	var dialog = this;

	//	WaveDrom.ProcessAll(); // LMP-FIXME
	WaveDrom.RenderWaveForm(9999, WaveDrom.eva('InputJSON_9999'), 'WaveDrom_Display_');

	if ( this.map ) {
		return;
	}
/*
	mw.loader.using( 'ext.kartographer.editor' ).then( function () {
		var geoJsonLayer,
			defaultShapeOptions = { shapeOptions: L.mapbox.simplestyle.style( {} ) },
			mapPosition = dialog.getInitialMapPosition();

		// TODO: Support 'style' editing
		dialog.map = mw.loader.require( 'ext.kartographer.box' ).map( {
			container: dialog.$map[ 0 ],
			center: mapPosition.center,
			zoom: mapPosition.zoom,
			alwaysInteractive: true
		} );

		dialog.map.doWhenReady( function () {

			dialog.updateGeoJson();
			dialog.onDimensionsChange();
			// Wait for dialog to resize as this triggers map move events
			setTimeout( function () {
				dialog.resetMapPosition();
			}, OO.ui.theme.getDialogTransitionDuration() );

			// if geojson and no center, we need the map to automatically
			// position itself when the feature layer is added.
			if (
				dialog.input.getValue() &&
				( !mapPosition.center || isNaN( mapPosition.center[ 0 ] ) || isNaN( mapPosition.center[ 1 ] ) )
			) {
				dialog.map.on( 'layeradd', function () {
					dialog.map.setView( null, mapPosition.zoom );
					dialog.updateActions();
				} );
			}

			geoJsonLayer = mw.loader.require( 'ext.kartographer.editing' )
				.getKartographerLayer( dialog.map );
			new L.Control.Draw( {
				edit: { featureGroup: geoJsonLayer },
				draw: {
					circle: false,
					// TODO: Determine metric preference from locale information
					polyline: defaultShapeOptions,
					polygon: defaultShapeOptions,
					rectangle: defaultShapeOptions,
					marker: { icon: L.mapbox.marker.icon( {} ) }
				}
			} ).addTo( dialog.map );

			function update() {
				// Prevent circular update of map
				dialog.updatingGeoJson = true;
				try {
					// dialog.input.setValue( JSON.stringify( geoJsonLayer.toGeoJSON(), null, '  ' ) );
				} finally {
					dialog.updatingGeoJson = false;
				}
				dialog.updateActions();
			}

			function created( e ) {
				e.layer.addTo( geoJsonLayer );
				update();
			}

			function updatePositionContainer() {
				var position = dialog.map.getMapPosition(),
					scaled = dialog.map.getScaleLatLng( position.center.lat, position.center.lng, position.zoom );
				dialog.$currentPositionLatField.text( scaled[ 0 ] );
				dialog.$currentPositionLonField.text( scaled[ 1 ] );
				dialog.$currentPositionZoomField.text( position.zoom );
			}

			function onMapMove() {
				dialog.updateActions();
				updatePositionContainer();
			}

			dialog.map
				.on( 'draw:edited', update )
				.on( 'draw:deleted', update )
				.on( 'draw:created', created )
				.on( 'moveend', onMapMove );

		} );
	} );
	*/
};

/**
 * Get the initial map position (coordinates and zoom level)
 *
 * @return {Object} Object containing latitude, longitude and zoom
 */
ve.ui.MWWavedromDialog.prototype.getInitialMapPosition = function () {
	var latitude, longitude, zoom,
		pageCoords = mw.config.get( 'wgCoordinates' ),
		mwData = this.selectedNode && this.selectedNode.getAttribute( 'mw' ),
		mwAttrs = mwData && mwData.attrs;

	if ( mwAttrs && mwAttrs.zoom ) {
		latitude = +mwAttrs.latitude;
		longitude = +mwAttrs.longitude;
		zoom = +mwAttrs.zoom;
	} else if ( pageCoords ) {
		// Use page coordinates if Extension:GeoData is available
		latitude = pageCoords.lat;
		longitude = pageCoords.lon;
		zoom = 5;
	} else if ( !mwAttrs || !mwAttrs.extsrc ) {
		latitude = 30;
		longitude = 0;
		zoom = 2;
	}

	return {
		center: [ latitude, longitude ],
		zoom: zoom
	};
};

/**
 * Update the GeoJSON layer from the current input state
 */
ve.ui.MWWavedromDialog.prototype.updateGeoJson = function () {
	var self = this;



	if ( /* !this.map || */ this.updatingGeoJson ) {
		return;
	}

	this.$wavedromdiv.text( this.input.getValue() ) ;

	// WaveDrom.ProcessAll(); // LMP-FIXME
	WaveDrom.RenderWaveForm(9999, WaveDrom.eva('InputJSON_9999'), 'WaveDrom_Display_');


/*
	mw.loader.require( 'ext.kartographer.editing' )
		.updateKartographerLayer( this.map, this.input.getValue() )
		.done( function () {
			self.input.setValidityFlag( true );
		} )
		.fail( function () {
			self.input.setValidityFlag( false );
		} )
		.always( function () {
			self.updateActions();
		} );
*/
};

/**
 * @inheritdoc
 */
ve.ui.MWWavedromDialog.prototype.getTeardownProcess = function ( data ) {
	return ve.ui.MWWavedromDialog.super.prototype.getTeardownProcess.call( this, data )
		.first( function () {
			// Events
			this.input.disconnect( this );
			this.dimensions.disconnect( this );
			this.resetMapButton.disconnect( this );

			this.dimensions.clear();
			if ( this.map ) {
				this.map.remove();
				this.map = null;
			}
		}, this );
};

/* Registration */

ve.ui.windowFactory.register( ve.ui.MWWavedromDialog );
