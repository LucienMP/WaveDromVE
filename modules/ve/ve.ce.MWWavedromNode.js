/*!
 * VisualEditor ContentEditable MWWavedromNode class.
 *
 * @copyright 2011-2015 VisualEditor Team and others; see http://ve.mit-license.org
 */
/**
 * ContentEditable paragraph node.
 *
 * @class
 * @extends ve.ce.MWBlockExtensionNode
 * @mixins ve.ce.ResizableNode
 *
 * @constructor
 * @param {ve.dm.MWWavedromNode} model Model to observe
 * @param {Object} [config] Configuration options
 */
ve.ce.MWWavedromNode = function VeCeMWWavedrom( model, config ) {
	config = config || {};

	// Parent constructor
	ve.ce.MWWavedromNode.super.apply( this, arguments );

	// Mixin constructors
	ve.ce.ResizableNode.call( this, this.$element, config );

	// Events
	this.model.connect( this, { attributeChange: 'onAttributeChange' } );
};


/* Inheritance */

OO.inheritClass( ve.ce.MWWavedromNode, ve.ce.MWExtensionNode );

OO.mixinClass( ve.ce.MWWavedromNode, ve.ce.ResizableNode );

/* Static Properties */

ve.ce.MWWavedromNode.static.name = 'mwWavedrom';

ve.ce.MWWavedromNode.static.tagName = 'div';

ve.ce.MWWavedromNode.static.primaryCommandName = 'mwWavedrom';

/* Methods */

/**
 * Update the rendering of the 'align', src', 'width' and 'height' attributes
 * when they change in the model.
 *
 * @method
 * @param {string} key Attribute key
 * @param {string} from Old value
 * @param {string} to New value
 */
ve.ce.MWWavedromNode.prototype.onAttributeChange = function () {
	this.update();
};

/**
 * @inheritdoc
 */
ve.ce.MWWavedromNode.prototype.onSetup = function () {
	ve.ce.MWWavedromNode.super.prototype.onSetup.call( this );

	// DOM changes
	this.$element
		.empty()
		.addClass( 've-ce-mwWavedromNode' )
		.css( this.model.getCurrentDimensions() );

	this.update();
};

/**
 * Update the map rendering
 */
ve.ce.MWWavedromNode.prototype.update = function () {
	var align = ve.getProp( this.model.getAttribute( 'mw' ), 'attrs', 'align' ) ||
			( this.model.doc.getDir() === 'ltr' ? 'right' : 'left' ),
		alignClasses = {
			left: 'tleft',
			center: 'tnone',
			none: 'tnone',
			right: 'tright'
		};

		if ( !this.$scaledcontainer && this.getRoot() ) {
			this.setupWavedrom();
		} else if ( this.$scaledcontainer ) {
			this.updateWavedrom();
		}

	this.$element
		.removeClass( 'tleft tright tnone tcenter' )
		.addClass( alignClasses[align] || alignClasses.none )
		.css( this.model.getCurrentDimensions() );
};

/**
 * Setup an interactive map
 */
ve.ce.MWWavedromNode.prototype.setupWavedrom = function () {
  // Container that allows for Wavedrom Scaling to certain size
	// TODO: should be moved to initialize() when wavedrom will be able to render detached elements
	this.$scaledcontainer = $( '<div>' )
		.addClass( 'thumbinner wavdrom-scaled-container' )
		.appendTo( this.$element[ 0 ] )
		.css( { height: '100%', width: '100%' } );

	this.updateWavedrom();
};

ve.ce.MWWavedromNode.prototype.initialize = function () {
	this.$element.addClass( 'mw-wavedrom-container thumb' ).attr( 'style', 'display: inline-block;' );
};

/**
 * Update the Wavedrom layer from the current model state
 */
ve.ce.MWWavedromNode.prototype.updateWavedrom = function () {
	var mwData = this.model.getAttribute( 'mw' ),
		geoJson = mwData && mwData.body.extsrc,
		dimensions = this.model.getCurrentDimensions();

	if ( geoJson !== this.geoJson ) {
		this.geoJson = geoJson;
		WaveDrom.Process( this.$scaledcontainer.get( 0 ), geoJson );
		this.$scaledcontainer.find( 'svg' )
			.attr( 'width', dimensions.width )
			.attr( 'height', dimensions.height );
	}
};

/**
 * @inheritdoc ve.ce.ResizableNode
 */
ve.ce.MWWavedromNode.prototype.onResizableResizing = function ( dimensions ) {
	// Mixin method
	ve.ce.ResizableNode.prototype.onResizableResizing.apply( this, arguments );

	this.$element.find( 'svg' )
		.attr( 'width', dimensions.width )
		.attr( 'height', dimensions.height );
};

/**
 * @inheritdoc ve.ce.ResizableNode
 */
ve.ce.MWWavedromNode.prototype.getAttributeChanges = function ( width, height ) {
	var mwData = ve.copy( this.model.getAttribute( 'mw' ) );

	mwData.attrs.width = width.toString();
	mwData.attrs.height = height.toString();

	return { mw: mwData };
};

/* Registration */

ve.ce.nodeFactory.register( ve.ce.MWWavedromNode );
