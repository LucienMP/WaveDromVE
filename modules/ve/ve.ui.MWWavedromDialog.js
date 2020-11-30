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
};

/* Inheritance */

OO.inheritClass( ve.ui.MWWavedromDialog, ve.ui.MWExtensionDialog );

/* Static Properties */

ve.ui.MWWavedromDialog.static.name = 'mwWavedrom';

ve.ui.MWWavedromDialog.static.title = OO.ui.deferMsg( 'visualeditor-mwwavedromdialog-title' );

ve.ui.MWWavedromDialog.static.size = 'larger';

ve.ui.MWWavedromDialog.static.allowedEmpty = true;

// ve.ui.MWWavedromDialog.static.modelClasses = [ ve.dm.MWWavedromNode, ve.dm.MWWavedromInlineNode ];
ve.ui.MWWavedromDialog.static.modelClasses = [ ve.dm.MWWavedromNode ];

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
		panel2.attr( 'style', 'border: 1px solid black; border-radius: 5px; margin-top: 1em;' );

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

	this.wavedromValue = '';

	this.scalable = null;

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

	// this.resetMapButton = new OO.ui.ButtonWidget( {
	// 	label: ve.msg( 'visualeditor-mwwavedromdialog-reset-map' )
	// } );

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
    //     this.typeFieldset = new OO.ui.FieldsetLayout( {
    //         $overlay: this.$overlay,
    //         label: ve.msg( 'visualeditor-mwwavedrom-style-title' ),
	//     help: ve.msg( 'visualeditor-mwwavedrom-style-title-help' ),
    //         icon: 'parameter'
    //     } );
	//
	//
    //     this.typeSelectDropdown = new OO.ui.DropdownWidget( { $overlay: this.$overlay } );
    //     this.typeSelect = this.typeSelectDropdown.getMenu();
    //     this.typeSelect.addItems( [
    //             // TODO: Inline images require a bit of further work, will be coming soon
    //             new OO.ui.MenuOptionWidget( {
    //                     data: 'thumb',
    //                     icon: 'image-thumbnail',
    //                     label: ve.msg( 'visualeditor-mwwavedrom-pulldownA' )
    //             } ),
    //             new OO.ui.MenuOptionWidget( {
    //                     data: 'frameless',
    //                     icon: 'image-frameless',
    //                     label: ve.msg( 'visualeditor-mwwavedrom-pulldownB' )
    //             } ),
    //             new OO.ui.MenuOptionWidget( {
    //                     data: 'frame',
    //                     icon: 'image-frame',
    //                     label: ve.msg( 'visualeditor-mwwavedrom-pulldownC' )
    //             } )
    //     ] );
	//
    // // Build type fieldset
    //     this.typeFieldset.$element.append(
    //             this.typeSelectDropdown.$element
    //     );

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
// 		this.$mapPositionContainer.append( this.typeFieldset.$element, this.resetMapButton.$element ),
		this.geoJsonField.$element
	);
	this.$body.append( panel.$element );
};

/**
 * Handle change events on the dimensions widget
 *
 * @param {string} newValue
 */
ve.ui.MWWavedromDialog.prototype.onDimensionsChange = function () {
	// Set container width for centering
	this.updateSize();

	WaveDrom.Process( this.$mapContainer.get( 0 ), this.wavedromValue );
	this.updateActions();
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

	this.alignCheckbox.setSelected( mwData.attrs.align !== 'none' );
	var isSelected = this.alignCheckbox.isSelected() ;

	// LMP: Disable alignment selection if "wrap text" is not selected
	this.align.setDisabled( !isSelected );

	mwData.attrs.width = dimensions.width.toString();
	mwData.attrs.height = dimensions.height.toString();

    if ( isSelected ) {
		// LMP: Case of just freshly un-selecting the wrap button, this is null - default to left
		//			var selected=this.align.getSelectedItem();
		var selected = this.align.findSelectedItem();
		if ( selected === null ) {
			selected = this.align.selectItemByData( 'left' );
		}
		mwData.attrs.align = selected.getData();
    } else {
		mwData.attrs.align = 'none' ;
    }
};

/**
 * @inheritdoc
 */
ve.ui.MWWavedromDialog.prototype.getReadyProcess = function ( data ) {
	this.wavedromValue = this.input.getValue();

	return ve.ui.MWWavedromDialog.super.prototype.getReadyProcess.call( this, data )
		.next( function () {
			this.setupWavedromRender();
			this.updateSize();
		}, this );
};

/**
 * @inheritdoc
 */
ve.ui.MWWavedromDialog.prototype.getSetupProcess = function ( data ) {
	data = data || {};
	return ve.ui.MWWavedromDialog.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
			var inline = false, //this.selectedNode instanceof ve.dm.MWWavedromInlineNode,
				mwAttrs = this.selectedNode && this.selectedNode.getAttribute( 'mw' ).attrs || {};

			this.input.clearUndoStack();

			this.actions.setMode( this.selectedNode ? 'edit' : 'insert' );

			if ( this.selectedNode && !inline ) {
				this.scalable = this.selectedNode.getScalable();
			} else {
				this.scalable = ve.dm.MWWavedromNode.static.createScalable(
					{ width: 850, height: 400 }
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

			this.dimensionsField.toggle( !inline );

			this.alignField.toggle( !inline );

			// TODO: Support block/inline conversion
			this.align.selectItemByData( mwAttrs.align || 'right' );

			// this.resetMapButton.$element.toggle( !!this.selectedNode );

			this.dimensions.setDimensions( this.scalable.getCurrentDimensions() );

			this.updateActions();
		}, this );
};

/**
 * Setup the map control
 */
ve.ui.MWWavedromDialog.prototype.setupWavedromRender = function () {
	WaveDrom.Process( this.$mapContainer.get( 0 ), this.wavedromValue );
};

/**
 * Update the GeoJSON layer from the current input state
 */
ve.ui.MWWavedromDialog.prototype.updateGeoJson = function () {
	this.wavedromValue = this.input.getValue();
	WaveDrom.Process( this.$mapContainer.get( 0 ), this.wavedromValue );
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
			// this.resetMapButton.disconnect( this );

			this.dimensions.clear();
		}, this );
};

/* Registration */

ve.ui.windowFactory.register( ve.ui.MWWavedromDialog );
