/*!
 * VisualEditor MediaWiki UserInterface gallery tool class.
 *
 * @copyright 2011-2015 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * MediaWiki UserInterface gallery tool.
 *
 * @class
 * @extends ve.ui.FragmentWindowTool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
ve.ui.MWWavedromDialogTool = function VeUiMWWavedromDialogTool() {
	ve.ui.MWWavedromDialogTool.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( ve.ui.MWWavedromDialogTool, ve.ui.FragmentWindowTool );

/* Static properties */

ve.ui.MWWavedromDialogTool.static.name = 'mwWavedrom';
ve.ui.MWWavedromDialogTool.static.group = 'object';
ve.ui.MWWavedromDialogTool.static.icon = 'map'; // LMP-A: oojs-ui.styles.icons-content, MENU
ve.ui.MWWavedromDialogTool.static.title = OO.ui.deferMsg( 'visualeditor-mwwavedromdialog-title' );
// ve.ui.MWWavedromDialogTool.static.modelClasses = [ ve.dm.MWWavedromNode, ve.dm.MWWavedromInlineNode ];
ve.ui.MWWavedromDialogTool.static.modelClasses = [ ve.dm.MWWavedromNode ];
ve.ui.MWWavedromDialogTool.static.commandName = 'mwWavedrom';

//if ( mw.config.get( 'wgWavedromEnableFrame' ) )
if(true)
{
	/* Registration */

	ve.ui.toolFactory.register( ve.ui.MWWavedromDialogTool );

	/* Commands */
	ve.ui.commandRegistry.register(
		new ve.ui.Command(
			'mwWavedrom', 'window', 'open',
			{ args: [ 'mwWavedrom' ], supportedSelections: [ 'linear' ] }
		)
	);
}
