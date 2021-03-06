
This is a MediaWiki extension plugin that enables embedding of WaveDrom wave forms into MediaWiki sites.

It was based off some work from;
  * https://www.mediawiki.org/wiki/Extension:Kartographer
  * https://github.com/Martoni/mediawiki_wavedrom


What this plugin extends is the following;
* Adds tag <wavedrom options=value> ... </wavedrom>  
   options are:  height/width/aligh=left/right/cetner/none
* Adds the Visual Editor extension

Visual Editor API documentaiton
 * https://doc.wikimedia.org/VisualEditor/master/#!/api/ve.ui.MWExtensionWindow
 * See the modules/ve/ and grep for .register function to see whats hooked

Basic Setup instructions for developing the plugin;
* Untar MediaWiki 1.35 to your http folder as say mediawiki-1.35.0  
   REF: https://www.mediawiki.org/wiki/Download  
   NOTE: You will need PHP7.3 or better (7.4.0-7.4.10 are broken)  
         For me this meant FedoraCore32  
   NOTE: I highly recommend MiriaDb/MySQL as your database  
   
* Configure Media Wiki
   Point your browser to htttp://yourserver/mediawiki-1.35  
   It will give you a web page with various questions.  
   Follow the instructions for setting up a new Wiki  
   Most of them dont matter, just include the VisualEditor extension.  
   And make it a public wiki, I suggest Timeless skin as well.  
     
   This will generate the LocalSettings.php file which will you will be given at the last screen.  
   
   Move this file to inside your mediawiki-1.35.0 folder.  
   
   
* Setup wavedrom in http://localhost/wavedrom
   1. git clone https://github.com/lucienmp/wavedrom
   2. cd wavedrom
   3. git checkout wavedrom
   4. Compile "wavedrom.js" and "wavedrom.min.js" (dont have to as I put it in the repository)
```html
        Fedora Core 32 instrucitons for a compile
        # As root
        npm update
        npm install -g grunt-cli

        # As user; in wavedrom folder
        npm install
        npm install eslint
        grunt
```
  5. You can manually check wave drom via going to http://localhost/wavedrom/test/test.html

* Setup the MediaWiki Visual Editor extension (in http://localhost/mediawiki-1.35.0)
    1. Move to mediawiki-1.35.0/extensions folder
    2. git clone https://github.com/lucienmp/WaveDromVE WaveDrom
    2. Set the locaiton of the altered WaveDrom WebApp in your LocalSettings.php
```html
        wfLoadExtension('WaveDrom');
        $wgWaveDromURL = "http://localhost/wavedrom";
        $wgWaveDromDebug = true ;
```

* Confirm the plugin is enabled, and passing  
    http://localhost/mediawiki-1.35.0/index.php?title=Special:Version

* Read TestPage with purge
  - http://localhost/mediawiki-1.35.0/index.php?title=TestPage&action=purge

* Debug information for your page load or PHP issues  
  Add the following to your LocalSettings.php
```html
//
// DEBUG SUPPORT
//
// https://www.mediawiki.org/wiki/Manual:How_to_debug#PHP_errors
//
error_reporting( -1 );
ini_set( 'display_errors', 1 );
$wgDebugToolbar=true;
$wgShowExceptionDetails = true;
$wgResourceLoaderDebug = true ;
$wgDebugLogFile = "/tmp/debug.txt";
```

Also check your httpd/php logs, via php.ini; for me this is "fail -f /var/log/php-fpm/www-error.log"

* Sample Media Wiki Source Page

```html
This is a sample waveform:

<wavedrom width="615" height="290.2" align="none">
{ "signal": [{ "name": "Alfa2", "wave": "01.zx=ud.23.456789" }] }
</wavedrom>

This is a sample image:
[[File:Georgia RVA Sample 98.jpg|none|thumb]]

This is a more complex waveform:
<wavedrom width="480" height="181" align="none">
{ "signal": [
  { "name": "clk",     "wave": "n.....H01" }, 
  { "name": "clk2",     "wave": "p.....H10" }, 
  { "name": "Data",    "wave": "x345x",  "data": ["2head", "body", "tail"] },
  { "name": "Request", "wave": "01..0" },{ "name": "Request", "wave": "01..0" },
  { "name": "Request", "wave": "01010" },{ "name": "Request", "wave": "01..0" },
  {}
  ],
  "config": { "hscale": 2 } 
}
</wavedrom>

This is an example circuit
<wavedrom width="480" height="181" align="none">
{ "assign":[
  ["z", ["~&",
    ["~^", ["~", "p0"], ["~", "q0"]],
    ["~^", ["~", "p1"], ["~", "q1"]],
    ["~^", ["~", "p2"], ["~", "q2"]],
    "...",
    ["~^", ["~", "p7"], ["~", "q7"]],
    ["~","~en"]
  ]]
]}
</wavedrom>

```
