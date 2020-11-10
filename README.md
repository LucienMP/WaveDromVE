
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
* Install MediaWiki 1.35 to your system, using basic configuraiton (Use Timeless skin)  
   REF: https://www.mediawiki.org/wiki/Download

* Setup wavedrom in http://localhsot/wavedrom
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

* Setup the MediaWiki Visual Editor extension
    1. git clone https://github.com/lucienmp/WaveDromVE
    2. Set the locaiton of the altered WaveDrom WebApp in your LocalSettings.php
```html
        $wgWaveDromURL = "http://localhost/path/to/wavedrom";
        $wgWaveDromDebug = true ;
```

* Read TestPage with purge
  - http://localhost/mediawiki-1.35.0/index.php?title=TestPage&action=purge


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