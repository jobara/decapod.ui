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
/*global setTimeout, window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    /************************
     *  decapod.pdfExporter *
     ************************/
    
    fluid.registerNamespace("decapod.pdfExporter");
    
    decapod.pdfExporter.toggleExportDetails = function (that) {
        if (that.isEnabled) {
            that.locate("exportDetails").toggleClass(that.options.styles.hideExportDetails);
        }
    };
    
    decapod.pdfExporter.disable = function (that) {
        that.isEnabled = false;
        that.locate("exportDetails").addClass(that.options.styles.hideExportDetails);
    };
    
    decapod.pdfExporter.enable = function (that) {
        that.isEnabled = true;
    };
    
    decapod.pdfExporter.bindEvents = function (that) {
        that.locate("exportInfo").click(function () {
            if (that.isEnabled) {
                that.events.onToggleExportDetails.fire();
            }
        });
    };
    
    decapod.pdfExporter.preInit = function (that) {
        that.toggleExportDetails = function () {
            that.toggleExportDetails();
        };
        that.bindEvents = function () {
            that.bindEvents();
        };
    };
    
    decapod.pdfExporter.finalInit = function (that) {
        that.enable();
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.pdfExportTemplate.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.pdfExporter", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "decapod.pdfExporter.preInit",
        finalInitFunction: "decapod.pdfExporter.finalInit",
        selectors: {
            exportInfo: ".dc-pdfExporter-exportInfo",
            exportDetails: ".dc-pdfExporter-exportDetails",
            pdfExportOptions: ".dc-pdfExporter-pdfExportOptions",
            controls: ".dc-pdfExporter-controls"
        },
        strings: {
            name: "Format type label",
            description: "A delectable medley of bits and bytes to satisfy every platform",
            documentResolutionLabel: "Output Image resolution:",
            documentDimensionsLabel: "Output dimensions:",
            documentDimensions: "A4(210 x 297mm / 8.3 x 11.7in.)",
            exportControl: "Start Export",
            progressMessage: "Export Progress",
            download: "Download Link",  
            restart: "Start Over"
        },
        styles: {
            hideExportDetails: "ds-exporter-exportOptions-hidden"
        },
        events: {
            afterFetchResources: null,
            afterExportComplete: null,
            onExportStart: null,
            onToggleExportDetails: null,
            onReady: null
        },
        listeners: {
            "afterFetchResources.bindEvents": "{pdfExporter}.bindEvents",
            "onToggleExportDetails.toggleExportDetails": "{pdfExporter}.toggleExportDetails"
        },
        invokers: {
            toggleExportDetails: "decapod.pdfExporter.toggleExportDetails",
            bindEvents: "decapod.pdfExporter.bindEvents",
            disable: "decapod.pdfExporter.disable",
            enable: "decapod.pdfExporter.enable"
        },
        resources: {
            pdfExportTemplate: {
                url: "../html/pdfExporterTemplate.html",
                forceCache: true
            },
            exportInfo: {
                url: "../html/exportInfoTemplate.html",
                forceCache: true
            },
            pdfExportOptions: {
                url: "../html/pdfExportOptionsTemplate.html",
                forceCache: true
            },
            controls: {
                url: "../html/exportControlsTemplate.html",
                forceCache: true
            },
            trigger: {
                url: "../html/exportControlsTriggerTemplate.html",
                forceCache: true
            },
            progress: {
                url: "../html/exportControlsProgressTemplate.html",
                forceCache: true
            },
            download: {
                url: "../html/exportControlsDownloadTemplate.html",
                forceCache: true
            }
        },
        components: {
            eventBinder: {
                type: "decapod.eventBinder",
                createOnEvent: "afterFetchResources",
                priority: "last",
                options: {
                    events: {
                        "onReady": "{pdfExporter}.events.onReady"
                    },
                    listeners: {
                        "{pdfExporter}.events.onExportStart": {
                            listener: "{dataSource}.put",
                            args: [null]
                        },
                        "{dataSource}.events.success": "{exportPoller}.poll",
                        "{exportPoller}.events.pollComplete": "{pdfExporter}.events.afterExportComplete"
                    }
                }
            },
            dataSource: {
                type: "decapod.dataSource"
            },
            exportPoller: {
                type: "decapod.exportPoller"
            },
            exportInfo: {
                type: "decapod.exportInfo",
                container: "{pdfExporter}.dom.exportInfo",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        name: "{pdfExporter}.options.strings.name",
                        description: "{pdfExporter}.options.strings.description"
                    },
                    resources: {
                        template: "{pdfExporter}.options.resources.exportInfo"
                    }
                }
            },
            exportOptions: {
                type: "decapod.pdfExportOptions",
                container: "{pdfExporter}.dom.pdfExportOptions",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        documentResolutionLabel: "{pdfExporter}.options.strings.documentResolutionLabel",
                        documentDimensionsLabel: "{pdfExporter}.options.strings.documentDimensionsLabel",
                        documentDimensions: "{pdfExporter}.options.strings.documentDimensions"
                    },
                    resources: {
                        template: "{pdfExporter}.options.resources.pdfExportOptions"
                    }
                }
            },
            exportControls: {
                type: "decapod.exportControls",
                container: "{pdfExporter}.dom.controls",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        exportControl: "{pdfExporter}.options.strings.exportControl",
                        progressMessage: "{pdfExporter}.options.strings.progressMessage",
                        download: "{pdfExporter}.options.strings.download",
                        restart: "{pdfExporter}.options.strings.restart"
                    },
                    resources: {
                        controls: "{pdfExporter}.options.resources.controls",
                        trigger: "{pdfExporter}.options.resources.trigger",
                        progress: "{pdfExporter}.options.resources.progress",
                        download: "{pdfExporter}.options.resources.download"
                    }
                }
            }
        }
    });
    
    /************************
     * decapod.eventBinder *
     ************************/
    
    fluid.registerNamespace("decapod.eventBinder");
    
    decapod.eventBinder.finalInit = function (that) {
        that.events.onReady.fire();
    };
    
    fluid.defaults("decapod.eventBinder", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        finalInitFunction: "decapod.eventBinder.finalInit",
        events: {
            onReady: null
        }
    });
    
    /************************
     * decapod.exportPoller *
     ************************/
     
    fluid.registerNamespace("decapod.exportPoller");
    
    decapod.exportPoller.poll = function (that) {
        that.events.onPoll.fire();
    };
    
    decapod.exportPoller.isComplete = function (response) {
        return response.status && response.status.toLowerCase() === "complete";
    };
    
    decapod.exportPoller.handleResponse = function (that, response) {
        that.response = response;
        if (that.isComplete(response)) {
            that.events.pollComplete.fire(response);
        } else {
            setTimeout(function () {
                that.poll();
            }, that.options.delay);
        }
    };
    
    decapod.exportPoller.preInit = function (that) {
        that.handleResponse = function (response) {
            that.handleResponse(response);
        };
    };
     
    fluid.defaults("decapod.exportPoller", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        preInitFunction: "decapod.exportPoller.preInit",
        invokers: {
            poll: "decapod.exportPoller.poll",
            isComplete: "decapod.exportPoller.isComplete",
            handleResponse: "decapod.exportPoller.handleResponse"
        },
        events: {
            onPoll: null,
            pollComplete: null
        },
        delay: 5000,
        components: {
            eventBinder: {
                type: "decapod.eventBinder",
                priority: "last",
                options: {
                    listeners: {
                        "{exportPoller}.events.onPoll": "{dataSource}.get"
                    }
                }
            },
            dataSource: {
                type: "decapod.dataSource",
                priority: "first",
                options: {
                    listeners: {
                        "success.handler": "{exportPoller}.handleResponse"
                    }
                }
            }
        }
    });
    
    /**********************
     * decapod.exportInfo *
     **********************/

    fluid.registerNamespace("decapod.exportInfo");

    decapod.exportInfo.produceTree = function (that) {
        return {
            name: {
                messagekey: "name"
            },
            description: {
                messagekey: "description"
            }
        };
    };
    
    decapod.exportInfo.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportInfo", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportInfo.finalInit",
        produceTree: "decapod.exportInfo.produceTree",
        selectors: {
            name: ".dc-exportInfo-name",
            description: ".dc-exportInfo-description"
        },
        strings: {
            name: "Format type label",
            description: "A delectable medley of bits and bytes to satisfy every platform"
        },
        events: {
            afterFetchResources: null
        },
        resources: {
            template: {
                url: "../html/exportInfoTemplate.html",
                forceCache: true
            }
        }
    });
    
    /****************************
     * decapod.pdfExportOptions *
     ****************************/
    
    fluid.registerNamespace("decapod.pdfExportOptions");
    
    decapod.pdfExportOptions.produceTree = function (that) {
        return {
            documentResolutionLabel: {
                messagekey: "documentResolutionLabel"
            },
            documentResolution: {
                value: "${dpi}"
            },
            documentDimensionsLabel: {
                messagekey: "documentDimensionsLabel"
            },
            documentDimensions: {
                messagekey: "documentDimensions"
            },
            exportButton: {
                messagekey: "exportButton"
            }
        };
    };
    
    decapod.pdfExportOptions.finalInit = function (that) {
        that.applier.modelChanged.addListener("dpi", that.events.afterModelChanged.fire);
        
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.pdfExportOptions", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.pdfExportOptions.finalInit",
        produceTree: "decapod.pdfExportOptions.produceTree",
        selectors: {
            documentResolutionLabel: ".dc-pdfExportOptions-documentResolutionLabel",
            documentResolution: ".dc-pdfExportOptions-documentResolution",
            documentDimensionsLabel: ".dc-pdfExportOptions-documentDimensionsLabel",
            documentDimensions: ".dc-pdfExportOptions-documentDimensions"
        },
        model: {
            dpi: "300"
        },
        resources: {
            template: {
                url: "../html/pdfExportOptionsTemplate.html",
                forceCache: true
            }
        },
        strings: {
            documentResolutionLabel: "Output Image resolution:",
            documentDimensionsLabel: "Output dimensions:",
            documentDimensions: "A4(210 x 297mm / 8.3 x 11.7in.)"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null
        }
    });
    
    /**************************
     * decapod.exportControls *
     **************************/
    
    fluid.registerNamespace("decapod.exportControls");

    decapod.exportControls.produceTree = function (that) {
        return {
            expander: [
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportStart,
                    trueTree: {
                        trigger: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.trigger"
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportProgress,
                    trueTree: {
                        progress: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.progress"
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportDownload,
                    trueTree: {
                        download: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.download"
                            }
                        }
                    }
                }
            ]
        };
    };
    
    decapod.exportControls.updateModel = function (that, modelPath, value) {
        that.applier.requestChange(modelPath, value);
    };
    
    decapod.exportControls.preInit = function (that) {
        // expose methods to be used by listeners
        that.refreshView = function () {
            that.refreshView();
        };
        
        that.updateModel = function (newModel) {
            that.updateModel(newModel);
        };
        
        // work around for FLUID-4192
        that.initialRender = function () {
            setTimeout(that.refreshView, 1);
        };
    };

    decapod.exportControls.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.controls.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.exportControls", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportControls.finalInit",
        preInitFunction: "decapod.exportControls.preInit",
        produceTree: "decapod.exportControls.produceTree",
        selectors: {
            trigger: ".dc-exportTypControls-trigger",
            progress: ".dc-exportTypControls-progress",
            download: ".dc-exportTypControls-download"
        },
        strings: {
            trigger: "Start Export",
            progressMessage: "Export Progress",
            download: "Download Link",
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null,
            onExportTrigger: null,
            onReady: null
        },
        listeners: {
            "afterModelChanged.refreshView": "{exportControls}.refreshView",
            "afterFetchResources.render": "{exportControls}.initialRender",
            "onExportTrigger.updateModel": {
                listener: "{exportControls}.updateModel",
                args: [{
                    showExportStart: false,
                    showExportProgress: true,
                    showExportDownload: false
                }]
            }
        },
        model: {
            showExportStart: true,
            showExportProgress: false,
            showExportDownload: false,
            downloadURL: ""
        },
        invokers: {
            updateModel: "decapod.exportControls.updateModel"
        },
        resources: {
            controls: {
                url: "../html/exportControlsTemplate.html",
                forceCache: true
            },
            trigger: {
                url: "../html/exportControlsTriggerTemplate.html",
                forceCache: true
            },
            progress: {
                url: "../html/exportControlsProgressTemplate.html",
                forceCache: true
            },
            download: {
                url: "../html/exportControlsDownloadTemplate.html",
                forceCache: true
            }
        }
    });
    
    /**********************************
     * decapod.exportControls.trigger *
     **********************************/
    
    fluid.registerNamespace("decapod.exportControls.trigger");
    
    decapod.exportControls.trigger.produceTree = function (that) {
        return {
            trigger: {
                messagekey: "trigger",
                decorators: [{
                    type: "jQuery",
                    func: "click",
                    args: function () { that.events.afterTriggered.fire(); }
                }]
            }
        };
    };
    
    decapod.exportControls.trigger.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportControls.trigger", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportControls.trigger.finalInit",
        produceTree: "decapod.exportControls.trigger.produceTree",
        selectors: {
            trigger: ".dc-exportTypControls-trigger-exportControl"
        },
        strings: {
            trigger: "Start Export"
        },
        events: {
            afterFetchResources: null,
            afterTriggered: null
        },
        resources: {
            template: {
                url: "../html/exportControlsTriggerTemplate.html",
                forceCache: true
            }
        }
    });
    
    /***********************************
     * decapod.exportControls.progress *
     ***********************************/
    
    fluid.registerNamespace("decapod.exportControls.progress");
    
    decapod.exportControls.progress.produceTree = function (that) {
        return {
            message: {
                messagekey: "message"
            }
        };
    };
    
    decapod.exportControls.progress.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportControls.progress", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportControls.progress.finalInit",
        produceTree: "decapod.exportControls.progress.produceTree",
        selectors: {
            message: ".dc-exportTypControls-progress-message"
        },
        strings: {
            message: "Export Progress"
        },
        events: {
            afterFetchResources: null
        },
        resources: {
            template: {
                url: "../html/exportControlsProgressTemplate.html",
                forceCache: true
            }
        }
    });
    
    /***********************************
     * decapod.exportControls.download *
     ***********************************/
    
    fluid.registerNamespace("decapod.exportControls.download");
    
    decapod.exportControls.download.updateModel = function (that, url) {
        that.applier.requestChange("downloadURL", url);
    };
    
    decapod.exportControls.download.produceTree = function (that) {
        return {
            download: {
                linktext: {
                    messagekey: "download"
                },
                target: "${downloadURL}"
            },
            restart: {
                messagekey: "restart"
            }
        };
    };
    
    decapod.exportControls.download.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportControls.download", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportControls.download.finalInit",
        produceTree: "decapod.exportControls.download.produceTree",
        invokers: {
            updateModel: "decapod.exportControls.download.updateModel"
        },
        selectors: {
            download: ".dc-exportTypControls-download-download",
            restart: ".dc-exportTypControls-download-restart"
        },
        strings: {
            download: "Download Link",
            restart: "Start Over"
        },
        events: {
            afterModelChanged: null,
            afterFetchResources: null
        },
        model: {
            downloadURL: ""
        },
        resources: {
            template: {
                url: "../html/exportControlsDownloadTemplate.html",
                forceCache: true
            }
        }
    });
})(jQuery);
