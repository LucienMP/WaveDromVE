/*!
 * VisualEditor MWWavedromContextItem class.
 *
 * @copyright 2011-2017 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * Context item for a MWWavedromInlineNode or MWWavedromNode.
 *
 * @class
 * @extends ve.ui.LinearContextItem
 *
 * @constructor
 * @param {ve.ui.Context} context Context item is in
 * @param {ve.dm.Model} model Model item is related to
 * @param {Object} config Configuration options
 */
ve.ui.MWWavedromContextItem = function VeUiMWWavedromContextItem() {
	// Parent constructor
	ve.ui.MWWavedromContextItem.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( ve.ui.MWWavedromContextItem, ve.ui.LinearContextItem );

/* Static Properties */

ve.ui.MWWavedromContextItem.static.name = 'mwWavedrom';

ve.ui.MWWavedromContextItem.static.icon = 'map';

ve.ui.MWWavedromContextItem.static.label = OO.ui.deferMsg( 'visualeditor-mwwavedromcontextitem-title' );

// ve.ui.MWWavedromContextItem.static.modelClasses = [ ve.dm.MWWavedromInlineNode, ve.dm.MWWavedromNode ];
ve.ui.MWWavedromContextItem.static.modelClasses = [ ve.dm.MWWavedromNode ];

ve.ui.MWWavedromContextItem.static.commandName = 'mwWavedrom';

/* Methods */

/**
 * Get a DOM rendering of the reference.
 *
 * @private
 * @return {jQuery} DOM rendering of reference
 */
ve.ui.MWWavedromContextItem.prototype.getRendering = function () {
	if ( !this.model.isEditable() ) {
		return $( '<div>' )
			.addClass( 've-ui-mwWaveDromContextItem-nosupport' )
			.text( this.getDescription() );
	}
};

/**
 * @inheritdoc
 */
ve.ui.MWWavedromContextItem.prototype.getDescription = function () {
	return this.model.isEditable() ? '' : ve.msg( 'visualeditor-mwwavedromcontextitem-nosupport' );
};

/**
 * @inheritdoc
 */
ve.ui.MWWavedromContextItem.prototype.renderBody = function () {
	this.$body.empty().append( this.getRendering() );
};

/* Registration */

ve.ui.contextItemFactory.register( ve.ui.MWWavedromContextItem );
