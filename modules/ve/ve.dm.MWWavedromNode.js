/*!
 * VisualEditor DataModel MWWavedromNode class.
 *
 * @copyright 2011-2015 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * DataModel MW Maps node.
 *
 * @class
 * @extends ve.dm.MWBlockExtensionNode
 * @mixins ve.dm.ResizableNode
 *
 * @constructor
 */
ve.dm.MWWavedromNode = function VeDmMWWavedrom() {
	// Parent constructor
	ve.dm.MWWavedromNode.super.apply( this, arguments );

	// Mixin constructors
	ve.dm.ResizableNode.call( this );
};

/* Inheritance */

OO.inheritClass( ve.dm.MWWavedromNode, ve.dm.MWBlockExtensionNode );

OO.mixinClass( ve.dm.MWWavedromNode, ve.dm.ResizableNode );

/* Static Properties */

ve.dm.MWWavedromNode.static.name = 'mwWavedrom';

ve.dm.MWWavedromNode.static.extensionName = 'wavedrom'; // TAG

ve.dm.MWWavedromNode.static.matchTagNames = [ 'div' ];

/* Static methods */

ve.dm.MWWavedromNode.static.toDataElement = function () {
	var dataElement = ve.dm.MWWavedromNode.super.static.toDataElement.apply( this, arguments );

	dataElement.attributes.width = dataElement.attributes.mw.attrs.width;
	dataElement.attributes.height = dataElement.attributes.mw.attrs.height;

	return dataElement;
};

ve.dm.MWWavedromNode.static.createScalable = function ( dimensions ) {
	return new ve.dm.Scalable( {
		fixedRatio: false,

		currentDimensions: {
			width: dimensions.width,
			height: dimensions.height
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
};

ve.dm.MWWavedromNode.prototype.getCurrentDimensions = function () {
	return {
		width: this.getAttribute( 'mw' ).attrs.width,
		height: this.getAttribute( 'mw' ).attrs.height
	};
};

/* Methods */

/**
 * @inheritdoc
 */
ve.dm.MWWavedromNode.prototype.createScalable = function () {
	return this.constructor.static.createScalable( this.getCurrentDimensions() );
};

/* Registration */

ve.dm.modelRegistry.register( ve.dm.MWWavedromNode );
