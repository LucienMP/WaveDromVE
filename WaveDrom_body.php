<?php
$wgHooks['ParserFirstCallInit'][] = 'WaveDrom::onParserSetup';
class WaveDrom {
    // Register any render callbacks with the parser
    public static function onParserSetup( Parser $parser ) {
        // When the parser sees the <wavedrom> tag, it executes renderTagWavedrom (see below)
        $parser->setHook( 'wavedrom', 'WaveDrom::renderTagWavedrom' );
    }

    /**
     * Called when the extension is first loaded
     */
    public static $instance = null;

    public static function onRegistration() {
            global $wgExtensionFunctions;
            //  define( 'TREEANDMENU_TREE', 1 );
            //  define( 'TREEANDMENU_MENU', 2 );
            self::$instance = new self();
            $wgExtensionFunctions[] = array( self::$instance, 'setup' );
    }


    /**
     * Called at extension setup time, install hooks and module resources
     */
    public function setup() {
        global $wgOut, $wgParser, $wgExtensionAssetsPath, $wgAutoloadClasses, $IP, $wgResourceModules;

        // $wgParser->setFunctionHook( 'wavedrom', array( $this, 'renderTagWavedrom' ) );

        // Add parser hooks
		$wgParser->setHook( 'wavedrom', 'WaveDrom::renderTagWavedrom' );

        // This gets the remote path even if it's a symlink (MW1.25+)
        $path = $wgExtensionAssetsPath . str_replace( "$IP/extensions", '', dirname( $wgAutoloadClasses[__CLASS__] ) );

        /*
            // Fancytree script and styles
            $wgResourceModules['ext.fancytree']['localBasePath'] = __DIR__ . '/fancytree';
            $wgResourceModules['ext.fancytree']['remoteExtPath'] = "$path/fancytree";
            $wgOut->addModules( 'ext.fancytree' );
            $wgOut->addStyle( "$path/fancytree/fancytree.css" );
            $wgOut->addJsConfigVars( 'fancytree_path', "$path/fancytree" );

            // Suckerfish menu script and styles
            $wgResourceModules['ext.suckerfish']['localBasePath'] = __DIR__ . '/suckerfish';
            $wgResourceModules['ext.suckerfish']['remoteExtPath'] = "$path/suckerfish";
            $wgOut->addModules( 'ext.suckerfish' );
            $wgOut->addStyle( "$path/suckerfish/suckerfish.css" );
        */
    }



    // Render <wavedrom>
    public static function renderTagWavedrom( $input, array $args, Parser $parser, PPFrame $frame ) {
        global $wgWaveDromURL ;
	 
        // Default to 127.0.0.1, otherwise whatever is in LocalSettings.php
        if( isset($wgWaveDromDebug) ) {
            $wavedromjs = "wavedrom.js" ;
        } else {
            $wavedromjs = "wavedrom.min.js" ;
        }

        if( !isset($wgWaveDromURL) )
      	    $wgWaveDromURL = "https://wavedrom.com/";

        // FIXME> Add an attribute for the skin we want to use; make it per diagram
        $parser->getOutput()->addHeadItem('<script src="' . $wgWaveDromURL . '/skins/default.js" type="text/javascript"></script>', 'WaveDromDefault');
        $parser->getOutput()->addHeadItem('<script src="' . $wgWaveDromURL . '/' . $wavedromjs . '" type="text/javascript"></script>', 'WaveDromMain');

        // Add a modules scripts to our header
        $parser->getOutput()->addModules( 'ext.wavedrom.postprocessing' );

        // LMP: Maybe should be better way
        $parser->getOutput()->addHeadItem('<script>window.addEventListener(\'DOMContentLoaded\', WaveDrom.ProcessAll, false);</script>', 'WaveDromLoad');

        // Mediawiki add <p> and <pre> if newlines ...
        $inputstriped = str_replace(array("\n", "\r"), "", $input);

        $alignClasses = [
            // 'left' => 'mw-halign-left',
            // 'center' => 'mw-halign-center',
            // 'right' => 'mw-halign-right',
            // 'none' => 'mw-halign-none'
            'left' => 'tleft',
            'center' => 'tcenter',
            'right' => 'tright',
            'none' => 'tnone'
        ];


        
        $width="";
        $height="";
        $align="none";
        $containerClass = 'thumb';

        // Over-ride if they are available in the tag element
        if( isset( $args['width'] ) )
            $width=$args['width'];

        if( isset( $args['height'] ) )
            $height=$args['height'];

        if( isset( $args['align'] ) )
            $align=$args['align'];

        // $mapDiv='<script type="WaveDrom" >'.$inputstriped.'</script>';
        // $mapDiv.='<style onload=alert(1)></style>';


        // Process the WaveDrom Element
        /* OLD WAY
            $mapDiv2 = Html::rawElement( 'script', [ 'onchange'=>'alert(1)' ], 'document.currentScript.parentNode.previousSibling.getElementsByTagName("script")[0].addEventListener("DOMSubtreeModified",WaveDrom.ProcessAll);');
            $mapDiv2 = Html::rawElement( 'script', [ 'onchange'=>'alert(1)' ], 'document.currentScript.parentNode.parentNode.addEventListener("DOMContentLoaded",WaveDrom.ProcessAll);');
            $mapDiv .= Html::rawElement( 'script', [ ], 'document.currentScript.xpreviousSibling.onload=WaveDrom.ProcessAll();');
        	   $mapDiv .= Html::rawElement( 'script', [ ], 'console.info(this); document.currentScript.parentNode.getElementsByTagName("script")[0].addClass("POOP");');
        	   .getAttribute('type') == 'text';
        	   closest(".cc-selector").prev(".feature_suffix").addClass("test-class");' );
        */
        $mapDiv = Html::rawElement( 'script', [ 'type' => 'WaveDrom' ], $inputstriped );
        $captionFrame='';

        // print_r($args, true)
        // return Html::rawElement( 'div', [ 'class' => "{$containerClass} {$alignClasses['center']}", 'style'=>'transform:scale(0.2)'],

        # DIV is rendered via JS module
        $thumbinner = Html::rawElement( 'div', [
                                            'class' => 'thumbinner wavdrom-scaled-container',
                                            'style' => "width: {$width}px; height: {$height}px;",
                        ], $mapDiv .  $captionFrame );

        $htmlWaveDromUnit = Html::rawElement( 'div', [ 'class' => "mw-wavedrom-container {$containerClass} {$alignClasses[$align]}" ], $thumbinner );



        return $htmlWaveDromUnit ;

        //    return '<script type="WaveDrom">'.$inputstriped.'</script>';
    }
}
?>