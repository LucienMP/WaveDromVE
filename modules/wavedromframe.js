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
module.exports = ( function ( $, mw, router ) {

	/**
	 * References the mapframe containers of the page.
	 *
	 * @type {HTMLElement[]}
	 */
	var maps = [],
		/**
		 * @private
		 * @ignore
		 */
		routerInited = false;

	/**
	 * Gets the map data attached to an element.
	 *
	 * @param {HTMLElement} element Element
	 * @return {Object|null} Map properties
	 * @return {number} return.latitude
	 * @return {number} return.longitude
	 * @return {number} return.zoom
	 * @return {string} return.style Map style
	 * @return {string[]} return.overlays Overlay groups
	 */
	function getMapData( element ) {
		var $el = $( element ),
			$caption = $el.parent().find( '.thumbcaption' ),
			captionText = '';

		// Prevent users from adding map divs directly via wikitext
		if ( $el.attr( 'mw-data' ) !== 'interface' ) {
			return null;
		}

		if ( $caption[ 0 ] ) {
			captionText = $caption.text();
		}

		return {
			latitude: +$el.data( 'lat' ),
			longitude: +$el.data( 'lon' ),
			zoom: +$el.data( 'zoom' ),
			style: $el.data( 'style' ),
			overlays: $el.data( 'overlays' ) || [],
			captionText: captionText
		};
	}

	/**
	 * This code will be executed once the article is rendered and ready.
	 *
	 * @ignore
	 */
	mw.hook( 'wikipage.content' ).add( function ( $content ) {
		var mapsInArticle = [],
			promises = [];


		// `wikipage.content` may be fired more than once.
		$.each( maps, function () {
			maps.pop().remove();
		} );

		// For each wavedrom container perform some action
		$content.find( '.mw-wavedrom-container' ).each( function ( index ) {
			//alert( index );

			WaveDrom.ProcessAll();

			return null ;

			var map, data,
				container = this,
				$container = $( this ),
				deferred = $.Deferred();

			data = getMapData( container );

			if ( data ) {
				data.enableFullScreenButton = true;

				map = kartobox.map( {
					featureType: 'mapframe',
					container: container,
					center: [ data.latitude, data.longitude ],
					zoom: data.zoom,
					fullScreenRoute: '/map/' + index,
					allowFullScreen: true,
					dataGroups: data.overlays,
					captionText: data.captionText
				} );

				$container.removeAttr( 'href' );

				mw.track( 'mediawiki.kartographer', {
					action: 'view',
					isFullScreen: false,
					feature: map
				} );

				map.doWhenReady( function () {
					map.$container.css( 'backgroundImage', '' );
				} );

				mapsInArticle.push( map );
				maps[ index ] = map;

				// Special case for collapsible maps.
				// When the container is hidden Leaflet is not able to
				// calculate the expected size when visible. We need to force
				// updating the map to the new container size on `expand`.
				if ( !$container.is( ':visible' ) ) {
					$container.closest( '.mw-collapsible' )
						.on( 'afterExpand.mw-collapsible', function () {
							map.invalidateSize();
						} );
				}

				promises.push( deferred.promise() );
			}
		} );

		// Allow customizations of interactive maps in article.
		$.when( promises ).then( function () {
			mw.hook( 'wikipage.maps' ).fire( mapsInArticle, false /* isFullScreen */ );

			if ( routerInited ) {
				return;
			}
			// execute this piece of code only once
			routerInited = true;

			// Opens a map in full screen. #/map(/:zoom)(/:latitude)(/:longitude)
			// Examples:
			//     #/map/0
			//     #/map/0/5
			//     #/map/0/16/-122.4006/37.7873
			router.route( /map\/([0-9]+)(?:\/([0-9]+))?(?:\/([+-]?\d+\.?\d{0,5})?\/([+-]?\d+\.?\d{0,5})?)?/, function ( maptagId, zoom, latitude, longitude ) {
				var map = maps[ maptagId ],
					position;

				if ( !map ) {
					router.navigate( '' );
					return;
				}

				if ( zoom !== undefined && latitude !== undefined && longitude !== undefined ) {
					position = {
						center: [ +latitude, +longitude ],
						zoom: +zoom
					};
				} else {
					position = map.getInitialMapPosition();
				}

				// We need this hack to differentiate these events from `open` events.
				if ( !map.fullScreenMap && !map.clicked ) {
					mw.track( 'mediawiki.kartographer', {
						action: 'hashopen',
						isFullScreen: true,
						feature: map
					} );
					map.clicked = false;
				}
				map.openFullScreen( position );
			} );

			// Check if we need to open a map in full screen.
			router.checkRoute();
		} );
	} );

	return maps;
}(
	jQuery,
	mediaWiki,
	require( 'mediawiki.router' )
) );
