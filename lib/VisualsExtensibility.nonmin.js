!function(modules) {
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: !1
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.loaded = !0, module.exports;
    }
    var installedModules = {};
    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
    __webpack_require__.p = "", __webpack_require__(0);
}({
    0: function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(440);
    },
    440: function(module, exports, __webpack_require__) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
        window.jsCommon = window.jsCommon || {}, window.powerbi = window.powerbi || {}, 
        window.debug = window.debug || {}, window.InJs = window.InJs || {}, __webpack_require__(441);
    },
    441: function(module, exports, __webpack_require__) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
        __webpack_require__(442), __webpack_require__(443), __webpack_require__(444), __webpack_require__(445), 
        __webpack_require__(446), __webpack_require__(447), __webpack_require__(448), __webpack_require__(449), 
        __webpack_require__(450), __webpack_require__(451), __webpack_require__(452), __webpack_require__(453);
    },
    442: function(module, exports) {
        window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
        window.jasmine, window.Microsoft;
    },
    443: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var visuals;
            !function(visuals) {
                var telemetry;
                !function(telemetry) {
                    function generateGuid() {
                        var guid = "", idx = 0;
                        for (idx = 0; 32 > idx; idx += 1) {
                            var guidDigitsItem = 16 * Math.random() | 0;
                            switch (idx) {
                              case 8:
                              case 12:
                              case 16:
                              case 20:
                                guid += "-";
                            }
                            guid += guidDigitsItem.toString(16);
                        }
                        return guid;
                    }
                    telemetry.generateGuid = generateGuid;
                }(telemetry = visuals.telemetry || (visuals.telemetry = {}));
            }(visuals = powerbi.visuals || (powerbi.visuals = {}));
        }(powerbi || (powerbi = {}));
    },
    444: function(module, exports) {
        var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var visuals;
            !function(visuals) {
                var telemetry;
                !function(telemetry) {
                    var g = jsCommon.Utility.generateGuid;
                    telemetry.VisualApiUsage = function(name, apiVersion, custom, parentId, isError, errorSource, errorCode) {
                        void 0 === isError && (isError = !1), void 0 === errorSource && (errorSource = void 0), 
                        void 0 === errorCode && (errorCode = void 0);
                        var info = {
                            name: name,
                            apiVersion: apiVersion,
                            custom: custom,
                            parentId: parentId,
                            isError: isError,
                            errorSource: errorSource,
                            errorCode: errorCode
                        }, event = {
                            name: "PBI.Visual.ApiUsage",
                            category: 1,
                            time: Date.now(),
                            id: g(),
                            getFormattedInfoObject: function() {
                                var formattedObject = {
                                    name: info.name,
                                    apiVersion: info.apiVersion,
                                    custom: info.custom,
                                    parentId: info.parentId,
                                    isError: info.isError
                                };
                                return "undefined" != typeof info.errorSource && (formattedObject.errorSource = powerbi.visuals.telemetry.ErrorSource[info.errorSource]), 
                                "undefined" != typeof info.errorCode && (formattedObject.errorCode = info.errorCode), 
                                formattedObject;
                            },
                            info: info,
                            privateFields: [],
                            orgInfoFields: []
                        };
                        return "undefined" != typeof powerbi.visuals.telemetry.VisualApiUsageLoggers && (event.loggers = powerbi.visuals.telemetry.VisualApiUsageLoggers), 
                        event;
                    }, telemetry.VisualException = function(visualType, isCustom, apiVersion, source, lineNumber, columnNumber, stack, message) {
                        var info = {
                            visualType: visualType,
                            isCustom: isCustom,
                            apiVersion: apiVersion,
                            source: source,
                            lineNumber: lineNumber,
                            columnNumber: columnNumber,
                            stack: stack,
                            message: message
                        }, event = {
                            name: "PBI.Visual.Exception",
                            category: 2,
                            time: Date.now(),
                            id: telemetry.generateGuid(),
                            getFormattedInfoObject: function() {
                                var formattedObject = {
                                    visualType: info.visualType,
                                    isCustom: info.isCustom,
                                    apiVersion: info.apiVersion,
                                    source: info.source,
                                    lineNumber: info.lineNumber,
                                    columnNumber: info.columnNumber,
                                    stack: info.stack,
                                    message: info.message
                                };
                                return formattedObject;
                            },
                            info: info,
                            privateFields: [],
                            orgInfoFields: []
                        };
                        return "undefined" != typeof telemetry.VisualExceptionLoggers && (event.loggers = telemetry.VisualExceptionLoggers), 
                        event;
                    };
                }(telemetry = visuals.telemetry || (visuals.telemetry = {}));
            }(visuals = powerbi.visuals || (powerbi.visuals = {}));
        }(powerbi || (powerbi = {}));
    },
    445: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                function VisualPlugin(options) {
                    return function(constructor) {
                        constructor.__transform__ = options.transform;
                    };
                }
                extensibility.VisualPlugin = VisualPlugin;
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    },
    446: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                var SelectionManager = function() {
                    function SelectionManager(options) {
                        this.dataPointObjectName = "dataPoint", this.hostServices = options.hostServices, 
                        this.selectedIds = [], this.promiseFactory = this.hostServices.promiseFactory();
                    }
                    return SelectionManager.prototype.select = function(selectionId, multiSelect) {
                        void 0 === multiSelect && (multiSelect = !1);
                        var deferred = this.promiseFactory.defer();
                        return this.hostServices.shouldRetainSelection() ? this.sendSelectionToHost([ selectionId ]) : (this.selectInternal(selectionId, multiSelect), 
                        this.sendSelectionToHost(this.selectedIds)), deferred.resolve(this.selectedIds), 
                        deferred.promise;
                    }, SelectionManager.prototype.showContextMenu = function(selectionId, position) {
                        var deferred = this.promiseFactory.defer();
                        return this.sendContextMenuToHost(selectionId, position), deferred.resolve(null), 
                        deferred.promise;
                    }, SelectionManager.prototype.hasSelection = function() {
                        return this.selectedIds.length > 0;
                    }, SelectionManager.prototype.clear = function() {
                        var deferred = this.promiseFactory.defer();
                        return this.selectedIds = [], this.sendSelectionToHost([]), deferred.resolve(null), 
                        deferred.promise;
                    }, SelectionManager.prototype.getSelectionIds = function() {
                        return this.selectedIds;
                    }, SelectionManager.prototype.sendSelectionToHost = function(ids) {
                        var dataPointObjectName = this.dataPointObjectName, selectArgs = {
                            visualObjects: _.chain(ids).filter(function(value) {
                                return value.hasIdentity();
                            }).map(function(value) {
                                return {
                                    objectName: dataPointObjectName,
                                    selectorsByColumn: value.getSelectorsByColumn()
                                };
                            }).value(),
                            selectors: void 0
                        }, shouldInsertSelectors = !1;
                        _.isEmpty(ids) || (shouldInsertSelectors = ids[0].getSelector() && !ids[0].getSelectorsByColumn()), 
                        shouldInsertSelectors && (selectArgs.selectors = _.chain(ids).filter(function(value) {
                            return value.hasIdentity();
                        }).map(function(value) {
                            return value.getSelector();
                        }).value()), this.hostServices.onSelect(selectArgs);
                    }, SelectionManager.prototype.sendContextMenuToHost = function(selectionId, position) {
                        var selectors = this.getSelectorsByColumn([ selectionId ]);
                        if (!_.isEmpty(selectors)) {
                            var args = {
                                data: selectors,
                                position: position
                            };
                            this.hostServices.onContextMenu(args);
                        }
                    }, SelectionManager.prototype.getSelectorsByColumn = function(selectionIds) {
                        return _(selectionIds).filter(function(value) {
                            return value.hasIdentity;
                        }).map(function(value) {
                            return value.getSelectorsByColumn();
                        }).compact().value();
                    }, SelectionManager.prototype.selectInternal = function(selectionId, multiSelect) {
                        SelectionManager.containsSelection(this.selectedIds, selectionId) ? this.selectedIds = multiSelect ? this.selectedIds.filter(function(d) {
                            return !selectionId.equals(d);
                        }) : this.selectedIds.length > 1 ? [ selectionId ] : [] : multiSelect ? this.selectedIds.push(selectionId) : this.selectedIds = [ selectionId ];
                    }, SelectionManager.containsSelection = function(list, id) {
                        return list.some(function(d) {
                            return id.equals(d);
                        });
                    }, SelectionManager;
                }();
                extensibility.SelectionManager = SelectionManager;
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    },
    447: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                var SelectionIdBuilder = function() {
                    function SelectionIdBuilder() {}
                    return SelectionIdBuilder.prototype.withCategory = function(categoryColumn, index) {
                        return categoryColumn && categoryColumn.source && categoryColumn.source.queryName && categoryColumn.identity && (this.ensureDataMap()[categoryColumn.source.queryName] = categoryColumn.identity[index]), 
                        this;
                    }, SelectionIdBuilder.prototype.withSeries = function(seriesColumn, valueColumn) {
                        return seriesColumn && seriesColumn.source && seriesColumn.source.queryName && valueColumn && (this.ensureDataMap()[seriesColumn.source.queryName] = valueColumn.identity), 
                        this;
                    }, SelectionIdBuilder.prototype.withMeasure = function(measureId) {
                        return this.measure = measureId, this;
                    }, SelectionIdBuilder.prototype.createSelectionId = function() {
                        return powerbi.visuals.SelectionId.createWithSelectorForColumnAndMeasure(this.ensureDataMap(), this.measure);
                    }, SelectionIdBuilder.prototype.ensureDataMap = function() {
                        return this.dataMap || (this.dataMap = {}), this.dataMap;
                    }, SelectionIdBuilder;
                }();
                extensibility.SelectionIdBuilder = SelectionIdBuilder;
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    },
    448: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                function createVisualAdapter(visualPlugin, telemetryService) {
                    var visualAdapter = new VisualAdapter(visualPlugin, telemetryService);
                    return new extensibility.VisualSafeExecutionWrapper(visualAdapter, visualPlugin, telemetryService, visualAdapter.isPluginInError);
                }
                extensibility.visualApiVersions = [], extensibility.createVisualAdapter = createVisualAdapter;
                var VisualAdapter = function() {
                    function VisualAdapter(visualPlugin, telemetryService) {
                        this.isPluginInError = !1, this.telemetryService = telemetryService, this.plugin = visualPlugin;
                        var version = visualPlugin.apiVersion, versionIndex = this.getVersionIndex(version);
                        version ? versionIndex > -1 ? (this.apiVersionIndex = versionIndex, this.legacy = !1) : this.isPluginInError = !0 : this.legacy = !0;
                    }
                    return VisualAdapter.prototype.init = function(options) {
                        if (options.element.empty(), this.legacy) this.visual = this.plugin.create(), this.visualLegacy.init(options); else {
                            var host = extensibility.visualApiVersions[this.apiVersionIndex].hostAdapter(options.host);
                            this.visual = this.plugin.create({
                                element: options.element.get(0),
                                host: host
                            }), this.overloadMethods();
                        }
                    }, VisualAdapter.prototype.update = function(options) {
                        (options.type & powerbi.VisualUpdateType.Resize) === powerbi.VisualUpdateType.Resize && this.visualHasMethod("onResizing") ? (this.plugin.custom && this.visualHasMethod("update") && this.visualLegacy.update(options), 
                        this.onResizing(options.viewport, options.resizeMode)) : this.visualHasMethod("update") ? this.visualLegacy.update(options) : ((!options.type || options.type & powerbi.VisualUpdateType.Data) && this.onDataChanged(_.pick(options, [ "dataViews", "operationKind" ])), 
                        options.type & powerbi.VisualUpdateType.ViewMode && this.onViewModeChanged(options.viewMode));
                    }, VisualAdapter.prototype.destroy = function() {
                        this.visualHasMethod("destroy") && this.visualLegacy.destroy();
                    }, VisualAdapter.prototype.enumerateObjectInstances = function(options) {
                        return this.visualHasMethod("enumerateObjectInstances") ? this.visualLegacy.enumerateObjectInstances(options) : void 0;
                    }, VisualAdapter.prototype.enumerateObjectRepetition = function() {
                        return this.visualHasMethod("enumerateObjectRepetition") ? this.visualLegacy.enumerateObjectRepetition() : void 0;
                    }, VisualAdapter.prototype.onResizing = function(finalViewport, resizeMode) {
                        this.visualHasMethod("onResizing") && this.visualLegacy.onResizing(finalViewport, resizeMode);
                    }, VisualAdapter.prototype.onDataChanged = function(options) {
                        this.visualHasMethod("onDataChanged") && this.visualLegacy.onDataChanged(options);
                    }, VisualAdapter.prototype.onViewModeChanged = function(viewMode) {
                        this.visualHasMethod("onViewModeChanged") && this.visualLegacy.onViewModeChanged(viewMode);
                    }, VisualAdapter.prototype.onClearSelection = function() {
                        this.visualHasMethod("onClearSelection") && this.visualLegacy.onClearSelection();
                    }, VisualAdapter.prototype.canResizeTo = function(viewport) {
                        return this.visualHasMethod("canResizeTo") ? this.visualLegacy.canResizeTo(viewport) : void 0;
                    }, VisualAdapter.prototype.unwrap = function() {
                        return this.visual;
                    }, Object.defineProperty(VisualAdapter.prototype, "visualNew", {
                        get: function() {
                            return this.legacy ? void 0 : this.visual;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(VisualAdapter.prototype, "visualLegacy", {
                        get: function() {
                            return this.legacy ? this.visual : void 0;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), VisualAdapter.prototype.visualHasMethod = function(methodName) {
                        var visual = this.legacy ? this.visualLegacy : this.visualNew;
                        return visual && _.isFunction(visual[methodName]);
                    }, VisualAdapter.prototype.getVersionIndex = function(version) {
                        if (version) for (var versionCount = extensibility.visualApiVersions.length, i = 0; versionCount > i; i++) if (extensibility.visualApiVersions[i].version === version) return i;
                        return -1;
                    }, VisualAdapter.prototype.overloadMethods = function() {
                        var overloads = this.getCompiledOverloads();
                        for (var key in overloads) this[key] = overloads[key];
                    }, VisualAdapter.prototype.getCompiledOverloads = function() {
                        for (var overloads = {}, versionIndex = this.apiVersionIndex, visualNew = this.visualNew, i = 0; versionIndex >= i; i++) {
                            var overloadFactory = extensibility.visualApiVersions[i].overloads;
                            _.isFunction(overloadFactory) && _.assign(overloads, overloadFactory(visualNew));
                        }
                        return overloads;
                    }, VisualAdapter;
                }();
                extensibility.VisualAdapter = VisualAdapter;
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    },
    449: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                function translateVisualPlugin(plugin) {
                    translateCapabilities(plugin.capabilities);
                }
                function translateCapabilities(capabilities) {
                    capabilities && (translateObjects(capabilities.objects), translateDataRoles(capabilities.dataRoles));
                }
                function translateObjects(objects) {
                    for (var key in objects) {
                        var object = objects[key];
                        if (object) {
                            var properties = object.properties;
                            if (properties) for (var pKey in properties) {
                                var property = properties[pKey];
                                if (property) {
                                    var propertyType = property.type;
                                    propertyType && propertyType.enumeration && (propertyType.enumeration = powerbi.createEnumType(propertyType.enumeration));
                                }
                            }
                        }
                    }
                }
                function translateDataRoles(dataRoles) {
                    for (var key in dataRoles) {
                        var dataRole = dataRoles[key];
                        if (dataRole && dataRole.kind) switch (dataRole.kind.toString().toLowerCase()) {
                          case "grouping":
                            dataRole.kind = powerbi.VisualDataRoleKind.Grouping;
                            break;

                          case "measure":
                            dataRole.kind = powerbi.VisualDataRoleKind.Measure;
                            break;

                          case "groupingormeasure":
                            dataRole.kind = powerbi.VisualDataRoleKind.GroupingOrMeasure;
                        }
                    }
                }
                extensibility.translateVisualPlugin = translateVisualPlugin;
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    },
    450: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                var VisualException = powerbi.visuals.telemetry.VisualException, VisualSafeExecutionWrapper = function() {
                    function VisualSafeExecutionWrapper(wrappedVisual, visualPlugin, telemetryService, isPluginInError, silent) {
                        this.wrappedVisual = wrappedVisual, this.visualPlugin = visualPlugin, this.telemetryService = telemetryService, 
                        this.isPluginInError = isPluginInError, this.silent = silent, this.telemetryService && (this.perfLoadEvent = this.telemetryService.startEvent(powerbi.visuals.telemetry.VisualApiUsage, visualPlugin.name, visualPlugin.apiVersion, !!visualPlugin.custom, void 0, isPluginInError, powerbi.visuals.telemetry.ErrorSource.User, void 0));
                    }
                    return VisualSafeExecutionWrapper.prototype.init = function(options) {
                        var _this = this;
                        this.wrappedVisual.init && this.executeSafely(function() {
                            return _this.wrappedVisual.init(options);
                        });
                    }, VisualSafeExecutionWrapper.prototype.destroy = function() {
                        var _this = this;
                        this.wrappedVisual.destroy && this.executeSafely(function() {
                            return _this.wrappedVisual.destroy();
                        }), this.perfLoadEvent && (this.perfLoadEvent = null);
                    }, VisualSafeExecutionWrapper.prototype.update = function(options) {
                        var _this = this;
                        this.wrappedVisual.update && this.executeSafely(function() {
                            _this.wrappedVisual.update(options), _this.perfLoadEvent && (_this.perfLoadEvent.resolve(), 
                            _this.perfLoadEvent = null);
                        });
                    }, VisualSafeExecutionWrapper.prototype.onResizing = function(finalViewport, resizeMode) {
                        var _this = this;
                        this.wrappedVisual.onResizing && this.executeSafely(function() {
                            return _this.wrappedVisual.onResizing(finalViewport, resizeMode);
                        });
                    }, VisualSafeExecutionWrapper.prototype.onDataChanged = function(options) {
                        var _this = this;
                        this.wrappedVisual.onDataChanged && this.executeSafely(function() {
                            return _this.wrappedVisual.onDataChanged(options);
                        });
                    }, VisualSafeExecutionWrapper.prototype.onViewModeChanged = function(viewMode) {
                        var _this = this;
                        this.wrappedVisual.onViewModeChanged && this.executeSafely(function() {
                            return _this.wrappedVisual.onViewModeChanged(viewMode);
                        });
                    }, VisualSafeExecutionWrapper.prototype.onClearSelection = function() {
                        var _this = this;
                        this.wrappedVisual.onClearSelection && this.executeSafely(function() {
                            return _this.wrappedVisual.onClearSelection();
                        });
                    }, VisualSafeExecutionWrapper.prototype.canResizeTo = function(viewport) {
                        var _this = this;
                        return this.wrappedVisual.canResizeTo ? this.executeSafely(function() {
                            return _this.wrappedVisual.canResizeTo(viewport);
                        }) : void 0;
                    }, VisualSafeExecutionWrapper.prototype.enumerateObjectInstances = function(options) {
                        var _this = this;
                        return this.wrappedVisual.enumerateObjectInstances ? this.executeSafely(function() {
                            return _this.wrappedVisual.enumerateObjectInstances(options);
                        }) : void 0;
                    }, VisualSafeExecutionWrapper.prototype.enumerateObjectRepetition = function() {
                        var _this = this;
                        return this.wrappedVisual.enumerateObjectRepetition ? this.executeSafely(function() {
                            return _this.wrappedVisual.enumerateObjectRepetition();
                        }) : void 0;
                    }, VisualSafeExecutionWrapper.prototype.unwrap = function() {
                        var visual = this.wrappedVisual;
                        return visual.unwrap ? visual.unwrap() : visual;
                    }, VisualSafeExecutionWrapper.prototype.isCustomVisual = function() {
                        return this.visualPlugin.custom;
                    }, VisualSafeExecutionWrapper.prototype.executeSafely = function(callback) {
                        try {
                            return callback();
                        } catch (exception) {
                            !this.silent, this.telemetryService && (this.telemetryService.logEvent(VisualException, this.visualPlugin.name, !!this.visualPlugin.custom, this.visualPlugin.apiVersion, exception.fileName, exception.lineNumber, exception.columnNumber, exception.stack, exception.message), 
                            this.perfLoadEvent && (this.perfLoadEvent.reject(), this.perfLoadEvent = null));
                        }
                    }, VisualSafeExecutionWrapper;
                }();
                extensibility.VisualSafeExecutionWrapper = VisualSafeExecutionWrapper;
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    },
    451: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                var legacy;
                !function(legacy) {
                    function isOldSelectEventArgs(args) {
                        var castArgs = args;
                        return null != castArgs.data || null != castArgs.selectors;
                    }
                    function getSelectorsByColumn(args) {
                        return args.data2;
                    }
                    function getSelectors(args) {
                        return _.isEmpty(args.selectors) ? args.data : args.selectors;
                    }
                    legacy.isOldSelectEventArgs = isOldSelectEventArgs, legacy.getSelectorsByColumn = getSelectorsByColumn, 
                    legacy.getSelectors = getSelectors;
                }(legacy = extensibility.legacy || (extensibility.legacy = {}));
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    },
    452: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                var v100;
                !function(v100) {
                    function convertLegacyUpdateType(options) {
                        var type = options.type || powerbi.VisualUpdateType.Data;
                        return type & powerbi.VisualUpdateType.Resize && 2 === options.resizeMode && (type |= powerbi.VisualUpdateType.ResizeEnd), 
                        type;
                    }
                    v100.convertLegacyUpdateType = convertLegacyUpdateType;
                    var overloadFactory = function(visual) {
                        return {
                            update: function(options) {
                                visual.update && visual.update({
                                    viewport: options.viewport,
                                    dataViews: options.dataViews,
                                    type: convertLegacyUpdateType(options)
                                });
                            },
                            destroy: function() {
                                visual.destroy && visual.destroy();
                            },
                            enumerateObjectInstances: function(options) {
                                return visual.enumerateObjectInstances ? visual.enumerateObjectInstances(options) : void 0;
                            }
                        };
                    }, hostAdapter = function(host) {
                        return {};
                    };
                    extensibility.visualApiVersions.push({
                        version: "1.0.0",
                        overloads: overloadFactory,
                        hostAdapter: hostAdapter
                    });
                }(v100 = extensibility.v100 || (extensibility.v100 = {}));
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    },
    453: function(module, exports) {
        var powerbi, powerbi = (window.jsCommon, window.powerbi);
        window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
        !function(powerbi) {
            var extensibility;
            !function(extensibility) {
                var v110;
                !function(v110) {
                    var overloadFactory = function(visual) {
                        return {
                            update: function(options) {
                                if (visual.update) {
                                    var updateOptions = {
                                        viewport: options.viewport,
                                        dataViews: options.dataViews,
                                        type: extensibility.v100.convertLegacyUpdateType(options)
                                    }, transform = visual.constructor.__transform__;
                                    _.isFunction(transform) ? visual.update(updateOptions, transform(updateOptions.dataViews)) : visual.update(updateOptions);
                                }
                            }
                        };
                    }, hostAdapter = function(host) {
                        return {
                            createSelectionIdBuilder: function() {
                                return new powerbi.visuals.SelectionIdBuilder();
                            },
                            createSelectionManager: function() {
                                return new extensibility.SelectionManager({
                                    hostServices: host
                                });
                            },
                            colors: powerbi.visuals.ThemeManager.getDefaultTheme()
                        };
                    };
                    extensibility.visualApiVersions.push({
                        version: "1.1.0",
                        overloads: overloadFactory,
                        hostAdapter: hostAdapter
                    });
                }(v110 = extensibility.v110 || (extensibility.v110 = {}));
            }(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
        }(powerbi || (powerbi = {}));
    }
});