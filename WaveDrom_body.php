<?php

use MediaWiki\MediaWikiServices;

class WaveDrom {
    // Register any render callbacks with the parser
    public static function onParserFirstCallInit( Parser $parser ) {
        // When the parser sees the <wavedrom> tag, it executes renderTagWavedrom (see below)
        $parser->setHook( 'wavedrom', [ self::class, 'renderTagWavedrom' ] );
    }

    // Render <wavedrom>
    public static function renderTagWavedrom( $input, array $args, Parser $parser, PPFrame $frame ) {
//        $config = MediaWikiServices::getInstance()->getMainConfig();
//    	$waveDromUrl = $config->get( 'WaveDromURL' );
//		$waveDromDebug = $config->get( 'WaveDromDebug' );
//
//        // FIXME> Add an attribute for the skin we want to use; make it per diagram
//		$skinScript = Html::element(
//			'script',
//			[
//				'src' => "$waveDromUrl/skins/default.js",
//				'type' => 'text/javascript',
//			]
//		);
//        $parser->getOutput()->addHeadItem( $skinScript, 'WaveDromDefault' );
//
//        $wavedromScript = Html::element(
//        	'script',
//			[
//				'src' => $waveDromUrl . '/' . ( $waveDromDebug ? 'wavedrom.js' : 'wavedrom.min.js' ),
//				'type' => 'text/javascript',
//			]
//		);
//        $parser->getOutput()->addHeadItem( $wavedromScript, 'WaveDromMain' );

        // Add a modules scripts to our header
        $parser->getOutput()->addModules( 'ext.wavedrom.postprocessing' );

        $alignClasses = [
            'left' => 'tleft',
            'center' => 'tcenter',
            'right' => 'tright',
            'none' => 'tnone',
        ];

        # DIV is rendered via JS module
        $thumbinner = Html::element(
        	'div',
			[
				'class' => 'thumbinner wavdrom-scaled-container',
				'style' => 'width: 100%; height: 100%',
				'data-mw-wavedrom' => $input,
			]
		);

		$classes = [ 'mw-wavedrom-container', 'thumb' ];
		$align = $args['align'] ?? 'none';
		$classes[] = $alignClasses[$align] ?? $alignClasses['none'];

		$style = [ 'display: inline-block' ];
		$width = intval( $args['width'] ?? 0 );
		if ( $width ) {
			$style[] = "width: {$width}px";
		}
		$height = intval( $args['height'] ?? 0 );
		if ( $height ) {
			$style[] = "height: {$height}px";
		}

		return Html::rawElement(
        	'div',
			[
				'class' => implode( ' ', $classes ),
				'style' => implode( ';', $style ),
			],
			$thumbinner
		);
    }
}
