/*
Copyright 2012 OCAD University 

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License.
*/

// Declare dependencies
/*global decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function () {

    "use strict";

    /*********************
     *  stereo browse Demands*
     *********************/

    fluid.demands("decapod.stereo.browse", "decapod.stereo", {});
    fluid.demands("decapod.stereo.browse", ["decapod.stereo", "decapod.fileSystem"], {
        funcName: "decapod.stereo.browse.local"
    });

    fluid.demands("decapod.stereo.browse.captures", "decapod.stereo", {});
    fluid.demands("decapod.stereo.browse.captures", ["decapod.stereo", "decapod.fileSystem"], {
        funcName: "decapod.stereo.browse.captures.local"
    });

    fluid.demands("decapod.stereo.browse.calibration", "decapod.stereo", {});
    fluid.demands("decapod.stereo.browse.calibration", ["decapod.stereo", "decapod.fileSystem"], {
        funcName: "decapod.stereo.browse.calibration.local"
    });

    fluid.demands("decapod.stereo.browse.colourPicker", "decapod.stereo", {});
    fluid.demands("decapod.stereo.browse.colourPicker", ["decapod.stereo", "decapod.fileSystem"], {
        funcName: "decapod.stereo.browse.colourPicker.local"
    });

})(jQuery);