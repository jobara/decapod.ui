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

(function ($) {

    "use strict";

    /*********************
     *  decapod.stereo *
     *********************/

    fluid.defaults("decapod.stereo", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        finalInitFunction: "decapod.stereo.finalInit",
        preInitFunction: "decapod.stereo.preInit",
        selectors: {
            title: ".dc-stereo-title",
            help: ".dc-stereo-help",
            start: ".dc-stereo-start",
            browse: ".dc-stereo-browse",
            status: ".dc-stereo-status"
        },
        components: {
            start: {
                type: "decapod.button",
                createOnEvent: "afterRender",
                container: "{decapod.stereo}.dom.start",
                options: {
                    strings: {
                        label: "{decapod.stereo}.options.strings.start"
                    },
                    model: {
                        "state": "disabled"
                    },
                    listeners: {}
                }
            },
            status: {
                type: "decapod.stereo.status",
                createOnEvent: "afterRender",
                container: "{decapod.stereo}.dom.status",
                options: {
                    events: {
                        hideInitial: "{decapod.stereo}.events.onFileSelected",
                        statusUpdated: "{decapod.stereo}.events.statusUpdated"
                    }
                }
            }
        },
        selectorsToIgnore: ["start", "status"],
        protoTree: {
            title: {
                messagekey: "title"
            },
            help: {
                target: "${help}",
                linktext: {
                    messagekey: "help"
                }
            },
            browse: {
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.browse"
                }
            }
        },
        model: {
            help: "#"
        },
        strings: {
            help: "Help",
            title: "",
            start: "",
            browse: "Browse Files"
        },
        resources: {
            template: {
                url: "../../core/html/stereoTemplate.html",
                forceCache: true,
                options: {
                    dataType: "html"
                }
            }
        },
        nickName: "decapod.stereo",
        events: {
            onFileSelected: null,
            statusUpdated: null,
            onUploadStart: null,
            onUploadSuccess: null,
            onUploadError: null,
            onUploadProgress: null
        },
        listeners: {
            onUploadStart: {
                listener: "{that}.events.statusUpdated.fire",
                args: ["{that}.options.statuses.working"]
            },
            onUploadSuccess: {
                listener: "{that}.events.statusUpdated.fire",
                args: ["{that}.options.statuses.uploadSuccess"]
            },
            onUploadError: {
                listener: "{that}.events.statusUpdated.fire"
            }
        },
        statuses: {
            uploadSuccess: "",
            working: "WORKING"
        },
        urls: {
            upload: ""
        }
    });

    fluid.defaults("decapod.dewarper", {
        gradeNames: ["decapod.stereo", "autoInit"]
    });

    fluid.defaults("decapod.calibrator", {
        gradeNames: ["decapod.stereo", "autoInit"]
    });

    decapod.stereo.preInit = function (that) {
        that.nickName = "decapod.stereo";
    };
    
    decapod.stereo.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function () {
            that.refreshView();
        });
    };

    fluid.fetchResources.primeCacheFromResources("decapod.stereo");

    fluid.defaults("decapod.stereo.status", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        renderOnInit: true,
        preInitFunction: "decapod.stereo.status.preInit",
        strings: {
            initialMessage: "Select \"Browse Files\" button to choose archive."
        },
        selectors: {
            initialMessage: ".dc-stereo-status-initialMessage",
            message: ".dc-stereo-status-message"
        },
        selectorsToIgnore: "message",
        events: {
            hideInitial: null,
            statusUpdated: null
        },
        listeners: {
            hideInitial: {
                listener: "{that}.hideInitialMessage"
            },
            statusUpdated: {
                listener: "{that}.onStatusUpdated",
                priority: "first"
            }
        },
        components: {
            message: {
                type: "decapod.stereo.status.message",
                container: "{decapod.stereo.status}.dom.message",
                createOnEvent: "statusUpdated"
            }
        },
        protoTree: {
            initialMessage: {
                messagekey: "initialMessage"
            }
        }
    });

    decapod.stereo.status.preInit = function (that) {
        that.hideInitialMessage = function () {
            that.locate("initialMessage").hide();
        };
        function handleError (error) {
            if (error) {
                that.error = error;
            } else {
                delete that.error;
            }
        }
        that.onStatusUpdated = function (status, error) {
            handleError(error);
            that.options.components.message.type =
                fluid.model.composeSegments("decapod.stereo.status.message",
                    status);
        };
    };

    fluid.defaults("decapod.stereo.status.spinner", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        postInitFunction: "decapod.stereo.status.spinner.postInit",
        styles: {
            spinner: "ds-shared-spinner",
            outerCircle: "ds-shared-spinner-outerCircle",
            innerCircle: "ds-shared-spinner-innerCircle",
            dot: "ds-shared-spinner-dot"
        }
    });

    decapod.stereo.status.spinner.postInit = function (that) {
        var styles = that.options.styles,
            spinner = $("<div></div>").addClass(styles.outerCircle)
                .after($("<div></div>").addClass(styles.innerCircle))
                .after($("<div></div>").addClass(styles.dot))
                .wrapAll($("<div></div>").addClass(styles.spinner))
                .parent("div");
        that.container.prepend(spinner);
    };

    fluid.defaults("decapod.stereo.status.message", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.stereo.status.message.preInit",
        selectors: {
            text: ".dc-stereo-status-message-text"
        },
        styles: {
            text: "ds-stereo-status-message-text"
        },
        strings: {
            text: ""
        },
        renderOnInit: true,
        protoTree: {
            text: {
                messagekey: "text",
                decorators: {"addClass": "{styles}.text"}
            }
        },
        nickName: "decapod.stereo.status.message"
    });

    decapod.stereo.status.message.preInit = function (that) {
        that.nickName = "decapod.stereo.status.message";
    };

    fluid.defaults("decapod.stereo.status.message.ERROR", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        strings: {
            text: "{decapod.stereo.status}.error.msg"
        }
    });

    fluid.defaults("decapod.stereo.status.message.WORKING", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        strings: {
            text: "Working..."
        },
        protoTree: {
            text: {
                messagekey: "text",
                decorators: [{"addClass": "{styles}.text"}, {
                    type: "fluid",
                    func: "decapod.stereo.status.spinner"
                }]
            }
        }
    });

    fluid.defaults("decapod.stereo.status.message.READY_TO_CALIBRATE", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        strings: {
            text: "Ready to calibrate."
        }
    });

    fluid.defaults("decapod.stereo.status.message.CAPTURES_FOUND", {
        gradeNames: ["decapod.stereo.status.message", "autoInit"],
        model: {
            captures: 0
        },
        strings: {
            text: "%captures captures found."
        },
        protoTree: {
            text: {
                messagekey: "text",
                args: {
                    captures: "${captures}"
                }
            }
        }
    });

    fluid.defaults("decapod.stereo.browse", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        selectors: {
            browseLabel: ".dc-stereo-browseLabel",
            browseInput: ".dc-stereo-browseInput"
        },
        strings: {
            browse: "{decapod.stereo}.options.strings.browse"
        },
        protoTree: {
            browseLabel: {
                messagekey: "browse"
            },
            browseInput: {
                decorators: {
                    type: "fluid",
                    func: "decapod.stereo.browse.input"
                }
            }
        },
        renderOnInit: true
    });

    fluid.defaults("decapod.stereo.browse.input", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        postInitFunction: "decapod.stereo.browse.input.postInit",
        preInitFunction: "decapod.stereo.browse.input.preInit",
        events: {
            onFileSelected: "{decapod.stereo}.events.onFileSelected",
            onStart: "{decapod.stereo}.events.onUploadStart",
            onSuccess: "{decapod.stereo}.events.onUploadSuccess",
            onError: "{decapod.stereo}.events.onUploadError",
            onProgress: "{decapod.stereo}.events.onUploadProgress"
        },
        listeners: {
            onFileSelected: [
                "{that}.events.onStart.fire",
                "{that}.upload"
            ]
        },
        url: "{decapod.stereo}.options.urls.upload"
    });

    decapod.stereo.browse.input.preInit = function (that) {
        that.onProgress = function (event) {
            that.events.onProgress.fire({
                loaded: event.loaded,
                total: event.total
            });
        };
        that.xhr = function () {
            var thisXhr = $.ajaxSettings.xhr();
            thisXhr.upload.addEventListener("progress", that.onProgress, false);
            return thisXhr;
        };
        that.upload = function () {
            var data = new FormData();
            data.append("file", that.file);
            $.ajax({
                url: that.options.url,
                type: "PUT",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                xhr: that.xhr,
                success: that.events.onSuccess.fire,
                error: function (xhr) {
                    var error = JSON.parse(xhr.responseText);
                    that.events.onError.fire("ERROR", error);
                }
            });
        };
    };

    decapod.stereo.browse.input.postInit = function (that) {
        that.container.change(function () {
            that.file = this.files[0];
            that.events.onFileSelected.fire();
        });
    };

})(jQuery);