/* globals require */
/**
 * Frame module.
 *
 * Once the page is loaded and ready, turn all `<mapframe/>` tags into
 * interactive maps.
 *
 * @alias Frame
 * @alias ext.kartographer.frame
 * @class Kartographer.Frame
 * @singleton
 */
( function ( $, mw ) {

	/**
	 * This code will be executed once the article is rendered and ready.
	 */
	mw.hook( 'wikipage.content' ).add( function ( $content ) {
		// For each wavedrom container perform some action
		$content.find( '.mw-wavedrom-container' ).each( function ( index ) {
			var $element = $( this ).children(),
				data = $element.attr( 'data-mw-wavedrom' );
			if ( data ) {
				// TODO: Remove setTimout when wavedrom will be able to draw detached elements
				setTimeout( function () {
					WaveDrom.Process( $element.get( 0 ), data )
					$element.find( 'svg' )
						.attr( 'width', $element.width() )
						.attr( 'height', $element.height() );
				}, 100 );
			}
		} );

	} );

}( jQuery, mediaWiki ) );
