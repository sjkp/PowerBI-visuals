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
}([ function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(352);
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
    window.jsCommon = window.jsCommon || {}, window.powerbi = window.powerbi || {}, 
    window.debug = window.debug || {}, window.InJs = window.InJs || {}, __webpack_require__(353);
}, function(module, exports, __webpack_require__) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
    __webpack_require__(354), __webpack_require__(355), __webpack_require__(356), __webpack_require__(357), 
    __webpack_require__(358), __webpack_require__(359), __webpack_require__(360), __webpack_require__(361), 
    __webpack_require__(362), __webpack_require__(363), __webpack_require__(364), __webpack_require__(365), 
    __webpack_require__(366), __webpack_require__(367), __webpack_require__(368), __webpack_require__(369), 
    __webpack_require__(370), __webpack_require__(371), __webpack_require__(372), __webpack_require__(373), 
    __webpack_require__(374), __webpack_require__(375), __webpack_require__(376), __webpack_require__(377), 
    __webpack_require__(378), __webpack_require__(379), __webpack_require__(380), __webpack_require__(381), 
    __webpack_require__(382), __webpack_require__(383), __webpack_require__(384), __webpack_require__(385), 
    __webpack_require__(386), __webpack_require__(387), __webpack_require__(388), __webpack_require__(389), 
    __webpack_require__(390), __webpack_require__(391), __webpack_require__(392), __webpack_require__(393), 
    __webpack_require__(394), __webpack_require__(395), __webpack_require__(396), __webpack_require__(397), 
    __webpack_require__(398), __webpack_require__(399), __webpack_require__(400), __webpack_require__(401), 
    __webpack_require__(402), __webpack_require__(403), __webpack_require__(404), __webpack_require__(405), 
    __webpack_require__(406), __webpack_require__(407), __webpack_require__(408), __webpack_require__(409), 
    __webpack_require__(410), __webpack_require__(411), __webpack_require__(412), __webpack_require__(413), 
    __webpack_require__(414), __webpack_require__(415), __webpack_require__(416), __webpack_require__(417), 
    __webpack_require__(418), __webpack_require__(419), __webpack_require__(420), __webpack_require__(421), 
    __webpack_require__(422), __webpack_require__(423), __webpack_require__(424), __webpack_require__(425), 
    __webpack_require__(426), __webpack_require__(427), __webpack_require__(428), __webpack_require__(429), 
    __webpack_require__(430), __webpack_require__(431), __webpack_require__(432), __webpack_require__(433), 
    __webpack_require__(434), __webpack_require__(435), __webpack_require__(436), __webpack_require__(437), 
    __webpack_require__(438), __webpack_require__(439);
}, function(module, exports) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi), __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var DefaultSQExprVisitorWithArg = function() {
                function DefaultSQExprVisitorWithArg() {}
                return DefaultSQExprVisitorWithArg.prototype.visitEntity = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitColumnRef = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitMeasureRef = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitAggr = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitPercentile = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitHierarchy = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitHierarchyLevel = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitPropertyVariationSource = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitSelectRef = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitBetween = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitIn = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitAnd = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitOr = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitCompare = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitContains = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitExists = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitNot = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitStartsWith = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitConstant = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitDateSpan = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitDateAdd = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitNow = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitDefaultValue = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitAnyValue = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitArithmetic = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitFillRule = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitResourcePackageItem = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitScopedEval = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitWithRef = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitTransformTableRef = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitTransformOutputRoleRef = function(expr, arg) {
                    return this.visitDefault(expr, arg);
                }, DefaultSQExprVisitorWithArg.prototype.visitDefault = function(expr, arg) {}, 
                DefaultSQExprVisitorWithArg;
            }();
            data.DefaultSQExprVisitorWithArg = DefaultSQExprVisitorWithArg;
            var DefaultSQExprVisitor = function(_super) {
                function DefaultSQExprVisitor() {
                    _super.apply(this, arguments);
                }
                return __extends(DefaultSQExprVisitor, _super), DefaultSQExprVisitor;
            }(DefaultSQExprVisitorWithArg);
            data.DefaultSQExprVisitor = DefaultSQExprVisitor;
            var DefaultSQExprVisitorWithTraversal = function() {
                function DefaultSQExprVisitorWithTraversal() {}
                return DefaultSQExprVisitorWithTraversal.prototype.visitEntity = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitColumnRef = function(expr) {
                    expr.source.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitMeasureRef = function(expr) {
                    expr.source.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitAggr = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitPercentile = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitHierarchy = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitHierarchyLevel = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitPropertyVariationSource = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitSelectRef = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitBetween = function(expr) {
                    expr.arg.accept(this), expr.lower.accept(this), expr.upper.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitIn = function(expr) {
                    for (var args = expr.args, i = 0, len = args.length; len > i; i++) args[i].accept(this);
                    for (var values = expr.values, i = 0, len = values.length; len > i; i++) for (var valueTuple = values[i], j = 0, jlen = valueTuple.length; jlen > j; j++) valueTuple[j].accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitAnd = function(expr) {
                    expr.left.accept(this), expr.right.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitOr = function(expr) {
                    expr.left.accept(this), expr.right.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitCompare = function(expr) {
                    expr.left.accept(this), expr.right.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitContains = function(expr) {
                    expr.left.accept(this), expr.right.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitExists = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitNot = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitStartsWith = function(expr) {
                    expr.left.accept(this), expr.right.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitConstant = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitDateSpan = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitDateAdd = function(expr) {
                    expr.arg.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitNow = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitDefaultValue = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitAnyValue = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitArithmetic = function(expr) {
                    expr.left.accept(this), expr.right.accept(this);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitFillRule = function(expr) {
                    expr.input.accept(this);
                    var rule = expr.rule, gradient2 = rule.linearGradient2, gradient3 = rule.linearGradient3;
                    gradient2 && this.visitLinearGradient2(gradient2), gradient3 && this.visitLinearGradient3(gradient3);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitLinearGradient2 = function(gradient2) {
                    this.visitFillRuleStop(gradient2.min), this.visitFillRuleStop(gradient2.max);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitLinearGradient3 = function(gradient3) {
                    this.visitFillRuleStop(gradient3.min), this.visitFillRuleStop(gradient3.mid), this.visitFillRuleStop(gradient3.max);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitResourcePackageItem = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitScopedEval = function(expr) {
                    expr.expression.accept(this);
                    for (var _i = 0, _a = expr.scope; _i < _a.length; _i++) {
                        var scopeExpr = _a[_i];
                        scopeExpr.accept(this);
                    }
                }, DefaultSQExprVisitorWithTraversal.prototype.visitWithRef = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitTransformTableRef = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitTransformOutputRoleRef = function(expr) {
                    this.visitDefault(expr);
                }, DefaultSQExprVisitorWithTraversal.prototype.visitDefault = function(expr) {}, 
                DefaultSQExprVisitorWithTraversal.prototype.visitFillRuleStop = function(stop) {
                    stop.color.accept(this);
                    var value = stop.value;
                    value && value.accept(this);
                }, DefaultSQExprVisitorWithTraversal;
            }();
            data.DefaultSQExprVisitorWithTraversal = DefaultSQExprVisitorWithTraversal;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        function createEnumType(members) {
            return new EnumType(members);
        }
        powerbi.createEnumType = createEnumType;
        var EnumType = function() {
            function EnumType(allMembers) {
                this.allMembers = allMembers;
            }
            return EnumType.prototype.members = function(validMembers) {
                var allMembers = this.allMembers;
                if (!validMembers) return allMembers;
                for (var membersToReturn = [], _i = 0, allMembers_1 = allMembers; _i < allMembers_1.length; _i++) {
                    var member = allMembers_1[_i];
                    _.contains(validMembers, member.value) && membersToReturn.push(member);
                }
                return membersToReturn;
            }, EnumType;
        }();
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var FillDefinitionHelpers;
        !function(FillDefinitionHelpers) {
            function createSolidFillDefinition(color) {
                return color ? {
                    solid: {
                        color: powerbi.data.SQExprBuilder.text(color)
                    }
                } : void 0;
            }
            function createSolidFillSQExpr(color) {
                return createSolidFillDefinition(color) || powerbi.data.SQExprBuilder.nullConstant();
            }
            FillDefinitionHelpers.createSolidFillDefinition = createSolidFillDefinition, FillDefinitionHelpers.createSolidFillSQExpr = createSolidFillSQExpr;
        }(FillDefinitionHelpers = powerbi.FillDefinitionHelpers || (powerbi.FillDefinitionHelpers = {}));
        var FillSolidColorTypeDescriptor;
        !function(FillSolidColorTypeDescriptor) {
            function nullable(descriptor) {
                if (descriptor === !0) return !1;
                var advancedDescriptor = descriptor;
                return !!advancedDescriptor.nullable;
            }
            FillSolidColorTypeDescriptor.nullable = nullable;
        }(FillSolidColorTypeDescriptor = powerbi.FillSolidColorTypeDescriptor || (powerbi.FillSolidColorTypeDescriptor = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var ImageDefinition;
        !function(ImageDefinition) {
            ImageDefinition.urlType = {
                misc: {
                    imageUrl: !0
                }
            };
        }(ImageDefinition = powerbi.ImageDefinition || (powerbi.ImageDefinition = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var StructuralTypeDescriptor;
        !function(StructuralTypeDescriptor) {
            function isValid(type) {
                return !!(type.fill || type.fillRule || type.filter || type.expression || type.image || type.paragraphs);
            }
            StructuralTypeDescriptor.isValid = isValid;
        }(StructuralTypeDescriptor = powerbi.StructuralTypeDescriptor || (powerbi.StructuralTypeDescriptor = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        function getPrimitiveType(extendedType) {
            return extendedType & PrimitiveTypeMask;
        }
        function isPrimitiveType(extendedType) {
            return (extendedType & PrimitiveTypeWithFlagsMask) === extendedType;
        }
        function getCategoryFromExtendedType(extendedType) {
            if (isPrimitiveType(extendedType)) return null;
            var category = ExtendedType[extendedType];
            if (category) {
                var delimIdx = category.lastIndexOf("_");
                if (delimIdx > 0) {
                    var baseCategory = category.slice(0, delimIdx);
                    ExtendedType[baseCategory] && (category = baseCategory);
                }
            }
            return category || null;
        }
        function toExtendedType(primitiveType, category) {
            var primitiveString = PrimitiveType[primitiveType], t = ExtendedType[primitiveString];
            if (null == t && (t = ExtendedType.Null), primitiveType && category) {
                var categoryType = ExtendedType[category];
                if (categoryType) {
                    var categoryPrimitiveType = getPrimitiveType(categoryType);
                    categoryPrimitiveType === PrimitiveType.Null ? (categoryType = t | categoryType, 
                    ExtendedType[categoryType] && (t = categoryType)) : categoryPrimitiveType === primitiveType && (t = categoryType);
                }
            }
            return t;
        }
        function matchesExtendedTypeWithAnyPrimitive(a, b) {
            return (a & PrimitiveTypeFlagsExcludedMask) === (b & PrimitiveTypeFlagsExcludedMask);
        }
        var EnumExtensions = jsCommon.EnumExtensions, ValueType = function() {
            function ValueType(type, category, enumType) {
                this.underlyingType = type, this.category = category, EnumExtensions.hasFlag(type, ExtendedType.Temporal) && (this.temporalType = new TemporalType(type)), 
                EnumExtensions.hasFlag(type, ExtendedType.Geography) && (this.geographyType = new GeographyType(type)), 
                EnumExtensions.hasFlag(type, ExtendedType.Miscellaneous) && (this.miscType = new MiscellaneousType(type)), 
                EnumExtensions.hasFlag(type, ExtendedType.Formatting) && (this.formattingType = new FormattingType(type)), 
                EnumExtensions.hasFlag(type, ExtendedType.Enumeration) && (this.enumType = enumType), 
                EnumExtensions.hasFlag(type, ExtendedType.Scripting) && (this.scriptingType = new ScriptType(type));
            }
            return ValueType.fromDescriptor = function(descriptor) {
                if (descriptor = descriptor || {}, descriptor.text) return ValueType.fromExtendedType(ExtendedType.Text);
                if (descriptor.integer) return ValueType.fromExtendedType(ExtendedType.Integer);
                if (descriptor.numeric) return ValueType.fromExtendedType(ExtendedType.Double);
                if (descriptor.bool) return ValueType.fromExtendedType(ExtendedType.Boolean);
                if (descriptor.dateTime) return ValueType.fromExtendedType(ExtendedType.DateTime);
                if (descriptor.duration) return ValueType.fromExtendedType(ExtendedType.Duration);
                if (descriptor.binary) return ValueType.fromExtendedType(ExtendedType.Binary);
                if (descriptor.none) return ValueType.fromExtendedType(ExtendedType.None);
                if (descriptor.scripting && descriptor.scripting.source) return ValueType.fromExtendedType(ExtendedType.ScriptSource);
                if (descriptor.enumeration) return ValueType.fromEnum(descriptor.enumeration);
                if (descriptor.temporal) {
                    if (descriptor.temporal.year) return ValueType.fromExtendedType(ExtendedType.Years_Integer);
                    if (descriptor.temporal.month) return ValueType.fromExtendedType(ExtendedType.Months_Integer);
                    if (descriptor.temporal.paddedDateTableDate) return ValueType.fromExtendedType(ExtendedType.PaddedDateTableDates);
                }
                if (descriptor.geography) {
                    if (descriptor.geography.address) return ValueType.fromExtendedType(ExtendedType.Address);
                    if (descriptor.geography.city) return ValueType.fromExtendedType(ExtendedType.City);
                    if (descriptor.geography.continent) return ValueType.fromExtendedType(ExtendedType.Continent);
                    if (descriptor.geography.country) return ValueType.fromExtendedType(ExtendedType.Country);
                    if (descriptor.geography.county) return ValueType.fromExtendedType(ExtendedType.County);
                    if (descriptor.geography.region) return ValueType.fromExtendedType(ExtendedType.Region);
                    if (descriptor.geography.postalCode) return ValueType.fromExtendedType(ExtendedType.PostalCode_Text);
                    if (descriptor.geography.stateOrProvince) return ValueType.fromExtendedType(ExtendedType.StateOrProvince);
                    if (descriptor.geography.place) return ValueType.fromExtendedType(ExtendedType.Place);
                    if (descriptor.geography.latitude) return ValueType.fromExtendedType(ExtendedType.Latitude_Double);
                    if (descriptor.geography.longitude) return ValueType.fromExtendedType(ExtendedType.Longitude_Double);
                }
                if (descriptor.misc) {
                    if (descriptor.misc.image) return ValueType.fromExtendedType(ExtendedType.Image);
                    if (descriptor.misc.imageUrl) return ValueType.fromExtendedType(ExtendedType.ImageUrl);
                    if (descriptor.misc.webUrl) return ValueType.fromExtendedType(ExtendedType.WebUrl);
                    if (descriptor.misc.barcode) return ValueType.fromExtendedType(ExtendedType.Barcode_Text);
                }
                if (descriptor.formatting) {
                    if (descriptor.formatting.color) return ValueType.fromExtendedType(ExtendedType.Color);
                    if (descriptor.formatting.formatString) return ValueType.fromExtendedType(ExtendedType.FormatString);
                    if (descriptor.formatting.alignment) return ValueType.fromExtendedType(ExtendedType.Alignment);
                    if (descriptor.formatting.labelDisplayUnits) return ValueType.fromExtendedType(ExtendedType.LabelDisplayUnits);
                    if (descriptor.formatting.fontSize) return ValueType.fromExtendedType(ExtendedType.FontSize);
                    if (descriptor.formatting.labelDensity) return ValueType.fromExtendedType(ExtendedType.LabelDensity);
                }
                return descriptor.extendedType ? ValueType.fromExtendedType(descriptor.extendedType) : descriptor.operations && descriptor.operations.searchEnabled ? ValueType.fromExtendedType(ExtendedType.SearchEnabled) : ValueType.fromExtendedType(ExtendedType.Null);
            }, ValueType.fromExtendedType = function(extendedType) {
                extendedType = extendedType || ExtendedType.Null;
                var primitiveType = getPrimitiveType(extendedType), category = getCategoryFromExtendedType(extendedType);
                return ValueType.fromPrimitiveTypeAndCategory(primitiveType, category);
            }, ValueType.fromPrimitiveTypeAndCategory = function(primitiveType, category) {
                primitiveType = primitiveType || PrimitiveType.Null, category = category || null;
                var id = primitiveType.toString();
                return category && (id += "|" + category), ValueType.typeCache[id] || (ValueType.typeCache[id] = new ValueType(toExtendedType(primitiveType, category), category));
            }, ValueType.fromEnum = function(enumType) {
                return new ValueType(ExtendedType.Enumeration, null, enumType);
            }, ValueType.isCompatibleTo = function(type, otherTypes) {
                for (var valueType = ValueType.fromDescriptor(type), _i = 0, otherTypes_1 = otherTypes; _i < otherTypes_1.length; _i++) {
                    var otherType = otherTypes_1[_i], otherValueType = ValueType.fromDescriptor(otherType);
                    if (otherValueType.isCompatibleFrom(valueType)) return !0;
                }
                return !1;
            }, ValueType.prototype.isCompatibleFrom = function(other) {
                var otherPrimitiveType = other.primitiveType;
                return this === other || this.primitiveType === otherPrimitiveType || otherPrimitiveType === PrimitiveType.Null;
            }, ValueType.prototype.equals = function(other) {
                return _.isEqual(this, other);
            }, Object.defineProperty(ValueType.prototype, "primitiveType", {
                get: function() {
                    return getPrimitiveType(this.underlyingType);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "extendedType", {
                get: function() {
                    return this.underlyingType;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "categoryString", {
                get: function() {
                    return this.category;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "text", {
                get: function() {
                    return this.primitiveType === PrimitiveType.Text;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "numeric", {
                get: function() {
                    return EnumExtensions.hasFlag(this.underlyingType, ExtendedType.Numeric);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "integer", {
                get: function() {
                    return this.primitiveType === PrimitiveType.Integer;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "bool", {
                get: function() {
                    return this.primitiveType === PrimitiveType.Boolean;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "dateTime", {
                get: function() {
                    return this.primitiveType === PrimitiveType.DateTime || this.primitiveType === PrimitiveType.Date || this.primitiveType === PrimitiveType.Time;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "duration", {
                get: function() {
                    return this.primitiveType === PrimitiveType.Duration;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "binary", {
                get: function() {
                    return this.primitiveType === PrimitiveType.Binary;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "none", {
                get: function() {
                    return this.primitiveType === PrimitiveType.None;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "temporal", {
                get: function() {
                    return this.temporalType;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "geography", {
                get: function() {
                    return this.geographyType;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "misc", {
                get: function() {
                    return this.miscType;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "formatting", {
                get: function() {
                    return this.formattingType;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "enum", {
                get: function() {
                    return this.enumType;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(ValueType.prototype, "scripting", {
                get: function() {
                    return this.scriptingType;
                },
                enumerable: !0,
                configurable: !0
            }), ValueType.typeCache = {}, ValueType;
        }();
        powerbi.ValueType = ValueType;
        var ScriptType = function() {
            function ScriptType(type) {
                this.underlyingType = type;
            }
            return Object.defineProperty(ScriptType.prototype, "source", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ScriptSource);
                },
                enumerable: !0,
                configurable: !0
            }), ScriptType;
        }();
        powerbi.ScriptType = ScriptType;
        var TemporalType = function() {
            function TemporalType(type) {
                this.underlyingType = type;
            }
            return Object.defineProperty(TemporalType.prototype, "year", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Years);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(TemporalType.prototype, "month", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Months);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(TemporalType.prototype, "paddedDateTableDate", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PaddedDateTableDates);
                },
                enumerable: !0,
                configurable: !0
            }), TemporalType;
        }();
        powerbi.TemporalType = TemporalType;
        var GeographyType = function() {
            function GeographyType(type) {
                this.underlyingType = type;
            }
            return Object.defineProperty(GeographyType.prototype, "address", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Address);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "city", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.City);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "continent", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Continent);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "country", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Country);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "county", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.County);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "region", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Region);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "postalCode", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PostalCode);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "stateOrProvince", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.StateOrProvince);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "place", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Place);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "latitude", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Latitude);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(GeographyType.prototype, "longitude", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Longitude);
                },
                enumerable: !0,
                configurable: !0
            }), GeographyType;
        }();
        powerbi.GeographyType = GeographyType;
        var MiscellaneousType = function() {
            function MiscellaneousType(type) {
                this.underlyingType = type;
            }
            return Object.defineProperty(MiscellaneousType.prototype, "image", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Image);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(MiscellaneousType.prototype, "imageUrl", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ImageUrl);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(MiscellaneousType.prototype, "webUrl", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.WebUrl);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(MiscellaneousType.prototype, "barcode", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Barcode);
                },
                enumerable: !0,
                configurable: !0
            }), MiscellaneousType;
        }();
        powerbi.MiscellaneousType = MiscellaneousType;
        var FormattingType = function() {
            function FormattingType(type) {
                this.underlyingType = type;
            }
            return Object.defineProperty(FormattingType.prototype, "color", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Color);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(FormattingType.prototype, "formatString", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FormatString);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(FormattingType.prototype, "alignment", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Alignment);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(FormattingType.prototype, "labelDisplayUnits", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDisplayUnits);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(FormattingType.prototype, "fontSize", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FontSize);
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(FormattingType.prototype, "labelDensity", {
                get: function() {
                    return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDensity);
                },
                enumerable: !0,
                configurable: !0
            }), FormattingType;
        }();
        powerbi.FormattingType = FormattingType, function(PrimitiveType) {
            PrimitiveType[PrimitiveType.Null = 0] = "Null", PrimitiveType[PrimitiveType.Text = 1] = "Text", 
            PrimitiveType[PrimitiveType.Decimal = 2] = "Decimal", PrimitiveType[PrimitiveType.Double = 3] = "Double", 
            PrimitiveType[PrimitiveType.Integer = 4] = "Integer", PrimitiveType[PrimitiveType.Boolean = 5] = "Boolean", 
            PrimitiveType[PrimitiveType.Date = 6] = "Date", PrimitiveType[PrimitiveType.DateTime = 7] = "DateTime", 
            PrimitiveType[PrimitiveType.DateTimeZone = 8] = "DateTimeZone", PrimitiveType[PrimitiveType.Time = 9] = "Time", 
            PrimitiveType[PrimitiveType.Duration = 10] = "Duration", PrimitiveType[PrimitiveType.Binary = 11] = "Binary", 
            PrimitiveType[PrimitiveType.None = 12] = "None";
        }(powerbi.PrimitiveType || (powerbi.PrimitiveType = {}));
        var PrimitiveType = powerbi.PrimitiveType;
        !function(ExtendedType) {
            ExtendedType[ExtendedType.Numeric = 256] = "Numeric", ExtendedType[ExtendedType.Temporal = 512] = "Temporal", 
            ExtendedType[ExtendedType.Geography = 1024] = "Geography", ExtendedType[ExtendedType.Miscellaneous = 2048] = "Miscellaneous", 
            ExtendedType[ExtendedType.Formatting = 4096] = "Formatting", ExtendedType[ExtendedType.Scripting = 8192] = "Scripting", 
            ExtendedType[ExtendedType.Null = 0] = "Null", ExtendedType[ExtendedType.Text = 1] = "Text", 
            ExtendedType[ExtendedType.Decimal = 258] = "Decimal", ExtendedType[ExtendedType.Double = 259] = "Double", 
            ExtendedType[ExtendedType.Integer = 260] = "Integer", ExtendedType[ExtendedType.Boolean = 5] = "Boolean", 
            ExtendedType[ExtendedType.Date = 518] = "Date", ExtendedType[ExtendedType.DateTime = 519] = "DateTime", 
            ExtendedType[ExtendedType.DateTimeZone = 520] = "DateTimeZone", ExtendedType[ExtendedType.Time = 521] = "Time", 
            ExtendedType[ExtendedType.Duration = 10] = "Duration", ExtendedType[ExtendedType.Binary = 11] = "Binary", 
            ExtendedType[ExtendedType.None = 12] = "None", ExtendedType[ExtendedType.Years = 66048] = "Years", 
            ExtendedType[ExtendedType.Years_Text = 66049] = "Years_Text", ExtendedType[ExtendedType.Years_Integer = 66308] = "Years_Integer", 
            ExtendedType[ExtendedType.Years_Date = 66054] = "Years_Date", ExtendedType[ExtendedType.Years_DateTime = 66055] = "Years_DateTime", 
            ExtendedType[ExtendedType.Months = 131584] = "Months", ExtendedType[ExtendedType.Months_Text = 131585] = "Months_Text", 
            ExtendedType[ExtendedType.Months_Integer = 131844] = "Months_Integer", ExtendedType[ExtendedType.Months_Date = 131590] = "Months_Date", 
            ExtendedType[ExtendedType.Months_DateTime = 131591] = "Months_DateTime", ExtendedType[ExtendedType.PaddedDateTableDates = 197127] = "PaddedDateTableDates", 
            ExtendedType[ExtendedType.Address = 6554625] = "Address", ExtendedType[ExtendedType.City = 6620161] = "City", 
            ExtendedType[ExtendedType.Continent = 6685697] = "Continent", ExtendedType[ExtendedType.Country = 6751233] = "Country", 
            ExtendedType[ExtendedType.County = 6816769] = "County", ExtendedType[ExtendedType.Region = 6882305] = "Region", 
            ExtendedType[ExtendedType.PostalCode = 6947840] = "PostalCode", ExtendedType[ExtendedType.PostalCode_Text = 6947841] = "PostalCode_Text", 
            ExtendedType[ExtendedType.PostalCode_Integer = 6948100] = "PostalCode_Integer", 
            ExtendedType[ExtendedType.StateOrProvince = 7013377] = "StateOrProvince", ExtendedType[ExtendedType.Place = 7078913] = "Place", 
            ExtendedType[ExtendedType.Latitude = 7144448] = "Latitude", ExtendedType[ExtendedType.Latitude_Decimal = 7144706] = "Latitude_Decimal", 
            ExtendedType[ExtendedType.Latitude_Double = 7144707] = "Latitude_Double", ExtendedType[ExtendedType.Longitude = 7209984] = "Longitude", 
            ExtendedType[ExtendedType.Longitude_Decimal = 7210242] = "Longitude_Decimal", ExtendedType[ExtendedType.Longitude_Double = 7210243] = "Longitude_Double", 
            ExtendedType[ExtendedType.Image = 13109259] = "Image", ExtendedType[ExtendedType.ImageUrl = 13174785] = "ImageUrl", 
            ExtendedType[ExtendedType.WebUrl = 13240321] = "WebUrl", ExtendedType[ExtendedType.Barcode = 13305856] = "Barcode", 
            ExtendedType[ExtendedType.Barcode_Text = 13305857] = "Barcode_Text", ExtendedType[ExtendedType.Barcode_Integer = 13306116] = "Barcode_Integer", 
            ExtendedType[ExtendedType.Color = 19664897] = "Color", ExtendedType[ExtendedType.FormatString = 19730433] = "FormatString", 
            ExtendedType[ExtendedType.Alignment = 20058113] = "Alignment", ExtendedType[ExtendedType.LabelDisplayUnits = 20123649] = "LabelDisplayUnits", 
            ExtendedType[ExtendedType.FontSize = 20189443] = "FontSize", ExtendedType[ExtendedType.LabelDensity = 20254979] = "LabelDensity", 
            ExtendedType[ExtendedType.Enumeration = 26214401] = "Enumeration", ExtendedType[ExtendedType.ScriptSource = 32776193] = "ScriptSource", 
            ExtendedType[ExtendedType.SearchEnabled = 65541] = "SearchEnabled";
        }(powerbi.ExtendedType || (powerbi.ExtendedType = {}));
        var ExtendedType = powerbi.ExtendedType, PrimitiveTypeMask = 255, PrimitiveTypeWithFlagsMask = 65535, PrimitiveTypeFlagsExcludedMask = 4294901760;
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            !function(DataShapeBindingLimitType) {
                DataShapeBindingLimitType[DataShapeBindingLimitType.Top = 0] = "Top", DataShapeBindingLimitType[DataShapeBindingLimitType.First = 1] = "First", 
                DataShapeBindingLimitType[DataShapeBindingLimitType.Last = 2] = "Last", DataShapeBindingLimitType[DataShapeBindingLimitType.Sample = 3] = "Sample", 
                DataShapeBindingLimitType[DataShapeBindingLimitType.Bottom = 4] = "Bottom";
            }(data.DataShapeBindingLimitType || (data.DataShapeBindingLimitType = {}));
            data.DataShapeBindingLimitType;
            !function(SubtotalType) {
                SubtotalType[SubtotalType.None = 0] = "None", SubtotalType[SubtotalType.Before = 1] = "Before", 
                SubtotalType[SubtotalType.After = 2] = "After";
            }(data.SubtotalType || (data.SubtotalType = {}));
            data.SubtotalType;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataShapeBindingDataReduction;
            !function(DataShapeBindingDataReduction) {
                function createFrom(reduction) {
                    if (reduction) {
                        var result;
                        return reduction.top && (result = {
                            Top: {}
                        }, reduction.top.count && (result.Top.Count = reduction.top.count)), reduction.bottom && (result = {
                            Bottom: {}
                        }, reduction.bottom.count && (result.Bottom.Count = reduction.bottom.count)), reduction.sample && (result = {
                            Sample: {}
                        }, reduction.sample.count && (result.Sample.Count = reduction.sample.count)), reduction.window && (result = {
                            Window: {}
                        }, reduction.window.count && (result.Window.Count = reduction.window.count)), result;
                    }
                }
                DataShapeBindingDataReduction.createFrom = createFrom;
            }(DataShapeBindingDataReduction = data.DataShapeBindingDataReduction || (data.DataShapeBindingDataReduction = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var FederatedConceptualSchema = function() {
                function FederatedConceptualSchema(options) {
                    this.schemas = options.schemas, options.links && (this.links = options.links);
                }
                return FederatedConceptualSchema.prototype.schema = function(name) {
                    return this.schemas[name];
                }, FederatedConceptualSchema;
            }();
            data.FederatedConceptualSchema = FederatedConceptualSchema;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data_1) {
            var Selector;
            !function(Selector) {
                function filterFromSelector(selectors, isNot) {
                    if (!_.isEmpty(selectors)) {
                        for (var exprs = [], i = 0, ilen = selectors.length; ilen > i; i++) {
                            var identity = selectors[i], data_2 = identity.data, exprToAdd = void 0;
                            if (data_2 && data_2.length) for (var j = 0, jlen = data_2.length; jlen > j; j++) exprToAdd = data_1.SQExprBuilder.and(exprToAdd, identity.data[j].expr);
                            exprToAdd && exprs.push(exprToAdd);
                        }
                        return _.isEmpty(exprs) ? void 0 : powerbi.DataViewScopeIdentity.filterFromExprs(exprs, isNot);
                    }
                }
                function matchesData(selector, identities) {
                    var selectorData = selector.data;
                    if (selectorData.length !== identities.length) return !1;
                    for (var i = 0, len = selectorData.length; len > i; i++) {
                        var dataItem = selector.data[i], selectorDataItem = dataItem;
                        if (selectorDataItem.expr) {
                            if (!powerbi.DataViewScopeIdentity.equals(selectorDataItem, identities[i])) return !1;
                        } else if (!data_1.DataViewScopeWildcard.matches(dataItem, identities[i])) return !1;
                    }
                    return !0;
                }
                function matchesKeys(selector, keysList) {
                    var selectorData = selector.data, selectorDataLength = selectorData.length;
                    if (selectorDataLength !== keysList.length) return !1;
                    for (var i = 0; selectorDataLength > i; i++) {
                        var selectorDataItem = selector.data[i], selectorDataExprs = void 0;
                        if (selectorDataItem.expr) selectorDataExprs = data_1.ScopeIdentityExtractor.getKeys(selectorDataItem.expr); else {
                            if (!selectorDataItem.exprs) return !1;
                            selectorDataExprs = selectorDataItem.exprs;
                        }
                        if (selectorDataExprs && !data_1.SQExprUtils.sequenceEqual(keysList[i], selectorDataExprs)) return !1;
                    }
                    return !0;
                }
                function equals(x, y) {
                    return x = x || null, y = y || null, x === y ? !0 : !x != !y ? !1 : x.id !== y.id ? !1 : x.metadata !== y.metadata ? !1 : !!equalsDataArray(x.data, y.data);
                }
                function equalsDataArray(x, y) {
                    if (x = x || null, y = y || null, x === y) return !0;
                    if (!x != !y) return !1;
                    if (x.length !== y.length) return !1;
                    for (var i = 0, len = x.length; len > i; i++) if (!equalsData(x[i], y[i])) return !1;
                    return !0;
                }
                function equalsData(x, y) {
                    var selector1 = x, selector2 = y;
                    return selector1.expr && selector2.expr ? powerbi.DataViewScopeIdentity.equals(selector1, selector2) : selector1.exprs && selector2.exprs ? data_1.DataViewScopeWildcard.equals(selector1, selector2) : selector1.roles && selector2.roles ? data_1.DataViewRoleWildcard.equals(selector1, selector2) : !1;
                }
                function getKey(selector) {
                    var toStringify = {};
                    if (selector.data) {
                        for (var data_3 = [], i = 0, ilen = selector.data.length; ilen > i; i++) data_3.push(selector.data[i].key);
                        toStringify.data = data_3;
                    }
                    return selector.metadata && (toStringify.metadata = selector.metadata), selector.id && (toStringify.id = selector.id), 
                    JSON.stringify(toStringify);
                }
                function containsWildcard(selector) {
                    var dataItems = selector.data;
                    if (!dataItems) return !1;
                    for (var _i = 0, dataItems_1 = dataItems; _i < dataItems_1.length; _i++) {
                        var dataItem = dataItems_1[_i], wildCard = dataItem;
                        if (wildCard.exprs || wildCard.roles) return !0;
                    }
                    return !1;
                }
                function hasRoleWildcard(selector) {
                    var dataItems = selector.data;
                    if (_.isEmpty(dataItems)) return !1;
                    for (var _i = 0, dataItems_2 = dataItems; _i < dataItems_2.length; _i++) {
                        var dataItem = dataItems_2[_i];
                        if (isRoleWildcard(dataItem)) return !0;
                    }
                    return !1;
                }
                function isRoleWildcard(dataItem) {
                    return !_.isEmpty(dataItem.roles);
                }
                function convertSelectorsByColumnToSelector(selectorsByColumn) {
                    var data = [];
                    for (var key in selectorsByColumn.dataMap) data.push(selectorsByColumn.dataMap[key]);
                    return {
                        data: data,
                        metadata: selectorsByColumn.metadata,
                        id: selectorsByColumn.id
                    };
                }
                Selector.filterFromSelector = filterFromSelector, Selector.matchesData = matchesData, 
                Selector.matchesKeys = matchesKeys, Selector.equals = equals, Selector.getKey = getKey, 
                Selector.containsWildcard = containsWildcard, Selector.hasRoleWildcard = hasRoleWildcard, 
                Selector.isRoleWildcard = isRoleWildcard, Selector.convertSelectorsByColumnToSelector = convertSelectorsByColumnToSelector;
            }(Selector = data_1.Selector || (data_1.Selector = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function getArithmeticOperatorName(arithmeticOperatorKind) {
                switch (arithmeticOperatorKind) {
                  case 0:
                    return "Add";

                  case 1:
                    return "Subtract";

                  case 2:
                    return "Multiply";

                  case 3:
                    return "Divide";
                }
                throw new Error("Unexpected ArithmeticOperatorKind: " + arithmeticOperatorKind);
            }
            !function(EntitySourceType) {
                EntitySourceType[EntitySourceType.Table = 0] = "Table", EntitySourceType[EntitySourceType.Pod = 1] = "Pod", 
                EntitySourceType[EntitySourceType.Expression = 2] = "Expression";
            }(data.EntitySourceType || (data.EntitySourceType = {}));
            data.EntitySourceType;
            data.getArithmeticOperatorName = getArithmeticOperatorName, function(TimeUnit) {
                TimeUnit[TimeUnit.Day = 0] = "Day", TimeUnit[TimeUnit.Week = 1] = "Week", TimeUnit[TimeUnit.Month = 2] = "Month", 
                TimeUnit[TimeUnit.Year = 3] = "Year", TimeUnit[TimeUnit.Decade = 4] = "Decade", 
                TimeUnit[TimeUnit.Second = 5] = "Second", TimeUnit[TimeUnit.Minute = 6] = "Minute", 
                TimeUnit[TimeUnit.Hour = 7] = "Hour";
            }(data.TimeUnit || (data.TimeUnit = {}));
            data.TimeUnit;
            !function(QueryAggregateFunction) {
                QueryAggregateFunction[QueryAggregateFunction.Sum = 0] = "Sum", QueryAggregateFunction[QueryAggregateFunction.Avg = 1] = "Avg", 
                QueryAggregateFunction[QueryAggregateFunction.Count = 2] = "Count", QueryAggregateFunction[QueryAggregateFunction.Min = 3] = "Min", 
                QueryAggregateFunction[QueryAggregateFunction.Max = 4] = "Max", QueryAggregateFunction[QueryAggregateFunction.CountNonNull = 5] = "CountNonNull", 
                QueryAggregateFunction[QueryAggregateFunction.Median = 6] = "Median", QueryAggregateFunction[QueryAggregateFunction.StandardDeviation = 7] = "StandardDeviation", 
                QueryAggregateFunction[QueryAggregateFunction.Variance = 8] = "Variance";
            }(data.QueryAggregateFunction || (data.QueryAggregateFunction = {}));
            data.QueryAggregateFunction;
            !function(QueryComparisonKind) {
                QueryComparisonKind[QueryComparisonKind.Equal = 0] = "Equal", QueryComparisonKind[QueryComparisonKind.GreaterThan = 1] = "GreaterThan", 
                QueryComparisonKind[QueryComparisonKind.GreaterThanOrEqual = 2] = "GreaterThanOrEqual", 
                QueryComparisonKind[QueryComparisonKind.LessThan = 3] = "LessThan", QueryComparisonKind[QueryComparisonKind.LessThanOrEqual = 4] = "LessThanOrEqual";
            }(data.QueryComparisonKind || (data.QueryComparisonKind = {}));
            data.QueryComparisonKind;
            !function(SemanticType) {
                SemanticType[SemanticType.None = 0] = "None", SemanticType[SemanticType.Number = 1] = "Number", 
                SemanticType[SemanticType.Integer = 3] = "Integer", SemanticType[SemanticType.DateTime = 4] = "DateTime", 
                SemanticType[SemanticType.Time = 8] = "Time", SemanticType[SemanticType.Date = 20] = "Date", 
                SemanticType[SemanticType.Month = 35] = "Month", SemanticType[SemanticType.Year = 67] = "Year", 
                SemanticType[SemanticType.YearAndMonth = 128] = "YearAndMonth", SemanticType[SemanticType.MonthAndDay = 256] = "MonthAndDay", 
                SemanticType[SemanticType.Decade = 515] = "Decade", SemanticType[SemanticType.YearAndWeek = 1024] = "YearAndWeek", 
                SemanticType[SemanticType.String = 2048] = "String", SemanticType[SemanticType.Boolean = 4096] = "Boolean", 
                SemanticType[SemanticType.Table = 8192] = "Table", SemanticType[SemanticType.Range = 16384] = "Range";
            }(data.SemanticType || (data.SemanticType = {}));
            data.SemanticType;
            !function(FilterKind) {
                FilterKind[FilterKind.Default = 0] = "Default", FilterKind[FilterKind.Period = 1] = "Period";
            }(data.FilterKind || (data.FilterKind = {}));
            data.FilterKind;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var QueryProjectionCollection = function() {
                function QueryProjectionCollection(items, activeProjectionRefs, showAll) {
                    this.items = items, this._activeProjectionRefs = activeProjectionRefs, this._showAll = showAll;
                }
                return QueryProjectionCollection.prototype.all = function() {
                    return this.items;
                }, Object.defineProperty(QueryProjectionCollection.prototype, "activeProjectionRefs", {
                    get: function() {
                        return this._activeProjectionRefs;
                    },
                    set: function(queryReferences) {
                        if (!_.isEmpty(queryReferences)) {
                            for (var queryRefs = this.items.map(function(val) {
                                return val.queryRef;
                            }), _i = 0, queryReferences_1 = queryReferences; _i < queryReferences_1.length; _i++) {
                                var queryReference = queryReferences_1[_i];
                                if (!_.contains(queryRefs, queryReference)) return;
                            }
                            this._activeProjectionRefs = queryReferences;
                        }
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(QueryProjectionCollection.prototype, "showAll", {
                    get: function() {
                        return this._showAll;
                    },
                    set: function(value) {
                        this._showAll = value;
                    },
                    enumerable: !0,
                    configurable: !0
                }), QueryProjectionCollection.prototype.addActiveQueryReference = function(queryRef) {
                    this._activeProjectionRefs ? this._activeProjectionRefs.push(queryRef) : this._activeProjectionRefs = [ queryRef ];
                }, QueryProjectionCollection.prototype.getLastActiveQueryReference = function() {
                    return _.isEmpty(this._activeProjectionRefs) ? void 0 : this._activeProjectionRefs[this._activeProjectionRefs.length - 1];
                }, QueryProjectionCollection.prototype.replaceQueryRef = function(oldQueryRef, newQueryRef) {
                    for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        item.queryRef === oldQueryRef && (item.queryRef = newQueryRef);
                    }
                }, QueryProjectionCollection.prototype.clone = function() {
                    return new QueryProjectionCollection(_.cloneDeep(this.items), _.clone(this._activeProjectionRefs), this._showAll);
                }, QueryProjectionCollection;
            }();
            data.QueryProjectionCollection = QueryProjectionCollection;
            var QueryProjectionsByRole;
            !function(QueryProjectionsByRole) {
                function clone(roles) {
                    if (!roles) return roles;
                    var clonedRoles = {};
                    for (var roleName in roles) clonedRoles[roleName] = roles[roleName].clone();
                    return clonedRoles;
                }
                function getRole(roles, name) {
                    return roles ? roles[name] : void 0;
                }
                QueryProjectionsByRole.clone = clone, QueryProjectionsByRole.getRole = getRole;
            }(QueryProjectionsByRole = data.QueryProjectionsByRole || (data.QueryProjectionsByRole = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        !function(DisplayUnitSystemType) {
            DisplayUnitSystemType[DisplayUnitSystemType.Default = 0] = "Default", DisplayUnitSystemType[DisplayUnitSystemType.Verbose = 1] = "Verbose", 
            DisplayUnitSystemType[DisplayUnitSystemType.WholeUnits = 2] = "WholeUnits", DisplayUnitSystemType[DisplayUnitSystemType.DataLabels = 3] = "DataLabels";
        }(powerbi.DisplayUnitSystemType || (powerbi.DisplayUnitSystemType = {}));
        powerbi.DisplayUnitSystemType;
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var DateTimeSequence = function() {
            function DateTimeSequence(unit) {
                this.unit = unit, this.sequence = [], this.min = new Date("9999-12-31T23:59:59.999"), 
                this.max = new Date("0001-01-01T00:00:00.000");
            }
            return DateTimeSequence.prototype.add = function(date) {
                date < this.min && (this.min = date), date > this.max && (this.max = date), this.sequence.push(date);
            }, DateTimeSequence.prototype.extendToCover = function(min, max) {
                for (var x = this.min; x > min; ) x = DateTimeSequence.addInterval(x, -this.interval, this.unit), 
                this.sequence.splice(0, 0, x);
                for (this.min = x, x = this.max; max > x; ) x = DateTimeSequence.addInterval(x, this.interval, this.unit), 
                this.sequence.push(x);
                this.max = x;
            }, DateTimeSequence.prototype.moveToCover = function(min, max) {
                var delta = DateTimeSequence.getDelta(min, max, this.unit), count = Math.floor(delta / this.interval);
                for (this.min = DateTimeSequence.addInterval(this.min, count * this.interval, this.unit), 
                this.sequence = [], this.sequence.push(this.min), this.max = this.min; this.max < max; ) this.max = DateTimeSequence.addInterval(this.max, this.interval, this.unit), 
                this.sequence.push(this.max);
            }, DateTimeSequence.calculate = function(dataMin, dataMax, expectedCount, unit) {
                switch (unit || (unit = DateTimeSequence.getIntervalUnit(dataMin, dataMax, expectedCount)), 
                unit) {
                  case powerbi.DateTimeUnit.Year:
                    return DateTimeSequence.calculateYears(dataMin, dataMax, expectedCount);

                  case powerbi.DateTimeUnit.Month:
                    return DateTimeSequence.calculateMonths(dataMin, dataMax, expectedCount);

                  case powerbi.DateTimeUnit.Week:
                    return DateTimeSequence.calculateWeeks(dataMin, dataMax, expectedCount);

                  case powerbi.DateTimeUnit.Day:
                    return DateTimeSequence.calculateDays(dataMin, dataMax, expectedCount);

                  case powerbi.DateTimeUnit.Hour:
                    return DateTimeSequence.calculateHours(dataMin, dataMax, expectedCount);

                  case powerbi.DateTimeUnit.Minute:
                    return DateTimeSequence.calculateMinutes(dataMin, dataMax, expectedCount);

                  case powerbi.DateTimeUnit.Second:
                    return DateTimeSequence.calculateSeconds(dataMin, dataMax, expectedCount);

                  case powerbi.DateTimeUnit.Millisecond:
                    return DateTimeSequence.calculateMilliseconds(dataMin, dataMax, expectedCount);
                }
            }, DateTimeSequence.calculateYears = function(dataMin, dataMax, expectedCount) {
                var yearsRange = powerbi.NumericSequenceRange.calculateDataRange(dataMin.getFullYear(), dataMax.getFullYear(), !1), sequence = powerbi.NumericSequence.calculate(powerbi.NumericSequenceRange.calculate(0, yearsRange.max - yearsRange.min), expectedCount, 0, null, null, [ 1, 2, 5 ]), newMinYear = Math.floor(yearsRange.min / sequence.interval) * sequence.interval, date = new Date(newMinYear, 0, 1), result = DateTimeSequence.fromNumericSequence(date, sequence, powerbi.DateTimeUnit.Year);
                return result;
            }, DateTimeSequence.calculateMonths = function(dataMin, dataMax, expectedCount) {
                var minYear = dataMin.getFullYear(), maxYear = dataMax.getFullYear(), minMonth = dataMin.getMonth(), maxMonth = 12 * (maxYear - minYear) + dataMax.getMonth(), date = new Date(minYear, 0, 1), sequence = powerbi.NumericSequence.calculateUnits(minMonth, maxMonth, expectedCount, [ 1, 2, 3, 6, 12 ]), result = DateTimeSequence.fromNumericSequence(date, sequence, powerbi.DateTimeUnit.Month);
                return result;
            }, DateTimeSequence.calculateWeeks = function(dataMin, dataMax, expectedCount) {
                var firstDayOfWeek = 0, minDayOfWeek = dataMin.getDay(), dayOffset = (minDayOfWeek - firstDayOfWeek + 7) % 7, minDay = dataMin.getDate() - dayOffset, date = new Date(dataMin.getFullYear(), dataMin.getMonth(), minDay), min = 0, max = powerbi.Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, powerbi.DateTimeUnit.Week)), sequence = powerbi.NumericSequence.calculateUnits(min, max, expectedCount, [ 1, 2, 4, 8 ]), result = DateTimeSequence.fromNumericSequence(date, sequence, powerbi.DateTimeUnit.Week);
                return result;
            }, DateTimeSequence.calculateDays = function(dataMin, dataMax, expectedCount) {
                var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate()), min = 0, max = powerbi.Double.ceilWithPrecision(DateTimeSequence.getDelta(dataMin, dataMax, powerbi.DateTimeUnit.Day)), sequence = powerbi.NumericSequence.calculateUnits(min, max, expectedCount, [ 1, 2, 7, 14 ]), result = DateTimeSequence.fromNumericSequence(date, sequence, powerbi.DateTimeUnit.Day);
                return result;
            }, DateTimeSequence.calculateHours = function(dataMin, dataMax, expectedCount) {
                var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate()), min = powerbi.Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, powerbi.DateTimeUnit.Hour)), max = powerbi.Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, powerbi.DateTimeUnit.Hour)), sequence = powerbi.NumericSequence.calculateUnits(min, max, expectedCount, [ 1, 2, 3, 6, 12, 24 ]), result = DateTimeSequence.fromNumericSequence(date, sequence, powerbi.DateTimeUnit.Hour);
                return result;
            }, DateTimeSequence.calculateMinutes = function(dataMin, dataMax, expectedCount) {
                var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours()), min = powerbi.Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, powerbi.DateTimeUnit.Minute)), max = powerbi.Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, powerbi.DateTimeUnit.Minute)), sequence = powerbi.NumericSequence.calculateUnits(min, max, expectedCount, [ 1, 2, 5, 10, 15, 30, 60, 120, 180, 360, 720, 1440 ]), result = DateTimeSequence.fromNumericSequence(date, sequence, powerbi.DateTimeUnit.Minute);
                return result;
            }, DateTimeSequence.calculateSeconds = function(dataMin, dataMax, expectedCount) {
                var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes()), min = powerbi.Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, powerbi.DateTimeUnit.Second)), max = powerbi.Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, powerbi.DateTimeUnit.Second)), sequence = powerbi.NumericSequence.calculateUnits(min, max, expectedCount, [ 1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600 ]), result = DateTimeSequence.fromNumericSequence(date, sequence, powerbi.DateTimeUnit.Second);
                return result;
            }, DateTimeSequence.calculateMilliseconds = function(dataMin, dataMax, expectedCount) {
                var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes(), dataMin.getSeconds()), min = DateTimeSequence.getDelta(date, dataMin, powerbi.DateTimeUnit.Millisecond), max = DateTimeSequence.getDelta(date, dataMax, powerbi.DateTimeUnit.Millisecond), sequence = powerbi.NumericSequence.calculate(powerbi.NumericSequenceRange.calculate(min, max), expectedCount, 0), result = DateTimeSequence.fromNumericSequence(date, sequence, powerbi.DateTimeUnit.Millisecond);
                return result;
            }, DateTimeSequence.addInterval = function(value, interval, unit) {
                switch (interval = Math.round(interval), unit) {
                  case powerbi.DateTimeUnit.Year:
                    return DateUtils.addYears(value, interval);

                  case powerbi.DateTimeUnit.Month:
                    return DateUtils.addMonths(value, interval);

                  case powerbi.DateTimeUnit.Week:
                    return DateUtils.addWeeks(value, interval);

                  case powerbi.DateTimeUnit.Day:
                    return DateUtils.addDays(value, interval);

                  case powerbi.DateTimeUnit.Hour:
                    return DateUtils.addHours(value, interval);

                  case powerbi.DateTimeUnit.Minute:
                    return DateUtils.addMinutes(value, interval);

                  case powerbi.DateTimeUnit.Second:
                    return DateUtils.addSeconds(value, interval);

                  case powerbi.DateTimeUnit.Millisecond:
                    return DateUtils.addMilliseconds(value, interval);
                }
            }, DateTimeSequence.fromNumericSequence = function(date, sequence, unit) {
                for (var result = new DateTimeSequence(unit), i = 0; i < sequence.sequence.length; i++) {
                    var x = sequence.sequence[i], d = DateTimeSequence.addInterval(date, x, unit);
                    result.add(d);
                }
                return result.interval = sequence.interval, result.intervalOffset = sequence.intervalOffset, 
                result;
            }, DateTimeSequence.getDelta = function(min, max, unit) {
                var delta = 0;
                switch (unit) {
                  case powerbi.DateTimeUnit.Year:
                    delta = max.getFullYear() - min.getFullYear();
                    break;

                  case powerbi.DateTimeUnit.Month:
                    delta = 12 * (max.getFullYear() - min.getFullYear()) + max.getMonth() - min.getMonth();
                    break;

                  case powerbi.DateTimeUnit.Week:
                    delta = (max.getTime() - min.getTime()) / 6048e5;
                    break;

                  case powerbi.DateTimeUnit.Day:
                    delta = (max.getTime() - min.getTime()) / 864e5;
                    break;

                  case powerbi.DateTimeUnit.Hour:
                    delta = (max.getTime() - min.getTime()) / 36e5;
                    break;

                  case powerbi.DateTimeUnit.Minute:
                    delta = (max.getTime() - min.getTime()) / 6e4;
                    break;

                  case powerbi.DateTimeUnit.Second:
                    delta = (max.getTime() - min.getTime()) / 1e3;
                    break;

                  case powerbi.DateTimeUnit.Millisecond:
                    delta = max.getTime() - min.getTime();
                }
                return delta;
            }, DateTimeSequence.getIntervalUnit = function(min, max, maxCount) {
                maxCount = Math.max(maxCount, 2);
                var totalDays = DateTimeSequence.getDelta(min, max, powerbi.DateTimeUnit.Day);
                if (totalDays > 356 && totalDays >= 180 * maxCount) return powerbi.DateTimeUnit.Year;
                if (totalDays > 60 && totalDays > 7 * maxCount) return powerbi.DateTimeUnit.Month;
                if (totalDays > 14 && totalDays > 2 * maxCount) return powerbi.DateTimeUnit.Week;
                var totalHours = DateTimeSequence.getDelta(min, max, powerbi.DateTimeUnit.Hour);
                if (totalDays > 2 && totalHours > 12 * maxCount) return powerbi.DateTimeUnit.Day;
                if (totalHours >= 24 && totalHours >= maxCount) return powerbi.DateTimeUnit.Hour;
                var totalMinutes = DateTimeSequence.getDelta(min, max, powerbi.DateTimeUnit.Minute);
                if (totalMinutes > 2 && totalMinutes >= maxCount) return powerbi.DateTimeUnit.Minute;
                var totalSeconds = DateTimeSequence.getDelta(min, max, powerbi.DateTimeUnit.Second);
                if (totalSeconds > 2 && totalSeconds >= .8 * maxCount) return powerbi.DateTimeUnit.Second;
                var totalMilliseconds = DateTimeSequence.getDelta(min, max, powerbi.DateTimeUnit.Millisecond);
                if (totalMilliseconds > 0) return powerbi.DateTimeUnit.Millisecond;
                var date = min;
                return 0 !== date.getMilliseconds() ? powerbi.DateTimeUnit.Millisecond : 0 !== date.getSeconds() ? powerbi.DateTimeUnit.Second : 0 !== date.getMinutes() ? powerbi.DateTimeUnit.Minute : 0 !== date.getHours() ? powerbi.DateTimeUnit.Hour : 1 !== date.getDate() ? powerbi.DateTimeUnit.Day : 0 !== date.getMonth() ? powerbi.DateTimeUnit.Month : powerbi.DateTimeUnit.Year;
            }, DateTimeSequence.MIN_COUNT = 1, DateTimeSequence.MAX_COUNT = 1e3, DateTimeSequence;
        }();
        powerbi.DateTimeSequence = DateTimeSequence;
        var DateUtils;
        !function(DateUtils) {
            function isLeap(year) {
                return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
            }
            function getMonthDays(year, month) {
                return isLeap(year) ? MonthDaysLeap[month] : MonthDays[month];
            }
            function addYears(date, yearDelta) {
                var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), isLeapDay = 2 === month && 29 === day, result = new Date(date.getTime());
                return year += yearDelta, isLeapDay && !isLeap(year) && (day = 28), result.setFullYear(year, month, day), 
                result;
            }
            function addMonths(date, monthDelta) {
                var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), result = new Date(date.getTime());
                return year += (monthDelta - monthDelta % 12) / 12, month += monthDelta % 12, month > 11 && (month %= 12, 
                year++), day = Math.min(day, getMonthDays(year, month)), result.setFullYear(year, month, day), 
                result;
            }
            function addWeeks(date, weeks) {
                return addDays(date, 7 * weeks);
            }
            function addDays(date, days) {
                var year = date.getFullYear(), month = date.getMonth(), day = date.getDate(), result = new Date(date.getTime());
                return result.setFullYear(year, month, day + days), result;
            }
            function addHours(date, hours) {
                return new Date(date.getTime() + 36e5 * hours);
            }
            function addMinutes(date, minutes) {
                return new Date(date.getTime() + 6e4 * minutes);
            }
            function addSeconds(date, seconds) {
                return new Date(date.getTime() + 1e3 * seconds);
            }
            function addMilliseconds(date, milliseconds) {
                return new Date(date.getTime() + milliseconds);
            }
            var MonthDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ], MonthDaysLeap = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
            DateUtils.addYears = addYears, DateUtils.addMonths = addMonths, DateUtils.addWeeks = addWeeks, 
            DateUtils.addDays = addDays, DateUtils.addHours = addHours, DateUtils.addMinutes = addMinutes, 
            DateUtils.addSeconds = addSeconds, DateUtils.addMilliseconds = addMilliseconds;
        }(DateUtils = powerbi.DateUtils || (powerbi.DateUtils = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi), __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        function createDisplayUnits(unitLookup, adjustMinBasedOnPreviousUnit) {
            for (var units = [], i = 3; maxExponent > i; i++) {
                var names = unitLookup(i);
                names && addUnitIfNonEmpty(units, powerbi.Double.pow10(i), names.title, names.format, adjustMinBasedOnPreviousUnit);
            }
            return units;
        }
        function addUnitIfNonEmpty(units, value, title, labelFormat, adjustMinBasedOnPreviousUnit) {
            if (title || labelFormat) {
                var min = value;
                if (units.length > 0) {
                    var previousUnit = units[units.length - 1];
                    adjustMinBasedOnPreviousUnit && (min = adjustMinBasedOnPreviousUnit(value, previousUnit.value, min)), 
                    previousUnit.applicableRangeMax = min;
                }
                var unit = new DisplayUnit();
                unit.value = value, unit.applicableRangeMin = min, unit.applicableRangeMax = 1e3 * min, 
                unit.title = title, unit.labelFormat = labelFormat, units.push(unit);
            }
        }
        var maxExponent = 24, defaultScientificBigNumbersBoundary = 1e15, scientificSmallNumbersBoundary = 1e-4, PERCENTAGE_FORMAT = "%", SCIENTIFIC_FORMAT = "E+0", DEFAULT_SCIENTIFIC_FORMAT = "0.##" + SCIENTIFIC_FORMAT, SUPPORTED_SCIENTIFIC_FORMATS = /^([0\#,]*\.[0\#]+|[0\#,]+|g)$/i, DisplayUnit = function() {
            function DisplayUnit() {}
            return DisplayUnit.prototype.project = function(value) {
                return this.value ? powerbi.Double.removeDecimalNoise(value / this.value) : value;
            }, DisplayUnit.prototype.reverseProject = function(value) {
                return this.value ? value * this.value : value;
            }, DisplayUnit.prototype.isApplicableTo = function(value) {
                value = Math.abs(value);
                var precision = powerbi.Double.getPrecision(value, 3);
                return powerbi.Double.greaterOrEqualWithPrecision(value, this.applicableRangeMin, precision) && powerbi.Double.lessWithPrecision(value, this.applicableRangeMax, precision);
            }, DisplayUnit.prototype.isScaling = function() {
                return this.value > 1;
            }, DisplayUnit;
        }();
        powerbi.DisplayUnit = DisplayUnit;
        var DisplayUnitSystem = function() {
            function DisplayUnitSystem(units) {
                this.units = units ? units : [];
            }
            return Object.defineProperty(DisplayUnitSystem.prototype, "title", {
                get: function() {
                    return this.displayUnit ? this.displayUnit.title : void 0;
                },
                enumerable: !0,
                configurable: !0
            }), DisplayUnitSystem.prototype.update = function(value) {
                void 0 !== value && (this.unitBaseValue = value, this.displayUnit = this.findApplicableDisplayUnit(value));
            }, DisplayUnitSystem.prototype.findApplicableDisplayUnit = function(value) {
                for (var _i = 0, _a = this.units; _i < _a.length; _i++) {
                    var unit = _a[_i];
                    if (unit.isApplicableTo(value)) return unit;
                }
            }, DisplayUnitSystem.prototype.format = function(value, format, decimals, trailingZeros) {
                decimals = this.getNumberOfDecimalsForFormatting(format, decimals);
                var nonScientificFormat = "";
                return this.isFormatSupported(format) && !this.hasScientitifcFormat(format) && this.isScalingUnit() && this.shouldRespectScalingUnit(format) && (value = this.displayUnit.project(value), 
                nonScientificFormat = this.displayUnit.labelFormat), this.formatHelper(value, nonScientificFormat, format, decimals, trailingZeros);
            }, DisplayUnitSystem.prototype.isFormatSupported = function(format) {
                return !DisplayUnitSystem.UNSUPPORTED_FORMATS.test(format);
            }, DisplayUnitSystem.prototype.isPercentageFormat = function(format) {
                return format && format.indexOf(PERCENTAGE_FORMAT) >= 0;
            }, DisplayUnitSystem.prototype.shouldRespectScalingUnit = function(format) {
                return !this.isPercentageFormat(format);
            }, DisplayUnitSystem.prototype.getNumberOfDecimalsForFormatting = function(format, decimals) {
                return decimals;
            }, DisplayUnitSystem.prototype.isScalingUnit = function() {
                return this.displayUnit && this.displayUnit.isScaling();
            }, DisplayUnitSystem.prototype.formatHelper = function(value, nonScientificFormat, format, decimals, trailingZeros) {
                if ("g" !== format && "G" !== format || null == decimals || (format = powerbi.visuals.valueFormatter.DefaultNumericFormat), 
                format = powerbi.NumberFormat.addDecimalsToFormat(format, decimals, trailingZeros), 
                format && !powerbi.formattingService.isStandardNumberFormat(format)) return powerbi.formattingService.formatNumberWithCustomOverride(value, format, nonScientificFormat);
                format || (format = "G"), nonScientificFormat || (nonScientificFormat = "{0}");
                var text = powerbi.formattingService.formatValue(value, format);
                return powerbi.formattingService.format(nonScientificFormat, [ text ]);
            }, DisplayUnitSystem.prototype.formatSingleValue = function(value, format, decimals, trailingZeros) {
                return this.update(this.shouldUseValuePrecision(value) ? powerbi.Double.getPrecision(value, 8) : value), 
                this.format(value, format, decimals, trailingZeros);
            }, DisplayUnitSystem.prototype.shouldUseValuePrecision = function(value) {
                if (0 === this.units.length) return !0;
                for (var applicableRangeMin = 0, i = 0; i < this.units.length; i++) if (this.units[i].isScaling()) {
                    applicableRangeMin = this.units[i].applicableRangeMin;
                    break;
                }
                return Math.abs(value) < applicableRangeMin;
            }, DisplayUnitSystem.prototype.isScientific = function(value) {
                return -defaultScientificBigNumbersBoundary > value || value > defaultScientificBigNumbersBoundary || value > -scientificSmallNumbersBoundary && scientificSmallNumbersBoundary > value && 0 !== value;
            }, DisplayUnitSystem.prototype.hasScientitifcFormat = function(format) {
                return format && -1 !== format.toUpperCase().indexOf("E");
            }, DisplayUnitSystem.prototype.supportsScientificFormat = function(format) {
                return format ? SUPPORTED_SCIENTIFIC_FORMATS.test(format) : !0;
            }, DisplayUnitSystem.prototype.shouldFallbackToScientific = function(value, format) {
                return !this.hasScientitifcFormat(format) && this.supportsScientificFormat(format) && this.isScientific(value);
            }, DisplayUnitSystem.prototype.getScientificFormat = function(data, format, decimals, trailingZeros) {
                if (this.isFormatSupported(format) && this.shouldFallbackToScientific(data, format)) {
                    var numericFormat = powerbi.NumberFormat.getNumericFormat(data, format);
                    return decimals && (numericFormat = powerbi.NumberFormat.addDecimalsToFormat(numericFormat ? numericFormat : "0", Math.abs(decimals), trailingZeros)), 
                    numericFormat ? numericFormat + SCIENTIFIC_FORMAT : DEFAULT_SCIENTIFIC_FORMAT;
                }
                return format;
            }, DisplayUnitSystem.UNSUPPORTED_FORMATS = /^(p\d*)|(.*\%)|(e\d*)$/i, DisplayUnitSystem;
        }();
        powerbi.DisplayUnitSystem = DisplayUnitSystem;
        var NoDisplayUnitSystem = function(_super) {
            function NoDisplayUnitSystem() {
                _super.call(this, []);
            }
            return __extends(NoDisplayUnitSystem, _super), NoDisplayUnitSystem;
        }(DisplayUnitSystem);
        powerbi.NoDisplayUnitSystem = NoDisplayUnitSystem;
        var DefaultDisplayUnitSystem = function(_super) {
            function DefaultDisplayUnitSystem(unitLookup) {
                _super.call(this, DefaultDisplayUnitSystem.getUnits(unitLookup));
            }
            return __extends(DefaultDisplayUnitSystem, _super), DefaultDisplayUnitSystem.prototype.format = function(data, format, decimals, trailingZeros) {
                return format = this.getScientificFormat(data, format, decimals, trailingZeros), 
                _super.prototype.format.call(this, data, format, decimals, trailingZeros);
            }, DefaultDisplayUnitSystem.reset = function() {
                DefaultDisplayUnitSystem.units = null;
            }, DefaultDisplayUnitSystem.getUnits = function(unitLookup) {
                return DefaultDisplayUnitSystem.units || (DefaultDisplayUnitSystem.units = createDisplayUnits(unitLookup, function(value, previousUnitValue, min) {
                    return value - previousUnitValue >= 1e3 ? value / 10 : min;
                }), DefaultDisplayUnitSystem.units[DefaultDisplayUnitSystem.units.length - 1].applicableRangeMax = 1 / 0), 
                DefaultDisplayUnitSystem.units;
            }, DefaultDisplayUnitSystem;
        }(DisplayUnitSystem);
        powerbi.DefaultDisplayUnitSystem = DefaultDisplayUnitSystem;
        var WholeUnitsDisplayUnitSystem = function(_super) {
            function WholeUnitsDisplayUnitSystem(unitLookup) {
                _super.call(this, WholeUnitsDisplayUnitSystem.getUnits(unitLookup));
            }
            return __extends(WholeUnitsDisplayUnitSystem, _super), WholeUnitsDisplayUnitSystem.reset = function() {
                WholeUnitsDisplayUnitSystem.units = null;
            }, WholeUnitsDisplayUnitSystem.getUnits = function(unitLookup) {
                return WholeUnitsDisplayUnitSystem.units || (WholeUnitsDisplayUnitSystem.units = createDisplayUnits(unitLookup), 
                WholeUnitsDisplayUnitSystem.units[WholeUnitsDisplayUnitSystem.units.length - 1].applicableRangeMax = 1 / 0), 
                WholeUnitsDisplayUnitSystem.units;
            }, WholeUnitsDisplayUnitSystem.prototype.format = function(data, format, decimals, trailingZeros) {
                return format = this.getScientificFormat(data, format, decimals, trailingZeros), 
                _super.prototype.format.call(this, data, format, decimals, trailingZeros);
            }, WholeUnitsDisplayUnitSystem;
        }(DisplayUnitSystem);
        powerbi.WholeUnitsDisplayUnitSystem = WholeUnitsDisplayUnitSystem;
        var DataLabelsDisplayUnitSystem = function(_super) {
            function DataLabelsDisplayUnitSystem(unitLookup) {
                _super.call(this, DataLabelsDisplayUnitSystem.getUnits(unitLookup));
            }
            return __extends(DataLabelsDisplayUnitSystem, _super), DataLabelsDisplayUnitSystem.prototype.isFormatSupported = function(format) {
                return !DataLabelsDisplayUnitSystem.UNSUPPORTED_FORMATS.test(format);
            }, DataLabelsDisplayUnitSystem.getUnits = function(unitLookup) {
                if (!DataLabelsDisplayUnitSystem.units) {
                    var units = [], adjustMinBasedOnPreviousUnit = function(value, previousUnitValue, min) {
                        return -1 === value && value - previousUnitValue >= 1e3 ? value / 10 : min;
                    }, names = unitLookup(-1);
                    addUnitIfNonEmpty(units, DataLabelsDisplayUnitSystem.AUTO_DISPLAYUNIT_VALUE, names.title, names.format, adjustMinBasedOnPreviousUnit), 
                    names = unitLookup(0), addUnitIfNonEmpty(units, DataLabelsDisplayUnitSystem.NONE_DISPLAYUNIT_VALUE, names.title, names.format, adjustMinBasedOnPreviousUnit), 
                    DataLabelsDisplayUnitSystem.units = units.concat(createDisplayUnits(unitLookup, adjustMinBasedOnPreviousUnit)), 
                    DataLabelsDisplayUnitSystem.units[DataLabelsDisplayUnitSystem.units.length - 1].applicableRangeMax = 1 / 0;
                }
                return DataLabelsDisplayUnitSystem.units;
            }, DataLabelsDisplayUnitSystem.prototype.format = function(data, format, decimals, trailingZeros) {
                return format = this.getScientificFormat(data, format, decimals, trailingZeros), 
                _super.prototype.format.call(this, data, format, decimals, trailingZeros);
            }, DataLabelsDisplayUnitSystem.AUTO_DISPLAYUNIT_VALUE = 0, DataLabelsDisplayUnitSystem.NONE_DISPLAYUNIT_VALUE = 1, 
            DataLabelsDisplayUnitSystem.UNSUPPORTED_FORMATS = /^(e\d*)$/i, DataLabelsDisplayUnitSystem;
        }(DisplayUnitSystem);
        powerbi.DataLabelsDisplayUnitSystem = DataLabelsDisplayUnitSystem;
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var NumericSequence = function() {
            function NumericSequence() {}
            return NumericSequence.calculate = function(range, expectedCount, maxAllowedMargin, minPower, useZeroRefPoint, steps) {
                var result = new NumericSequence();
                if (expectedCount = void 0 === expectedCount ? 10 : powerbi.Double.ensureInRange(expectedCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT), 
                void 0 === minPower && (minPower = powerbi.Double.MIN_EXP), void 0 === useZeroRefPoint && (useZeroRefPoint = !1), 
                void 0 === maxAllowedMargin && (maxAllowedMargin = 1), void 0 === steps && (steps = [ 1, 2, 5 ]), 
                range.forcedSingleStop) return result.interval = range.getSize(), result.intervalOffset = result.interval - (range.forcedSingleStop - range.min), 
                result.min = range.min, result.max = range.max, result.sequence = [ range.forcedSingleStop ], 
                result;
                var interval = 0, min = 0, max = 9, canExtendMin = maxAllowedMargin > 0 && !range.hasFixedMin, canExtendMax = maxAllowedMargin > 0 && !range.hasFixedMax, size = range.getSize(), exp = powerbi.Double.log10(size), stepExp = powerbi.Double.log10(steps[0]);
                exp -= stepExp;
                var expectedCountExp = powerbi.Double.log10(expectedCount);
                exp -= expectedCountExp, exp = Math.max(exp, minPower - stepExp + 1);
                var count = void 0;
                if (0 !== interval) {
                    var power = powerbi.Double.pow10(exp), roundMin = powerbi.Double.floorToPrecision(range.min, power), roundMax = powerbi.Double.ceilToPrecision(range.max, power), roundRange = powerbi.NumericSequenceRange.calculateFixedRange(roundMin, roundMax);
                    roundRange.shrinkByStep(range, interval), min = roundRange.min, max = roundRange.max, 
                    count = Math.floor(roundRange.getSize() / interval);
                } else {
                    var dexp = void 0;
                    for (dexp = 0; 3 > dexp; dexp++) {
                        for (var e = exp + dexp, power = powerbi.Double.pow10(e), roundMin = powerbi.Double.floorToPrecision(range.min, power), roundMax = powerbi.Double.ceilToPrecision(range.max, power), stepsCount = steps.length, stepPower = powerbi.Double.pow10(e - 1), i = 0; stepsCount > i; i++) {
                            var step = steps[i] * stepPower, roundRange = powerbi.NumericSequenceRange.calculateFixedRange(roundMin, roundMax, useZeroRefPoint);
                            if (roundRange.shrinkByStep(range, step), canExtendMin && range.min === roundRange.min && maxAllowedMargin >= 1 && (roundRange.min -= step), 
                            canExtendMax && range.max === roundRange.max && maxAllowedMargin >= 1 && (roundRange.max += step), 
                            count = powerbi.Double.ceilWithPrecision(roundRange.getSize() / step), expectedCount >= count || 2 === dexp && i === stepsCount - 1 || 1 === expectedCount && 2 === count && (step > range.getSize() || range.min < 0 && range.max > 0 && 2 * step >= range.getSize())) {
                                interval = step, min = roundRange.min, max = roundRange.max;
                                break;
                            }
                        }
                        if (0 !== interval) break;
                    }
                }
                (count > 32 * expectedCount || count > NumericSequence.MAX_COUNT) && (count = Math.min(32 * expectedCount, NumericSequence.MAX_COUNT), 
                interval = (max - min) / count), result.min = min, result.max = max, result.interval = interval, 
                result.intervalOffset = min - range.min, result.maxAllowedMargin = maxAllowedMargin, 
                result.canExtendMin = canExtendMin, result.canExtendMax = canExtendMax;
                var precision = powerbi.Double.getPrecision(interval, 0);
                result.precision = precision;
                var sequence = [], x = powerbi.Double.roundToPrecision(min, precision);
                sequence.push(x);
                for (var i = 0; count > i; i++) x = powerbi.Double.roundToPrecision(x + interval, precision), 
                sequence.push(x);
                return result.sequence = sequence, result.trimMinMax(range.min, range.max), result;
            }, NumericSequence.calculateUnits = function(min, max, maxCount, steps) {
                maxCount = powerbi.Double.ensureInRange(maxCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT), 
                min === max && (max = min + 1);
                for (var stepCount = 0, step = 0, i = 0; i < steps.length; i++) {
                    step = steps[i];
                    var maxStepCount = powerbi.Double.ceilWithPrecision(max / step), minStepCount = powerbi.Double.floorWithPrecision(min / step);
                    if (stepCount = maxStepCount - minStepCount, maxCount >= stepCount) break;
                }
                var offset = -min;
                offset %= step;
                var result = new NumericSequence();
                result.sequence = [];
                for (var x = min + offset; result.sequence.push(x), !(x >= max); x += step) ;
                return result.interval = step, result.intervalOffset = offset, result.min = result.sequence[0], 
                result.max = result.sequence[result.sequence.length - 1], result;
            }, NumericSequence.prototype.trimMinMax = function(min, max) {
                var minMargin = (min - this.min) / this.interval, maxMargin = (this.max - max) / this.interval, marginPrecision = .001;
                (!this.canExtendMin || minMargin > this.maxAllowedMargin && minMargin > marginPrecision) && (this.min = min), 
                (!this.canExtendMax || maxMargin > this.maxAllowedMargin && maxMargin > marginPrecision) && (this.max = max);
            }, NumericSequence.MIN_COUNT = 1, NumericSequence.MAX_COUNT = 1e3, NumericSequence;
        }();
        powerbi.NumericSequence = NumericSequence;
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var NumericSequenceRange = function() {
            function NumericSequenceRange() {}
            return NumericSequenceRange.prototype._ensureIncludeZero = function() {
                this.includeZero && (this.min > 0 && !this.hasFixedMin && (this.min = 0), this.max < 0 && !this.hasFixedMax && (this.max = 0));
            }, NumericSequenceRange.prototype._ensureNotEmpty = function() {
                if (this.min === this.max) if (this.min) {
                    var value = this.min, exp = powerbi.Double.log10(Math.abs(value)), step = void 0;
                    exp >= 0 && 4 > exp ? (step = .5, this.forcedSingleStop = value) : (step = powerbi.Double.pow10(exp) / 2, 
                    this.forcedSingleStop = null), this.min = value - step, this.max = value + step;
                } else this.min = 0, this.max = NumericSequenceRange.DEFAULT_MAX, this.hasFixedMin = !0, 
                this.hasFixedMax = !0;
            }, NumericSequenceRange.prototype._ensureDirection = function() {
                if (this.min > this.max) {
                    var temp = this.min;
                    this.min = this.max, this.max = temp;
                }
            }, NumericSequenceRange.prototype.getSize = function() {
                return this.max - this.min;
            }, NumericSequenceRange.prototype.shrinkByStep = function(range, step) {
                var oldCount = this.min / step, newCount = range.min / step, deltaCount = Math.floor(newCount - oldCount);
                this.min += deltaCount * step, oldCount = this.max / step, newCount = range.max / step, 
                deltaCount = Math.ceil(newCount - oldCount), this.max += deltaCount * step;
            }, NumericSequenceRange.calculate = function(dataMin, dataMax, fixedMin, fixedMax, includeZero) {
                var result = new NumericSequenceRange();
                return result.includeZero = !!includeZero, result.hasDataRange = ValueUtil.hasValue(dataMin) && ValueUtil.hasValue(dataMax), 
                result.hasFixedMin = ValueUtil.hasValue(fixedMin), result.hasFixedMax = ValueUtil.hasValue(fixedMax), 
                dataMin = powerbi.Double.ensureInRange(dataMin, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE), 
                dataMax = powerbi.Double.ensureInRange(dataMax, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE), 
                result.hasFixedMin && result.hasFixedMax ? (result.min = fixedMin, result.max = fixedMax) : result.hasFixedMin ? (result.min = fixedMin, 
                result.max = dataMax > fixedMin ? dataMax : fixedMin) : result.hasFixedMax ? (result.min = fixedMax > dataMin ? dataMin : fixedMax, 
                result.max = fixedMax) : result.hasDataRange ? (result.min = dataMin, result.max = dataMax) : (result.min = 0, 
                result.max = 0), result._ensureIncludeZero(), result._ensureNotEmpty(), result._ensureDirection(), 
                0 === result.min ? result.hasFixedMin = !0 : 0 === result.max && (result.hasFixedMax = !0), 
                result;
            }, NumericSequenceRange.calculateDataRange = function(dataMin, dataMax, includeZero) {
                return ValueUtil.hasValue(dataMin) && ValueUtil.hasValue(dataMax) ? NumericSequenceRange.calculate(dataMin, dataMax, null, null, includeZero) : NumericSequenceRange.calculateFixedRange(0, NumericSequenceRange.DEFAULT_MAX);
            }, NumericSequenceRange.calculateFixedRange = function(fixedMin, fixedMax, includeZero) {
                var result = new NumericSequenceRange();
                return result.hasDataRange = !1, result.includeZero = includeZero, result.min = fixedMin, 
                result.max = fixedMax, result._ensureIncludeZero(), result._ensureNotEmpty(), result._ensureDirection(), 
                result.hasFixedMin = !0, result.hasFixedMax = !0, result;
            }, NumericSequenceRange.DEFAULT_MAX = 10, NumericSequenceRange.MIN_SUPPORTED_DOUBLE = -1e307, 
            NumericSequenceRange.MAX_SUPPORTED_DOUBLE = 1e307, NumericSequenceRange;
        }();
        powerbi.NumericSequenceRange = NumericSequenceRange;
        var ValueUtil;
        !function(ValueUtil) {
            function hasValue(value) {
                return void 0 !== value && null !== value;
            }
            ValueUtil.hasValue = hasValue;
        }(ValueUtil = powerbi.ValueUtil || (powerbi.ValueUtil = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var visuals;
        !function(visuals) {
            var valueFormatter;
            !function(valueFormatter) {
                function beautify(format) {
                    var key = BeautifiedFormat[format];
                    return key ? defaultLocalizedStrings[key] || format : format;
                }
                function describeUnit(exponent) {
                    var exponentLookup = -1 === exponent ? "Auto" : exponent.toString(), title = defaultLocalizedStrings["DisplayUnitSystem_E" + exponentLookup + "_Title"], format = 0 >= exponent ? "{0}" : defaultLocalizedStrings["DisplayUnitSystem_E" + exponentLookup + "_LabelFormat"];
                    return title || format ? {
                        title: title,
                        format: format
                    } : void 0;
                }
                function getLocalizedString(stringId) {
                    return defaultLocalizedStrings[stringId];
                }
                function getFormatMetadata(format) {
                    return powerbi.NumberFormat.getCustomFormatMetadata(format);
                }
                function setLocaleOptions(options) {
                    locale = options, powerbi.DefaultDisplayUnitSystem.reset(), powerbi.WholeUnitsDisplayUnitSystem.reset();
                }
                function createDefaultFormatter(formatString, allowFormatBeautification) {
                    void 0 === allowFormatBeautification && (allowFormatBeautification = !1);
                    var formatBeaut = allowFormatBeautification ? locale.beautify(formatString) : formatString;
                    return {
                        format: function(value) {
                            return null == value ? locale["null"] : formatCore(value, formatBeaut);
                        }
                    };
                }
                function create(options) {
                    var format = options.allowFormatBeautification ? locale.beautify(options.format) : options.format;
                    if (shouldUseNumericDisplayUnits(options)) {
                        var displayUnitSystem_1 = createDisplayUnitSystem(options.displayUnitSystemType), singleValueFormattingMode_1 = !!options.formatSingleValues;
                        displayUnitSystem_1.update(Math.max(Math.abs(options.value || 0), Math.abs(options.value2 || 0)));
                        var decimals_1, forcePrecision_1 = null != options.precision;
                        if (forcePrecision_1 ? decimals_1 = -options.precision : displayUnitSystem_1.displayUnit && displayUnitSystem_1.displayUnit.value > 1 && (decimals_1 = -MaxScaledDecimalPlaces), 
                        options.detectAxisPrecision) {
                            forcePrecision_1 = !0;
                            var axisValue = options.value;
                            displayUnitSystem_1.displayUnit && displayUnitSystem_1.displayUnit.value > 0 && (axisValue /= displayUnitSystem_1.displayUnit.value), 
                            powerbi.Double.isInteger(axisValue) ? decimals_1 = 0 : (decimals_1 = powerbi.Double.log10(axisValue), 
                            format && valueFormatter.getFormatMetadata(format).hasPercent && (decimals_1 = 0 > decimals_1 ? Math.min(0, decimals_1 + 2) : 0));
                        }
                        return {
                            format: function(value) {
                                var formattedValue = getStringFormat(value, !0);
                                return StringExtensions.isNullOrUndefinedOrWhiteSpaceString(formattedValue) ? (value && !displayUnitSystem_1.isScalingUnit() && Math.abs(value) < MaxValueForDisplayUnitRounding && !forcePrecision_1 && (value = powerbi.Double.roundToPrecision(value)), 
                                singleValueFormattingMode_1 ? displayUnitSystem_1.formatSingleValue(value, format, decimals_1, forcePrecision_1) : displayUnitSystem_1.format(value, format, decimals_1, forcePrecision_1)) : formattedValue;
                            },
                            displayUnit: displayUnitSystem_1.displayUnit,
                            options: options
                        };
                    }
                    if (shouldUseDateUnits(options.value, options.value2, options.tickCount)) {
                        var unit_1 = powerbi.DateTimeSequence.getIntervalUnit(options.value, options.value2, options.tickCount);
                        return {
                            format: function(value) {
                                if (null == value) return locale["null"];
                                var formatString = powerbi.formattingService.dateFormatString(unit_1);
                                return formatCore(value, formatString);
                            },
                            options: options
                        };
                    }
                    return createDefaultFormatter(format);
                }
                function format(value, format, allowFormatBeautification) {
                    return null == value ? locale["null"] : formatCore(value, allowFormatBeautification ? locale.beautify(format) : format);
                }
                function formatVariantMeasureValue(value, column, formatStringProp, nullsAreBlank) {
                    if (!(column && column.type && column.type.dateTime) && value instanceof Date) {
                        var valueFormat = getFormatString(DateTimeMetadataColumn, null, !1);
                        return formatCore(value, valueFormat, nullsAreBlank);
                    }
                    return formatCore(value, getFormatString(column, formatStringProp), nullsAreBlank);
                }
                function createDisplayUnitSystem(displayUnitSystemType) {
                    if (null == displayUnitSystemType) return new powerbi.DefaultDisplayUnitSystem(locale.describe);
                    switch (displayUnitSystemType) {
                      case powerbi.DisplayUnitSystemType.Default:
                        return new powerbi.DefaultDisplayUnitSystem(locale.describe);

                      case powerbi.DisplayUnitSystemType.WholeUnits:
                        return new powerbi.WholeUnitsDisplayUnitSystem(locale.describe);

                      case powerbi.DisplayUnitSystemType.Verbose:
                        return new powerbi.NoDisplayUnitSystem();

                      case powerbi.DisplayUnitSystemType.DataLabels:
                        return new powerbi.DataLabelsDisplayUnitSystem(locale.describe);

                      default:
                        return new powerbi.DefaultDisplayUnitSystem(locale.describe);
                    }
                }
                function shouldUseNumericDisplayUnits(options) {
                    var value = options.value, value2 = options.value2, format = options.format;
                    if (options.formatSingleValues && format && Math.abs(value) < MinIntegerValueForDisplayUnits) {
                        var isCustomFormat = !powerbi.NumberFormat.isStandardFormat(format);
                        if (isCustomFormat) {
                            var precision = powerbi.NumberFormat.getCustomFormatMetadata(format, !0).precision;
                            if (MinPrecisionForDisplayUnits > precision) return !1;
                        } else if (powerbi.Double.isInteger(value)) return !1;
                    }
                    return "number" == typeof value || "number" == typeof value2 ? !0 : void 0;
                }
                function shouldUseDateUnits(value, value2, tickCount) {
                    return value instanceof Date && value2 instanceof Date && void 0 !== tickCount && null !== tickCount;
                }
                function getFormatString(column, formatStringProperty, suppressTypeFallback) {
                    if (column) {
                        if (formatStringProperty) {
                            var propertyValue = powerbi.DataViewObjects.getValue(column.objects, formatStringProperty);
                            if (propertyValue) return propertyValue;
                        }
                        if (!suppressTypeFallback) {
                            var columnType = column.type;
                            if (columnType) {
                                if (columnType.dateTime) return valueFormatter.DefaultDateFormat;
                                if (columnType.integer) return valueFormatter.DefaultIntegerFormat;
                                if (columnType.numeric) return valueFormatter.DefaultNumericFormat;
                            }
                        }
                    }
                }
                function formatListCompound(strings, conjunction) {
                    var result;
                    if (!strings) return null;
                    var length = strings.length;
                    if (length > 0) {
                        result = strings[0];
                        for (var lastIndex = length - 1, i = 1, len = lastIndex; len > i; i++) {
                            var value = strings[i];
                            result = StringExtensions.format(locale.restatementComma, result, value);
                        }
                        if (length > 1) {
                            var value = strings[lastIndex];
                            result = StringExtensions.format(conjunction, result, value);
                        }
                    } else result = null;
                    return result;
                }
                function formatListAnd(strings) {
                    return formatListCompound(strings, locale.restatementCompoundAnd);
                }
                function formatListOr(strings) {
                    return formatListCompound(strings, locale.restatementCompoundOr);
                }
                function formatCore(value, format, nullsAreBlank) {
                    var formattedValue = getStringFormat(value, nullsAreBlank ? nullsAreBlank : !1);
                    return StringExtensions.isNullOrUndefinedOrWhiteSpaceString(formattedValue) ? powerbi.formattingService.formatValue(value, format) : formattedValue;
                }
                function getStringFormat(value, nullsAreBlank) {
                    return null == value && nullsAreBlank ? locale["null"] : value === !0 ? locale["true"] : value === !1 ? locale["false"] : "number" == typeof value && isNaN(value) ? locale.NaN : value === Number.NEGATIVE_INFINITY ? locale.negativeInfinity : value === Number.POSITIVE_INFINITY ? locale.infinity : "";
                }
                function getDisplayUnits(displayUnitSystemType) {
                    var displayUnitSystem = createDisplayUnitSystem(displayUnitSystemType);
                    return displayUnitSystem.units;
                }
                var StringExtensions = jsCommon.StringExtensions, BeautifiedFormat = {
                    "0.00 %;-0.00 %;0.00 %": "Percentage",
                    "0.0 %;-0.0 %;0.0 %": "Percentage1"
                };
                valueFormatter.DefaultIntegerFormat = "g", valueFormatter.DefaultNumericFormat = "#,0.00", 
                valueFormatter.DefaultDateFormat = "d";
                var defaultLocalizedStrings = {
                    NullValue: "(Blank)",
                    BooleanTrue: "True",
                    BooleanFalse: "False",
                    NaNValue: "NaN",
                    InfinityValue: "+Infinity",
                    NegativeInfinityValue: "-Infinity",
                    RestatementComma: "{0}, {1}",
                    RestatementCompoundAnd: "{0} and {1}",
                    RestatementCompoundOr: "{0} or {1}",
                    DisplayUnitSystem_EAuto_Title: "Auto",
                    DisplayUnitSystem_E0_Title: "None",
                    DisplayUnitSystem_E3_LabelFormat: "{0}K",
                    DisplayUnitSystem_E3_Title: "Thousands",
                    DisplayUnitSystem_E6_LabelFormat: "{0}M",
                    DisplayUnitSystem_E6_Title: "Millions",
                    DisplayUnitSystem_E9_LabelFormat: "{0}bn",
                    DisplayUnitSystem_E9_Title: "Billions",
                    DisplayUnitSystem_E12_LabelFormat: "{0}T",
                    DisplayUnitSystem_E12_Title: "Trillions",
                    Percentage: "#,0.##%",
                    Percentage1: "#,0.#%",
                    TableTotalLabel: "Total",
                    Tooltip_HighlightedValueDisplayName: "Highlighted",
                    Funnel_PercentOfFirst: "Percent of first",
                    Funnel_PercentOfPrevious: "Percent of previous",
                    Funnel_PercentOfFirst_Highlight: "Percent of first (highlighted)",
                    Funnel_PercentOfPrevious_Highlight: "Percent of previous (highlighted)",
                    GeotaggingString_Continent: "continent",
                    GeotaggingString_Continents: "continents",
                    GeotaggingString_Country: "country",
                    GeotaggingString_Countries: "countries",
                    GeotaggingString_State: "state",
                    GeotaggingString_States: "states",
                    GeotaggingString_City: "city",
                    GeotaggingString_Cities: "cities",
                    GeotaggingString_Town: "town",
                    GeotaggingString_Towns: "towns",
                    GeotaggingString_Province: "province",
                    GeotaggingString_Provinces: "provinces",
                    GeotaggingString_County: "county",
                    GeotaggingString_Counties: "counties",
                    GeotaggingString_Village: "village",
                    GeotaggingString_Villages: "villages",
                    GeotaggingString_Post: "post",
                    GeotaggingString_Zip: "zip",
                    GeotaggingString_Code: "code",
                    GeotaggingString_Place: "place",
                    GeotaggingString_Places: "places",
                    GeotaggingString_Address: "address",
                    GeotaggingString_Addresses: "addresses",
                    GeotaggingString_Street: "street",
                    GeotaggingString_Streets: "streets",
                    GeotaggingString_Longitude: "longitude",
                    GeotaggingString_Longitude_Short: "lon",
                    GeotaggingString_Longitude_Short2: "long",
                    GeotaggingString_Latitude: "latitude",
                    GeotaggingString_Latitude_Short: "lat",
                    GeotaggingString_PostalCode: "postal code",
                    GeotaggingString_PostalCodes: "postal codes",
                    GeotaggingString_ZipCode: "zip code",
                    GeotaggingString_ZipCodes: "zip codes",
                    GeotaggingString_Territory: "territory",
                    GeotaggingString_Territories: "territories"
                };
                valueFormatter.getLocalizedString = getLocalizedString;
                var locale = {
                    "null": defaultLocalizedStrings.NullValue,
                    "true": defaultLocalizedStrings.BooleanTrue,
                    "false": defaultLocalizedStrings.BooleanFalse,
                    NaN: defaultLocalizedStrings.NaNValue,
                    infinity: defaultLocalizedStrings.InfinityValue,
                    negativeInfinity: defaultLocalizedStrings.NegativeInfinityValue,
                    beautify: function(format) {
                        return beautify(format);
                    },
                    describe: function(exponent) {
                        return describeUnit(exponent);
                    },
                    restatementComma: defaultLocalizedStrings.RestatementComma,
                    restatementCompoundAnd: defaultLocalizedStrings.RestatementCompoundAnd,
                    restatementCompoundOr: defaultLocalizedStrings.RestatementCompoundOr
                }, MaxScaledDecimalPlaces = 2, MaxValueForDisplayUnitRounding = 1e3, MinIntegerValueForDisplayUnits = 1e4, MinPrecisionForDisplayUnits = 2, DateTimeMetadataColumn = {
                    displayName: "",
                    type: powerbi.ValueType.fromPrimitiveTypeAndCategory(powerbi.PrimitiveType.DateTime)
                };
                valueFormatter.getFormatMetadata = getFormatMetadata, valueFormatter.setLocaleOptions = setLocaleOptions, 
                valueFormatter.createDefaultFormatter = createDefaultFormatter, valueFormatter.create = create, 
                valueFormatter.format = format, valueFormatter.formatVariantMeasureValue = formatVariantMeasureValue, 
                valueFormatter.getFormatString = getFormatString, valueFormatter.formatListAnd = formatListAnd, 
                valueFormatter.formatListOr = formatListOr, valueFormatter.getDisplayUnits = getDisplayUnits;
            }(valueFormatter = visuals.valueFormatter || (visuals.valueFormatter = {}));
        }(visuals = powerbi.visuals || (powerbi.visuals = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewMatrixUtils, inherit = powerbi.Prototype.inherit, inheritSingle = powerbi.Prototype.inheritSingle, ArrayExtensions = jsCommon.ArrayExtensions;
            !function(DataViewMatrixUtils) {
                function isLeafNode(node) {
                    return _.isEmpty(node.children);
                }
                function forEachNodeDepthFirst(rootNodes, callback) {
                    if (rootNodes) if (isNodeArray(rootNodes)) for (var _i = 0, rootNodes_1 = rootNodes; _i < rootNodes_1.length; _i++) {
                        var rootNode = rootNodes_1[_i];
                        rootNode && forEachNodeDepthFirstRecursive(rootNode, [], callback);
                    } else forEachNodeDepthFirstRecursive(rootNodes, [], callback);
                }
                function forEachNodeDepthFirstRecursive(matrixNode, traversalPath, callback) {
                    traversalPath.push(matrixNode);
                    var traversalResult = callback(matrixNode, traversalPath), shouldContinue = !!traversalResult && 0 !== traversalResult;
                    if (1 === traversalResult) {
                        var childNodes = matrixNode.children;
                        if (!_.isEmpty(childNodes)) for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
                            var nextChild = childNodes_1[_i];
                            if (nextChild && (shouldContinue = forEachNodeDepthFirstRecursive(nextChild, traversalPath, callback), 
                            !shouldContinue)) break;
                        }
                    }
                    return traversalPath.pop(), shouldContinue;
                }
                function forEachLeafNode(rootNodes, callback) {
                    var nextLeafNodeIndex = 0;
                    forEachNodeDepthFirst(rootNodes, function(node, traversalPath) {
                        return isLeafNode(node) && (callback(node, nextLeafNodeIndex, traversalPath), nextLeafNodeIndex++), 
                        1;
                    });
                }
                function isNodeArray(nodeOrNodeArray) {
                    return ArrayExtensions.isArrayOrInheritedArray(nodeOrNodeArray);
                }
                function forEachNodeAtLevel(node, targetLevel, callback) {
                    if (node.level === targetLevel) return void callback(node);
                    var children = node.children;
                    if (children && children.length > 0) for (var i = 0, ilen = children.length; ilen > i; i++) forEachNodeAtLevel(children[i], targetLevel, callback);
                }
                function inheritMatrixNodeHierarchy(node, deepestLevelToInherit, useInheritSingle) {
                    var returnNode = node, isRootNode = void 0 === node.level, shouldInheritCurrentNode = isRootNode || node.level <= deepestLevelToInherit;
                    if (shouldInheritCurrentNode) {
                        var inheritFunc = useInheritSingle ? inheritSingle : inherit, inheritedNode = inheritFunc(node), shouldInheritChildNodes = isRootNode || node.level < deepestLevelToInherit;
                        if (shouldInheritChildNodes && !_.isEmpty(node.children)) {
                            inheritedNode.children = inheritFunc(node.children);
                            for (var i = 0, ilen = inheritedNode.children.length; ilen > i; i++) inheritedNode.children[i] = inheritMatrixNodeHierarchy(inheritedNode.children[i], deepestLevelToInherit, useInheritSingle);
                        }
                        returnNode = inheritedNode;
                    }
                    return returnNode;
                }
                function containsCompositeGroup(matrixOrHierarchy) {
                    var hasCompositeGroup = !1;
                    if (matrixOrHierarchy) if (isMatrix(matrixOrHierarchy)) hasCompositeGroup = containsCompositeGroup(matrixOrHierarchy.rows) || containsCompositeGroup(matrixOrHierarchy.columns); else {
                        var hierarchyLevels = matrixOrHierarchy.levels;
                        if (!_.isEmpty(hierarchyLevels)) for (var _i = 0, hierarchyLevels_1 = hierarchyLevels; _i < hierarchyLevels_1.length; _i++) {
                            var level = hierarchyLevels_1[_i];
                            if (level.sources && level.sources.length >= 2) {
                                var isMeasureHeadersLevel = level.sources[0].isMeasure;
                                if (!isMeasureHeadersLevel) {
                                    hasCompositeGroup = !0;
                                    break;
                                }
                            }
                        }
                    }
                    return hasCompositeGroup;
                }
                function isMatrix(matrixOrHierarchy) {
                    return "rows" in matrixOrHierarchy && "columns" in matrixOrHierarchy && "valueSources" in matrixOrHierarchy;
                }
                DataViewMatrixUtils.isLeafNode = isLeafNode, DataViewMatrixUtils.forEachNodeDepthFirst = forEachNodeDepthFirst, 
                DataViewMatrixUtils.forEachLeafNode = forEachLeafNode, DataViewMatrixUtils.forEachNodeAtLevel = forEachNodeAtLevel, 
                DataViewMatrixUtils.inheritMatrixNodeHierarchy = inheritMatrixNodeHierarchy, DataViewMatrixUtils.containsCompositeGroup = containsCompositeGroup;
            }(DataViewMatrixUtils = data.DataViewMatrixUtils || (data.DataViewMatrixUtils = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewMetadataColumnUtils;
            !function(DataViewMetadataColumnUtils) {
                function isForRole(metadataColumn, targetRole) {
                    var roles = metadataColumn.roles;
                    return !!roles && !!roles[targetRole];
                }
                function isForAnyRole(metadataColumn, targetRoles) {
                    var roles = metadataColumn.roles;
                    return !!roles && _.any(targetRoles, function(targetRole) {
                        return roles[targetRole];
                    });
                }
                function leftJoinMetadataColumnsAndProjectionOrder(columnSources, projectionOrdering, roles) {
                    var jointResult = [];
                    if (!_.isEmpty(columnSources)) for (var selectIndexToProjectionIndicesMap = createSelectIndexToProjectionOrderIndicesMapping(projectionOrdering), j = 0, jlen = columnSources.length; jlen > j; j++) {
                        var column = columnSources[j];
                        if (isForAnyRole(column, roles)) {
                            var projectionIndices = selectIndexToProjectionIndicesMap[column.index];
                            if (_.isEmpty(projectionIndices)) {
                                var jointColumnInfo = {
                                    metadataColumn: column,
                                    sourceIndex: j,
                                    projectionOrderIndex: void 0
                                };
                                jointResult.push(jointColumnInfo);
                            } else for (var _i = 0, projectionIndices_1 = projectionIndices; _i < projectionIndices_1.length; _i++) {
                                var projectionIndex = projectionIndices_1[_i], jointColumnInfo = {
                                    metadataColumn: column,
                                    sourceIndex: j,
                                    projectionOrderIndex: projectionIndex
                                };
                                jointResult.push(jointColumnInfo);
                            }
                        }
                    }
                    return jointResult;
                }
                function createSelectIndexToProjectionOrderIndicesMapping(selectIndicesByProjectionOrder) {
                    for (var selectIndexToProjectionIndicesMap = {}, i = 0, ilen = selectIndicesByProjectionOrder.length; ilen > i; i++) {
                        var selectIndex = selectIndicesByProjectionOrder[i], projectionOrders = selectIndexToProjectionIndicesMap[selectIndex];
                        projectionOrders || (projectionOrders = selectIndexToProjectionIndicesMap[selectIndex] = []), 
                        projectionOrders.push(i);
                    }
                    return selectIndexToProjectionIndicesMap;
                }
                DataViewMetadataColumnUtils.isForRole = isForRole, DataViewMetadataColumnUtils.isForAnyRole = isForAnyRole, 
                DataViewMetadataColumnUtils.leftJoinMetadataColumnsAndProjectionOrder = leftJoinMetadataColumnsAndProjectionOrder;
            }(DataViewMetadataColumnUtils = data.DataViewMetadataColumnUtils || (data.DataViewMetadataColumnUtils = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
}, function(module, exports) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataRoleHelper;
            !function(DataRoleHelper) {
                function getMeasureIndexOfRole(grouped, roleName) {
                    if (!_.isEmpty(grouped)) {
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) for (var i = 0, len = firstGroup.values.length; len > i; ++i) {
                            var value = firstGroup.values[i];
                            if (value && value.source && hasRole(value.source, roleName)) return i;
                        }
                    }
                    return -1;
                }
                function getCategoryIndexOfRole(categories, roleName) {
                    if (!_.isEmpty(categories)) for (var i = 0, ilen = categories.length; ilen > i; i++) if (hasRole(categories[i].source, roleName)) return i;
                    return -1;
                }
                function hasRole(column, name) {
                    var roles = column.roles;
                    return roles && roles[name];
                }
                function hasRoleInDataView(dataView, name) {
                    return null != dataView && null != dataView.metadata && dataView.metadata.columns && _.any(dataView.metadata.columns, function(c) {
                        return c.roles && void 0 !== c.roles[name];
                    });
                }
                function hasRoleInValueColumn(valueColumn, name) {
                    return valueColumn && valueColumn.source && valueColumn.source.roles && valueColumn.source.roles[name] === !0;
                }
                DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole, DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole, 
                DataRoleHelper.hasRole = hasRole, DataRoleHelper.hasRoleInDataView = hasRoleInDataView, 
                DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
            }(DataRoleHelper = data.DataRoleHelper || (data.DataRoleHelper = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createIDataViewCategoricalReader(dataView) {
                return new DataViewCategoricalReader(dataView);
            }
            var DataRoleHelper = powerbi.data.DataRoleHelper;
            data.createIDataViewCategoricalReader = createIDataViewCategoricalReader;
            var DataViewCategoricalReader = function() {
                function DataViewCategoricalReader(dataView) {
                    this.dataView = dataView;
                    var categorical;
                    dataView && (categorical = dataView.categorical);
                    var categories;
                    categorical && (categories = this.categories = categorical.categories), this.hasValidCategories = !_.isEmpty(categories);
                    var values;
                    if (categorical && (values = categorical.values), this.hasAnyValidValues = !1, null != values) {
                        var grouped = dataView.categorical.values.grouped();
                        if (grouped.length > 0) {
                            this.hasAnyValidValues = !0, this.grouped = grouped;
                            for (var valueRoleIndexMapping = {}, firstGroupValues = grouped[0].values, valueIndex = 0, valueCount = firstGroupValues.length; valueCount > valueIndex; valueIndex++) {
                                var valueRoles = firstGroupValues[valueIndex].source.roles;
                                for (var role in valueRoles) valueRoles[role] && (valueRoleIndexMapping[role] || (valueRoleIndexMapping[role] = []), 
                                valueRoleIndexMapping[role].push(valueIndex));
                            }
                            this.valueRoleIndexMapping = valueRoleIndexMapping;
                        }
                    }
                    this.hasAnyValidValues && (this.dataHasDynamicSeries = !!this.dataView.categorical.values.source);
                }
                return DataViewCategoricalReader.prototype.hasCategories = function() {
                    return this.hasValidCategories;
                }, DataViewCategoricalReader.prototype.getCategoryCount = function() {
                    return this.hasValidCategories ? this.categories[0].values.length : 0;
                }, DataViewCategoricalReader.prototype.getCategoryValues = function(roleName) {
                    if (this.hasValidCategories) {
                        var categories = this.getCategoryFromRole(roleName);
                        return categories ? categories.values : void 0;
                    }
                }, DataViewCategoricalReader.prototype.getCategoryValue = function(roleName, categoryIndex) {
                    if (this.hasValidCategories) {
                        var categories = this.getCategoryFromRole(roleName);
                        return categories ? categories.values[categoryIndex] : void 0;
                    }
                }, DataViewCategoricalReader.prototype.getCategoryColumn = function(roleName) {
                    return this.hasValidCategories ? this.getCategoryFromRole(roleName) : void 0;
                }, DataViewCategoricalReader.prototype.getCategoryMetadataColumn = function(roleName) {
                    if (this.hasValidCategories) {
                        var categories = this.getCategoryFromRole(roleName);
                        return categories ? categories.source : void 0;
                    }
                }, DataViewCategoricalReader.prototype.getCategoryColumnIdentityFields = function(roleName) {
                    if (this.hasValidCategories) {
                        var categories = this.getCategoryFromRole(roleName);
                        return categories ? categories.identityFields : void 0;
                    }
                }, DataViewCategoricalReader.prototype.getCategoryDisplayName = function(roleName) {
                    if (this.hasValidCategories) {
                        var targetColumn = this.getCategoryColumn(roleName);
                        if (targetColumn && targetColumn.source) return targetColumn.source.displayName;
                    }
                }, DataViewCategoricalReader.prototype.hasCompositeCategories = function() {
                    return this.hasValidCategories ? this.categories.length > 1 : void 0;
                }, DataViewCategoricalReader.prototype.hasCategoryWithRole = function(roleName) {
                    return -1 !== DataRoleHelper.getCategoryIndexOfRole(this.categories, roleName);
                }, DataViewCategoricalReader.prototype.getCategoryObjects = function(roleName, categoryIndex) {
                    if (this.hasValidCategories) {
                        var category = this.getCategoryFromRole(roleName);
                        if (category && category.objects) return category.objects[categoryIndex];
                    }
                }, DataViewCategoricalReader.prototype.getCategoryFromRole = function(roleName) {
                    var categories = this.categories;
                    return categories[DataRoleHelper.getCategoryIndexOfRole(categories, roleName)];
                }, DataViewCategoricalReader.prototype.hasValues = function(roleName) {
                    return this.valueRoleIndexMapping && !_.isEmpty(this.valueRoleIndexMapping[roleName]);
                }, DataViewCategoricalReader.prototype.hasHighlights = function(roleName) {
                    return this.hasValues(roleName) ? !_.isEmpty(this.grouped[0].values[this.valueRoleIndexMapping[roleName][0]].highlights) : !1;
                }, DataViewCategoricalReader.prototype.getValue = function(roleName, categoryIndex, seriesIndex) {
                    return void 0 === seriesIndex && (seriesIndex = 0), this.hasValues(roleName) ? this.dataHasDynamicSeries ? this.getValueInternal(roleName, categoryIndex, seriesIndex, 0, !1) : this.getValueInternal(roleName, categoryIndex, 0, seriesIndex, !1) : void 0;
                }, DataViewCategoricalReader.prototype.getHighlight = function(roleName, categoryIndex, seriesIndex) {
                    return void 0 === seriesIndex && (seriesIndex = 0), this.hasValues(roleName) ? this.dataHasDynamicSeries ? this.getValueInternal(roleName, categoryIndex, seriesIndex, 0, !0) : this.getValueInternal(roleName, categoryIndex, 0, seriesIndex, !0) : void 0;
                }, DataViewCategoricalReader.prototype.getAllValuesForRole = function(roleName, categoryIndex, seriesIndex) {
                    if (void 0 === seriesIndex && (seriesIndex = 0), this.hasValues(roleName)) {
                        for (var valuesInRole = [], roleValueIndex = 0, roleValueCount = this.valueRoleIndexMapping[roleName].length; roleValueCount > roleValueIndex; roleValueIndex++) valuesInRole.push(this.getValueInternal(roleName, categoryIndex, seriesIndex, roleValueIndex, !1));
                        return valuesInRole;
                    }
                }, DataViewCategoricalReader.prototype.getAllHighlightsForRole = function(roleName, categoryIndex, seriesIndex) {
                    if (void 0 === seriesIndex && (seriesIndex = 0), this.hasValues(roleName)) {
                        for (var valuesInRole = [], roleValueIndex = 0, roleValueCount = this.valueRoleIndexMapping[roleName].length; roleValueCount > roleValueIndex; roleValueIndex++) valuesInRole.push(this.getValueInternal(roleName, categoryIndex, seriesIndex, roleValueIndex, !0));
                        return valuesInRole;
                    }
                }, DataViewCategoricalReader.prototype.getValueInternal = function(roleName, categoryIndex, groupIndex, valueColumnIndexInRole, getHighlight) {
                    if (this.hasValues(roleName)) {
                        var valueColumnIndex = this.valueRoleIndexMapping[roleName][valueColumnIndexInRole], groupedValues = this.grouped[groupIndex].values[valueColumnIndex];
                        return getHighlight ? groupedValues.highlights[categoryIndex] : groupedValues.values[categoryIndex];
                    }
                }, DataViewCategoricalReader.prototype.getFirstNonNullValueForCategory = function(roleName, categoryIndex) {
                    if (this.hasValues(roleName)) {
                        if (!this.dataHasDynamicSeries) return this.getValue(roleName, categoryIndex);
                        for (var seriesIndex = 0, seriesCount = this.grouped.length; seriesCount > seriesIndex; seriesIndex++) {
                            var value = this.getValue(roleName, categoryIndex, seriesIndex);
                            if (null != value) return value;
                        }
                    }
                }, DataViewCategoricalReader.prototype.getMeasureQueryName = function(roleName) {
                    return this.hasValues(roleName) ? this.grouped[0].values[this.valueRoleIndexMapping[roleName][0]].source.queryName : void 0;
                }, DataViewCategoricalReader.prototype.getValueColumn = function(roleName, seriesIndex) {
                    return void 0 === seriesIndex && (seriesIndex = 0), this.hasValues(roleName) ? this.dataHasDynamicSeries ? this.grouped[seriesIndex].values[this.valueRoleIndexMapping[roleName][0]] : this.grouped[0].values[this.valueRoleIndexMapping[roleName][seriesIndex]] : void 0;
                }, DataViewCategoricalReader.prototype.getValueMetadataColumn = function(roleName, seriesIndex) {
                    void 0 === seriesIndex && (seriesIndex = 0);
                    var valueColumn = this.getValueColumn(roleName, seriesIndex);
                    return valueColumn ? valueColumn.source : void 0;
                }, DataViewCategoricalReader.prototype.getAllValueMetadataColumnsForRole = function(roleName, seriesIndex) {
                    if (void 0 === seriesIndex && (seriesIndex = 0), this.hasValues(roleName)) {
                        for (var metadata = [], roleValueIndex = 0, roleValueCount = this.valueRoleIndexMapping[roleName].length; roleValueCount > roleValueIndex; roleValueIndex++) {
                            var column = this.grouped[seriesIndex].values[this.valueRoleIndexMapping[roleName][roleValueIndex]].source;
                            metadata.push(column);
                        }
                        return metadata;
                    }
                }, DataViewCategoricalReader.prototype.getValueDisplayName = function(roleName, seriesIndex) {
                    if (this.hasValues(roleName)) {
                        var targetColumn = this.getValueColumn(roleName, seriesIndex);
                        if (targetColumn && targetColumn.source) return targetColumn.source.displayName;
                    }
                }, DataViewCategoricalReader.prototype.hasDynamicSeries = function() {
                    return this.dataHasDynamicSeries;
                }, DataViewCategoricalReader.prototype.getSeriesCount = function(valueRoleName) {
                    if (this.hasAnyValidValues) {
                        if (this.dataHasDynamicSeries) return this.grouped.length;
                        var roleIndexMap = valueRoleName && this.valueRoleIndexMapping[valueRoleName];
                        return roleIndexMap ? roleIndexMap.length : 1;
                    }
                }, DataViewCategoricalReader.prototype.getSeriesObjects = function(seriesIndex) {
                    return this.hasAnyValidValues ? this.grouped[seriesIndex].objects : void 0;
                }, DataViewCategoricalReader.prototype.getSeriesValueColumns = function() {
                    return this.hasAnyValidValues ? this.dataView.categorical.values : void 0;
                }, DataViewCategoricalReader.prototype.getSeriesValueColumnGroup = function(seriesIndex) {
                    return this.hasAnyValidValues ? this.grouped[seriesIndex] : void 0;
                }, DataViewCategoricalReader.prototype.getSeriesMetadataColumn = function() {
                    return this.hasAnyValidValues ? this.dataView.categorical.values.source : void 0;
                }, DataViewCategoricalReader.prototype.getSeriesColumnIdentityFields = function() {
                    return this.hasAnyValidValues ? this.dataView.categorical.values.identityFields : void 0;
                }, DataViewCategoricalReader.prototype.getSeriesName = function(seriesIndex) {
                    return this.hasAnyValidValues ? this.grouped[seriesIndex].name : void 0;
                }, DataViewCategoricalReader.prototype.getSeriesDisplayName = function() {
                    return this.hasAnyValidValues && this.dataHasDynamicSeries ? this.dataView.categorical.values.source.displayName : void 0;
                }, DataViewCategoricalReader.prototype.getStaticObjects = function() {
                    var result = null;
                    return this.dataView.metadata && this.dataView.metadata.objects && (result = this.dataView.metadata.objects), 
                    result;
                }, DataViewCategoricalReader;
            }();
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewConcatenateCategoricalColumns, inherit = powerbi.Prototype.inherit, inheritSingle = powerbi.Prototype.inheritSingle, valueFormatter = powerbi.visuals.valueFormatter;
            !function(DataViewConcatenateCategoricalColumns) {
                function detectAndApply(dataView, objectDescriptors, applicableRoleMappings, projectionOrdering, projectionActiveItems) {
                    var result = dataView, dataViewCategorical = dataView.categorical;
                    if (dataViewCategorical) {
                        var concatenationSource = detectCategoricalRoleForHierarchicalGroup(dataViewCategorical, applicableRoleMappings);
                        if (concatenationSource) {
                            var columnsSortedByProjectionOrdering = sortColumnsByProjectionOrdering(projectionOrdering, concatenationSource.roleName, concatenationSource.categories);
                            if (columnsSortedByProjectionOrdering.length >= 2) {
                                var activeItemsToIgnoreInConcatenation = _.chain(projectionActiveItems && projectionActiveItems[concatenationSource.roleName]).filter(function(activeItemInfo) {
                                    return activeItemInfo.suppressConcat;
                                }).map(function(activeItemInfo) {
                                    return activeItemInfo.queryRef;
                                }).value();
                                result = applyConcatenation(dataView, objectDescriptors, concatenationSource.roleName, columnsSortedByProjectionOrdering, activeItemsToIgnoreInConcatenation);
                            }
                        }
                    }
                    return result;
                }
                function applyToPlayChartCategorical(metadata, objectDescriptors, categoryRoleName, categorical) {
                    var result;
                    if (!_.isEmpty(categorical.categories) && categorical.categories.length >= 2) {
                        var transformingColumns_1 = inherit(metadata.columns), transformingMetadata = inherit(metadata, function(m) {
                            m.columns = transformingColumns_1;
                        }), transformingDataView = {
                            metadata: transformingMetadata,
                            categorical: categorical
                        };
                        result = applyConcatenation(transformingDataView, objectDescriptors, categoryRoleName, categorical.categories, []);
                    } else result = {
                        metadata: metadata,
                        categorical: categorical
                    };
                    return result;
                }
                function detectCategoricalRoleForHierarchicalGroup(dataViewCategorical, applicableRoleMappings) {
                    var result, isEveryRoleMappingForCategorical = !_.isEmpty(applicableRoleMappings) && _.every(applicableRoleMappings, function(roleMapping) {
                        return !!roleMapping.categorical;
                    });
                    if (isEveryRoleMappingForCategorical) {
                        var targetRoleName_1 = getSingleCategoryRoleNameInEveryRoleMapping(applicableRoleMappings);
                        if (targetRoleName_1 && isVisualExpectingMaxOneCategoryColumn(targetRoleName_1, applicableRoleMappings)) {
                            var categoryColumnsForTargetRole_1 = _.filter(dataViewCategorical.categories, function(categoryColumn) {
                                return categoryColumn.source.roles && !!categoryColumn.source.roles[targetRoleName_1];
                            });
                            if (categoryColumnsForTargetRole_1.length >= 2) {
                                var areValuesCountsEqual = _.every(categoryColumnsForTargetRole_1, function(categoryColumn) {
                                    return categoryColumn.values.length === categoryColumnsForTargetRole_1[0].values.length;
                                });
                                areValuesCountsEqual && (result = {
                                    roleName: targetRoleName_1,
                                    categories: categoryColumnsForTargetRole_1
                                });
                            }
                        }
                    }
                    return result;
                }
                function getSingleCategoryRoleNameInEveryRoleMapping(categoricalRoleMappings) {
                    var result, uniqueCategoryRoles = _.chain(categoricalRoleMappings).map(function(roleMapping) {
                        var categoryRoles = getAllRolesInCategories(roleMapping.categorical);
                        return 1 === categoryRoles.length ? categoryRoles[0] : void 0;
                    }).uniq().value(), isSameCategoryRoleNameInAllRoleMappings = 1 === uniqueCategoryRoles.length && void 0 !== uniqueCategoryRoles[0];
                    return isSameCategoryRoleNameInAllRoleMappings && (result = uniqueCategoryRoles[0]), 
                    result;
                }
                function isVisualExpectingMaxOneCategoryColumn(categoricalRoleName, roleMappings) {
                    var isVisualExpectingMaxOneCategoryColumn = _.every(roleMappings, function(roleMapping) {
                        return !_.isEmpty(roleMapping.conditions) && _.every(roleMapping.conditions, function(condition) {
                            return condition[categoricalRoleName] && 1 === condition[categoricalRoleName].max;
                        });
                    });
                    return isVisualExpectingMaxOneCategoryColumn;
                }
                function getAllRolesInCategories(categoricalRoleMapping) {
                    var roleNames = [];
                    return powerbi.DataViewMapping.visitCategoricalCategories(categoricalRoleMapping.categories, {
                        visitRole: function(roleName) {
                            roleNames.push(roleName);
                        }
                    }), roleNames;
                }
                function applyConcatenation(dataView, objectDescriptors, roleName, columnsSortedByProjectionOrdering, queryRefsToIgnore) {
                    var formatStringPropId = data.DataViewObjectDescriptors.findFormatString(objectDescriptors), concatenatedValues = concatenateValues(columnsSortedByProjectionOrdering, queryRefsToIgnore, formatStringPropId), columnsSourceSortedByProjectionOrdering = _.map(columnsSortedByProjectionOrdering, function(categoryColumn) {
                        return categoryColumn.source;
                    }), concatenatedColumnMetadata = createConcatenatedColumnMetadata(roleName, columnsSourceSortedByProjectionOrdering, queryRefsToIgnore), transformedDataView = inheritSingle(dataView);
                    addToMetadata(transformedDataView, concatenatedColumnMetadata);
                    var dataViewCategorical = dataView.categorical, dataViewObjects = dataViewCategorical.categories[0].objects, concatenatedCategoryColumn = createConcatenatedCategoryColumn(columnsSortedByProjectionOrdering, concatenatedColumnMetadata, concatenatedValues, dataViewObjects), transformedCategoricalCategories = _.difference(dataViewCategorical.categories, columnsSortedByProjectionOrdering);
                    transformedCategoricalCategories.push(concatenatedCategoryColumn);
                    var transformedCategorical = inheritSingle(dataViewCategorical);
                    return transformedCategorical.categories = transformedCategoricalCategories, transformedDataView.categorical = transformedCategorical, 
                    transformedDataView;
                }
                function concatenateValues(columnsSortedByProjectionOrdering, queryRefsToIgnore, formatStringPropId) {
                    for (var concatenatedValues = [], _i = 0, columnsSortedByProjectionOrdering_1 = columnsSortedByProjectionOrdering; _i < columnsSortedByProjectionOrdering_1.length; _i++) for (var categoryColumn = columnsSortedByProjectionOrdering_1[_i], formatString = valueFormatter.getFormatString(categoryColumn.source, formatStringPropId), i = 0, len = categoryColumn.values.length; len > i; i++) if (!_.contains(queryRefsToIgnore, categoryColumn.source.queryName)) {
                        var value = categoryColumn.values && categoryColumn.values[i], formattedValue = valueFormatter.format(value, formatString);
                        concatenatedValues[i] = void 0 === concatenatedValues[i] ? formattedValue : formattedValue + " " + concatenatedValues[i];
                    }
                    return concatenatedValues;
                }
                function sortColumnsByProjectionOrdering(projectionOrdering, roleName, columns) {
                    var columnsInProjectionOrdering;
                    if (projectionOrdering) {
                        for (var columnsByIndex_1 = {}, _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                            var column = columns_1[_i];
                            column.source.roles[roleName] && (columnsByIndex_1[column.source.index] = column);
                        }
                        var columnIndicesInProjectionOrdering = projectionOrdering[roleName];
                        columnsInProjectionOrdering = _.chain(columnIndicesInProjectionOrdering).map(function(columnIndex) {
                            return columnsByIndex_1[columnIndex];
                        }).filter(function(column) {
                            return !!column;
                        }).value();
                    } else columnsInProjectionOrdering = _.filter(columns, function(column) {
                        return column.source.roles[roleName];
                    });
                    return columnsInProjectionOrdering;
                }
                function createConcatenatedColumnMetadata(roleName, sourceColumnsSortedByProjectionOrdering, queryRefsToIgnore) {
                    for (var concatenatedDisplayName, _i = 0, sourceColumnsSortedByProjectionOrdering_1 = sourceColumnsSortedByProjectionOrdering; _i < sourceColumnsSortedByProjectionOrdering_1.length; _i++) {
                        var columnSource = sourceColumnsSortedByProjectionOrdering_1[_i];
                        _.contains(queryRefsToIgnore, columnSource.queryName) || (concatenatedDisplayName = null == concatenatedDisplayName ? columnSource.displayName : columnSource.displayName + " " + concatenatedDisplayName);
                    }
                    var newRoles = {};
                    newRoles[roleName] = !0;
                    var newColumnMetadata = {
                        displayName: concatenatedDisplayName,
                        roles: newRoles,
                        type: powerbi.ValueType.fromPrimitiveTypeAndCategory(powerbi.PrimitiveType.Text)
                    }, columnSourceForCurrentDrillLevel = _.last(sourceColumnsSortedByProjectionOrdering);
                    return void 0 !== columnSourceForCurrentDrillLevel.isMeasure && (newColumnMetadata.isMeasure = columnSourceForCurrentDrillLevel.isMeasure), 
                    newColumnMetadata.queryName = columnSourceForCurrentDrillLevel.queryName, newColumnMetadata;
                }
                function addToMetadata(transformedDataView, newColumn) {
                    var transformedColumns = inheritSingle(transformedDataView.metadata.columns);
                    transformedColumns.push(newColumn);
                    var transformedMetadata = inheritSingle(transformedDataView.metadata);
                    transformedMetadata.columns = transformedColumns, transformedDataView.metadata = transformedMetadata;
                }
                function createConcatenatedCategoryColumn(sourceColumnsSortedByProjectionOrdering, columnMetadata, concatenatedValues, dataViewObjects) {
                    var newCategoryColumn = {
                        source: columnMetadata,
                        values: concatenatedValues
                    }, firstColumn = sourceColumnsSortedByProjectionOrdering[0];
                    return firstColumn.identity && (newCategoryColumn.identity = firstColumn.identity), 
                    firstColumn.identityFields && (newCategoryColumn.identityFields = firstColumn.identityFields), 
                    dataViewObjects && (newCategoryColumn.objects = dataViewObjects), newCategoryColumn;
                }
                DataViewConcatenateCategoricalColumns.detectAndApply = detectAndApply, DataViewConcatenateCategoricalColumns.applyToPlayChartCategorical = applyToPlayChartCategorical;
            }(DataViewConcatenateCategoricalColumns = data.DataViewConcatenateCategoricalColumns || (data.DataViewConcatenateCategoricalColumns = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var DataViewMapping;
        !function(DataViewMapping) {
            function getRegressionUsage(dataViewMapping) {
                var regressionUsage = dataViewMapping && dataViewMapping.usage && dataViewMapping.usage.regression;
                return regressionUsage || void 0;
            }
            DataViewMapping.getRegressionUsage = getRegressionUsage;
        }(DataViewMapping = powerbi.DataViewMapping || (powerbi.DataViewMapping = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var DataViewMapping;
        !function(DataViewMapping) {
            function visitMapping(mapping, visitor) {
                var categorical = mapping.categorical;
                categorical && visitCategorical(categorical, visitor);
                var table = mapping.table;
                table && visitTable(table, visitor);
                var matrix = mapping.matrix;
                matrix && visitMatrix(matrix, visitor);
                var tree = mapping.tree;
                tree && visitTree(tree, visitor);
                var single = mapping.single;
                single && visitSingle(single, visitor);
            }
            function visitCategorical(mapping, visitor) {
                visitCategoricalCategories(mapping.categories, visitor);
                var values = mapping.values;
                visitCategoricalValues(values, visitor), visitGrouped(values, visitor);
            }
            function visitCategoricalCategories(mapping, visitor) {
                mapping && (visitBind(mapping, visitor), visitFor(mapping, visitor), visitList(mapping, visitor), 
                visitReduction(mapping, visitor));
            }
            function visitCategoricalValues(mapping, visitor) {
                if (mapping) {
                    visitBind(mapping, visitor, 0), visitFor(mapping, visitor, 0), visitList(mapping, visitor, 0);
                    var group = mapping.group;
                    if (group) for (var _i = 0, _a = group.select; _i < _a.length; _i++) {
                        var item = _a[_i];
                        visitBind(item, visitor, 1), visitFor(item, visitor, 1);
                    }
                }
            }
            function visitTable(mapping, visitor) {
                var rows = mapping.rows;
                visitBind(rows, visitor), visitFor(rows, visitor), visitList(rows, visitor), visitReduction(rows, visitor);
            }
            function visitMatrix(mapping, visitor) {
                visitMatrixItems(mapping.rows, visitor), visitMatrixItems(mapping.columns, visitor), 
                visitMatrixItems(mapping.values, visitor);
            }
            function visitMatrixItems(mapping, visitor) {
                mapping && (visitFor(mapping, visitor), visitList(mapping, visitor), visitReduction(mapping, visitor));
            }
            function visitTree(mapping, visitor) {
                visitTreeNodes(mapping.nodes, visitor), visitTreeValues(mapping.values, visitor);
            }
            function visitTreeNodes(mapping, visitor) {
                mapping && (visitFor(mapping, visitor), visitReduction(mapping, visitor));
            }
            function visitTreeValues(mapping, visitor) {
                mapping && visitFor(mapping, visitor);
            }
            function visitBind(mapping, visitor, context) {
                var bind = mapping.bind;
                bind && (null != context ? visitor.visitRole(bind.to, context) : visitor.visitRole(bind.to));
            }
            function visitFor(mapping, visitor, context) {
                var forValue = mapping["for"];
                forValue && (null != context ? visitor.visitRole(forValue["in"], context) : visitor.visitRole(forValue["in"]));
            }
            function visitList(mapping, visitor, context) {
                var select = mapping.select;
                if (select) for (var _i = 0, select_1 = select; _i < select_1.length; _i++) {
                    var item = select_1[_i];
                    visitBind(item, visitor, context), visitFor(item, visitor, context);
                }
            }
            function visitGrouped(mapping, visitor) {
                if (mapping) {
                    var group = mapping.group;
                    group && (visitor.visitRole(group.by), visitReduction(group, visitor));
                }
            }
            function visitReduction(mapping, visitor) {
                if (visitor.visitReduction) {
                    var reductionAlgorithm = mapping.dataReductionAlgorithm;
                    reductionAlgorithm && visitor.visitReduction(reductionAlgorithm);
                }
            }
            function visitSingle(mapping, visitor) {
                visitor.visitRole(mapping.role);
            }
            DataViewMapping.visitMapping = visitMapping, DataViewMapping.visitCategorical = visitCategorical, 
            DataViewMapping.visitCategoricalCategories = visitCategoricalCategories, DataViewMapping.visitCategoricalValues = visitCategoricalValues, 
            DataViewMapping.visitTable = visitTable, DataViewMapping.visitMatrixItems = visitMatrixItems, 
            DataViewMapping.visitTreeNodes = visitTreeNodes, DataViewMapping.visitTreeValues = visitTreeValues, 
            DataViewMapping.visitGrouped = visitGrouped;
        }(DataViewMapping = powerbi.DataViewMapping || (powerbi.DataViewMapping = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewNormalizeValues, inheritSingle = powerbi.Prototype.inheritSingle;
            !function(DataViewNormalizeValues) {
                function apply(options) {
                    var rolesToNormalize = _.filter(options.dataRoles, function(role) {
                        return !_.isEmpty(role.requiredTypes);
                    });
                    filterVariantMeasures(options.dataview, options.dataViewMappings, rolesToNormalize);
                }
                function filterVariantMeasures(dataview, dataViewMappings, rolesToNormalize) {
                    if (!_.isEmpty(dataViewMappings) && !_.isEmpty(rolesToNormalize)) {
                        for (var columnFilter = generateMetadataColumnFilter(dataview.metadata.columns, rolesToNormalize), valueFilter = generateValueFilter(dataview.metadata.columns, rolesToNormalize), usedMappings = {}, _i = 0, dataViewMappings_1 = dataViewMappings; _i < dataViewMappings_1.length; _i++) {
                            var dataViewMapping = dataViewMappings_1[_i];
                            for (var dataViewMappingProp in dataViewMapping) null != dataview[dataViewMappingProp] && (usedMappings[dataViewMappingProp] = !0);
                        }
                        usedMappings.categorical && filterVariantMeasuresCategorical(dataview.categorical, columnFilter, valueFilter), 
                        usedMappings.table && filterVariantMeasuresTable(dataview.table, columnFilter, valueFilter), 
                        usedMappings.tree && filterVariantMeasuresTreeNode(dataview.tree.root, columnFilter, valueFilter), 
                        usedMappings.matrix && filterVariantMeasuresMatrix(dataview.matrix, columnFilter, valueFilter), 
                        usedMappings.single && filterVariantMeasuresSingle(dataview, dataViewMappings, rolesToNormalize, valueFilter);
                    }
                }
                function generateMetadataColumnFilter(columns, rolesToNormalize) {
                    if (!columns || !rolesToNormalize) return function() {
                        return !1;
                    };
                    for (var columnsToNormalize = {}, _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                        var column = columns_1[_i], roles = column.roles;
                        if (roles) for (var _a = 0, rolesToNormalize_1 = rolesToNormalize; _a < rolesToNormalize_1.length; _a++) {
                            var role = rolesToNormalize_1[_a];
                            if (roles[role.name]) {
                                columnsToNormalize[column.index] = !0;
                                break;
                            }
                        }
                    }
                    return function(columnIndex) {
                        return isNaN(columnIndex) ? !1 : !!columnsToNormalize[columnIndex];
                    };
                }
                function generateValueFilter(columns, rolesToNormalize) {
                    if (!columns || !rolesToNormalize) return function() {
                        return !0;
                    };
                    for (var columnValueFilters = [], _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
                        var column = columns_2[_i], columnValueFilter = generateColumnValueFilter(column, rolesToNormalize);
                        columnValueFilter && (columnValueFilters[column.index] = columnValueFilter);
                    }
                    return function(columnIndex, value) {
                        return columnValueFilters[columnIndex] ? columnValueFilters[columnIndex](value) : !0;
                    };
                }
                function generateColumnValueFilter(column, rolesToNormalize) {
                    var requiredTypes = getColumnRequiredTypes(column, rolesToNormalize);
                    if (!_.isEmpty(requiredTypes)) return function(value) {
                        return doesValueMatchTypes(value, requiredTypes);
                    };
                }
                function getColumnRequiredTypes(column, rolesToNormalize) {
                    var requiredTypes = [], columnRoles = column && column.roles;
                    if (!columnRoles) return requiredTypes;
                    for (var _i = 0, rolesToNormalize_2 = rolesToNormalize; _i < rolesToNormalize_2.length; _i++) {
                        var role = rolesToNormalize_2[_i];
                        if (columnRoles[role.name]) for (var _a = 0, _b = role.requiredTypes; _a < _b.length; _a++) {
                            var typeDescriptor = _b[_a], type = powerbi.ValueType.fromDescriptor(typeDescriptor);
                            requiredTypes.push(type);
                        }
                    }
                    return requiredTypes;
                }
                function filterVariantMeasuresCategorical(dataview, columnFilter, valueFilter) {
                    var values = dataview && dataview.values;
                    if (values) {
                        var valuesGrouped = values.grouped();
                        if (valuesGrouped) for (var _i = 0, valuesGrouped_1 = valuesGrouped; _i < valuesGrouped_1.length; _i++) for (var valueGroup = valuesGrouped_1[_i], valuesInGroup = valueGroup.values, _a = 0, valuesInGroup_1 = valuesInGroup; _a < valuesInGroup_1.length; _a++) {
                            var valueColumn = valuesInGroup_1[_a], columnIndex = valueColumn.source.index;
                            if (columnFilter(columnIndex)) for (var i = 0, ilen = valueColumn.values.length; ilen > i; i++) valueColumn.values = normalizeVariant(valueColumn.values, i, columnIndex, valueFilter);
                        }
                    }
                }
                function filterVariantMeasuresTable(dataview, columnFilter, valueFilter) {
                    var columns = dataview && dataview.columns;
                    if (columns) {
                        for (var filteredColumns = [], _i = 0, columns_3 = columns; _i < columns_3.length; _i++) {
                            var column = columns_3[_i];
                            columnFilter(column.index) && filteredColumns.push(column.index);
                        }
                        for (var rows = dataview.rows, i = 0, ilen = rows.length; ilen > i; i++) for (var _a = 0, filteredColumns_1 = filteredColumns; _a < filteredColumns_1.length; _a++) {
                            var index = filteredColumns_1[_a];
                            rows[i] = normalizeVariant(rows[i], index, index, valueFilter);
                        }
                    }
                }
                function filterVariantMeasuresTreeNode(node, columnFilter, valueFilter) {
                    if (node.values) for (var columnIndex in node.values) columnFilter(columnIndex) && ("object" == typeof node.values[columnIndex] && "value" in node.values[columnIndex] ? node.values[columnIndex] = normalizeVariant(node.values[columnIndex], "value", columnIndex, valueFilter) : node.values = normalizeVariant(node.values, columnIndex, columnIndex, valueFilter)); else if (node.children) for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        filterVariantMeasuresTreeNode(child, columnFilter, valueFilter);
                    }
                }
                function filterVariantMeasuresMatrix(dataview, columnFilter, valueFilter) {
                    var root = dataview && dataview.rows && dataview.rows.root;
                    root && filterVariantMeasuresMatrixRecursive(dataview, root, columnFilter, valueFilter);
                }
                function filterVariantMeasuresMatrixRecursive(dataviewMatrix, node, columnFilter, valueFilter) {
                    if (node.values) for (var id in node.values) {
                        var nodeValue = node.values[id], valueSourceIndex = nodeValue.valueSourceIndex || 0, columnIndex = dataviewMatrix.valueSources[valueSourceIndex].index;
                        _.isNumber(columnIndex) && columnFilter(columnIndex) && (node.values[id] = normalizeVariant(nodeValue, "value", columnIndex, valueFilter));
                    } else if (node.children) for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        filterVariantMeasuresMatrixRecursive(dataviewMatrix, child, columnFilter, valueFilter);
                    }
                }
                function filterVariantMeasuresSingle(dataview, dataViewMappings, rolesToNormalize, valueFilter) {
                    if (dataview.single) {
                        for (var roleNames = [], _i = 0, rolesToNormalize_3 = rolesToNormalize; _i < rolesToNormalize_3.length; _i++) {
                            var role = rolesToNormalize_3[_i];
                            role.name && roleNames.push(role.name);
                        }
                        for (var columns = dataview.metadata.columns, _a = 0, dataViewMappings_2 = dataViewMappings; _a < dataViewMappings_2.length; _a++) {
                            var dataViewMapping = dataViewMappings_2[_a], roleName = dataViewMapping.single.role;
                            if (-1 !== roleNames.indexOf(roleName)) {
                                var column = firstColumnByRoleName(columns, roleName);
                                return void (column && (dataview.single = normalizeVariant(dataview.single, "value", column.index, valueFilter)));
                            }
                        }
                    }
                }
                function normalizeVariant(object, key, columnIndex, valueFilter) {
                    if (object) {
                        var value = object[key];
                        return null === value || valueFilter(columnIndex, value) || (object = inheritSingle(object), 
                        object[key] = null), object;
                    }
                }
                function doesValueMatchTypes(value, types) {
                    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                        var type = types_1[_i];
                        if (type.numeric || type.integer) return "number" == typeof value;
                    }
                    return !1;
                }
                function firstColumnByRoleName(columns, roleName) {
                    for (var _i = 0, columns_4 = columns; _i < columns_4.length; _i++) {
                        var column = columns_4[_i], columnRoles = column && column.roles;
                        if (columnRoles && columnRoles[roleName]) return column;
                    }
                }
                DataViewNormalizeValues.apply = apply, DataViewNormalizeValues.filterVariantMeasures = filterVariantMeasures, 
                DataViewNormalizeValues.generateMetadataColumnFilter = generateMetadataColumnFilter, 
                DataViewNormalizeValues.generateValueFilter = generateValueFilter, DataViewNormalizeValues.getColumnRequiredTypes = getColumnRequiredTypes, 
                DataViewNormalizeValues.normalizeVariant = normalizeVariant;
            }(DataViewNormalizeValues = data.DataViewNormalizeValues || (data.DataViewNormalizeValues = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var DataViewObjects;
        !function(DataViewObjects) {
            function getValue(objects, propertyId, defaultValue) {
                if (!objects) return defaultValue;
                var objectOrMap = objects[propertyId.objectName], object = objectOrMap;
                return DataViewObject.getValue(object, propertyId.propertyName, defaultValue);
            }
            function getObject(objects, objectName, defaultValue) {
                if (objects && objects[objectName]) {
                    var object = objects[objectName];
                    return object;
                }
                return defaultValue;
            }
            function getUserDefinedObjects(objects, objectName) {
                if (objects && objects[objectName]) {
                    var map = objects[objectName];
                    return map;
                }
            }
            function getFillColor(objects, propertyId, defaultColor) {
                var value = getValue(objects, propertyId);
                return value && value.solid ? value.solid.color : defaultColor;
            }
            function isUserDefined(objectOrMap) {
                return _.isArray(objectOrMap);
            }
            DataViewObjects.getValue = getValue, DataViewObjects.getObject = getObject, DataViewObjects.getUserDefinedObjects = getUserDefinedObjects, 
            DataViewObjects.getFillColor = getFillColor, DataViewObjects.isUserDefined = isUserDefined;
        }(DataViewObjects = powerbi.DataViewObjects || (powerbi.DataViewObjects = {}));
        var DataViewObject;
        !function(DataViewObject) {
            function getValue(object, propertyName, defaultValue) {
                if (!object) return defaultValue;
                var propertyValue = object[propertyName];
                return void 0 === propertyValue ? defaultValue : propertyValue;
            }
            function getFillColorByPropertyName(objects, propertyName, defaultColor) {
                var value = DataViewObject.getValue(objects, propertyName);
                return value && value.solid ? value.solid.color : defaultColor;
            }
            DataViewObject.getValue = getValue, DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
        }(DataViewObject = powerbi.DataViewObject || (powerbi.DataViewObject = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewObjectDefinitions, JsonComparer = jsCommon.JsonComparer;
            !function(DataViewObjectDefinitions) {
                function ensure(defns, objectName, selector) {
                    var defnsForObject = defns[objectName];
                    defnsForObject || (defns[objectName] = defnsForObject = []);
                    for (var i = 0, len = defnsForObject.length; len > i; i++) {
                        var defn = defnsForObject[i];
                        if (data.Selector.equals(defn.selector, selector)) return defn;
                    }
                    var newDefn = {
                        selector: selector,
                        properties: {}
                    };
                    return defnsForObject.push(newDefn), newDefn;
                }
                function deleteProperties(targetDefns, sourceDefns) {
                    if (targetDefns && sourceDefns) for (var objName in sourceDefns) for (var objDefns = sourceDefns[objName], _i = 0, objDefns_1 = objDefns; _i < objDefns_1.length; _i++) {
                        var defn = objDefns_1[_i];
                        for (var propName in defn.properties) deleteProperty(targetDefns, objName, defn.selector, propName);
                    }
                }
                function extend(targetDefns, defaultDefns) {
                    if (targetDefns && defaultDefns) for (var objName in defaultDefns) {
                        var defaultObjDefns = defaultDefns[objName];
                        if (defaultObjDefns) {
                            var targetObjDefns = targetDefns[objName];
                            targetObjDefns || (targetObjDefns = targetDefns[objName] = []), extendObjectDefinitions(targetObjDefns, defaultObjDefns);
                        }
                    }
                }
                function extendObjectDefinitions(targetObjDefns, defaultObjDefns) {
                    for (var found, _i = 0, defaultObjDefns_1 = defaultObjDefns; _i < defaultObjDefns_1.length; _i++) {
                        var defaultObjDefn = defaultObjDefns_1[_i];
                        found = !1;
                        for (var _a = 0, targetObjDefns_1 = targetObjDefns; _a < targetObjDefns_1.length; _a++) {
                            var targetObjDefn = targetObjDefns_1[_a];
                            if (data.Selector.equals(targetObjDefn.selector, defaultObjDefn.selector)) {
                                extendPropDefns(targetObjDefn.properties, defaultObjDefn.properties), found = !0;
                                break;
                            }
                        }
                        if (!found) {
                            var newObjDefn = {
                                selector: defaultObjDefn.selector,
                                properties: {}
                            };
                            extendPropDefns(newObjDefn.properties, defaultObjDefn.properties), targetObjDefns.push(newObjDefn);
                        }
                    }
                }
                function extendPropDefns(targetPropDefns, defaultPropDefns) {
                    for (var propName in defaultPropDefns) {
                        var defaultPropDefn = defaultPropDefns[propName];
                        if (defaultPropDefn) {
                            var targetPropDefn = targetPropDefns[propName];
                            targetPropDefn || (targetPropDefns[propName] = defaultPropDefn);
                        }
                    }
                }
                function deleteProperty(defns, objectName, selector, propertyName) {
                    var match = getObjectDefinition(defns, objectName, selector);
                    match && DataViewObjectDefinition.deleteSingleProperty(match, propertyName);
                }
                function setValue(defns, propertyId, selector, value) {
                    ensure(defns, propertyId.objectName, selector).properties[propertyId.propertyName] = value;
                }
                function getValue(defns, propertyId, selector) {
                    var properties = getPropertyContainer(defns, propertyId, selector);
                    if (properties) return properties[propertyId.propertyName];
                }
                function getPropertyContainer(defns, propertyId, selector) {
                    var defn = getObjectDefinition(defns, propertyId.objectName, selector);
                    if (defn) return defn.properties;
                }
                function getObjectDefinition(defns, objectName, selector) {
                    if (defns) {
                        var defnsForObject = defns[objectName];
                        if (defnsForObject) for (var i = 0, len = defnsForObject.length; len > i; i++) {
                            var defn = defnsForObject[i];
                            if (data.Selector.equals(defn.selector, selector)) return defn;
                        }
                    }
                }
                function propertiesAreEqual(a, b) {
                    return a instanceof data.SemanticFilter && b instanceof data.SemanticFilter ? data.SemanticFilter.isSameFilter(a, b) : JsonComparer.equals(a, b);
                }
                function allPropertiesAreEqual(a, b) {
                    if (Object.keys(a).length !== Object.keys(b).length) return !1;
                    for (var property in a) if (!propertiesAreEqual(a[property], b[property])) return !1;
                    return !0;
                }
                function encodePropertyValue(value, valueTypeDescriptor) {
                    if (valueTypeDescriptor.bool) return "boolean" != typeof value && (value = !1), 
                    data.SQExprBuilder["boolean"](value);
                    if (valueTypeDescriptor.text || valueTypeDescriptor.scripting && valueTypeDescriptor.scripting.source) return data.SQExprBuilder.text(value);
                    if (valueTypeDescriptor.numeric) {
                        if ($.isNumeric(value)) return data.SQExprBuilder["double"](+value);
                    } else if (valueTypeDescriptor.fill) {
                        if (value) return {
                            solid: {
                                color: data.SQExprBuilder.text(value)
                            }
                        };
                    } else {
                        if (valueTypeDescriptor.formatting) return valueTypeDescriptor.formatting.labelDisplayUnits ? data.SQExprBuilder["double"](+value) : data.SQExprBuilder.text(value);
                        if (valueTypeDescriptor.enumeration) return $.isNumeric(value) ? data.SQExprBuilder["double"](+value) : data.SQExprBuilder.text(value);
                        if (valueTypeDescriptor.misc) value = value ? data.SQExprBuilder.text(value) : null; else if (valueTypeDescriptor.dateTime) value = value ? data.SQExprBuilder.dateTime(value) : null; else if (valueTypeDescriptor.image && value) {
                            var imageValue = value, imageDefinition = {
                                name: data.SQExprBuilder.text(imageValue.name),
                                url: data.SQExprBuilder.text(imageValue.url)
                            };
                            return imageValue.scaling && (imageDefinition.scaling = data.SQExprBuilder.text(imageValue.scaling)), 
                            imageDefinition;
                        }
                    }
                    return value;
                }
                function clone(original) {
                    var cloned = {};
                    for (var objectName in original) {
                        var originalDefns = original[objectName];
                        if (!_.isEmpty(originalDefns)) {
                            for (var clonedDefns = [], _i = 0, originalDefns_1 = originalDefns; _i < originalDefns_1.length; _i++) {
                                var originalDefn = originalDefns_1[_i];
                                clonedDefns.push({
                                    properties: cloneProperties(originalDefn.properties),
                                    selector: originalDefn.selector
                                });
                            }
                            cloned[objectName] = clonedDefns;
                        }
                    }
                    return cloned;
                }
                function cloneProperties(original) {
                    return _.clone(original);
                }
                DataViewObjectDefinitions.ensure = ensure, DataViewObjectDefinitions.deleteProperties = deleteProperties, 
                DataViewObjectDefinitions.extend = extend, DataViewObjectDefinitions.deleteProperty = deleteProperty, 
                DataViewObjectDefinitions.setValue = setValue, DataViewObjectDefinitions.getValue = getValue, 
                DataViewObjectDefinitions.getPropertyContainer = getPropertyContainer, DataViewObjectDefinitions.getObjectDefinition = getObjectDefinition, 
                DataViewObjectDefinitions.propertiesAreEqual = propertiesAreEqual, DataViewObjectDefinitions.allPropertiesAreEqual = allPropertiesAreEqual, 
                DataViewObjectDefinitions.encodePropertyValue = encodePropertyValue, DataViewObjectDefinitions.clone = clone;
            }(DataViewObjectDefinitions = data.DataViewObjectDefinitions || (data.DataViewObjectDefinitions = {}));
            var DataViewObjectDefinition;
            !function(DataViewObjectDefinition) {
                function deleteSingleProperty(defn, propertyName) {
                    delete defn.properties[propertyName];
                }
                DataViewObjectDefinition.deleteSingleProperty = deleteSingleProperty;
            }(DataViewObjectDefinition = data.DataViewObjectDefinition || (data.DataViewObjectDefinition = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewObjectDescriptors;
            !function(DataViewObjectDescriptors) {
                function findFormatString(descriptors) {
                    return findProperty(descriptors, function(propDesc) {
                        var formattingTypeDesc = powerbi.ValueType.fromDescriptor(propDesc.type).formatting;
                        return formattingTypeDesc && formattingTypeDesc.formatString;
                    });
                }
                function findFilterOutput(descriptors) {
                    return findProperty(descriptors, function(propDesc) {
                        var propType = propDesc.type;
                        return propType && propType.filter && !propType.filter.selfFilter;
                    });
                }
                function findSelfFilter(descriptors) {
                    return findProperty(descriptors, isSelfFilter);
                }
                function isSelfFilter(descriptor) {
                    var propType = descriptor && descriptor.type;
                    return propType && propType.filter && propType.filter.selfFilter;
                }
                function findSelfFilterEnabled(descriptors) {
                    return findProperty(descriptors, function(propDesc) {
                        var propType = propDesc.type;
                        return propType && propType.operations && propType.operations.searchEnabled;
                    });
                }
                function findDefaultValue(descriptors) {
                    return findProperty(descriptors, function(propDesc) {
                        var propType = propDesc.type;
                        return propType && !!propType.expression && propType.expression.defaultValue;
                    });
                }
                function findProperty(descriptors, propPredicate) {
                    if (descriptors) for (var objectName in descriptors) {
                        var objPropDescs = descriptors[objectName].properties;
                        for (var propertyName in objPropDescs) if (propPredicate(objPropDescs[propertyName])) return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    }
                }
                DataViewObjectDescriptors.findFormatString = findFormatString, DataViewObjectDescriptors.findFilterOutput = findFilterOutput, 
                DataViewObjectDescriptors.findSelfFilter = findSelfFilter, DataViewObjectDescriptors.isSelfFilter = isSelfFilter, 
                DataViewObjectDescriptors.findSelfFilterEnabled = findSelfFilterEnabled, DataViewObjectDescriptors.findDefaultValue = findDefaultValue;
            }(DataViewObjectDescriptors = data.DataViewObjectDescriptors || (data.DataViewObjectDescriptors = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewObjectEvaluationUtils;
            !function(DataViewObjectEvaluationUtils) {
                function evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns) {
                    for (var objects, j = 0, jlen = objectDefns.length; jlen > j; j++) {
                        var objectDefinition = objectDefns[j], objectName = objectDefinition.name, evaluatedObject = data.DataViewObjectEvaluator.run(evalContext, objectDescriptors[objectName], objectDefinition.properties);
                        evaluatedObject && (objects || (objects = {}), objects[objectName] = evaluatedObject);
                    }
                    return objects;
                }
                function groupObjectsBySelector(objectDefinitions) {
                    var grouped = {
                        data: []
                    };
                    if (objectDefinitions) for (var objectName in objectDefinitions) for (var objectDefnList = objectDefinitions[objectName], i = 0, len = objectDefnList.length; len > i; i++) {
                        var objectDefn = objectDefnList[i];
                        ensureDefinitionListForSelector(grouped, objectDefn.selector).objects.push({
                            name: objectName,
                            properties: objectDefn.properties
                        });
                    }
                    return grouped;
                }
                function ensureDefinitionListForSelector(grouped, selector) {
                    if (!selector) return grouped.metadataOnce || (grouped.metadataOnce = {
                        objects: []
                    }), grouped.metadataOnce;
                    var groupedObjects;
                    selector.data ? groupedObjects = grouped.data : selector.metadata ? (grouped.metadata || (grouped.metadata = []), 
                    groupedObjects = grouped.metadata) : selector.id && (grouped.userDefined || (grouped.userDefined = []), 
                    groupedObjects = grouped.userDefined);
                    for (var _i = 0, groupedObjects_1 = groupedObjects; _i < groupedObjects_1.length; _i++) {
                        var item_1 = groupedObjects_1[_i];
                        if (data.Selector.equals(selector, item_1.selector)) return item_1;
                    }
                    var item = {
                        selector: selector,
                        objects: []
                    };
                    return groupedObjects.push(item), item;
                }
                function addImplicitObjects(objectsForAllSelectors, objectDescriptors, columns, selectTransforms) {
                    selectTransforms && (addDefaultFormatString(objectsForAllSelectors, objectDescriptors, columns, selectTransforms), 
                    addDefaultValue(objectsForAllSelectors, objectDescriptors, columns, selectTransforms));
                }
                function addDefaultFormatString(objectsForAllSelectors, objectDescriptors, columns, selectTransforms) {
                    var formatStringProp = data.DataViewObjectDescriptors.findFormatString(objectDescriptors);
                    if (formatStringProp) for (var selectIdx = 0, selectLen = selectTransforms.length; selectLen > selectIdx; selectIdx++) {
                        var selectTransform = selectTransforms[selectIdx];
                        selectTransform && applyFormatString(objectsForAllSelectors, formatStringProp, selectTransform.queryName, selectTransform.format || getColumnFormatForIndex(columns, selectIdx));
                    }
                }
                function addDefaultValue(objectsForAllSelectors, objectDescriptors, columns, selectTransforms) {
                    var defaultValueProp = data.DataViewObjectDescriptors.findDefaultValue(objectDescriptors);
                    if (defaultValueProp) for (var _i = 0, selectTransforms_1 = selectTransforms; _i < selectTransforms_1.length; _i++) {
                        var selectTransform = selectTransforms_1[_i];
                        selectTransform && applyDefaultValue(objectsForAllSelectors, defaultValueProp, selectTransform.queryName, selectTransform.defaultValue);
                    }
                }
                function getColumnFormatForIndex(columns, selectIdx) {
                    for (var columnIdx = 0, columnLen = columns.length; columnLen > columnIdx; columnIdx++) {
                        var column = columns[columnIdx];
                        if (column && column.index === selectIdx) return column.format;
                    }
                }
                function applyFormatString(objectsForAllSelectors, formatStringProp, queryName, formatStringValue) {
                    formatStringValue && applyMetadataProperty(objectsForAllSelectors, formatStringProp, {
                        metadata: queryName
                    }, data.SQExprBuilder.text(formatStringValue));
                }
                function applyDefaultValue(objectsForAllSelectors, defaultValueProp, queryName, defaultValue) {
                    defaultValue && applyMetadataProperty(objectsForAllSelectors, defaultValueProp, {
                        metadata: queryName
                    }, defaultValue);
                }
                function applyMetadataProperty(objectsForAllSelectors, propertyId, selector, value) {
                    var objectDefns;
                    if (selector) {
                        var metadataObjects = objectsForAllSelectors.metadata;
                        metadataObjects || (metadataObjects = objectsForAllSelectors.metadata = []), objectDefns = metadataObjects;
                    } else {
                        var metadataOnce = objectsForAllSelectors.metadataOnce;
                        metadataOnce || (metadataOnce = objectsForAllSelectors.metadataOnce = {
                            selector: selector,
                            objects: []
                        }), objectDefns = [ metadataOnce ];
                    }
                    var targetObjectDefn, targetMetadataObject = findWithMatchingSelector(objectDefns, selector);
                    if (targetMetadataObject) {
                        var targetObjectDefns = targetMetadataObject.objects;
                        if (targetObjectDefn = findExistingObject(targetObjectDefns, propertyId.objectName)) {
                            if (targetObjectDefn.properties[propertyId.propertyName]) return;
                        } else targetObjectDefn = {
                            name: propertyId.objectName,
                            properties: {}
                        }, targetObjectDefns.push(targetObjectDefn);
                    } else targetObjectDefn = {
                        name: propertyId.objectName,
                        properties: {}
                    }, objectDefns.push({
                        selector: selector,
                        objects: [ targetObjectDefn ]
                    });
                    targetObjectDefn.properties[propertyId.propertyName] = value;
                }
                function findWithMatchingSelector(objects, selector) {
                    for (var i = 0, len = objects.length; len > i; i++) {
                        var object = objects[i];
                        if (data.Selector.equals(object.selector, selector)) return object;
                    }
                }
                function findExistingObject(objectDefns, objectName) {
                    for (var i = 0, len = objectDefns.length; len > i; i++) {
                        var objectDefn = objectDefns[i];
                        if (objectDefn.name === objectName) return objectDefn;
                    }
                }
                DataViewObjectEvaluationUtils.evaluateDataViewObjects = evaluateDataViewObjects, 
                DataViewObjectEvaluationUtils.groupObjectsBySelector = groupObjectsBySelector, DataViewObjectEvaluationUtils.addImplicitObjects = addImplicitObjects;
            }(DataViewObjectEvaluationUtils = data.DataViewObjectEvaluationUtils || (data.DataViewObjectEvaluationUtils = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi), __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewObjectEvaluator;
            !function(DataViewObjectEvaluator) {
                function run(evalContext, objectDescriptor, propertyDefinitions) {
                    if (objectDescriptor) {
                        var object, propertyDescriptors = objectDescriptor.properties;
                        for (var propertyName in propertyDefinitions) {
                            var propertyDefinition = propertyDefinitions[propertyName], propertyDescriptor = propertyDescriptors[propertyName];
                            if (propertyDescriptor) {
                                var propertyValue = evaluateProperty(evalContext, propertyDescriptor, propertyDefinition);
                                void 0 !== propertyValue && (object || (object = {}), object[propertyName] = propertyValue);
                            }
                        }
                        return object;
                    }
                }
                function evaluateProperty(evalContext, propertyDescriptor, propertyDefinition) {
                    var structuralType = propertyDescriptor.type;
                    if (structuralType && structuralType.expression) return propertyDefinition;
                    var value = evaluateValue(evalContext, propertyDefinition, powerbi.ValueType.fromDescriptor(propertyDescriptor.type));
                    return void 0 !== value || propertyDefinition instanceof data.RuleEvaluation ? value : evaluateFill(evalContext, propertyDefinition, structuralType) || evaluateFillRule(evalContext, propertyDefinition, structuralType) || evaluateImage(evalContext, propertyDefinition, structuralType) || evaluateParagraphs(evalContext, propertyDefinition, structuralType) || propertyDefinition;
                }
                function evaluateFill(evalContext, fillDefn, type) {
                    var fillType = type.fill;
                    if (fillType) return fillType && fillType.solid && fillType.solid.color && fillDefn.solid ? {
                        solid: {
                            color: evaluateValue(evalContext, fillDefn.solid.color, powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Color))
                        }
                    } : void 0;
                }
                function evaluateFillRule(evalContext, fillRuleDefn, type) {
                    if (type.fillRule) {
                        if (fillRuleDefn.linearGradient2) {
                            var linearGradient2 = fillRuleDefn.linearGradient2;
                            return {
                                linearGradient2: {
                                    min: evaluateColorStop(evalContext, linearGradient2.min),
                                    max: evaluateColorStop(evalContext, linearGradient2.max)
                                }
                            };
                        }
                        if (fillRuleDefn.linearGradient3) {
                            var linearGradient3 = fillRuleDefn.linearGradient3;
                            return {
                                linearGradient3: {
                                    min: evaluateColorStop(evalContext, linearGradient3.min),
                                    mid: evaluateColorStop(evalContext, linearGradient3.mid),
                                    max: evaluateColorStop(evalContext, linearGradient3.max)
                                }
                            };
                        }
                    }
                }
                function evaluateColorStop(evalContext, colorStop) {
                    var step = {
                        color: evaluateValue(evalContext, colorStop.color, colorValueType)
                    }, value = evaluateValue(evalContext, colorStop.value, numericType);
                    return null != value && (step.value = value), step;
                }
                function evaluateImage(evalContext, definition, type) {
                    if (type.image && definition) {
                        var value = {
                            name: evaluateValue(evalContext, definition.name, textType),
                            url: evaluateValue(evalContext, definition.url, powerbi.ValueType.fromDescriptor(powerbi.ImageDefinition.urlType))
                        };
                        return definition.scaling && (value.scaling = evaluateValue(evalContext, definition.scaling, textType)), 
                        value;
                    }
                }
                function evaluateParagraphs(evalContext, definition, type) {
                    return type.paragraphs && definition ? evaluateArrayCopyOnChange(evalContext, definition, evaluateParagraph) : void 0;
                }
                function evaluateParagraph(evalContext, definition) {
                    var evaluated, definitionTextRuns = definition.textRuns, evaluatedTextRuns = evaluateArrayCopyOnChange(evalContext, definitionTextRuns, evaluateTextRun);
                    return definitionTextRuns !== evaluatedTextRuns && (evaluated = _.clone(definition), 
                    evaluated.textRuns = evaluatedTextRuns), evaluated || definition;
                }
                function evaluateTextRun(evalContext, definition) {
                    var evaluated, definitionValue = definition.value, evaluatedValue = evaluateValue(evalContext, definitionValue, textType);
                    return void 0 !== evaluatedValue && (evaluated = _.clone(definition), evaluated.value = evaluatedValue), 
                    evaluated || definition;
                }
                function evaluateArrayCopyOnChange(evalContext, definitions, evaluator) {
                    for (var evaluatedValues, i = 0, len = definitions.length; len > i; i++) {
                        var definition = definitions[i], evaluated = evaluator(evalContext, definition);
                        evaluatedValues || definition === evaluated || (evaluatedValues = _.take(definitions, i)), 
                        evaluatedValues && evaluatedValues.push(evaluated);
                    }
                    return evaluatedValues || definitions;
                }
                function evaluateValue(evalContext, definition, valueType) {
                    return definition instanceof data.SQExpr ? ExpressionEvaluator.evaluate(definition, evalContext) : definition instanceof data.RuleEvaluation ? definition.evaluate(evalContext) : void 0;
                }
                var colorValueType = powerbi.ValueType.fromDescriptor({
                    formatting: {
                        color: !0
                    }
                }), numericType = powerbi.ValueType.fromDescriptor({
                    numeric: !0
                }), textType = powerbi.ValueType.fromDescriptor({
                    text: !0
                });
                DataViewObjectEvaluator.run = run, DataViewObjectEvaluator.evaluateProperty = evaluateProperty, 
                DataViewObjectEvaluator.evaluateValue = evaluateValue;
                var ExpressionEvaluator = function(_super) {
                    function ExpressionEvaluator() {
                        _super.apply(this, arguments);
                    }
                    return __extends(ExpressionEvaluator, _super), ExpressionEvaluator.evaluate = function(expr, evalContext) {
                        return null != expr ? expr.accept(ExpressionEvaluator.instance, evalContext) : void 0;
                    }, ExpressionEvaluator.prototype.visitColumnRef = function(expr, evalContext) {
                        return evalContext.getExprValue(expr);
                    }, ExpressionEvaluator.prototype.visitConstant = function(expr, evalContext) {
                        return expr.value;
                    }, ExpressionEvaluator.prototype.visitMeasureRef = function(expr, evalContext) {
                        return evalContext.getExprValue(expr);
                    }, ExpressionEvaluator.prototype.visitAggr = function(expr, evalContext) {
                        return evalContext.getExprValue(expr);
                    }, ExpressionEvaluator.prototype.visitFillRule = function(expr, evalContext) {
                        var inputValue = expr.input.accept(this, evalContext);
                        if (void 0 !== inputValue) {
                            var colorAllocator = evalContext.getColorAllocator(expr);
                            if (colorAllocator) return colorAllocator.color(inputValue);
                        }
                    }, ExpressionEvaluator.prototype.visitPercentile = function(expr, evalContext) {
                        return evalContext.getExprValue(expr);
                    }, ExpressionEvaluator.prototype.visitSelectRef = function(expr, evalContext) {
                        return evalContext.getExprValue(expr);
                    }, ExpressionEvaluator.instance = new ExpressionEvaluator(), ExpressionEvaluator;
                }(data.DefaultSQExprVisitorWithArg);
            }(DataViewObjectEvaluator = data.DataViewObjectEvaluator || (data.DataViewObjectEvaluator = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewCategoricalEvalGrouped, inheritSingle = powerbi.Prototype.inheritSingle;
            !function(DataViewCategoricalEvalGrouped) {
                function apply(categorical) {
                    var valueColumns = categorical.values;
                    if (valueColumns) {
                        var seriesGroups, isDynamicSeries = !!valueColumns.source;
                        if (isDynamicSeries) {
                            seriesGroups = inheritSingle(valueColumns.grouped());
                            for (var nextSeriesGroupIndex = 0, currentSeriesGroup = void 0, i = 0, ilen = valueColumns.length; ilen > i; i++) {
                                var currentValueColumn = valueColumns[i];
                                if (!currentSeriesGroup || currentValueColumn.identity !== currentSeriesGroup.identity) {
                                    var existingSeriesGroup = seriesGroups[nextSeriesGroupIndex];
                                    currentSeriesGroup = existingSeriesGroup ? inheritSingle(existingSeriesGroup) : existingSeriesGroup = seriesGroups[nextSeriesGroupIndex] = {
                                        values: null
                                    }, seriesGroups[nextSeriesGroupIndex] = currentSeriesGroup, currentSeriesGroup.values = [], 
                                    nextSeriesGroupIndex++;
                                }
                                currentSeriesGroup.values.push(currentValueColumn);
                            }
                        } else seriesGroups = [ {
                            values: valueColumns
                        } ];
                        valueColumns.grouped = function() {
                            return seriesGroups;
                        }, categorical.values = valueColumns;
                    }
                }
                DataViewCategoricalEvalGrouped.apply = apply;
            }(DataViewCategoricalEvalGrouped = data.DataViewCategoricalEvalGrouped || (data.DataViewCategoricalEvalGrouped = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewMatrixProjectionOrder, ArrayExtensions = jsCommon.ArrayExtensions, inheritSingle = powerbi.Prototype.inheritSingle;
            !function(DataViewMatrixProjectionOrder) {
                function apply(prototype, matrixMapping, projectionOrdering, context) {
                    var transformingMatrix = prototype;
                    return projectionOrdering && (transformingMatrix = projectMeasures(transformingMatrix, matrixMapping, projectionOrdering, context), 
                    transformingMatrix = reorderCompositeGroups(transformingMatrix, matrixMapping, projectionOrdering)), 
                    transformingMatrix;
                }
                function projectMeasures(prototype, matrixRoleMapping, projectionOrdering, context) {
                    if (!projectionOrdering) return prototype;
                    var valuesRoleNames = getMatrixValuesRoleNames(matrixRoleMapping);
                    if (_.isEmpty(valuesRoleNames)) return prototype;
                    var valueSources = prototype.valueSources, projectionOrderingForValuesRoles = getCombinedProjectionOrdering(projectionOrdering, valuesRoleNames);
                    if (_.isEmpty(valueSources) || isEqualProjectionOrdering(prototype.valueSources, projectionOrderingForValuesRoles)) return prototype;
                    var jointMetadataColumns = data.DataViewMetadataColumnUtils.leftJoinMetadataColumnsAndProjectionOrder(valueSources, projectionOrderingForValuesRoles, valuesRoleNames), jointMetadataColumnsOrderedByProjection = _.chain(jointMetadataColumns).filter(function(column) {
                        return void 0 !== column.projectionOrderIndex;
                    }).sortBy(function(column) {
                        return column.projectionOrderIndex;
                    }).value(), matrix = inheritSingle(prototype);
                    matrix.rows = projectIntersectionValues(matrix.rows, matrix.valueSources, jointMetadataColumnsOrderedByProjection);
                    var projectedValueSources = _.map(jointMetadataColumnsOrderedByProjection, function(jointMetadataColumn) {
                        return jointMetadataColumn.metadataColumn;
                    });
                    return matrix.valueSources = projectedValueSources, matrix.columns = DataViewMatrixMeasureHeaders.update(matrix.columns, projectedValueSources.slice()), 
                    context.hierarchyTreesRewritten = !0, matrix;
                }
                function getMatrixValuesRoleNames(matrixRoleMapping) {
                    var valuesRoles = [];
                    return powerbi.DataViewMapping.visitMatrixItems(matrixRoleMapping.values, {
                        visitRole: function(role) {
                            valuesRoles.push(role);
                        }
                    }), valuesRoles;
                }
                function getCombinedProjectionOrdering(projectionOrdering, roles) {
                    for (var combinedOrdering = [], _i = 0, roles_1 = roles; _i < roles_1.length; _i++) {
                        var role = roles_1[_i], roleProjectionOrdering = projectionOrdering[role];
                        _.isEmpty(roleProjectionOrdering) || combinedOrdering.push.apply(combinedOrdering, roleProjectionOrdering);
                    }
                    return combinedOrdering;
                }
                function isEqualProjectionOrdering(valueSources, valueProjectionOrdering) {
                    var currentSelectIndices = _.map(valueSources, function(valueSource) {
                        return valueSource.index;
                    });
                    return ArrayExtensions.sequenceEqual(currentSelectIndices, valueProjectionOrdering, function(a, b) {
                        return a === b;
                    });
                }
                function projectIntersectionValues(prototypeRowHierarchy, originalValueSources, projectedValueSourceEntries) {
                    var columnGroupInstanceCount, originalValueSourcesLength = originalValueSources.length, projectingValueSourcesLength = projectedValueSourceEntries.length, rowHierarchy = inheritSingle(prototypeRowHierarchy);
                    return rowHierarchy.root = data.DataViewPivotMatrix.cloneTreeExecuteOnLeaf(rowHierarchy.root, function(node) {
                        var originalValues = node.values;
                        if (originalValues) if (void 0 === columnGroupInstanceCount && (columnGroupInstanceCount = Object.keys(node.values).length / originalValueSourcesLength), 
                        projectingValueSourcesLength > 0) {
                            for (var projectedValues = {}, columnGroupInstanceIndex = 0; columnGroupInstanceCount > columnGroupInstanceIndex; columnGroupInstanceIndex++) for (var offsetInOriginalValues = columnGroupInstanceIndex * originalValueSourcesLength, offsetInProjectedValues = columnGroupInstanceIndex * projectingValueSourcesLength, projectingValueSourceIndex = 0; projectingValueSourcesLength > projectingValueSourceIndex; projectingValueSourceIndex++) {
                                var originalValueSourceIndex = projectedValueSourceEntries[projectingValueSourceIndex].sourceIndex, nodeValue = originalValues[offsetInOriginalValues + originalValueSourceIndex];
                                projectingValueSourceIndex !== (nodeValue.valueSourceIndex || 0) && (nodeValue = inheritSingle(nodeValue), 
                                nodeValue.valueSourceIndex = projectingValueSourceIndex || void 0), projectedValues[offsetInProjectedValues + projectingValueSourceIndex] = nodeValue;
                            }
                            node.values = projectedValues;
                        } else node.values = void 0;
                    }), rowHierarchy;
                }
                function reorderCompositeGroups(prototype, supportedDataViewMapping, projectionOrdering) {
                    var transformedRowsHierarchy;
                    powerbi.DataViewMapping.visitMatrixItems(supportedDataViewMapping.rows, {
                        visitRole: function(role, context) {
                            transformedRowsHierarchy = reorderMatrixHierarchyCompositeGroups(transformedRowsHierarchy || prototype.rows, role, projectionOrdering);
                        }
                    });
                    var transformedColumnsHierarchy;
                    powerbi.DataViewMapping.visitMatrixItems(supportedDataViewMapping.columns, {
                        visitRole: function(role, context) {
                            transformedColumnsHierarchy = reorderMatrixHierarchyCompositeGroups(transformedColumnsHierarchy || prototype.columns, role, projectionOrdering);
                        }
                    });
                    var transformedDataView;
                    return (transformedRowsHierarchy || transformedColumnsHierarchy) && (transformedDataView = inheritSingle(prototype), 
                    transformedDataView.rows = transformedRowsHierarchy || transformedDataView.rows, 
                    transformedDataView.columns = transformedColumnsHierarchy || transformedDataView.columns), 
                    transformedDataView || prototype;
                }
                function reorderMatrixHierarchyCompositeGroups(matrixHierarchy, hierarchyRole, projectionOrdering) {
                    var transformedHierarchy, selectIndicesInProjectionOrder = projectionOrdering[hierarchyRole], hasMultipleColumnsInProjection = selectIndicesInProjectionOrder && selectIndicesInProjectionOrder.length >= 2;
                    if (hasMultipleColumnsInProjection && !_.isEmpty(matrixHierarchy.levels)) for (var i = matrixHierarchy.levels.length - 1; i >= 0; i--) {
                        var hierarchyLevel = matrixHierarchy.levels[i], levelSourceIndexMappings = createMatrixHierarchyLevelSourcesPositionMapping(hierarchyLevel, hierarchyRole, projectionOrdering);
                        if (!_.isEmpty(levelSourceIndexMappings)) {
                            void 0 === transformedHierarchy && (transformedHierarchy = inheritSingle(matrixHierarchy), 
                            transformedHierarchy.levels = inheritSingle(matrixHierarchy.levels), transformedHierarchy.root = data.DataViewMatrixUtils.inheritMatrixNodeHierarchy(matrixHierarchy.root, i, !0));
                            var transformingHierarchyLevel = inheritSingle(matrixHierarchy.levels[i]);
                            transformedHierarchy.levels[i] = reorderMatrixHierarchyLevelColumnSources(transformingHierarchyLevel, levelSourceIndexMappings), 
                            reorderMatrixHierarchyLevelValues(transformedHierarchy.root, i, levelSourceIndexMappings);
                        }
                    }
                    return transformedHierarchy;
                }
                function createMatrixHierarchyLevelSourcesPositionMapping(hierarchyLevel, hierarchyRole, projectionOrdering) {
                    var levelSourceIndexMappings, levelSourceColumns = hierarchyLevel.sources;
                    if (levelSourceColumns && levelSourceColumns.length >= 2) {
                        var uniqueProjectionOrdering = _.uniq(projectionOrdering[hierarchyRole]), columnsForHierarchyRoleOrderedByLevelSourceIndex = data.DataViewMetadataColumnUtils.leftJoinMetadataColumnsAndProjectionOrder(levelSourceColumns, uniqueProjectionOrdering, [ hierarchyRole ]);
                        if (columnsForHierarchyRoleOrderedByLevelSourceIndex && columnsForHierarchyRoleOrderedByLevelSourceIndex.length >= 2) {
                            var columnsForHierarchyRoleOrderedByProjection = _.sortBy(columnsForHierarchyRoleOrderedByLevelSourceIndex, function(columnInfo) {
                                return columnInfo.projectionOrderIndex;
                            });
                            levelSourceIndexMappings = _.map(columnsForHierarchyRoleOrderedByProjection, function(value, i) {
                                var entry = {
                                    originalSourceIndex: value.sourceIndex,
                                    newSourceIndex: i
                                };
                                return entry;
                            });
                        }
                    }
                    return levelSourceIndexMappings;
                }
                function reorderMatrixHierarchyLevelColumnSources(transformingHierarchyLevel, levelSourceIndexMappings) {
                    var originalLevelSources = transformingHierarchyLevel.sources;
                    transformingHierarchyLevel.sources = originalLevelSources.slice(0);
                    for (var _i = 0, levelSourceIndexMappings_1 = levelSourceIndexMappings; _i < levelSourceIndexMappings_1.length; _i++) {
                        var mapping = levelSourceIndexMappings_1[_i];
                        transformingHierarchyLevel.sources[mapping.newSourceIndex] = originalLevelSources[mapping.originalSourceIndex];
                    }
                    return transformingHierarchyLevel;
                }
                function reorderMatrixHierarchyLevelValues(transformingHierarchyRootNode, transformingHierarchyLevelIndex, levelSourceIndexMappings) {
                    var mappingsByOriginalLevelSourceIndex = _.reduce(levelSourceIndexMappings, function(mappingsByOriginalLevelSourceIndex, value) {
                        return mappingsByOriginalLevelSourceIndex[value.originalSourceIndex] = value, mappingsByOriginalLevelSourceIndex;
                    }, {});
                    return data.DataViewMatrixUtils.forEachNodeAtLevel(transformingHierarchyRootNode, transformingHierarchyLevelIndex, function(transformingMatrixNode) {
                        var originalLevelValues = transformingMatrixNode.levelValues;
                        if (!_.isEmpty(originalLevelValues)) {
                            for (var newlyOrderedLevelValues = _.sortBy(originalLevelValues, function(levelValue) {
                                var mapping = mappingsByOriginalLevelSourceIndex[levelValue.levelSourceIndex];
                                return mapping && mapping.newSourceIndex;
                            }), i = 0, ilen = newlyOrderedLevelValues.length; ilen > i; i++) {
                                var transformingLevelValue = inheritSingle(newlyOrderedLevelValues[i]), mapping = mappingsByOriginalLevelSourceIndex[transformingLevelValue.levelSourceIndex];
                                transformingLevelValue.levelSourceIndex = mapping && mapping.newSourceIndex, newlyOrderedLevelValues[i] = transformingLevelValue;
                            }
                            transformingMatrixNode.levelValues = newlyOrderedLevelValues;
                            var newlyOrderedLastLevelValue = _.last(newlyOrderedLevelValues);
                            transformingMatrixNode.value !== newlyOrderedLastLevelValue.value && (transformingMatrixNode.value = newlyOrderedLastLevelValue.value), 
                            (transformingMatrixNode.levelSourceIndex || 0) !== newlyOrderedLastLevelValue.levelSourceIndex && (transformingMatrixNode.levelSourceIndex = newlyOrderedLastLevelValue.levelSourceIndex);
                        }
                    }), transformingHierarchyRootNode;
                }
                DataViewMatrixProjectionOrder.apply = apply;
            }(DataViewMatrixProjectionOrder = data.DataViewMatrixProjectionOrder || (data.DataViewMatrixProjectionOrder = {}));
            var DataViewMatrixMeasureHeaders;
            !function(DataViewMatrixMeasureHeaders) {
                function update(prototypeColumnHierarchy, newValueSources) {
                    var columnHierarchy, prototypeColumnHierarchyLevels = prototypeColumnHierarchy.levels, hasExistingMeasureHeaders = hasMeasureHeadersLevel(prototypeColumnHierarchyLevels), hasDynamicColumnGroupLevel = hasExistingMeasureHeaders ? _.size(prototypeColumnHierarchyLevels) >= 2 : _.size(prototypeColumnHierarchyLevels) >= 1, isMeasureHeadersLevelNeeded = hasDynamicColumnGroupLevel ? newValueSources.length >= 2 : newValueSources.length >= 1;
                    return columnHierarchy = hasExistingMeasureHeaders ? isMeasureHeadersLevelNeeded ? updateExistingMeasureHeaders(prototypeColumnHierarchy, newValueSources) : removeMeasureHeaders(prototypeColumnHierarchy) : isMeasureHeadersLevelNeeded ? addMeasureHeaders(prototypeColumnHierarchy, newValueSources) : prototypeColumnHierarchy;
                }
                function hasMeasureHeadersLevel(columnHierarchyLevels) {
                    return !_.isEmpty(columnHierarchyLevels) && _.every(_.last(columnHierarchyLevels).sources, function(leafLevelSource) {
                        return leafLevelSource.isMeasure;
                    });
                }
                function updateExistingMeasureHeaders(prototypeColumnHierarchy, newValueSources) {
                    var columnHierarchy = inheritSingle(prototypeColumnHierarchy), columnHierarchyLevels = columnHierarchy.levels = inheritSingle(columnHierarchy.levels), measureHeaderLevelIndex = columnHierarchyLevels.length - 1, measureHeadersLevel = columnHierarchyLevels[measureHeaderLevelIndex] = inheritSingle(columnHierarchyLevels[measureHeaderLevelIndex]);
                    return measureHeadersLevel.sources = newValueSources, columnHierarchy.root = data.DataViewMatrixUtils.inheritMatrixNodeHierarchy(columnHierarchy.root, measureHeaderLevelIndex, !0), 
                    data.DataViewMatrixUtils.forEachNodeDepthFirst(columnHierarchy.root, function(node) {
                        return isParentOfMeasureHeaders(node, measureHeaderLevelIndex) ? (node.children = createMeasureHeaderNodes(measureHeaderLevelIndex, newValueSources.length, node.isSubtotal), 
                        2) : 1;
                    }), columnHierarchy;
                }
                function removeMeasureHeaders(prototypeColumnHierarchy) {
                    var columnHierarchy = inheritSingle(prototypeColumnHierarchy), columnHierarchyLevels = columnHierarchy.levels = inheritSingle(columnHierarchy.levels), measureHeaderLevelIndex = columnHierarchyLevels.length - 1;
                    return columnHierarchyLevels.splice(measureHeaderLevelIndex, 1), columnHierarchy.root = data.DataViewMatrixUtils.inheritMatrixNodeHierarchy(columnHierarchy.root, measureHeaderLevelIndex, !0), 
                    data.DataViewMatrixUtils.forEachNodeDepthFirst(columnHierarchy.root, function(node) {
                        return isParentOfMeasureHeaders(node, measureHeaderLevelIndex) ? (node.children = void 0, 
                        2) : 1;
                    }), columnHierarchy;
                }
                function addMeasureHeaders(prototypeColumnHierarchy, newValueSources) {
                    var columnHierarchy = inheritSingle(prototypeColumnHierarchy), columnHierarchyLevels = columnHierarchy.levels = inheritSingle(columnHierarchy.levels), measureHeaderLevel = {
                        sources: newValueSources
                    };
                    columnHierarchyLevels.push(measureHeaderLevel);
                    var measureHeaderLevelIndex = columnHierarchyLevels.length - 1;
                    return columnHierarchy.root = data.DataViewMatrixUtils.inheritMatrixNodeHierarchy(columnHierarchy.root, measureHeaderLevelIndex, !0), 
                    data.DataViewMatrixUtils.forEachNodeDepthFirst(columnHierarchy.root, function(node) {
                        return data.DataViewMatrixUtils.isLeafNode(node) ? (node.children = createMeasureHeaderNodes(measureHeaderLevelIndex, newValueSources.length, node.isSubtotal), 
                        2) : 1;
                    }), columnHierarchy;
                }
                function isParentOfMeasureHeaders(node, measureHeadersLevelIndex) {
                    var childNodes = node.children;
                    return !_.isEmpty(childNodes) && childNodes[0].level === measureHeadersLevelIndex;
                }
                function createMeasureHeaderNodes(level, measureFieldCount, isSubtotal) {
                    for (var measureHeaderNodes = [], i = 0, ilen = measureFieldCount; ilen > i; i++) {
                        var measureHeaderNode = {
                            level: level
                        };
                        i > 0 && (measureHeaderNode.levelSourceIndex = i), isSubtotal && (measureHeaderNode.isSubtotal = !0), 
                        measureHeaderNodes.push(measureHeaderNode);
                    }
                    return measureHeaderNodes;
                }
                DataViewMatrixMeasureHeaders.update = update;
            }(DataViewMatrixMeasureHeaders || (DataViewMatrixMeasureHeaders = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewPivotCategorical, inherit = powerbi.Prototype.inherit;
            !function(DataViewPivotCategorical) {
                function apply(dataView) {
                    var categorical = dataView.categorical;
                    if (!categorical) return null;
                    var categories = categorical.categories;
                    if (!categories || 1 !== categories.length) return null;
                    var values = categorical.values;
                    if (_.isEmpty(values) || values.source) return null;
                    for (var category = categories[0], categoryIdentities = category.identity, categoryValues = category.values, pivotedColumns = [], pivotedValues = [], rowIdx = 0, rowCount = categoryValues.length; rowCount > rowIdx; rowIdx++) for (var categoryValue = categoryValues[rowIdx], categoryIdentity = categoryIdentities[rowIdx], colIdx = 0, colCount = values.length; colCount > colIdx; colIdx++) {
                        var value = values[colIdx], pivotedColumn = inherit(value.source);
                        if (value.identity) return null;
                        pivotedColumn.groupName = categoryValue;
                        var pivotedValue = {
                            source: pivotedColumn,
                            values: [ value.values[rowIdx] ],
                            identity: categoryIdentity,
                            min: value.min,
                            max: value.max,
                            subtotal: value.subtotal
                        }, highlights = value.highlights;
                        highlights && (pivotedValue.highlights = [ highlights[rowIdx] ]), pivotedColumns.push(pivotedColumn), 
                        pivotedValues.push(pivotedValue);
                    }
                    var pivotedMetadata = inherit(dataView.metadata);
                    return pivotedMetadata.columns = pivotedColumns, values = data.DataViewTransform.createValueColumns(pivotedValues, category.identityFields, category.source), 
                    {
                        metadata: pivotedMetadata,
                        categorical: {
                            values: values
                        },
                        matrix: dataView.matrix
                    };
                }
                DataViewPivotCategorical.apply = apply;
            }(DataViewPivotCategorical = data.DataViewPivotCategorical || (data.DataViewPivotCategorical = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewPivotMatrix;
            !function(DataViewPivotMatrix) {
                function apply(dataViewMatrix, context) {
                    context.columnHierarchyRewritten || (dataViewMatrix.columns = powerbi.Prototype.inherit(dataViewMatrix.columns));
                    var columns = dataViewMatrix.columns;
                    context.rowHierarchyRewritten || (dataViewMatrix.rows = powerbi.Prototype.inherit(dataViewMatrix.rows));
                    var rows = dataViewMatrix.rows;
                    if (!(columns.levels.length > 1)) {
                        var pivotedRowNode = {
                            level: 0
                        }, columnLeafNodes = columns.root.children, measureCount = columnLeafNodes.length, pivotResultMeasureHeaderLevel = rows.levels.length;
                        if (measureCount > 0) {
                            var index_1 = 0, callback = function(node) {
                                if (node.values) {
                                    pivotedRowNode.values || (pivotedRowNode.values = {});
                                    for (var i = 0; measureCount > i; i++) pivotedRowNode.values[index_1++] = node.values[i];
                                    node.values = void 0;
                                }
                                if (measureCount > 1) {
                                    node.children || (node.children = []);
                                    for (var j = 0; measureCount > j; j++) {
                                        var measureHeaderLeaf = {
                                            level: pivotResultMeasureHeaderLevel
                                        }, columnLeafNode = columnLeafNodes[j];
                                        measureHeaderLeaf.levelSourceIndex = columnLeafNode.levelSourceIndex, node.isSubtotal && (measureHeaderLeaf.isSubtotal = !0), 
                                        node.children.push(measureHeaderLeaf);
                                    }
                                }
                            };
                            context.hierarchyTreesRewritten ? forEachLeaf(rows.root, callback) : dataViewMatrix.columns.root = cloneTreeExecuteOnLeaf(rows.root, callback);
                        } else context.hierarchyTreesRewritten || (dataViewMatrix.columns.root = cloneTree(rows.root));
                        if (measureCount > 1) {
                            var level = {
                                sources: columns.levels[0].sources
                            };
                            rows.levels.push(level), columns.levels.length = 0;
                        }
                        if (context.hierarchyTreesRewritten) dataViewMatrix.columns.root = rows.root, dataViewMatrix.rows.root = {
                            children: [ pivotedRowNode ]
                        }; else {
                            var updatedRowRoot = powerbi.Prototype.inherit(dataViewMatrix.rows.root);
                            updatedRowRoot.children = [ pivotedRowNode ], dataViewMatrix.rows.root = updatedRowRoot;
                        }
                        dataViewMatrix.columns.levels = rows.levels, dataViewMatrix.rows.levels = [];
                    }
                }
                function forEachLeaf(root, callback) {
                    var children = root.children;
                    if (children && children.length > 0) for (var i = 0, ilen = children.length; ilen > i; i++) forEachLeaf(children[i], callback); else callback(root);
                }
                function cloneTree(node) {
                    return cloneTreeExecuteOnLeaf(node);
                }
                function cloneTreeExecuteOnLeaf(node, callback) {
                    var updatedNode = powerbi.Prototype.inherit(node), children = node.children;
                    if (children && children.length > 0) {
                        for (var newChildren = [], i = 0, ilen = children.length; ilen > i; i++) {
                            var updatedChild = cloneTreeExecuteOnLeaf(children[i], callback);
                            newChildren.push(updatedChild);
                        }
                        updatedNode.children = newChildren;
                    } else callback && callback(updatedNode);
                    return updatedNode;
                }
                DataViewPivotMatrix.apply = apply, DataViewPivotMatrix.cloneTree = cloneTree, DataViewPivotMatrix.cloneTreeExecuteOnLeaf = cloneTreeExecuteOnLeaf;
            }(DataViewPivotMatrix = data.DataViewPivotMatrix || (data.DataViewPivotMatrix = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createNullValues(length) {
                for (var array = new Array(length), i = 0; length > i; i++) array[i] = null;
                return array;
            }
            function inheritArrayWithValue(nullValues, original, index) {
                var inherited = powerbi.Prototype.inherit(nullValues);
                return inherited[index] = original[index], inherited;
            }
            var DataViewSelfCrossJoin;
            !function(DataViewSelfCrossJoin) {
                function apply(dataView) {
                    if (dataView.categorical) {
                        var dataViewCategorical = dataView.categorical;
                        if (dataViewCategorical.categories && 1 === dataViewCategorical.categories.length && (!dataViewCategorical.values || !dataViewCategorical.values.source)) return applyCategorical(dataView.metadata, dataViewCategorical);
                    }
                }
                function applyCategorical(dataViewMetadata, dataViewCategorical) {
                    var category = dataViewCategorical.categories[0], categoryValues = category.values, categoryLength = categoryValues.length;
                    if (0 !== categoryLength) {
                        var valuesArray = dataViewCategorical.values ? dataViewCategorical.values.grouped()[0].values : [], transformedDataView = data.createCategoricalDataViewBuilder().withCategories(dataViewCategorical.categories).withGroupedValues(createGroupedValues(category, categoryValues, categoryLength, valuesArray)).build();
                        return dataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata), dataViewMetadata.columns = transformedDataView.metadata.columns, 
                        {
                            metadata: dataViewMetadata,
                            categorical: transformedDataView.categorical
                        };
                    }
                }
                function createGroupedValues(category, categoryValues, categoryLength, valuesArray) {
                    for (var nullValuesArray = createNullValues(categoryLength), valuesArrayLen = valuesArray.length, seriesData = [], i = 0; categoryLength > i; i++) {
                        for (var seriesDataItem = [], j = 0; valuesArrayLen > j; j++) {
                            var originalValueColumn = valuesArray[j], originalHighlightValues = originalValueColumn.highlights, seriesDataItemCategory = {
                                values: inheritArrayWithValue(nullValuesArray, originalValueColumn.values, i)
                            };
                            originalHighlightValues && (seriesDataItemCategory.highlights = inheritArrayWithValue(nullValuesArray, originalHighlightValues, i)), 
                            seriesDataItem.push(seriesDataItemCategory);
                        }
                        seriesData.push(seriesDataItem);
                    }
                    return {
                        groupColumn: {
                            source: category.source,
                            identityFrom: {
                                fields: category.identityFields,
                                identities: category.identity
                            },
                            values: category.values
                        },
                        valueColumns: _.map(valuesArray, function(v) {
                            return {
                                source: v.source
                            };
                        }),
                        data: seriesData
                    };
                }
                DataViewSelfCrossJoin.apply = apply;
            }(DataViewSelfCrossJoin = data.DataViewSelfCrossJoin || (data.DataViewSelfCrossJoin = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewPivotCategoricalToPrimaryGroups, ArrayExtensions = jsCommon.ArrayExtensions, DataShapeBindingDataReduction = powerbi.data.DataShapeBindingDataReduction, inheritSingle = powerbi.Prototype.inheritSingle;
            !function(DataViewPivotCategoricalToPrimaryGroups) {
                function pivotBinding(binding, allMappings, finalMapping, defaultDataVolume) {
                    allMappings && 1 === allMappings.length && finalMapping.categorical && finalMapping.categorical.dataReductionAlgorithm && binding && canPivotCategorical(binding, finalMapping) && (binding.Primary.Groupings = [ binding.Secondary.Groupings[0], binding.Primary.Groupings[0] ], 
                    binding.Secondary = void 0, binding.DataReduction = {
                        Primary: DataShapeBindingDataReduction.createFrom(finalMapping.categorical.dataReductionAlgorithm),
                        DataVolume: finalMapping.categorical.dataVolume || defaultDataVolume
                    });
                }
                function isPivotableAxis(axis) {
                    return axis && axis.Groupings && 1 === axis.Groupings.length && !_.isEmpty(axis.Groupings[0].Projections) && !axis.Groupings[0].Subtotal && _.isEmpty(axis.Groupings[0].SuppressedProjections);
                }
                function canPivotCategorical(binding, mapping) {
                    return isPivotableAxis(binding.Primary) && isPivotableAxis(binding.Secondary) && 1 === binding.Secondary.Groupings[0].Projections.length ? !binding.DataReduction || !binding.DataReduction.Primary && !binding.DataReduction.Secondary : !1;
                }
                function unpivotResult(oldDataView, selects, roleKindByQueryRef, queryProjectionsByRole, applicableRoleMappings) {
                    if (!inferUnpivotTransform(oldDataView, selects, roleKindByQueryRef, queryProjectionsByRole, applicableRoleMappings)) return oldDataView;
                    var newDataView = {
                        metadata: {
                            columns: ArrayExtensions.copy(oldDataView.metadata.columns)
                        }
                    };
                    if (oldDataView.single && (newDataView.single = oldDataView.single), oldDataView.table && (newDataView.table = oldDataView.table), 
                    oldDataView.matrix) {
                        var newDataViewMatrix = unpivotMatrix(oldDataView.matrix);
                        if (!_.isEmpty(newDataViewMatrix.valueSources)) {
                            var hasCompositeGroupInSeries = data.DataViewMatrixUtils.containsCompositeGroup(newDataViewMatrix.columns);
                            hasCompositeGroupInSeries || (newDataView.categorical = categoricalFromUnpivotedMatrix(newDataViewMatrix, newDataView.metadata.columns));
                        }
                    }
                    return newDataView;
                }
                function inferUnpivotTransform(dataView, selects, roleKindByQueryRef, queryProjectionsByRole, applicableRoleMappings) {
                    if (_.isEmpty(selects) || !dataView || _.isEmpty(applicableRoleMappings)) return !1;
                    var applicableRoleMappingWithoutRegression = _.filter(applicableRoleMappings, function(mapping) {
                        return !powerbi.DataViewMapping.getRegressionUsage(mapping);
                    });
                    if (1 !== applicableRoleMappingWithoutRegression.length) return !1;
                    var categoricalMapping = applicableRoleMappingWithoutRegression[0].categorical;
                    if (!categoricalMapping) return !1;
                    var matrixDataview = dataView.matrix;
                    if (!matrixDataview) return !1;
                    if (!matrixDataview.rows || !matrixDataview.rows.levels || 2 !== matrixDataview.rows.levels.length) return !1;
                    var categoryGroups = [], valueGroups = [], addGroupingRole = function(roleName, groups) {
                        var roleProjections = queryProjectionsByRole[roleName];
                        if (roleProjections) for (var _i = 0, _a = roleProjections.all(); _i < _a.length; _i++) {
                            var roleProjection = _a[_i];
                            roleKindByQueryRef[roleProjection.queryRef] === powerbi.VisualDataRoleKind.Grouping && groups.push(roleProjection.queryRef);
                        }
                    };
                    if (powerbi.DataViewMapping.visitCategoricalCategories(categoricalMapping.categories, {
                        visitRole: function(roleName) {
                            addGroupingRole(roleName, categoryGroups);
                        }
                    }), powerbi.DataViewMapping.visitGrouped(categoricalMapping.values, {
                        visitRole: function(roleName) {
                            addGroupingRole(roleName, valueGroups);
                        }
                    }), powerbi.DataViewMapping.visitCategoricalValues(categoricalMapping.values, {
                        visitRole: function(roleName) {
                            addGroupingRole(roleName, valueGroups);
                        }
                    }), _.isEmpty(categoryGroups) || _.isEmpty(valueGroups)) return !1;
                    for (var _i = 0, _a = matrixDataview.columns.levels; _i < _a.length; _i++) for (var level = _a[_i], _b = 0, _c = level.sources; _b < _c.length; _b++) {
                        var source = _c[_b];
                        if (!source.isMeasure) return !1;
                    }
                    return !0;
                }
                function unpivotMatrix(oldMatrix) {
                    var oldRows = oldMatrix.rows, oldRoot = oldRows.root, oldChildren = oldRoot.children, series = [], seriesIdLevel = oldRows.levels[0], seriesIdFields = oldRoot.childIdentityFields, categoryIndex = {}, categories = [], categoryIdLevel = oldRows.levels[1], categoryIdFields = _.isEmpty(oldChildren) ? void 0 : oldChildren[0].childIdentityFields, measureCount = oldMatrix.valueSources.length, findCategory = function(identity) {
                        var index = categoryIndex[identity.key];
                        return index;
                    };
                    if (oldChildren) for (var addCategory = function(categoryNode) {
                        var key = categoryNode.identity.key, index = categoryIndex[key];
                        void 0 === index && (index = categories.length, categoryIndex[key] = index, categories.push(categoryNode));
                    }, _i = 0, oldChildren_1 = oldChildren; _i < oldChildren_1.length; _i++) {
                        var seriesNode = oldChildren_1[_i];
                        series.push(seriesNode);
                        for (var _a = 0, _b = seriesNode.children; _a < _b.length; _a++) {
                            var categoryNode = _b[_a];
                            addCategory(categoryNode);
                        }
                    }
                    for (var matrixValues = new Array(categories.length), j = 0; j < series.length; ++j) for (var seriesNode = oldChildren[j], _c = 0, _d = seriesNode.children; _c < _d.length; _c++) {
                        var categoryNode = _d[_c], i = findCategory(categoryNode.identity);
                        matrixValues[i] || (matrixValues[i] = new Array(series.length)), matrixValues[i][j] = categoryNode.values;
                    }
                    var newColumns = {
                        root: {
                            children: _.map(series, function(s) {
                                var inheritedNode = inheritSingle(s);
                                return inheritedNode.level = 0, inheritedNode.children = void 0, inheritedNode.childIdentityFields = void 0, 
                                inheritedNode;
                            }),
                            childIdentityFields: seriesIdFields
                        },
                        levels: [ seriesIdLevel ]
                    };
                    if (measureCount > 0) {
                        for (var newColChildren = _.map(oldMatrix.columns.root.children, function(srcnode) {
                            var dstnode = {
                                level: 1
                            };
                            return srcnode.levelSourceIndex && (dstnode.levelSourceIndex = srcnode.levelSourceIndex), 
                            dstnode;
                        }), i = 0; i < newColumns.root.children.length; ++i) newColumns.root.children[i].children = newColChildren;
                        newColumns.levels.push(oldMatrix.columns.levels[0]);
                    }
                    var newRows = {
                        root: {
                            children: _.map(categories, function(c) {
                                var inheritedNode = inheritSingle(c);
                                return inheritedNode.level = 0, inheritedNode.children = void 0, inheritedNode.childIdentityFields = void 0, 
                                inheritedNode;
                            }),
                            childIdentityFields: categoryIdFields
                        },
                        levels: [ categoryIdLevel ]
                    };
                    if (measureCount > 0) for (var i = 0; i < categories.length; ++i) {
                        for (var row = newRows.root.children[i], rowValues = {}, j = 0; j < series.length; ++j) for (var mvalues = matrixValues[i] && matrixValues[i][j], k = 0; measureCount > k; ++k) {
                            var l = j * measureCount + k;
                            rowValues[l] = mvalues ? mvalues[k] : 0 === k ? {
                                value: null
                            } : {
                                value: null,
                                valueSourceIndex: k
                            };
                        }
                        row.values = rowValues;
                    }
                    var newMatrix = {
                        rows: newRows,
                        columns: newColumns,
                        valueSources: oldMatrix.valueSources
                    };
                    return newMatrix;
                }
                function categoricalFromUnpivotedMatrix(matrix, columnMetadata) {
                    for (var seriesCount = matrix.columns.root.children.length, measureMetadata = matrix.valueSources, measureCount = measureMetadata.length, categories = createCategoryColumnsFromUnpivotedMatrix(matrix), groups = [], j = 0; seriesCount > j; ++j) {
                        var seriesColumn = matrix.columns.root.children[j], group = {
                            values: [],
                            identity: seriesColumn.identity,
                            name: seriesColumn.value || null
                        };
                        groups.push(group);
                        for (var k = 0; measureCount > k; ++k) {
                            var valueColumnMetadataSrc = measureMetadata[k], valueColumnMetadataDst = {};
                            for (var key in valueColumnMetadataSrc) valueColumnMetadataDst[key] = valueColumnMetadataSrc[key];
                            valueColumnMetadataDst.groupName = group.name, columnMetadata.push(valueColumnMetadataDst);
                            var valueColumn = {
                                source: valueColumnMetadataDst,
                                values: [],
                                identity: group.identity
                            };
                            group.values.push(valueColumn);
                            for (var index = k + j * measureCount, _i = 0, _a = matrix.rows.root.children; _i < _a.length; _i++) {
                                var categoryNode = _a[_i], value = categoryNode.values[index].value;
                                valueColumn.values.push(value);
                            }
                        }
                    }
                    for (var values = [], _b = 0, groups_1 = groups; _b < groups_1.length; _b++) for (var group = groups_1[_b], k = 0; measureCount > k; ++k) values.push(group.values[k]);
                    values.grouped = function() {
                        return groups;
                    }, values.identityFields = matrix.columns.root.childIdentityFields, values.source = matrix.columns.levels[0].sources[0];
                    var categorical = {
                        categories: categories,
                        values: values
                    };
                    return categorical;
                }
                function createCategoryColumnsFromUnpivotedMatrix(unpivotedMatrix) {
                    for (var categoryIdentity = _.map(unpivotedMatrix.rows.root.children, function(x) {
                        return x.identity;
                    }), categoryIdentityFields = unpivotedMatrix.rows.root.childIdentityFields, categorySourceColumns = unpivotedMatrix.rows.levels[0].sources, categories = [], i = 0, ilen = categorySourceColumns.length; ilen > i; i++) {
                        var groupLevelValues = _.map(unpivotedMatrix.rows.root.children, function(categoryNode) {
                            var levelValues = categoryNode.levelValues;
                            return void 0 !== levelValues ? levelValues[i].value : void 0;
                        });
                        categories.push({
                            source: categorySourceColumns[i],
                            values: groupLevelValues,
                            identity: categoryIdentity,
                            identityFields: categoryIdentityFields
                        });
                    }
                    return categories;
                }
                DataViewPivotCategoricalToPrimaryGroups.pivotBinding = pivotBinding, DataViewPivotCategoricalToPrimaryGroups.unpivotResult = unpivotResult;
            }(DataViewPivotCategoricalToPrimaryGroups = data.DataViewPivotCategoricalToPrimaryGroups || (data.DataViewPivotCategoricalToPrimaryGroups = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewRemoveSelects, EnumExtensions = jsCommon.EnumExtensions;
            !function(DataViewRemoveSelects) {
                function apply(dataView, targetDataViewKinds, selectsToInclude) {
                    selectsToInclude && dataView.categorical && EnumExtensions.hasFlag(targetDataViewKinds, 1) && applyToCategorical(dataView.categorical, selectsToInclude);
                }
                function applyToCategorical(categorical, selectsToInclude) {
                    var valueColumns = categorical.values;
                    if (valueColumns) {
                        var updatedColumns = void 0;
                        valueColumns.source && (selectsToInclude[valueColumns.source.index] || (valueColumns.source = void 0, 
                        updatedColumns = !0));
                        for (var i = valueColumns.length - 1; i >= 0; i--) selectsToInclude[valueColumns[i].source.index] || (valueColumns.splice(i, 1), 
                        updatedColumns = !0);
                        if (updatedColumns) {
                            var hasRemainingDynamicSeries = !!valueColumns.source, hasRemainingMeasures = valueColumns.length > 0;
                            hasRemainingDynamicSeries || hasRemainingMeasures ? data.DataViewCategoricalEvalGrouped.apply(categorical) : categorical.values = void 0;
                        }
                    }
                }
                DataViewRemoveSelects.apply = apply;
            }(DataViewRemoveSelects = data.DataViewRemoveSelects || (data.DataViewRemoveSelects = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewTransformContext;
            !function(DataViewTransformContext) {
                function create(queryDataViewMetadata, objectDescriptors, dataViewMappings, dataRoles, transforms, colorAllocatorFactory) {
                    var selectTransforms = transforms.selects, projectionActiveItems = transforms.roles && transforms.roles.activeItems, roleKindByQueryRef = _.isEmpty(selectTransforms) ? {} : data.DataViewSelectTransform.createRoleKindFromMetadata(selectTransforms, queryDataViewMetadata), queryProjectionsByRole = data.DataViewSelectTransform.projectionsFromSelects(selectTransforms, projectionActiveItems), dataViewMappingResult = powerbi.DataViewAnalysis.chooseDataViewMappings(queryProjectionsByRole, dataViewMappings, roleKindByQueryRef, objectDescriptors, transforms.objects), applicableRoleMappings = dataViewMappingResult.supportedMappings, context = {
                        queryDataViewMetadata: queryDataViewMetadata,
                        objectDescriptors: objectDescriptors,
                        dataRoles: dataRoles,
                        transforms: transforms,
                        colorAllocatorFactory: colorAllocatorFactory,
                        selectTransforms: selectTransforms,
                        projectionOrdering: transforms.roles && transforms.roles.ordering,
                        projectionActiveItems: projectionActiveItems,
                        roleKindByQueryRef: roleKindByQueryRef,
                        queryProjectionsByRole: queryProjectionsByRole,
                        visualCapabilitiesRoleMappings: dataViewMappings,
                        visualCapabilitiesDataViewKinds: getTargetDataViewKinds(dataViewMappings),
                        applicableRoleMappings: applicableRoleMappings,
                        applicableDataViewKinds: getTargetDataViewKinds(applicableRoleMappings)
                    };
                    return context;
                }
                function getTargetDataViewKinds(roleMappings) {
                    if (!roleMappings) return 0;
                    for (var result = 0, _i = 0, roleMappings_1 = roleMappings; _i < roleMappings_1.length; _i++) {
                        var roleMapping = roleMappings_1[_i];
                        roleMapping.categorical && (result |= 1), roleMapping.matrix && (result |= 2), roleMapping.single && (result |= 4), 
                        roleMapping.table && (result |= 8), roleMapping.tree && (result |= 16);
                    }
                    return result;
                }
                DataViewTransformContext.create = create;
            }(DataViewTransformContext = data.DataViewTransformContext || (data.DataViewTransformContext = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewTransform, inherit = powerbi.Prototype.inherit, inheritSingle = powerbi.Prototype.inheritSingle, ArrayExtensions = jsCommon.ArrayExtensions, EnumExtensions = jsCommon.EnumExtensions;
            !function(DataViewTransform) {
                function apply(options) {
                    var prototype = options.prototype, objectDescriptors = options.objectDescriptors, transforms = options.transforms, colorAllocatorFactory = options.colorAllocatorFactory;
                    if (!prototype) return transformEmptyDataView(objectDescriptors, transforms, colorAllocatorFactory);
                    if (!transforms) return [ prototype ];
                    var transformContext = data.DataViewTransformContext.create(prototype.metadata, objectDescriptors, options.dataViewMappings, options.dataRoles, transforms, colorAllocatorFactory);
                    prototype = data.DataViewPivotCategoricalToPrimaryGroups.unpivotResult(prototype, transformContext.selectTransforms, transformContext.roleKindByQueryRef, transformContext.queryProjectionsByRole, transformContext.applicableRoleMappings);
                    var visualDataViews = transformQueryToVisualDataView(prototype, transformContext);
                    return visualDataViews = data.DataViewRegression.run({
                        visualDataViews: visualDataViews,
                        dataRoles: transformContext.dataRoles,
                        objectDescriptors: objectDescriptors,
                        objectDefinitions: transforms.objects,
                        colorAllocatorFactory: colorAllocatorFactory,
                        transformSelects: transforms.selects,
                        applicableDataViewMappings: transformContext.applicableRoleMappings,
                        roleKindByQueryRef: transformContext.roleKindByQueryRef,
                        queryProjectionsByRole: transformContext.queryProjectionsByRole
                    });
                }
                function transformQueryToVisualDataView(prototype, transformContext) {
                    var transformedDataViews = [], splits = transformContext.transforms.splits;
                    if (_.isEmpty(splits)) transformedDataViews.push(transformDataView(prototype, transformContext)); else for (var _i = 0, splits_1 = splits; _i < splits_1.length; _i++) {
                        var split = splits_1[_i], transformed = transformDataView(prototype, transformContext, split.selects);
                        transformedDataViews.push(transformed);
                    }
                    return transformedDataViews;
                }
                function transformEmptyDataView(objectDescriptors, transforms, colorAllocatorFactory) {
                    if (transforms && transforms.objects) {
                        var emptyDataView = {
                            metadata: {
                                columns: []
                            }
                        };
                        return transformObjects(emptyDataView, 0, objectDescriptors, transforms.objects, transforms.selects, colorAllocatorFactory), 
                        [ emptyDataView ];
                    }
                    return [];
                }
                function transformDataView(prototype, transformContext, selectsToInclude) {
                    var targetDataViewKinds = transformContext.visualCapabilitiesDataViewKinds, targetRoleMappings = transformContext.visualCapabilitiesRoleMappings, selectTransforms = transformContext.selectTransforms, objectDescriptors = transformContext.objectDescriptors, projectionOrdering = transformContext.projectionOrdering, transformed = inherit(prototype);
                    return transformed.metadata = inherit(prototype.metadata), transformed = transformSelects(transformed, targetDataViewKinds, targetRoleMappings, selectTransforms, projectionOrdering), 
                    transformObjects(transformed, transformContext.visualCapabilitiesDataViewKinds, objectDescriptors, transformContext.transforms.objects, selectTransforms, transformContext.colorAllocatorFactory), 
                    data.DataViewRemoveSelects.apply(transformed, targetDataViewKinds, selectsToInclude), 
                    transformed = data.DataViewConcatenateCategoricalColumns.detectAndApply(transformed, transformContext.objectDescriptors, transformContext.applicableRoleMappings, transformContext.projectionOrdering, transformContext.projectionActiveItems), 
                    data.DataViewNormalizeValues.apply({
                        dataview: transformed,
                        dataViewMappings: targetRoleMappings,
                        dataRoles: transformContext.dataRoles
                    }), transformed;
                }
                function transformSelects(dataView, targetDataViewKinds, roleMappings, selectTransforms, projectionOrdering) {
                    var columnRewrites = [];
                    if (selectTransforms && (dataView.metadata.columns = applyTransformsToColumns(dataView.metadata.columns, selectTransforms, columnRewrites), 
                    evaluateAggregateSources(dataView, selectTransforms)), dataView.categorical && EnumExtensions.hasFlag(targetDataViewKinds, 1) && (dataView.categorical = applyRewritesToCategorical(dataView.categorical, columnRewrites), 
                    dataView = pivotIfNecessary(dataView, roleMappings)), dataView.matrix && EnumExtensions.hasFlag(targetDataViewKinds, 2)) {
                        var matrixTransformationContext = {
                            rowHierarchyRewritten: !1,
                            columnHierarchyRewritten: !1,
                            hierarchyTreesRewritten: !1
                        };
                        dataView.matrix = applyRewritesToMatrix(dataView.matrix, columnRewrites, roleMappings, projectionOrdering, matrixTransformationContext), 
                        shouldPivotMatrix(dataView.matrix, roleMappings) && data.DataViewPivotMatrix.apply(dataView.matrix, matrixTransformationContext);
                    }
                    return dataView.table && EnumExtensions.hasFlag(targetDataViewKinds, 8) && (dataView.table = applyRewritesToTable(dataView.table, columnRewrites, projectionOrdering)), 
                    dataView;
                }
                function applyTransformsToColumns(prototypeColumns, selects, rewrites) {
                    if (!selects) return prototypeColumns;
                    for (var columns = inherit(prototypeColumns), i = 0, len = prototypeColumns.length; len > i; i++) {
                        var prototypeColumn = prototypeColumns[i], select = selects[prototypeColumn.index];
                        if (select) {
                            var column = columns[i] = inheritColumnProperties(prototypeColumn, select);
                            rewrites.push({
                                from: prototypeColumn,
                                to: column
                            });
                        }
                    }
                    return columns;
                }
                function inheritColumnProperties(prototypeColumn, select) {
                    var column = inherit(prototypeColumn);
                    return select.roles && (column.roles = select.roles), select.type && (column.type = select.type), 
                    column.format = getFormatForColumn(select, column), select.displayName && (column.displayName = select.displayName), 
                    select.queryName && (column.queryName = select.queryName), select.expr && (column.expr = select.expr), 
                    select.kpi && (column.kpi = select.kpi), select.sort && (column.sort = select.sort), 
                    select.discourageAggregationAcrossGroups && (column.discourageAggregationAcrossGroups = select.discourageAggregationAcrossGroups), 
                    column;
                }
                function evaluateAggregateSources(dataView, selects) {
                    if (selects) for (var evalContext, columns = dataView.metadata.columns, selectIdx = 0, len = selects.length; len > selectIdx; selectIdx++) {
                        var select = selects[selectIdx], aggregateSources = select && select.aggregateSources;
                        if (aggregateSources) {
                            evalContext || (evalContext = data.createStaticEvalContext(data.createColorAllocatorCache(), dataView, selects));
                            var column = findOrCreateColumn(columns, selectIdx, select), columnAggregates = column.aggregates = {}, type = powerbi.ValueType.fromDescriptor(column.type), value = evaluateAggregate(evalContext, selects, type, aggregateSources.min);
                            void 0 !== value && (columnAggregates.min = value), value = evaluateAggregate(evalContext, selects, type, aggregateSources.max), 
                            void 0 !== value && (columnAggregates.max = value);
                        }
                    }
                }
                function findOrCreateColumn(columns, selectIdx, select) {
                    for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                        var column = columns_1[_i];
                        if (column.index === selectIdx && void 0 === column.groupName) return column;
                    }
                    var newColumn = inheritColumnProperties({
                        displayName: select.displayName
                    }, select);
                    return columns.push(newColumn), newColumn;
                }
                function evaluateAggregate(evalContext, selects, type, source) {
                    var select = selects[source.index];
                    return select ? data.DataViewObjectEvaluator.evaluateValue(evalContext, select.expr, type) : void 0;
                }
                function getFormatForColumn(select, column) {
                    return select.format || column.format;
                }
                function applyRewritesToCategorical(prototype, columnRewrites) {
                    function override(value) {
                        var rewrittenSource = findOverride(value.source, columnRewrites);
                        if (rewrittenSource) {
                            var rewritten = inherit(value);
                            return rewritten.source = rewrittenSource, rewritten;
                        }
                    }
                    var categorical = inherit(prototype), categories = powerbi.Prototype.overrideArray(prototype.categories, override);
                    if (categories && (categorical.categories = categories), prototype.values) {
                        var valueColumns = powerbi.Prototype.overrideArray(prototype.values, override) || inheritSingle(prototype.values);
                        if (categorical.values = valueColumns, valueColumns.source) {
                            var rewrittenValuesSource = findOverride(valueColumns.source, columnRewrites);
                            rewrittenValuesSource && (valueColumns.source = rewrittenValuesSource);
                        }
                    }
                    return data.DataViewCategoricalEvalGrouped.apply(categorical), categorical;
                }
                function applyRewritesToTable(prototype, columnRewrites, projectionOrdering) {
                    var table = inherit(prototype), override = function(metadata) {
                        return findOverride(metadata, columnRewrites);
                    }, columns = powerbi.Prototype.overrideArray(prototype.columns, override);
                    if (columns && (table.columns = columns), !projectionOrdering) return table;
                    var newToOldPositions = createTableColumnPositionMapping(projectionOrdering, columnRewrites);
                    if (!newToOldPositions) return table;
                    for (var columnsClone = columns.slice(0), keys = Object.keys(newToOldPositions), i = 0, len = keys.length; len > i; i++) {
                        var sourceColumn = columnsClone[newToOldPositions[keys[i]]];
                        i === columns.length ? columns.push(sourceColumn) : columns[i] = sourceColumn;
                    }
                    var rows = powerbi.Prototype.overrideArray(table.rows, function(row) {
                        for (var newRow = [], i = 0, len = keys.length; len > i; ++i) newRow[i] = row[newToOldPositions[keys[i]]];
                        return newRow;
                    });
                    return rows && (table.rows = rows), table;
                }
                function createTableColumnPositionMapping(projectionOrdering, columnRewrites) {
                    var roles = Object.keys(projectionOrdering);
                    if (1 === roles.length) {
                        var role = roles[0], originalOrder = _.map(columnRewrites, function(rewrite) {
                            return rewrite.from.index;
                        }), newOrder = projectionOrdering[role];
                        return createOrderMapping(originalOrder, newOrder);
                    }
                }
                function applyRewritesToMatrix(prototype, columnRewrites, roleMappings, projectionOrdering, context) {
                    function override(metadata) {
                        return findOverride(metadata, columnRewrites);
                    }
                    function overrideHierarchy(hierarchy) {
                        var rewrittenHierarchy = null, newLevels = powerbi.Prototype.overrideArray(hierarchy.levels, function(level) {
                            var newLevel = null, levelSources = powerbi.Prototype.overrideArray(level.sources, override);
                            return levelSources && (newLevel = ensureRewritten(newLevel, level, function(h) {
                                return h.sources = levelSources;
                            })), newLevel;
                        });
                        return newLevels && (rewrittenHierarchy = ensureRewritten(rewrittenHierarchy, hierarchy, function(r) {
                            return r.levels = newLevels;
                        })), rewrittenHierarchy;
                    }
                    var firstRoleMappingWithMatrix = _.find(roleMappings, function(roleMapping) {
                        return !!roleMapping.matrix;
                    }), matrixMapping = firstRoleMappingWithMatrix.matrix, matrix = inherit(prototype), rows = overrideHierarchy(matrix.rows);
                    rows && (matrix.rows = rows, context.rowHierarchyRewritten = !0);
                    var columns = overrideHierarchy(matrix.columns);
                    columns && (matrix.columns = columns, context.columnHierarchyRewritten = !0);
                    var valueSources = powerbi.Prototype.overrideArray(matrix.valueSources, override);
                    return valueSources && (matrix.valueSources = valueSources), data.DataViewMatrixProjectionOrder.apply(matrix, matrixMapping, projectionOrdering, context), 
                    matrix;
                }
                function createOrderMapping(originalOrder, newOrder) {
                    if (!ArrayExtensions.sequenceEqual(originalOrder, newOrder, function(x, y) {
                        return x === y;
                    })) {
                        for (var mapping = {}, i = 0, len = newOrder.length; len > i; ++i) {
                            var newPosition = newOrder[i];
                            mapping[i] = originalOrder.indexOf(newPosition);
                        }
                        return mapping;
                    }
                }
                function findOverride(source, columnRewrites) {
                    for (var i = 0, len = columnRewrites.length; len > i; i++) {
                        var columnRewrite = columnRewrites[i];
                        if (columnRewrite.from === source) return columnRewrite.to;
                    }
                }
                function ensureRewritten(rewritten, prototype, callback) {
                    return rewritten || (rewritten = inherit(prototype)), callback && callback(rewritten), 
                    rewritten;
                }
                function transformObjects(dataView, targetDataViewKinds, objectDescriptors, objectDefinitions, selectTransforms, colorAllocatorFactory) {
                    if (objectDescriptors) {
                        var objectsForAllSelectors = data.DataViewObjectEvaluationUtils.groupObjectsBySelector(objectDefinitions);
                        data.DataViewObjectEvaluationUtils.addImplicitObjects(objectsForAllSelectors, objectDescriptors, dataView.metadata.columns, selectTransforms);
                        var metadataOnce = objectsForAllSelectors.metadataOnce, dataObjects = objectsForAllSelectors.data;
                        metadataOnce && evaluateMetadataObjects(dataView, selectTransforms, objectDescriptors, metadataOnce.objects, dataObjects, colorAllocatorFactory);
                        var metadataObjects = objectsForAllSelectors.metadata;
                        if (metadataObjects) for (var i = 0, len = metadataObjects.length; len > i; i++) {
                            var metadataObject = metadataObjects[i], objectDefns = metadataObject.objects, colorAllocatorCache = populateColorAllocatorCache(dataView, selectTransforms, objectDefns, colorAllocatorFactory);
                            evaluateMetadataRepetition(dataView, selectTransforms, objectDescriptors, metadataObject.selector, objectDefns, colorAllocatorCache);
                        }
                        for (var i = 0, len = dataObjects.length; len > i; i++) {
                            var dataObject = dataObjects[i], objectDefns = dataObject.objects, colorAllocatorCache = populateColorAllocatorCache(dataView, selectTransforms, objectDefns, colorAllocatorFactory);
                            evaluateDataRepetition(dataView, targetDataViewKinds, selectTransforms, objectDescriptors, dataObject.selector, dataObject.rules, objectDefns, colorAllocatorCache);
                        }
                        var userDefined = objectsForAllSelectors.userDefined;
                        userDefined && evaluateUserDefinedObjects(dataView, selectTransforms, objectDescriptors, userDefined, colorAllocatorFactory);
                    }
                }
                function evaluateUserDefinedObjects(dataView, selectTransforms, objectDescriptors, objectDefns, colorAllocatorFactory) {
                    var dataViewObjects = dataView.metadata.objects;
                    dataViewObjects || (dataViewObjects = dataView.metadata.objects = {});
                    for (var _i = 0, objectDefns_1 = objectDefns; _i < objectDefns_1.length; _i++) {
                        var objectDefn = objectDefns_1[_i], id = objectDefn.selector.id, colorAllocatorCache = populateColorAllocatorCache(dataView, selectTransforms, objectDefn.objects, colorAllocatorFactory), evalContext = data.createStaticEvalContext(colorAllocatorCache, dataView, selectTransforms), objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefn.objects);
                        for (var objectName in objects) {
                            var object = objects[objectName], map = dataViewObjects[objectName];
                            map || (map = dataViewObjects[objectName] = []), map.push({
                                id: id,
                                object: object
                            });
                        }
                    }
                }
                function evaluateMetadataObjects(dataView, selectTransforms, objectDescriptors, objectDefns, dataObjects, colorAllocatorFactory) {
                    var colorAllocatorCache = populateColorAllocatorCache(dataView, selectTransforms, objectDefns, colorAllocatorFactory), evalContext = data.createStaticEvalContext(colorAllocatorCache, dataView, selectTransforms), objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                    if (objects) {
                        dataView.metadata.objects = objects;
                        for (var objectName in objects) {
                            var object = objects[objectName], objectDesc = objectDescriptors[objectName];
                            for (var propertyName in object) {
                                var propertyDesc = objectDesc.properties[propertyName], ruleDesc = propertyDesc.rule;
                                if (ruleDesc) {
                                    var definitions = createRuleEvaluationInstance(dataView, colorAllocatorFactory, ruleDesc, objectName, object[propertyName], propertyDesc.type);
                                    _.isEmpty(definitions) || dataObjects.push.apply(dataObjects, definitions);
                                }
                            }
                        }
                    }
                }
                function createRuleEvaluationInstance(dataView, colorAllocatorFactory, ruleDesc, objectName, propertyValue, ruleType) {
                    var ruleOutput = ruleDesc.output;
                    if (ruleOutput) {
                        var selectorsToCreate = findSelectorsForRuleInput(dataView, ruleOutput.selector);
                        if (!_.isEmpty(selectorsToCreate)) return ruleType.fillRule ? createRuleEvaluationInstanceFillRule(dataView, colorAllocatorFactory, ruleDesc, selectorsToCreate, objectName, propertyValue) : void 0;
                    }
                }
                function createRuleEvaluationInstanceFillRule(dataView, colorAllocatorFactory, ruleDesc, selectorsToCreate, objectName, propertyValue) {
                    var colorAllocator = tryCreateColorAllocatorForFillRule(dataView, colorAllocatorFactory, ruleDesc.inputRole, 1, propertyValue);
                    if (colorAllocator) {
                        var rule = new data.ColorRuleEvaluation(ruleDesc.inputRole, colorAllocator), fillRuleProperties = {};
                        fillRuleProperties[ruleDesc.output.property] = {
                            solid: {
                                color: rule
                            }
                        };
                        for (var objectDefinitions = [], selectorIndex = 0, selectorCount = selectorsToCreate.length; selectorCount > selectorIndex; selectorIndex++) objectDefinitions.push({
                            selector: selectorsToCreate[selectorIndex],
                            rules: [ rule ],
                            objects: [ {
                                name: objectName,
                                properties: fillRuleProperties
                            } ]
                        });
                        return objectDefinitions;
                    }
                }
                function tryCreateColorAllocatorForFillRule(dataView, colorAllocatorFactory, identifier, identifierKind, propertyValue) {
                    return propertyValue.linearGradient2 ? createColorAllocatorLinearGradient2(dataView, colorAllocatorFactory, identifier, identifierKind, propertyValue, propertyValue.linearGradient2) : propertyValue.linearGradient3 ? createColorAllocatorLinearGradient3(dataView, colorAllocatorFactory, identifier, identifierKind, propertyValue, propertyValue.linearGradient3) : void 0;
                }
                function createColorAllocatorLinearGradient2(dataView, colorAllocatorFactory, identifier, identifierKind, propertyValueFillRule, linearGradient2) {
                    if (linearGradient2 = propertyValueFillRule.linearGradient2, void 0 === linearGradient2.min.value || void 0 === linearGradient2.max.value) {
                        var inputRange = findRuleInputColumnNumberRange(dataView, identifier, identifierKind);
                        if (!inputRange) return;
                        void 0 === linearGradient2.min.value && (linearGradient2.min.value = inputRange.min), 
                        void 0 === linearGradient2.max.value && (linearGradient2.max.value = inputRange.max);
                    }
                    return colorAllocatorFactory.linearGradient2(propertyValueFillRule.linearGradient2);
                }
                function createColorAllocatorLinearGradient3(dataView, colorAllocatorFactory, identifier, identifierKind, propertyValueFillRule, linearGradient3) {
                    var splitScales;
                    if (linearGradient3 = propertyValueFillRule.linearGradient3, void 0 === linearGradient3.min.value || void 0 === linearGradient3.mid.value || void 0 === linearGradient3.max.value) {
                        var inputRange = findRuleInputColumnNumberRange(dataView, identifier, identifierKind);
                        if (!inputRange) return;
                        if (splitScales = void 0 === linearGradient3.min.value && void 0 === linearGradient3.max.value && void 0 !== linearGradient3.mid.value, 
                        void 0 === linearGradient3.min.value && (linearGradient3.min.value = inputRange.min), 
                        void 0 === linearGradient3.max.value && (linearGradient3.max.value = inputRange.max), 
                        void 0 === linearGradient3.mid.value) {
                            var midValue = (linearGradient3.max.value + linearGradient3.min.value) / 2;
                            linearGradient3.mid.value = midValue;
                        }
                    }
                    return colorAllocatorFactory.linearGradient3(propertyValueFillRule.linearGradient3, splitScales);
                }
                function populateColorAllocatorCache(dataView, selectTransforms, objectDefns, colorAllocatorFactory) {
                    for (var cache = data.createColorAllocatorCache(), staticEvalContext = data.createStaticEvalContext(), i = 0, len = objectDefns.length; len > i; i++) {
                        var objectDefnProperties = objectDefns[i].properties;
                        for (var propertyName in objectDefnProperties) {
                            var fillProperty = objectDefnProperties[propertyName];
                            if (fillProperty && fillProperty.solid && fillProperty.solid.color && 23 === fillProperty.solid.color.kind) {
                                var fillRuleExpr = fillProperty.solid.color, inputExprQueryName = findFirstQueryNameForExpr(selectTransforms, fillRuleExpr.input);
                                if (!inputExprQueryName) continue;
                                var fillRule = data.DataViewObjectEvaluator.evaluateProperty(staticEvalContext, fillRulePropertyDescriptor, fillRuleExpr.rule), colorAllocator = tryCreateColorAllocatorForFillRule(dataView, colorAllocatorFactory, inputExprQueryName, 0, fillRule);
                                colorAllocator && cache.register(fillRuleExpr, colorAllocator);
                            }
                        }
                    }
                    return cache;
                }
                function evaluateDataRepetition(dataView, targetDataViewKinds, selectTransforms, objectDescriptors, selector, rules, objectDefns, colorAllocatorCache) {
                    var containsWildcard = data.Selector.containsWildcard(selector), dataViewCategorical = dataView.categorical;
                    if (dataViewCategorical && EnumExtensions.hasFlag(targetDataViewKinds, 1)) {
                        var rewrittenSelector = rewriteCategoricalRoleSelector(dataViewCategorical, selector);
                        evaluateDataRepetitionCategoricalCategory(dataViewCategorical, selectTransforms, objectDescriptors, rewrittenSelector, rules, containsWildcard, objectDefns, colorAllocatorCache), 
                        evaluateDataRepetitionCategoricalValueGrouping(dataViewCategorical, selectTransforms, objectDescriptors, rewrittenSelector, rules, containsWildcard, objectDefns, colorAllocatorCache);
                    }
                    var dataViewMatrix = dataView.matrix;
                    if (dataViewMatrix && EnumExtensions.hasFlag(targetDataViewKinds, 2)) {
                        var rewrittenMatrix = evaluateDataRepetitionMatrix(dataViewMatrix, objectDescriptors, selector, rules, containsWildcard, objectDefns, colorAllocatorCache);
                        rewrittenMatrix && (dataView.matrix = rewrittenMatrix);
                    }
                    var dataViewTable = dataView.table;
                    if (dataViewTable && EnumExtensions.hasFlag(targetDataViewKinds, 8)) {
                        var rewrittenSelector = rewriteTableRoleSelector(dataViewTable, selector), rewrittenTable = evaluateDataRepetitionTable(dataViewTable, selectTransforms, objectDescriptors, rewrittenSelector, rules, containsWildcard, objectDefns, colorAllocatorCache);
                        rewrittenTable && (dataView.table = rewrittenTable);
                    }
                }
                function rewriteTableRoleSelector(dataViewTable, selector) {
                    return data.Selector.hasRoleWildcard(selector) && (selector = findSelectorForRoleWildcard(selector, function(r) {
                        return getIdentityExprsForRolesOnTable(r, dataViewTable);
                    })), selector;
                }
                function rewriteCategoricalRoleSelector(dataViewCategorical, selector) {
                    return data.Selector.hasRoleWildcard(selector) && (selector = findSelectorForRoleWildcard(selector, function(r) {
                        return getIdentityExprsForRolesOnCategorical(r, dataViewCategorical);
                    })), selector;
                }
                function findSelectorForRoleWildcard(selector, getIdentityExprsForRoles) {
                    for (var resultingSelector = {
                        data: [],
                        id: selector.id,
                        metadata: selector.metadata
                    }, _i = 0, _a = selector.data; _i < _a.length; _i++) {
                        var dataSelector = _a[_i];
                        if (data.Selector.isRoleWildcard(dataSelector)) {
                            var exprs = getIdentityExprsForRoles(dataSelector.roles);
                            if (!_.isEmpty(exprs)) {
                                resultingSelector.data.push(data.DataViewScopeWildcard.fromExprs(exprs));
                                continue;
                            }
                        }
                        isUniqueDataSelector(resultingSelector.data, dataSelector) && resultingSelector.data.push(dataSelector);
                    }
                    return resultingSelector;
                }
                function getIdentityExprsForRolesOnTable(roles, dataViewTable) {
                    var allColumnsBelongToSelectorRole = allColumnsBelongToRole(dataViewTable.columns, roles), exprs = dataViewTable.identityFields;
                    return allColumnsBelongToSelectorRole && exprs ? exprs : void 0;
                }
                function getIdentityExprsForRolesOnCategorical(roles, dataViewCategorical) {
                    if (dataViewCategorical.categories) for (var _i = 0, _a = dataViewCategorical.categories; _i < _a.length; _i++) {
                        var category = _a[_i];
                        if (category.source && allColumnsBelongToRole([ category.source ], roles)) return category.identityFields;
                    }
                }
                function isUniqueDataSelector(dataSelectors, newSelector) {
                    return _.isEmpty(dataSelectors) ? !0 : !_.any(dataSelectors, function(dataSelector) {
                        return dataSelector.key === newSelector.key;
                    });
                }
                function allColumnsBelongToRole(columns, selectorRoles) {
                    for (var _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
                        var column = columns_2[_i], roles = column.roles;
                        if (!roles || !_.any(selectorRoles, function(selectorRole) {
                            return roles[selectorRole];
                        })) return !1;
                    }
                    return !0;
                }
                function evaluateDataRepetitionCategoricalCategory(dataViewCategorical, selectTransforms, objectDescriptors, selector, rules, containsWildcard, objectDefns, colorAllocatorCache) {
                    if (dataViewCategorical.categories && 0 !== dataViewCategorical.categories.length) {
                        var targetColumn = findSelectedCategoricalColumn(dataViewCategorical, selector);
                        if (targetColumn) {
                            var foundMatch, identities = targetColumn.identities, evalContext = data.createCategoricalEvalContext(colorAllocatorCache, dataViewCategorical, selectTransforms);
                            if (identities) {
                                for (var i = 0, len = identities.length; len > i; i++) {
                                    var identity = identities[i];
                                    if (containsWildcard || data.Selector.matchesData(selector, [ identity ])) {
                                        evalContext.setCurrentRowIndex(i);
                                        var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                                        if (objects && (targetColumn.column.objects || (targetColumn.column.objects = [], 
                                        targetColumn.column.objects.length = len), targetColumn.column.objects[i] = objects), 
                                        !containsWildcard) return !0;
                                        foundMatch = !0;
                                    }
                                }
                                return foundMatch;
                            }
                        }
                    }
                }
                function evaluateDataRepetitionCategoricalValueGrouping(dataViewCategorical, selectTransforms, objectDescriptors, selector, rules, containsWildcard, objectDefns, colorAllocatorCache) {
                    var dataViewCategoricalValues = dataViewCategorical.values;
                    if (dataViewCategoricalValues && dataViewCategoricalValues.identityFields && data.Selector.matchesKeys(selector, [ dataViewCategoricalValues.identityFields ])) {
                        var valuesGrouped = dataViewCategoricalValues.grouped();
                        if (valuesGrouped) {
                            for (var foundMatch, evalContext = data.createCategoricalEvalContext(colorAllocatorCache, dataViewCategorical, selectTransforms), i = 0, len = valuesGrouped.length; len > i; i++) {
                                var valueGroup = valuesGrouped[i], selectorMetadata = selector.metadata, valuesInGroup = valueGroup.values;
                                if (containsWildcard || data.Selector.matchesData(selector, [ valueGroup.identity ])) {
                                    var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                                    if (objects) if (selectorMetadata) for (var j = 0, jlen = valuesInGroup.length; jlen > j; j++) {
                                        var valueColumn = valuesInGroup[j], valueSource = valueColumn.source;
                                        if (valueSource.queryName === selectorMetadata) {
                                            var valueSourceOverwrite = powerbi.Prototype.inherit(valueSource);
                                            valueSourceOverwrite.objects = objects, valueColumn.source = valueSourceOverwrite, 
                                            foundMatch = !0;
                                            break;
                                        }
                                    } else valueGroup.objects = objects, setGrouped(dataViewCategoricalValues, valuesGrouped), 
                                    foundMatch = !0;
                                    if (!containsWildcard) return !0;
                                }
                            }
                            return foundMatch;
                        }
                    }
                }
                function evaluateDataRepetitionMatrix(dataViewMatrix, objectDescriptors, selector, rules, containsWildcard, objectDefns, colorAllocatorCache) {
                    var evalContext = data.createMatrixEvalContext(colorAllocatorCache, dataViewMatrix), rewrittenRows = evaluateDataRepetitionMatrixHierarchy(evalContext, dataViewMatrix.rows, objectDescriptors, selector, rules, containsWildcard, objectDefns), rewrittenCols = evaluateDataRepetitionMatrixHierarchy(evalContext, dataViewMatrix.columns, objectDescriptors, selector, rules, containsWildcard, objectDefns);
                    if (rewrittenRows || rewrittenCols) {
                        var rewrittenMatrix = inheritSingle(dataViewMatrix);
                        return rewrittenRows && (rewrittenMatrix.rows = rewrittenRows), rewrittenCols && (rewrittenMatrix.columns = rewrittenCols), 
                        rewrittenMatrix;
                    }
                }
                function evaluateDataRepetitionMatrixHierarchy(evalContext, dataViewMatrixHierarchy, objectDescriptors, selector, rules, containsWildcard, objectDefns) {
                    if (dataViewMatrixHierarchy) {
                        var root = dataViewMatrixHierarchy.root;
                        if (root) {
                            var rewrittenRoot = evaluateDataRepetitionMatrixNode(evalContext, root, objectDescriptors, selector, rules, containsWildcard, objectDefns);
                            if (rewrittenRoot) {
                                var rewrittenHierarchy = inheritSingle(dataViewMatrixHierarchy);
                                return rewrittenHierarchy.root = rewrittenRoot, rewrittenHierarchy;
                            }
                        }
                    }
                }
                function evaluateDataRepetitionMatrixNode(evalContext, dataViewNode, objectDescriptors, selector, rules, containsWildcard, objectDefns) {
                    var childNodes = dataViewNode.children;
                    if (childNodes) {
                        var rewrittenNode, shouldSearchChildren, childIdentityFields = dataViewNode.childIdentityFields;
                        childIdentityFields && (shouldSearchChildren = data.Selector.matchesKeys(selector, [ childIdentityFields ]));
                        for (var i = 0, len = childNodes.length; len > i; i++) {
                            var childNode = childNodes[i], identity = childNode.identity, rewrittenChildNode = null;
                            if (shouldSearchChildren) {
                                if (containsWildcard || data.Selector.matchesData(selector, [ identity ])) {
                                    var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                                    objects && (rewrittenChildNode = inheritSingle(childNode), rewrittenChildNode.objects = objects);
                                }
                            } else rewrittenChildNode = evaluateDataRepetitionMatrixNode(evalContext, childNode, objectDescriptors, selector, rules, containsWildcard, objectDefns);
                            if (rewrittenChildNode && (rewrittenNode || (rewrittenNode = inheritNodeAndChildren(dataViewNode)), 
                            rewrittenNode.children[i] = rewrittenChildNode, !containsWildcard)) break;
                        }
                        return rewrittenNode;
                    }
                }
                function inheritNodeAndChildren(node) {
                    if (Object.getPrototypeOf(node) !== Object.prototype) return node;
                    var inherited = inheritSingle(node);
                    return inherited.children = inherit(node.children), inherited;
                }
                function evaluateDataRepetitionTable(dataViewTable, selectTransforms, objectDescriptors, selector, rules, containsWildcard, objectDefns, colorAllocatorCache) {
                    var evalContext = data.createTableEvalContext(colorAllocatorCache, dataViewTable, selectTransforms), rewrittenRows = evaluateDataRepetitionTableRows(evalContext, dataViewTable.columns, dataViewTable.rows, dataViewTable.identity, dataViewTable.identityFields, objectDescriptors, selector, rules, containsWildcard, objectDefns);
                    if (rewrittenRows) {
                        var rewrittenTable = inheritSingle(dataViewTable);
                        return rewrittenTable.rows = rewrittenRows, rewrittenTable;
                    }
                }
                function evaluateDataRepetitionTableRows(evalContext, columns, rows, identities, identityFields, objectDescriptors, selector, rules, containsWildcard, objectDefns) {
                    if (!_.isEmpty(identities) && !_.isEmpty(identityFields) && selector.metadata && data.Selector.matchesKeys(selector, [ identityFields ])) {
                        var colIdx = _.findIndex(columns, function(col) {
                            return col.queryName === selector.metadata;
                        });
                        if (!(0 > colIdx)) {
                            for (var inheritedRows, colLen = columns.length, rowIdx = 0, rowLen = identities.length; rowLen > rowIdx; rowIdx++) {
                                var identity = identities[rowIdx];
                                if (containsWildcard || data.Selector.matchesData(selector, [ identity ])) {
                                    evalContext.setCurrentRowIndex(rowIdx);
                                    var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                                    if (objects) {
                                        inheritedRows || (inheritedRows = inheritSingle(rows));
                                        var inheritedRow = inheritedRows[rowIdx] = inheritSingle(inheritedRows[rowIdx]), objectsForColumns = inheritedRow.objects;
                                        objectsForColumns || (inheritedRow.objects = objectsForColumns = new Array(colLen)), 
                                        objectsForColumns[colIdx] = objects;
                                    }
                                    if (!containsWildcard) break;
                                }
                            }
                            return inheritedRows;
                        }
                    }
                }
                function evaluateMetadataRepetition(dataView, selectTransforms, objectDescriptors, selector, objectDefns, colorAllocatorCache) {
                    for (var columns = dataView.metadata.columns, metadataId = selector.metadata, evalContext = data.createStaticEvalContext(colorAllocatorCache, dataView, selectTransforms), i = 0, len = columns.length; len > i; i++) {
                        var column = columns[i];
                        if (column.queryName === metadataId) {
                            var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(evalContext, objectDescriptors, objectDefns);
                            objects && (column.objects = objects);
                        }
                    }
                }
                function findSelectedCategoricalColumn(dataViewCategorical, selector) {
                    var categoricalColumn = dataViewCategorical.categories[0];
                    if (categoricalColumn.identityFields && data.Selector.matchesKeys(selector, [ categoricalColumn.identityFields ])) {
                        var identities = categoricalColumn.identity, targetColumn = categoricalColumn, selectedMetadataId = selector.metadata;
                        if (selectedMetadataId) {
                            var valueColumns = dataViewCategorical.values;
                            if (valueColumns) for (var i = 0, len = valueColumns.length; len > i; i++) {
                                var valueColumn = valueColumns[i];
                                if (valueColumn.source.queryName === selectedMetadataId) {
                                    targetColumn = valueColumn;
                                    break;
                                }
                            }
                        }
                        return {
                            column: targetColumn,
                            identities: identities
                        };
                    }
                }
                function findSelectorsForRuleInput(dataView, selectorRoles) {
                    var dataViewCategorical = dataView.categorical;
                    if (dataViewCategorical) {
                        var categories = dataViewCategorical.categories;
                        if (categories) {
                            for (var categoryRoles, selectorsForRuleInput = [], categoryIndex = 0, categoryCount = categories.length; categoryCount > categoryIndex; categoryIndex++) {
                                var categoryColumn = categories[categoryIndex], categoryIdentityFields = categoryColumn.identityFields;
                                if (categoryRoles = categoryColumn.source.roles, categoryRoles && categoryIdentityFields) {
                                    var columnHasSelectorRole = _.any(selectorRoles, function(role) {
                                        return categoryRoles[role];
                                    });
                                    columnHasSelectorRole && selectorsForRuleInput.push({
                                        data: [ data.DataViewScopeWildcard.fromExprs(categoryIdentityFields) ]
                                    });
                                }
                            }
                            return selectorsForRuleInput;
                        }
                    }
                }
                function findFirstQueryNameForExpr(selectTransforms, expr) {
                    if (data.SQExpr.isSelectRef(expr)) return expr.expressionName;
                    if (selectTransforms) for (var i = 0, len = selectTransforms.length; len > i; i++) {
                        var select = selectTransforms[i], columnExpr = select.expr;
                        if (columnExpr && data.SQExpr.equals(expr, select.expr)) return select.queryName;
                    }
                }
                function findRuleInputColumnNumberRange(dataView, identifier, identifierKind) {
                    for (var columns = dataView.metadata.columns, i = 0, len = columns.length; len > i; i++) {
                        var column = columns[i];
                        if (1 === identifierKind) {
                            var valueColRoles = column.roles;
                            if (!valueColRoles || !valueColRoles[identifier]) continue;
                        } else if (column.queryName !== identifier) continue;
                        var aggregates = column.aggregates;
                        if (aggregates) {
                            var min = aggregates.min;
                            if (void 0 === min && (min = aggregates.minLocal), void 0 !== min) {
                                var max = aggregates.max;
                                if (void 0 === max && (max = aggregates.maxLocal), void 0 !== max) return {
                                    min: min,
                                    max: max
                                };
                            }
                        }
                    }
                }
                function createValueColumns(values, valueIdentityFields, source) {
                    void 0 === values && (values = []);
                    var result = values;
                    return setGrouped(values), valueIdentityFields && (result.identityFields = valueIdentityFields), 
                    source && (result.source = source), result;
                }
                function setGrouped(values, groupedResult) {
                    values.grouped = groupedResult ? function() {
                        return groupedResult;
                    } : function() {
                        return groupValues(values);
                    };
                }
                function groupValues(values) {
                    for (var currentGroup, groups = [], i = 0, len = values.length; len > i; i++) {
                        var value = values[i];
                        if (!currentGroup || currentGroup.identity !== value.identity) {
                            if (currentGroup = {
                                values: []
                            }, value.identity) {
                                currentGroup.identity = value.identity;
                                var source = value.source;
                                void 0 !== source.groupName ? currentGroup.name = source.groupName : source.displayName && (currentGroup.name = source.displayName);
                            }
                            groups.push(currentGroup);
                        }
                        currentGroup.values.push(value);
                    }
                    return groups;
                }
                function pivotIfNecessary(dataView, dataViewMappings) {
                    var transformedDataView;
                    switch (determineCategoricalTransformation(dataView.categorical, dataViewMappings)) {
                      case 1:
                        transformedDataView = data.DataViewPivotCategorical.apply(dataView);
                        break;

                      case 2:
                        transformedDataView = data.DataViewSelfCrossJoin.apply(dataView);
                    }
                    return transformedDataView || dataView;
                }
                function determineCategoricalTransformation(categorical, dataViewMappings) {
                    if (categorical && !_.isEmpty(dataViewMappings)) {
                        var categories = categorical.categories;
                        if (categories && 1 === categories.length) {
                            var values = categorical.values;
                            if (!_.isEmpty(values) && !values.grouped().some(function(vg) {
                                return !!vg.identity;
                            })) for (var categoryRoles = categories[0].source.roles, i = 0, len = dataViewMappings.length; len > i; i++) {
                                var roleMappingCategorical = dataViewMappings[i].categorical;
                                if (roleMappingCategorical && hasRolesGrouped(categoryRoles, roleMappingCategorical.values)) {
                                    var categoriesMapping = roleMappingCategorical.categories, hasCategoryRole = hasRolesBind(categoryRoles, categoriesMapping) || hasRolesFor(categoryRoles, categoriesMapping);
                                    return hasCategoryRole ? 2 : 1;
                                }
                            }
                        }
                    }
                }
                function shouldPivotMatrix(matrix, dataViewMappings) {
                    if (matrix && !_.isEmpty(dataViewMappings)) {
                        var rowLevels = matrix.rows.levels;
                        if (!(rowLevels.length < 1)) {
                            var rows = matrix.rows.root.children;
                            if (rows && 0 !== rows.length) for (var rowRoles = rowLevels[0].sources[0].roles, i = 0, len = dataViewMappings.length; len > i; i++) {
                                var roleMappingMatrix = dataViewMappings[i].matrix;
                                if (roleMappingMatrix && !hasRolesFor(rowRoles, roleMappingMatrix.rows) && hasRolesFor(rowRoles, roleMappingMatrix.columns)) return !0;
                            }
                        }
                    }
                }
                function hasRolesBind(roles, roleMapping) {
                    return roles && roleMapping && roleMapping.bind ? roles[roleMapping.bind.to] : void 0;
                }
                function hasRolesFor(roles, roleMapping) {
                    return roles && roleMapping && roleMapping["for"] ? roles[roleMapping["for"]["in"]] : void 0;
                }
                function hasRolesGrouped(roles, roleMapping) {
                    return roles && roleMapping && roleMapping.group ? roles[roleMapping.group.by] : void 0;
                }
                var fillRulePropertyDescriptor = {
                    type: {
                        fillRule: {}
                    }
                };
                DataViewTransform.apply = apply, DataViewTransform.transformObjects = transformObjects, 
                DataViewTransform.createValueColumns = createValueColumns, DataViewTransform.setGrouped = setGrouped;
            }(DataViewTransform = data.DataViewTransform || (data.DataViewTransform = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createDisplayNameGetter(displayNameKey) {
                return function(resourceProvider) {
                    return resourceProvider.get(displayNameKey);
                };
            }
            function getDisplayName(displayNameGetter, resourceProvider) {
                return "function" == typeof displayNameGetter ? displayNameGetter(resourceProvider) : "string" == typeof displayNameGetter ? displayNameGetter : void 0;
            }
            data.createDisplayNameGetter = createDisplayNameGetter, data.getDisplayName = getDisplayName;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        !function(DateTimeUnit) {
            DateTimeUnit[DateTimeUnit.Year = 0] = "Year", DateTimeUnit[DateTimeUnit.Month = 1] = "Month", 
            DateTimeUnit[DateTimeUnit.Week = 2] = "Week", DateTimeUnit[DateTimeUnit.Day = 3] = "Day", 
            DateTimeUnit[DateTimeUnit.Hour = 4] = "Hour", DateTimeUnit[DateTimeUnit.Minute = 5] = "Minute", 
            DateTimeUnit[DateTimeUnit.Second = 6] = "Second", DateTimeUnit[DateTimeUnit.Millisecond = 7] = "Millisecond";
        }(powerbi.DateTimeUnit || (powerbi.DateTimeUnit = {}));
        powerbi.DateTimeUnit;
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi), __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var SQExprBuilder;
            !function(SQExprBuilder) {
                function fieldExpr(fieldExpr) {
                    var sqExpr = FieldExprPattern.visit(fieldExpr, FieldExprToSQExprVisitor.instance);
                    return sqExpr;
                }
                function fromColumnAggr(columnAggr) {
                    return SQExprBuilder.aggregate(fromColumn(columnAggr), columnAggr.aggregate);
                }
                function fromColumn(column) {
                    return SQExprBuilder.columnRef(fromEntity(column), column.name);
                }
                function fromEntity(entityPattern) {
                    return SQExprBuilder.entity(entityPattern.schema, entityPattern.entity, entityPattern.entityVar);
                }
                function fromEntityAggr(entityAggr) {
                    return SQExprBuilder.aggregate(fromEntity(entityAggr), entityAggr.aggregate);
                }
                function fromHierarchyLevelAggr(hierarchyLevelAggr) {
                    return SQExprBuilder.aggregate(fromHierarchyLevel(hierarchyLevelAggr), hierarchyLevelAggr.aggregate);
                }
                function fromHierarchyLevel(hierarchyLevelPattern) {
                    return SQExprBuilder.hierarchyLevel(fromHierarchy(hierarchyLevelPattern), hierarchyLevelPattern.level);
                }
                function fromHierarchy(hierarchyPattern) {
                    return SQExprBuilder.hierarchy(fromEntity(hierarchyPattern), hierarchyPattern.name);
                }
                SQExprBuilder.fieldExpr = fieldExpr, SQExprBuilder.fromColumnAggr = fromColumnAggr, 
                SQExprBuilder.fromColumn = fromColumn, SQExprBuilder.fromEntity = fromEntity, SQExprBuilder.fromEntityAggr = fromEntityAggr, 
                SQExprBuilder.fromHierarchyLevelAggr = fromHierarchyLevelAggr, SQExprBuilder.fromHierarchyLevel = fromHierarchyLevel, 
                SQExprBuilder.fromHierarchy = fromHierarchy;
                var FieldExprToSQExprVisitor = function() {
                    function FieldExprToSQExprVisitor() {}
                    return FieldExprToSQExprVisitor.prototype.visitColumn = function(column) {
                        return fromColumn(column);
                    }, FieldExprToSQExprVisitor.prototype.visitColumnAggr = function(columnAggr) {
                        return fromColumnAggr(columnAggr);
                    }, FieldExprToSQExprVisitor.prototype.visitColumnHierarchyLevelVariation = function(columnHierarchyLevelVariationPattern) {
                        return SQExprBuilder.propertyVariationSource(this.visitEntity(columnHierarchyLevelVariationPattern.source), columnHierarchyLevelVariationPattern.source.name, columnHierarchyLevelVariationPattern.level.name);
                    }, FieldExprToSQExprVisitor.prototype.visitEntity = function(entityPattern) {
                        return fromEntity(entityPattern);
                    }, FieldExprToSQExprVisitor.prototype.visitEntityAggr = function(entityAggr) {
                        return fromEntityAggr(entityAggr);
                    }, FieldExprToSQExprVisitor.prototype.visitHierarchy = function(hierarchyPattern) {
                        return fromHierarchy(hierarchyPattern);
                    }, FieldExprToSQExprVisitor.prototype.visitHierarchyLevel = function(level) {
                        return fromHierarchyLevel(level);
                    }, FieldExprToSQExprVisitor.prototype.visitHierarchyLevelAggr = function(hierarchyLevelAggr) {
                        return fromHierarchyLevelAggr(hierarchyLevelAggr);
                    }, FieldExprToSQExprVisitor.prototype.visitMeasure = function(measure) {
                        return SQExprBuilder.measureRef(this.visitEntity(measure), measure.name);
                    }, FieldExprToSQExprVisitor.prototype.visitPercentile = function(percentile) {
                        var arg = SQExprBuilder.fieldExpr(percentile.arg);
                        return SQExprBuilder.percentile(arg, percentile.k, percentile.exclusive);
                    }, FieldExprToSQExprVisitor.prototype.visitPercentOfGrandTotal = function(percentOfGrandTotal) {
                        var baseSQExpr = SQExprBuilder.fieldExpr(percentOfGrandTotal.baseExpr);
                        return SQExprBuilder.arithmetic(baseSQExpr, SQExprBuilder.scopedEval(baseSQExpr, []), 3);
                    }, FieldExprToSQExprVisitor.prototype.visitSelectRef = function(selectRef) {
                        return SQExprBuilder.selectRef(selectRef.expressionName);
                    }, FieldExprToSQExprVisitor.instance = new FieldExprToSQExprVisitor(), FieldExprToSQExprVisitor;
                }();
            }(SQExprBuilder = data.SQExprBuilder || (data.SQExprBuilder = {}));
            var SQExprConverter;
            !function(SQExprConverter) {
                function asFieldPattern(sqExpr, schema) {
                    return sqExpr.accept(new FieldExprPatternBuilder(schema));
                }
                SQExprConverter.asFieldPattern = asFieldPattern;
            }(SQExprConverter = data.SQExprConverter || (data.SQExprConverter = {}));
            var FieldExprPattern, FieldExprPatternBuilder = function(_super) {
                function FieldExprPatternBuilder(schema) {
                    _super.call(this), this.schema = schema;
                }
                return __extends(FieldExprPatternBuilder, _super), FieldExprPatternBuilder.prototype.visitColumnRef = function(expr) {
                    var sourceRef = expr.source.accept(SourceExprPatternBuilder.instance);
                    if (sourceRef && sourceRef.entity) {
                        var columnRef = sourceRef.entity;
                        return columnRef.name = expr.ref, {
                            column: columnRef
                        };
                    }
                }, FieldExprPatternBuilder.prototype.visitMeasureRef = function(expr) {
                    var sourceRef = expr.source.accept(SourceExprPatternBuilder.instance);
                    if (sourceRef && sourceRef.entity) {
                        var measureRef = sourceRef.entity;
                        return measureRef.name = expr.ref, {
                            measure: measureRef
                        };
                    }
                }, FieldExprPatternBuilder.prototype.visitEntity = function(expr) {
                    var entityRef = {
                        schema: expr.schema,
                        entity: expr.entity
                    };
                    return expr.variable && (entityRef.entityVar = expr.variable), {
                        entity: entityRef
                    };
                }, FieldExprPatternBuilder.prototype.visitAggr = function(expr) {
                    var fieldPattern = expr.arg.accept(this);
                    if (fieldPattern && fieldPattern.column) {
                        var argAggr = fieldPattern.column;
                        return argAggr.aggregate = expr.func, {
                            columnAggr: argAggr
                        };
                    }
                    if (fieldPattern && fieldPattern.columnAggr) {
                        var argAggr = fieldPattern.columnAggr;
                        return argAggr.aggregate = expr.func, {
                            columnAggr: argAggr
                        };
                    }
                    if (fieldPattern && fieldPattern.hierarchyLevel) {
                        var argAggr = fieldPattern.hierarchyLevel;
                        return argAggr.aggregate = expr.func, {
                            hierarchyLevelAggr: argAggr
                        };
                    }
                    var sourcePattern = expr.arg.accept(SourceExprPatternBuilder.instance);
                    if (sourcePattern && sourcePattern.entity) {
                        var argAggr = sourcePattern.entity;
                        return argAggr.aggregate = expr.func, {
                            entityAggr: argAggr
                        };
                    }
                }, FieldExprPatternBuilder.prototype.visitPercentile = function(expr) {
                    return {
                        percentile: {
                            arg: expr.arg.accept(this),
                            k: expr.k,
                            exclusive: expr.exclusive
                        }
                    };
                }, FieldExprPatternBuilder.prototype.visitHierarchy = function(expr) {
                    var sourcePattern = expr.arg.accept(SourceExprPatternBuilder.instance);
                    if (sourcePattern && sourcePattern.entity) {
                        var hierarchyRef = sourcePattern.entity;
                        return hierarchyRef.name = expr.hierarchy, {
                            hierarchy: hierarchyRef
                        };
                    }
                }, FieldExprPatternBuilder.prototype.visitHierarchyLevel = function(expr) {
                    var hierarchySourceExprPattern = expr.arg.accept(HierarchyExprPatternBuiler.instance);
                    if (hierarchySourceExprPattern) {
                        var hierarchyLevel;
                        if (hierarchySourceExprPattern.hierarchy && (hierarchyLevel = {
                            entity: hierarchySourceExprPattern.hierarchy.entity,
                            schema: hierarchySourceExprPattern.hierarchy.schema,
                            name: hierarchySourceExprPattern.hierarchy.name,
                            level: expr.level
                        }), hierarchySourceExprPattern.variation) {
                            if (this.schema) {
                                var variation = hierarchySourceExprPattern.variation, conceptualEntity = this.schema.schema(hierarchySourceExprPattern.variation.column.schema).findTargetEntityOfVariation(hierarchyLevel.entity, variation.column.name, variation.variationName);
                                conceptualEntity && (hierarchyLevel.entity = conceptualEntity.name);
                            }
                            return {
                                columnHierarchyLevelVariation: {
                                    source: {
                                        entity: hierarchySourceExprPattern.variation.column.entity,
                                        schema: hierarchySourceExprPattern.variation.column.schema,
                                        name: hierarchySourceExprPattern.variation.column.name
                                    },
                                    level: hierarchyLevel,
                                    variationName: hierarchySourceExprPattern.variation.variationName
                                }
                            };
                        }
                        return {
                            hierarchyLevel: hierarchyLevel
                        };
                    }
                }, FieldExprPatternBuilder.prototype.visitArithmetic = function(expr) {
                    var percentOfGrandTotalPattern = {
                        percentOfGrandTotal: {
                            baseExpr: expr.left.accept(this)
                        }
                    };
                    return data.SQExpr.equals(expr, SQExprBuilder.fieldExpr(percentOfGrandTotalPattern)) ? percentOfGrandTotalPattern : void 0;
                }, FieldExprPatternBuilder.prototype.visitSelectRef = function(expr) {
                    return {
                        selectRef: {
                            expressionName: expr.expressionName
                        }
                    };
                }, FieldExprPatternBuilder;
            }(data.DefaultSQExprVisitor), SourceExprPatternBuilder = function(_super) {
                function SourceExprPatternBuilder() {
                    _super.apply(this, arguments);
                }
                return __extends(SourceExprPatternBuilder, _super), SourceExprPatternBuilder.prototype.visitEntity = function(expr) {
                    var entityRef = {
                        schema: expr.schema,
                        entity: expr.entity
                    };
                    return expr.variable && (entityRef.entityVar = expr.variable), {
                        entity: entityRef
                    };
                }, SourceExprPatternBuilder.prototype.visitPropertyVariationSource = function(expr) {
                    var entityExpr = expr.arg;
                    if (entityExpr instanceof data.SQEntityExpr) {
                        var propertyVariationSource = {
                            schema: entityExpr.schema,
                            entity: entityExpr.entity,
                            name: expr.property
                        };
                        return entityExpr.variable && (propertyVariationSource.entityVar = entityExpr.variable), 
                        {
                            variation: {
                                column: propertyVariationSource,
                                variationName: expr.name
                            }
                        };
                    }
                }, SourceExprPatternBuilder.instance = new SourceExprPatternBuilder(), SourceExprPatternBuilder;
            }(data.DefaultSQExprVisitor), HierarchyExprPatternBuiler = function(_super) {
                function HierarchyExprPatternBuiler() {
                    _super.apply(this, arguments);
                }
                return __extends(HierarchyExprPatternBuiler, _super), HierarchyExprPatternBuiler.prototype.visitHierarchy = function(expr) {
                    var hierarchyRef, variationRef, exprPattern = expr.arg.accept(SourceExprPatternBuilder.instance);
                    return exprPattern.variation ? (hierarchyRef = {
                        name: expr.hierarchy,
                        schema: exprPattern.variation.column.schema,
                        entity: exprPattern.variation.column.entity
                    }, variationRef = exprPattern.variation) : hierarchyRef = {
                        name: expr.hierarchy,
                        schema: exprPattern.entity.schema,
                        entity: exprPattern.entity.entity
                    }, {
                        hierarchy: hierarchyRef,
                        variation: variationRef
                    };
                }, HierarchyExprPatternBuiler.instance = new HierarchyExprPatternBuiler(), HierarchyExprPatternBuiler;
            }(data.DefaultSQExprVisitor);
            !function(FieldExprPattern) {
                function visit(expr, visitor) {
                    var fieldExprPattern = expr instanceof data.SQExpr ? SQExprConverter.asFieldPattern(expr) : expr;
                    return fieldExprPattern.column ? visitColumn(fieldExprPattern.column, visitor) : fieldExprPattern.columnAggr ? visitColumnAggr(fieldExprPattern.columnAggr, visitor) : fieldExprPattern.columnHierarchyLevelVariation ? visitColumnHierarchyLevelVariation(fieldExprPattern.columnHierarchyLevelVariation, visitor) : fieldExprPattern.entity ? visitEntity(fieldExprPattern.entity, visitor) : fieldExprPattern.entityAggr ? visitEntityAggr(fieldExprPattern.entityAggr, visitor) : fieldExprPattern.hierarchy ? visitHierarchy(fieldExprPattern.hierarchy, visitor) : fieldExprPattern.hierarchyLevel ? visitHierarchyLevel(fieldExprPattern.hierarchyLevel, visitor) : fieldExprPattern.hierarchyLevelAggr ? visitHierarchyLevelAggr(fieldExprPattern.hierarchyLevelAggr, visitor) : fieldExprPattern.measure ? visitMeasure(fieldExprPattern.measure, visitor) : fieldExprPattern.percentile ? visitPercentile(fieldExprPattern.percentile, visitor) : fieldExprPattern.percentOfGrandTotal ? visitPercentOfGrandTotal(fieldExprPattern.percentOfGrandTotal, visitor) : fieldExprPattern.selectRef ? visitSelectRef(fieldExprPattern.selectRef, visitor) : void 0;
                }
                function visitColumn(column, visitor) {
                    return visitor.visitColumn(column);
                }
                function visitColumnAggr(columnAggr, visitor) {
                    return visitor.visitColumnAggr(columnAggr);
                }
                function visitColumnHierarchyLevelVariation(columnHierarchyLevelVariation, visitor) {
                    return visitor.visitColumnHierarchyLevelVariation(columnHierarchyLevelVariation);
                }
                function visitEntity(entity, visitor) {
                    return visitor.visitEntity(entity);
                }
                function visitEntityAggr(entityAggr, visitor) {
                    return visitor.visitEntityAggr(entityAggr);
                }
                function visitHierarchy(hierarchy, visitor) {
                    return visitor.visitHierarchy(hierarchy);
                }
                function visitHierarchyLevel(hierarchyLevel, visitor) {
                    return visitor.visitHierarchyLevel(hierarchyLevel);
                }
                function visitHierarchyLevelAggr(hierarchyLevelAggr, visitor) {
                    return visitor.visitHierarchyLevelAggr(hierarchyLevelAggr);
                }
                function visitMeasure(measure, visitor) {
                    return visitor.visitMeasure(measure);
                }
                function visitSelectRef(selectRef, visitor) {
                    return visitor.visitSelectRef(selectRef);
                }
                function visitPercentile(percentile, visitor) {
                    return visitor.visitPercentile(percentile);
                }
                function visitPercentOfGrandTotal(percentOfGrandTotal, visitor) {
                    return visitor.visitPercentOfGrandTotal(percentOfGrandTotal);
                }
                function toColumnRefSQExpr(columnPattern) {
                    return SQExprBuilder.columnRef(SQExprBuilder.entity(columnPattern.schema, columnPattern.entity, columnPattern.entityVar), columnPattern.name);
                }
                function getAggregate(fieldExpr) {
                    return visit(fieldExpr, FieldExprPatternAggregateVisitor.instance);
                }
                function isAggregation(fieldExpr) {
                    return visit(fieldExpr, FieldExprPatternIsAggregationVisitor.instance);
                }
                function hasFieldExprName(fieldExpr) {
                    return void 0 !== (fieldExpr.column || fieldExpr.columnAggr || fieldExpr.measure);
                }
                function getPropertyName(fieldExpr) {
                    return FieldExprPattern.visit(fieldExpr, FieldExprPropertyNameVisitor.instance);
                }
                function getHierarchyName(fieldExpr) {
                    var hierarchy = fieldExpr.hierarchy;
                    return hierarchy ? hierarchy.name : void 0;
                }
                function getColumnRef(fieldExpr) {
                    return fieldExpr.columnHierarchyLevelVariation ? fieldExpr.columnHierarchyLevelVariation.source : fieldExpr.column || fieldExpr.measure || fieldExpr.columnAggr;
                }
                function getFieldExprName(fieldExpr) {
                    var name = getPropertyName(fieldExpr);
                    return name ? name : toFieldExprEntityPattern(fieldExpr).entity;
                }
                function getSchema(fieldExpr) {
                    var item = FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);
                    return item.schema;
                }
                function toFieldExprEntityPattern(fieldExpr) {
                    return FieldExprPattern.visit(fieldExpr, FieldExprToEntityExprPatternBuilder.instance);
                }
                function toFieldExprEntityItemPattern(fieldExpr) {
                    return FieldExprPattern.visit(fieldExpr, FieldExprToEntityExprPatternBuilder.instance);
                }
                FieldExprPattern.visit = visit, FieldExprPattern.toColumnRefSQExpr = toColumnRefSQExpr, 
                FieldExprPattern.getAggregate = getAggregate, FieldExprPattern.isAggregation = isAggregation, 
                FieldExprPattern.hasFieldExprName = hasFieldExprName, FieldExprPattern.getPropertyName = getPropertyName, 
                FieldExprPattern.getHierarchyName = getHierarchyName, FieldExprPattern.getColumnRef = getColumnRef, 
                FieldExprPattern.getFieldExprName = getFieldExprName, FieldExprPattern.getSchema = getSchema, 
                FieldExprPattern.toFieldExprEntityPattern = toFieldExprEntityPattern, FieldExprPattern.toFieldExprEntityItemPattern = toFieldExprEntityItemPattern;
                var FieldExprPatternAggregateVisitor = function() {
                    function FieldExprPatternAggregateVisitor() {}
                    return FieldExprPatternAggregateVisitor.prototype.visitColumn = function(column) {}, 
                    FieldExprPatternAggregateVisitor.prototype.visitColumnAggr = function(columnAggr) {
                        return columnAggr.aggregate;
                    }, FieldExprPatternAggregateVisitor.prototype.visitColumnHierarchyLevelVariation = function(columnHierarchyLevelVariation) {}, 
                    FieldExprPatternAggregateVisitor.prototype.visitEntity = function(entity) {}, FieldExprPatternAggregateVisitor.prototype.visitEntityAggr = function(entityAggr) {
                        return entityAggr.aggregate;
                    }, FieldExprPatternAggregateVisitor.prototype.visitHierarchy = function(hierarchy) {}, 
                    FieldExprPatternAggregateVisitor.prototype.visitHierarchyLevel = function(hierarchyLevel) {}, 
                    FieldExprPatternAggregateVisitor.prototype.visitHierarchyLevelAggr = function(hierarchyLevelAggr) {
                        return hierarchyLevelAggr.aggregate;
                    }, FieldExprPatternAggregateVisitor.prototype.visitMeasure = function(measure) {}, 
                    FieldExprPatternAggregateVisitor.prototype.visitSelectRef = function(selectRef) {}, 
                    FieldExprPatternAggregateVisitor.prototype.visitPercentile = function(percentile) {}, 
                    FieldExprPatternAggregateVisitor.prototype.visitPercentOfGrandTotal = function(percentOfGrandTotal) {
                        return data.SQExprInfo.getAggregate(SQExprBuilder.fieldExpr(percentOfGrandTotal.baseExpr));
                    }, FieldExprPatternAggregateVisitor.instance = new FieldExprPatternAggregateVisitor(), 
                    FieldExprPatternAggregateVisitor;
                }(), FieldExprPatternIsAggregationVisitor = function() {
                    function FieldExprPatternIsAggregationVisitor() {}
                    return FieldExprPatternIsAggregationVisitor.prototype.visitColumn = function(column) {
                        return !1;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitColumnAggr = function(columnAggr) {
                        return !0;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitColumnHierarchyLevelVariation = function(columnHierarchyLevelVariation) {
                        return !1;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitEntity = function(entity) {
                        return !1;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitEntityAggr = function(entityAggr) {
                        return !0;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitHierarchy = function(hierarchy) {
                        return !1;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitHierarchyLevel = function(hierarchyLevel) {
                        return !1;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitHierarchyLevelAggr = function(hierarchyLevelAggr) {
                        return !0;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitMeasure = function(measure) {
                        return !0;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitSelectRef = function(selectRef) {
                        return !1;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitPercentile = function(percentile) {
                        return !0;
                    }, FieldExprPatternIsAggregationVisitor.prototype.visitPercentOfGrandTotal = function(percentOfGrandTotal) {
                        return !0;
                    }, FieldExprPatternIsAggregationVisitor.instance = new FieldExprPatternIsAggregationVisitor(), 
                    FieldExprPatternIsAggregationVisitor;
                }(), FieldExprToEntityExprPatternBuilder = function() {
                    function FieldExprToEntityExprPatternBuilder() {}
                    return FieldExprToEntityExprPatternBuilder.prototype.visitColumn = function(column) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(column);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitColumnAggr = function(columnAggr) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(columnAggr);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitColumnHierarchyLevelVariation = function(columnHierarchyLevelVariation) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(columnHierarchyLevelVariation.source);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitEntity = function(entity) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(entity);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitEntityAggr = function(entityAggr) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(entityAggr);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitHierarchy = function(hierarchy) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(hierarchy);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitHierarchyLevel = function(hierarchyLevel) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(hierarchyLevel);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitHierarchyLevelAggr = function(hierarchyLevelAggr) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(hierarchyLevelAggr);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitMeasure = function(measure) {
                        return FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern(measure);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitSelectRef = function(selectRef) {}, 
                    FieldExprToEntityExprPatternBuilder.prototype.visitPercentile = function(percentile) {
                        return FieldExprPattern.visit(percentile.arg, this);
                    }, FieldExprToEntityExprPatternBuilder.prototype.visitPercentOfGrandTotal = function(percentOfGrandTotal) {
                        return FieldExprPattern.visit(percentOfGrandTotal.baseExpr, this);
                    }, FieldExprToEntityExprPatternBuilder.toEntityItemExprPattern = function(exprPattern) {
                        var pattern = {
                            schema: exprPattern.schema,
                            entity: exprPattern.entity
                        };
                        return exprPattern.entityVar && (pattern.entityVar = exprPattern.entityVar), pattern;
                    }, FieldExprToEntityExprPatternBuilder.instance = new FieldExprToEntityExprPatternBuilder(), 
                    FieldExprToEntityExprPatternBuilder;
                }(), FieldExprPropertyNameVisitor = function() {
                    function FieldExprPropertyNameVisitor() {}
                    return FieldExprPropertyNameVisitor.prototype.visitColumn = function(column) {
                        return column.name;
                    }, FieldExprPropertyNameVisitor.prototype.visitColumnAggr = function(columnAggr) {
                        return columnAggr.name;
                    }, FieldExprPropertyNameVisitor.prototype.visitColumnHierarchyLevelVariation = function(columnHierarchyLevelVariation) {}, 
                    FieldExprPropertyNameVisitor.prototype.visitEntity = function(entity) {}, FieldExprPropertyNameVisitor.prototype.visitEntityAggr = function(entityAggr) {}, 
                    FieldExprPropertyNameVisitor.prototype.visitHierarchy = function(hierarchy) {}, 
                    FieldExprPropertyNameVisitor.prototype.visitHierarchyLevel = function(hierarchyLevel) {}, 
                    FieldExprPropertyNameVisitor.prototype.visitHierarchyLevelAggr = function(hierarchyLevelAggr) {}, 
                    FieldExprPropertyNameVisitor.prototype.visitMeasure = function(measure) {
                        return measure.name;
                    }, FieldExprPropertyNameVisitor.prototype.visitSelectRef = function(selectRef) {}, 
                    FieldExprPropertyNameVisitor.prototype.visitPercentile = function(percentile) {
                        return FieldExprPattern.visit(percentile.arg, this);
                    }, FieldExprPropertyNameVisitor.prototype.visitPercentOfGrandTotal = function(percentOfGrandTotal) {
                        return FieldExprPattern.visit(percentOfGrandTotal.baseExpr, this);
                    }, FieldExprPropertyNameVisitor.instance = new FieldExprPropertyNameVisitor(), FieldExprPropertyNameVisitor;
                }();
            }(FieldExprPattern = data.FieldExprPattern || (data.FieldExprPattern = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var DataViewAnalysis;
        !function(DataViewAnalysis) {
            function validateAndReshape(dataView, dataViewMappings) {
                if (!dataViewMappings || 0 === dataViewMappings.length) return {
                    dataView: dataView,
                    isValid: !0
                };
                if (dataView) for (var _i = 0, dataViewMappings_1 = dataViewMappings; _i < dataViewMappings_1.length; _i++) {
                    var dataViewMapping = dataViewMappings_1[_i];
                    if (supports(dataView, dataViewMapping)) return {
                        dataView: dataView,
                        isValid: !0
                    };
                    if (dataViewMapping.categorical && dataView.categorical) return reshapeCategorical(dataView, dataViewMapping);
                    if (dataViewMapping.tree && dataView.tree) return reshapeTree(dataView, dataViewMapping.tree);
                    if (dataViewMapping.single && dataView.single) return reshapeSingle(dataView, dataViewMapping.single);
                    if (dataViewMapping.table && dataView.table) return reshapeTable(dataView, dataViewMapping.table);
                } else if (powerbi.ScriptResultUtil.findScriptResult(dataViewMappings)) return {
                    dataView: dataView,
                    isValid: !0
                };
                return {
                    isValid: !1
                };
            }
            function reshapeCategorical(dataView, dataViewMapping) {
                var categoryRoleMapping = dataViewMapping.categorical, categorical = dataView.categorical;
                if (!categorical) return {
                    isValid: !1
                };
                var rowCount;
                if (categoryRoleMapping.rowCount && (rowCount = categoryRoleMapping.rowCount.supported, 
                rowCount && rowCount.max)) {
                    var updated = void 0, categories = categorical.categories, maxRowCount = rowCount.max, originalLength = void 0;
                    if (categories) for (var i = 0, len = categories.length; len > i; i++) {
                        var category = categories[i];
                        if (originalLength = category.values.length, void 0 !== maxRowCount && originalLength > maxRowCount) {
                            var updatedCategories = ArrayExtensions.range(category.values, 0, maxRowCount - 1);
                            updated = updated || {
                                categories: []
                            }, updated.categories.push({
                                source: category.source,
                                values: updatedCategories
                            });
                        }
                    }
                    if (categorical.values && categorical.values.length > 0 && maxRowCount && (originalLength || (originalLength = categorical.values[0].values.length), 
                    void 0 !== maxRowCount && originalLength > maxRowCount)) {
                        updated = updated || {}, updated.values = powerbi.data.DataViewTransform.createValueColumns();
                        for (var i = 0, len = categorical.values.length; len > i; i++) {
                            var column = categorical.values[i], updatedColumn = {
                                source: column.source,
                                values: ArrayExtensions.range(column.values, 0, maxRowCount - 1)
                            };
                            void 0 !== column.min && (updatedColumn.min = column.min), void 0 !== column.max && (updatedColumn.max = column.max), 
                            void 0 !== column.subtotal && (updatedColumn.subtotal = column.subtotal), updated.values.push(updatedColumn);
                        }
                    }
                    updated && (dataView = {
                        metadata: dataView.metadata,
                        categorical: updated
                    });
                }
                return supportsCategorical(dataView, dataViewMapping) ? {
                    dataView: dataView,
                    isValid: !0
                } : null;
            }
            function reshapeSingle(dataView, singleRoleMapping) {
                return dataView.single ? {
                    dataView: dataView,
                    isValid: !0
                } : {
                    isValid: !1
                };
            }
            function reshapeTree(dataView, treeRoleMapping) {
                var metadata = dataView.metadata;
                return null == validateRange(countGroups(metadata.columns), treeRoleMapping.depth) ? {
                    dataView: dataView,
                    isValid: !0
                } : {
                    isValid: !1
                };
            }
            function reshapeTable(dataView, tableRoleMapping) {
                return dataView.table ? {
                    dataView: dataView,
                    isValid: !0
                } : {
                    isValid: !1
                };
            }
            function countGroups(columns) {
                for (var count = 0, i = 0, len = columns.length; len > i; i++) columns[i].isMeasure || ++count;
                return count;
            }
            function countMeasures(columns) {
                for (var count = 0, i = 0, len = columns.length; len > i; i++) columns[i].isMeasure && ++count;
                return count;
            }
            function supports(dataView, roleMapping, usePreferredDataViewSchema) {
                return roleMapping && dataView ? roleMapping.scriptResult && !supportsScriptResult(dataView.scriptResult, roleMapping.scriptResult) ? !1 : roleMapping.categorical && !supportsCategorical(dataView, roleMapping.categorical, usePreferredDataViewSchema) ? !1 : roleMapping.tree && !supportsTree(dataView, roleMapping.tree) ? !1 : roleMapping.single && !supportsSingle(dataView.single, roleMapping.single) ? !1 : !roleMapping.table || supportsTable(dataView.table, roleMapping.table, usePreferredDataViewSchema) : !1;
            }
            function supportsCategorical(dataView, categoryRoleMapping, usePreferredDataViewSchema) {
                var dataViewCategorical = dataView.categorical;
                if (!dataViewCategorical) return !1;
                if (categoryRoleMapping.rowCount) {
                    var rowCount = categoryRoleMapping.rowCount.supported;
                    if (usePreferredDataViewSchema && categoryRoleMapping.rowCount.preferred && (rowCount = categoryRoleMapping.rowCount.preferred), 
                    rowCount) {
                        var len = 0;
                        if (dataViewCategorical.values && dataViewCategorical.values.length ? len = dataViewCategorical.values[0].values.length : dataViewCategorical.categories && dataViewCategorical.categories.length && (len = dataViewCategorical.categories[0].values.length), 
                        null != validateRange(len, rowCount)) return !1;
                    }
                }
                return !0;
            }
            function supportsSingle(dataViewSingle, singleRoleMapping) {
                return !!dataViewSingle;
            }
            function supportsTree(dataView, treeRoleMapping) {
                var metadata = dataView.metadata;
                return null == validateRange(countGroups(metadata.columns), treeRoleMapping.depth);
            }
            function supportsTable(dataViewTable, tableRoleMapping, usePreferredDataViewSchema) {
                if (!dataViewTable) return !1;
                if (tableRoleMapping.rowCount) {
                    var rowCount = tableRoleMapping.rowCount.supported;
                    if (usePreferredDataViewSchema && tableRoleMapping.rowCount.preferred && (rowCount = tableRoleMapping.rowCount.preferred), 
                    rowCount) {
                        var len = 0;
                        if (dataViewTable.rows && dataViewTable.rows.length && (len = dataViewTable.rows.length), 
                        null != validateRange(len, rowCount)) return !1;
                    }
                }
                return !0;
            }
            function supportsScriptResult(dataView, scriptResultRoleMapping) {
                return dataView ? !!dataView.imageBase64 : !1;
            }
            function validateRange(value, roleCondition, ignoreMin) {
                return roleCondition ? !ignoreMin && void 0 !== roleCondition.min && roleCondition.min > value ? DataViewMappingMatchErrorCode.conditionRangeTooSmall : void 0 !== roleCondition.max && roleCondition.max < value ? DataViewMappingMatchErrorCode.conditionRangeTooLarge : void 0 : void 0;
            }
            function validateKind(roleCondition, roleName, projections, roleKindByQueryRef) {
                if (roleCondition && void 0 !== roleCondition.kind) {
                    var expectedKind = roleCondition.kind, roleCollection = projections[roleName];
                    if (roleCollection) for (var roleProjections = roleCollection.all(), _i = 0, roleProjections_1 = roleProjections; _i < roleProjections_1.length; _i++) {
                        var roleProjection = roleProjections_1[_i];
                        if (roleKindByQueryRef[roleProjection.queryRef] !== expectedKind) switch (expectedKind) {
                          case powerbi.VisualDataRoleKind.Measure:
                            return DataViewMappingMatchErrorCode.conditionKindExpectedMeasure;

                          case powerbi.VisualDataRoleKind.Grouping:
                            return DataViewMappingMatchErrorCode.conditionKindExpectedGrouping;

                          case powerbi.VisualDataRoleKind.GroupingOrMeasure:
                            return DataViewMappingMatchErrorCode.conditionKindExpectedGroupingOrMeasure;
                        }
                    }
                }
            }
            function chooseDataViewMappings(projections, mappings, roleKindByQueryRef, objectDescriptors, objectDefinitions) {
                var supportedMappings = [], errors = [];
                if (!_.isEmpty(mappings)) for (var mappingIndex = 0, mappingCount = mappings.length; mappingCount > mappingIndex; mappingIndex++) {
                    var mapping = mappings[mappingIndex], mappingConditions = mapping.conditions, requiredProperties = mapping.requiredProperties, allPropertiesValid = areAllPropertiesValid(requiredProperties, objectDescriptors, objectDefinitions), conditionsMet = [];
                    if (_.isEmpty(mappingConditions)) conditionsMet.push({}); else for (var conditionIndex = 0, conditionCount = mappingConditions.length; conditionCount > conditionIndex; conditionIndex++) {
                        var condition = mappingConditions[conditionIndex], currentConditionErrors = checkForConditionErrors(projections, condition, roleKindByQueryRef);
                        if (_.isEmpty(currentConditionErrors)) conditionsMet.push(condition); else for (var _i = 0, currentConditionErrors_1 = currentConditionErrors; _i < currentConditionErrors_1.length; _i++) {
                            var error = currentConditionErrors_1[_i];
                            error.mappingIndex = mappingIndex, error.conditionIndex = conditionIndex, errors.push(error);
                        }
                    }
                    if (!_.isEmpty(conditionsMet) && allPropertiesValid) {
                        var supportedMapping = _.cloneDeep(mapping), updatedConditions = _.filter(conditionsMet, function(condition) {
                            return Object.keys(condition).length > 0;
                        });
                        _.isEmpty(updatedConditions) || (supportedMapping.conditions = updatedConditions), 
                        supportedMappings.push(supportedMapping);
                    }
                }
                return {
                    supportedMappings: ArrayExtensions.emptyToNull(supportedMappings),
                    mappingErrors: ArrayExtensions.emptyToNull(errors)
                };
            }
            function checkForConditionErrors(projections, condition, roleKindByQueryRef) {
                for (var conditionRoles = Object.keys(condition), errors = [], i = 0, len = conditionRoles.length; len > i; i++) {
                    var roleName = conditionRoles[i], isDrillable = projections[roleName] && !_.isEmpty(projections[roleName].activeProjectionRefs), roleCondition = condition[roleName], roleCount = getPropertyCount(roleName, projections, isDrillable), rangeError = validateRange(roleCount, roleCondition);
                    null != rangeError && errors.push({
                        code: rangeError,
                        roleName: roleName
                    });
                    var kindError = validateKind(roleCondition, roleName, projections, roleKindByQueryRef);
                    null != kindError && errors.push({
                        code: kindError,
                        roleName: roleName
                    });
                }
                return errors;
            }
            function areAllPropertiesValid(requiredProperties, objectDescriptors, objectDefinitions) {
                if (_.isEmpty(requiredProperties)) return !0;
                if (!objectDescriptors || !objectDefinitions) return !1;
                var staticEvalContext = powerbi.data.createStaticEvalContext();
                return _.every(requiredProperties, function(requiredProperty) {
                    var objectDescriptorValue = null, objectDescriptorProperty = objectDescriptors[requiredProperty.objectName];
                    objectDescriptorProperty && (objectDescriptorValue = objectDescriptorProperty.properties[requiredProperty.propertyName]);
                    var objectDefinitionValue = DataViewObjectDefinitions.getValue(objectDefinitions, requiredProperty, null);
                    return objectDescriptorValue && objectDefinitionValue ? powerbi.data.DataViewObjectEvaluator.evaluateProperty(staticEvalContext, objectDescriptorValue, objectDefinitionValue) : !1;
                });
            }
            function getPropertyCount(roleName, projections, useActiveIfAvailable) {
                var projectionsForRole = projections[roleName];
                return projectionsForRole ? useActiveIfAvailable ? 1 : projectionsForRole.all().length : 0;
            }
            function hasSameCategoryIdentity(dataView1, dataView2) {
                if (dataView1 && dataView2 && dataView1.categorical && dataView2.categorical) {
                    var dv1Categories = dataView1.categorical.categories, dv2Categories = dataView2.categorical.categories;
                    if (dv1Categories && dv2Categories && dv1Categories.length === dv2Categories.length) {
                        for (var i = 0, len = dv1Categories.length; len > i; i++) {
                            var dv1Identity = dv1Categories[i].identity, dv2Identity = dv2Categories[i].identity, dv1Length = getLengthOptional(dv1Identity);
                            if (dv1Length !== getLengthOptional(dv2Identity)) return !1;
                            for (var j = 0; dv1Length > j; j++) if (!powerbi.DataViewScopeIdentity.equals(dv1Identity[j], dv2Identity[j])) return !1;
                        }
                        return !0;
                    }
                }
                return !1;
            }
            function getLengthOptional(identity) {
                return identity ? identity.length : 0;
            }
            function areMetadataColumnsEquivalent(column1, column2) {
                return column1 || column2 ? column1 && column2 ? column1.displayName !== column2.displayName ? !1 : column1.queryName !== column2.queryName ? !1 : column1.isMeasure !== column2.isMeasure ? !1 : column1.type !== column2.type ? !1 : column1.sort === column2.sort : !1 : !0;
            }
            function isMetadataEquivalent(metadata1, metadata2) {
                if (!metadata1 && !metadata2) return !0;
                if (!metadata1 || !metadata2) return !1;
                var previousColumnsLength = metadata1.columns.length, newColumnsLength = metadata2.columns.length;
                if (previousColumnsLength !== newColumnsLength) return !1;
                for (var i = 0; newColumnsLength > i; i++) if (!DataViewAnalysis.areMetadataColumnsEquivalent(metadata1.columns[i], metadata2.columns[i])) return !1;
                return !0;
            }
            var ArrayExtensions = jsCommon.ArrayExtensions, DataViewObjectDefinitions = powerbi.data.DataViewObjectDefinitions;
            !function(DataViewMappingMatchErrorCode) {
                DataViewMappingMatchErrorCode[DataViewMappingMatchErrorCode.conditionRangeTooLarge = 0] = "conditionRangeTooLarge", 
                DataViewMappingMatchErrorCode[DataViewMappingMatchErrorCode.conditionRangeTooSmall = 1] = "conditionRangeTooSmall", 
                DataViewMappingMatchErrorCode[DataViewMappingMatchErrorCode.conditionKindExpectedMeasure = 2] = "conditionKindExpectedMeasure", 
                DataViewMappingMatchErrorCode[DataViewMappingMatchErrorCode.conditionKindExpectedGrouping = 3] = "conditionKindExpectedGrouping", 
                DataViewMappingMatchErrorCode[DataViewMappingMatchErrorCode.conditionKindExpectedGroupingOrMeasure = 4] = "conditionKindExpectedGroupingOrMeasure";
            }(DataViewAnalysis.DataViewMappingMatchErrorCode || (DataViewAnalysis.DataViewMappingMatchErrorCode = {}));
            var DataViewMappingMatchErrorCode = DataViewAnalysis.DataViewMappingMatchErrorCode;
            DataViewAnalysis.validateAndReshape = validateAndReshape, DataViewAnalysis.countGroups = countGroups, 
            DataViewAnalysis.countMeasures = countMeasures, DataViewAnalysis.supports = supports, 
            DataViewAnalysis.validateRange = validateRange, DataViewAnalysis.chooseDataViewMappings = chooseDataViewMappings, 
            DataViewAnalysis.getPropertyCount = getPropertyCount, DataViewAnalysis.hasSameCategoryIdentity = hasSameCategoryIdentity, 
            DataViewAnalysis.areMetadataColumnsEquivalent = areMetadataColumnsEquivalent, DataViewAnalysis.isMetadataEquivalent = isMetadataEquivalent;
        }(DataViewAnalysis = powerbi.DataViewAnalysis || (powerbi.DataViewAnalysis = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewRoleWildcard, ArrayExtensions = jsCommon.ArrayExtensions, Lazy = jsCommon.Lazy;
            !function(DataViewRoleWildcard) {
                function fromRoles(roles) {
                    return new DataViewRoleWildcardImpl(roles);
                }
                function equals(firstRoleWildcard, secondRoleWildcard) {
                    return firstRoleWildcard.key && secondRoleWildcard.key && firstRoleWildcard.key === secondRoleWildcard.key && ArrayExtensions.sequenceEqual(firstRoleWildcard.roles, secondRoleWildcard.roles, function(role1, role2) {
                        return role1 === role2;
                    });
                }
                DataViewRoleWildcard.fromRoles = fromRoles, DataViewRoleWildcard.equals = equals;
                var DataViewRoleWildcardImpl = function() {
                    function DataViewRoleWildcardImpl(roles) {
                        var _this = this;
                        this._roles = roles, this._key = new Lazy(function() {
                            return JSON.stringify(_this.roles);
                        });
                    }
                    return Object.defineProperty(DataViewRoleWildcardImpl.prototype, "roles", {
                        get: function() {
                            return this._roles;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(DataViewRoleWildcardImpl.prototype, "key", {
                        get: function() {
                            return this._key.getValue();
                        },
                        enumerable: !0,
                        configurable: !0
                    }), DataViewRoleWildcardImpl;
                }();
            }(DataViewRoleWildcard = data.DataViewRoleWildcard || (data.DataViewRoleWildcard = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var DataViewScopeIdentity;
        !function(DataViewScopeIdentity) {
            function equals(x, y, ignoreCase) {
                return x = x || null, y = y || null, x === y ? !0 : !x != !y ? !1 : data.SQExpr.equals(x.expr, y.expr, ignoreCase);
            }
            function filterFromIdentity(identities, isNot) {
                if (!_.isEmpty(identities)) {
                    for (var exprs = [], _i = 0, identities_1 = identities; _i < identities_1.length; _i++) {
                        var identity = identities_1[_i];
                        exprs.push(identity.expr);
                    }
                    return filterFromExprs(exprs, isNot);
                }
            }
            function filterFromExprs(orExprs, isNot) {
                if (!_.isEmpty(orExprs)) {
                    for (var resultExpr, _i = 0, orExprs_1 = orExprs; _i < orExprs_1.length; _i++) {
                        var orExpr = orExprs_1[_i], inExpr = data.ScopeIdentityExtractor.getInExpr(orExpr);
                        resultExpr = resultExpr ? data.SQExprBuilder.or(resultExpr, inExpr) : inExpr || orExpr;
                    }
                    return resultExpr && isNot && (resultExpr = powerbi.data.SQExprBuilder.not(resultExpr)), 
                    powerbi.data.SemanticFilter.fromSQExpr(resultExpr);
                }
            }
            DataViewScopeIdentity.equals = equals, DataViewScopeIdentity.filterFromIdentity = filterFromIdentity, 
            DataViewScopeIdentity.filterFromExprs = filterFromExprs;
        }(DataViewScopeIdentity = powerbi.DataViewScopeIdentity || (powerbi.DataViewScopeIdentity = {}));
        var data;
        !function(data) {
            function createDataViewScopeIdentity(expr) {
                return new DataViewScopeIdentityImpl(expr);
            }
            var Lazy = jsCommon.Lazy;
            data.createDataViewScopeIdentity = createDataViewScopeIdentity;
            var DataViewScopeIdentityImpl = function() {
                function DataViewScopeIdentityImpl(expr) {
                    this._expr = expr, this._key = new Lazy(function() {
                        return data.SQExprShortSerializer.serialize(expr);
                    });
                }
                return Object.defineProperty(DataViewScopeIdentityImpl.prototype, "expr", {
                    get: function() {
                        return this._expr;
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(DataViewScopeIdentityImpl.prototype, "key", {
                    get: function() {
                        return this._key.getValue();
                    },
                    enumerable: !0,
                    configurable: !0
                }), DataViewScopeIdentityImpl;
            }();
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewScopeWildcard, Lazy = jsCommon.Lazy;
            !function(DataViewScopeWildcard) {
                function matches(wildcard, instance) {
                    var instanceExprs = data.ScopeIdentityExtractor.getKeys(instance.expr);
                    return instanceExprs ? data.SQExprUtils.sequenceEqual(wildcard.exprs, instanceExprs) : !1;
                }
                function equals(firstScopeWildcard, secondScopeWildcard) {
                    return firstScopeWildcard.key === secondScopeWildcard.key && data.SQExprUtils.sequenceEqual(firstScopeWildcard.exprs, secondScopeWildcard.exprs);
                }
                function fromExprs(exprs) {
                    return new DataViewScopeWildcardImpl(exprs);
                }
                DataViewScopeWildcard.matches = matches, DataViewScopeWildcard.equals = equals, 
                DataViewScopeWildcard.fromExprs = fromExprs;
                var DataViewScopeWildcardImpl = function() {
                    function DataViewScopeWildcardImpl(exprs) {
                        this._exprs = exprs, this._key = new Lazy(function() {
                            return data.SQExprShortSerializer.serializeArray(exprs);
                        });
                    }
                    return Object.defineProperty(DataViewScopeWildcardImpl.prototype, "exprs", {
                        get: function() {
                            return this._exprs;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(DataViewScopeWildcardImpl.prototype, "key", {
                        get: function() {
                            return this._key.getValue();
                        },
                        enumerable: !0,
                        configurable: !0
                    }), DataViewScopeWildcardImpl;
                }();
            }(DataViewScopeWildcard = data.DataViewScopeWildcard || (data.DataViewScopeWildcard = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createColorAllocatorCache() {
                return new ColorAllocatorProvider();
            }
            data.createColorAllocatorCache = createColorAllocatorCache;
            var ColorAllocatorProvider = function() {
                function ColorAllocatorProvider() {
                    this.cache = [];
                }
                return ColorAllocatorProvider.prototype.get = function(key) {
                    for (var _i = 0, _a = this.cache; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        if (entry.key === key) return entry.allocator;
                    }
                }, ColorAllocatorProvider.prototype.register = function(key, colorAllocator) {
                    return this.cache.push({
                        key: key,
                        allocator: colorAllocator
                    }), this;
                }, ColorAllocatorProvider;
            }();
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    window.jsCommon, window.powerbi, window.powerbitests, window.InJs, window.debug, 
    window.jasmine, window.Microsoft;
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewRegression, DataViewMapping = powerbi.DataViewMapping;
            !function(DataViewRegression) {
                function run(options) {
                    var visualDataViews = options.visualDataViews, dataRoles = options.dataRoles, objectDescriptors = options.objectDescriptors, objectDefinitions = options.objectDefinitions, colorAllocatorFactory = options.colorAllocatorFactory, transformSelects = options.transformSelects, applicableDataViewMappings = options.applicableDataViewMappings, roleKindByQueryRef = options.roleKindByQueryRef, queryProjectionsByRole = options.queryProjectionsByRole;
                    if (!_.isEmpty(visualDataViews) && transformSelects) {
                        if (!roleKindByQueryRef || !queryProjectionsByRole || _.isEmpty(applicableDataViewMappings) || !objectDescriptors || !objectDefinitions) return visualDataViews;
                        var regressionDataViewMapping = _.find(applicableDataViewMappings, function(dataViewMapping) {
                            return !!DataViewMapping.getRegressionUsage(dataViewMapping);
                        });
                        if (regressionDataViewMapping) {
                            for (var regressionDataViews = [], _i = 0, visualDataViews_1 = visualDataViews; _i < visualDataViews_1.length; _i++) {
                                var visualDataView = visualDataViews_1[_i], regressionDataView = this.linearRegressionTransform(visualDataView, dataRoles, regressionDataViewMapping, objectDescriptors, objectDefinitions, colorAllocatorFactory);
                                regressionDataView && regressionDataViews.push(regressionDataView);
                            }
                            _.isEmpty(regressionDataViews) || visualDataViews.push.apply(visualDataViews, regressionDataViews);
                        }
                    }
                    return visualDataViews;
                }
                function linearRegressionTransform(sourceDataView, dataRoles, regressionDataViewMapping, objectDescriptors, objectDefinitions, colorAllocatorFactory) {
                    if (sourceDataView.categorical) {
                        var xColumns = getColumnsForCartesianRoleKind(0, sourceDataView.categorical, dataRoles), yColumns = getColumnsForCartesianRoleKind(1, sourceDataView.categorical, dataRoles);
                        if (!_.isEmpty(xColumns) && !_.isEmpty(yColumns)) {
                            var xColumnSource = xColumns[0].source, yColumnSource = yColumns[0].source, combineSeries = !0, regressionUsage = DataViewMapping.getRegressionUsage(regressionDataViewMapping);
                            if (regressionUsage && sourceDataView.metadata.objects) {
                                var combineSeriesPropertyId = regressionUsage.combineSeries;
                                combineSeriesPropertyId && (combineSeries = powerbi.DataViewObjects.getValue(sourceDataView.metadata.objects, combineSeriesPropertyId, !0));
                            }
                            var dataPointsBySeries = getDataPointsBySeries(xColumns, yColumns, combineSeries, !1), lineDefSet = calculateLineDefinitions(dataPointsBySeries);
                            if (lineDefSet) {
                                var highlightsLineDefSet, xMin = lineDefSet.xMin, xMax = lineDefSet.xMax, shouldComputeHightlights = hasHighlightValues(yColumns) || hasHighlightValues(xColumns);
                                if (shouldComputeHightlights) {
                                    var highlightDataPointsBySeries = getDataPointsBySeries(xColumns, yColumns, combineSeries, !0);
                                    highlightsLineDefSet = calculateLineDefinitions(highlightDataPointsBySeries), highlightsLineDefSet ? (xMin = _.min([ xMin, highlightsLineDefSet.xMin ]), 
                                    xMax = _.max([ xMax, highlightsLineDefSet.xMax ])) : shouldComputeHightlights = !1;
                                }
                                for (var valuesByTrend = [], _i = 0, _a = lineDefSet.lineDefs; _i < _a.length; _i++) {
                                    var trend = _a[_i];
                                    valuesByTrend.push(computeLineYValues(trend, +xMin, +xMax));
                                }
                                var highlightsByTrend;
                                if (shouldComputeHightlights) {
                                    highlightsByTrend = [];
                                    for (var _b = 0, _c = highlightsLineDefSet.lineDefs; _b < _c.length; _b++) {
                                        var trend = _c[_b];
                                        highlightsByTrend.push(computeLineYValues(trend, +xMin, +xMax));
                                    }
                                }
                                var groupValues;
                                if (combineSeries) groupValues = [ "combinedRegressionSeries" ]; else if (sourceDataView.categorical.values.source) {
                                    var groups = sourceDataView.categorical.values.grouped();
                                    groupValues = _.map(groups, function(group) {
                                        return group.name;
                                    });
                                } else groupValues = _.map(yColumns, function(column) {
                                    return column.source.queryName;
                                });
                                var regressionDataView = createRegressionDataView(xColumnSource, yColumnSource, groupValues, [ xMin, xMax ], valuesByTrend, highlightsByTrend, sourceDataView, regressionDataViewMapping, objectDescriptors, objectDefinitions, colorAllocatorFactory);
                                return regressionDataView;
                            }
                        }
                    }
                }
                function calculateLineDefinitions(dataPointsBySeries) {
                    for (var xMin, xMax, lineDefs = [], _i = 0, dataPointsBySeries_1 = dataPointsBySeries; _i < dataPointsBySeries_1.length; _i++) {
                        var dataPointSet = dataPointsBySeries_1[_i], unsortedXValues = dataPointSet.xValues, unsortedYValues = dataPointSet.yValues;
                        if (_.isEmpty(unsortedXValues) || _.isEmpty(unsortedYValues)) return;
                        var xDataType = getDataType(unsortedXValues);
                        if (!xDataType) return;
                        var yDataType = getDataType(unsortedYValues);
                        if (!yDataType) return;
                        var sortedDataPointSet = sortValues(unsortedXValues, unsortedYValues), minCategoryValue = sortedDataPointSet.xValues[0], maxCategoryValue = sortedDataPointSet.xValues[sortedDataPointSet.xValues.length - 1], lineDef = computeRegressionLine(sortedDataPointSet.xValues, sortedDataPointSet.yValues);
                        xMin = _.min([ xMin, minCategoryValue ]), xMax = _.max([ xMax, maxCategoryValue ]), 
                        lineDefs.push(lineDef);
                    }
                    return {
                        lineDefs: lineDefs,
                        xMin: xMin,
                        xMax: xMax
                    };
                }
                function getColumnsForCartesianRoleKind(roleKind, categorical, roles) {
                    var columns = getColumnsWithRoleKind(roleKind, categorical.values, roles);
                    if (!_.isEmpty(columns)) return columns;
                    var categories = categorical.categories;
                    if (!_.isEmpty(categories)) {
                        var categoryColumn = categories[0];
                        return columns = getColumnsWithRoleKind(roleKind, [ categoryColumn ], roles), _.isEmpty(columns) ? void 0 : columns;
                    }
                }
                function getColumnsWithRoleKind(roleKind, columns, roles) {
                    return _.isEmpty(columns) ? void 0 : _.filter(columns, function(column) {
                        var _loop_1 = function(roleName) {
                            if (!column.source.roles[roleName]) return "continue";
                            var role = _.find(roles, function(role) {
                                return role.name === roleName;
                            });
                            return role && role.cartesianKind === roleKind ? {
                                value: !0
                            } : void 0;
                        };
                        for (var roleName in column.source.roles) {
                            var state_1 = _loop_1(roleName);
                            if ("object" == typeof state_1) return state_1.value;
                        }
                        return !1;
                    });
                }
                function getDataType(values) {
                    var firstNonNull = _.find(values, function(value) {
                        return null != value;
                    });
                    if (null != firstNonNull) {
                        var dataType = typeof firstNonNull;
                        if (!_.some(values, function(value) {
                            return null != value && typeof value !== dataType;
                        })) return dataType;
                    }
                }
                function sortValues(unsortedXValues, unsortedYValues) {
                    var zippedValues = _.zip(unsortedXValues, unsortedYValues), _a = _.chain(zippedValues).filter(function(valuePair) {
                        return null != valuePair[0] && null != valuePair[1];
                    }).sortBy(function(valuePair) {
                        return valuePair[0];
                    }).unzip().value(), xValues = _a[0], yValues = _a[1];
                    return {
                        xValues: xValues,
                        yValues: yValues
                    };
                }
                function computeRegressionLine(xValues, yValues) {
                    var xBar = _.sum(xValues) / xValues.length, yBar = _.sum(yValues) / yValues.length, ssXX = _.chain(xValues).map(function(x) {
                        return Math.pow(x - xBar, 2);
                    }).sum(), ssXY = _.chain(xValues).map(function(x, i) {
                        return (x - xBar) * (yValues[i] - yBar);
                    }).sum(), slope = ssXY / ssXX, intercept = yBar - xBar * slope;
                    return {
                        slope: slope,
                        intercept: intercept
                    };
                }
                function computeLineYValues(lineDef, x1, x2) {
                    return [ x1 * lineDef.slope + lineDef.intercept, x2 * lineDef.slope + lineDef.intercept ];
                }
                function getValuesFromColumn(column, preferHighlights) {
                    if (preferHighlights) {
                        var valueColumn = column;
                        if (valueColumn.highlights) return valueColumn.highlights;
                    }
                    return column.values;
                }
                function getDataPointsBySeries(xColumns, yColumns, combineSeries, preferHighlights) {
                    for (var dataPointsBySeries = [], xValueArray = _.map(xColumns, function(column) {
                        return getValuesFromColumn(column, preferHighlights);
                    }), seriesYValues = _.map(yColumns, function(column) {
                        return getValuesFromColumn(column, preferHighlights);
                    }), multipleXValueColumns = xColumns.length > 1, i = 0; i < seriesYValues.length; i++) {
                        var xValues = multipleXValueColumns ? xValueArray[i] : xValueArray[0], yValues = seriesYValues[i];
                        combineSeries && dataPointsBySeries.length > 0 ? (dataPointsBySeries[0].xValues = dataPointsBySeries[0].xValues.concat(xValues), 
                        dataPointsBySeries[0].yValues = dataPointsBySeries[0].yValues.concat(yValues)) : dataPointsBySeries.push({
                            xValues: xValues,
                            yValues: yValues
                        });
                    }
                    return dataPointsBySeries;
                }
                function createRegressionDataView(xColumnSource, yColumnSource, groupValues, categories, values, highlights, sourceDataView, regressionDataViewMapping, objectDescriptors, objectDefinitions, colorAllocatorFactory) {
                    var yRole, seriesRole, xRole = regressionDataViewMapping.categorical.categories["for"]["in"], grouped = regressionDataViewMapping.categorical.values.group;
                    if (grouped && !_.isEmpty(grouped.select) && (yRole = grouped.select[0]["for"] ? grouped.select[0]["for"]["in"] : grouped.select[0].bind.to, 
                    seriesRole = grouped.by), yRole && seriesRole) {
                        var categoricalRoles = (_a = {}, _a[xRole] = !0, _a), valueRoles = (_b = {}, _b[yRole] = !0, 
                        _b), seriesRoles = (_c = {}, _c[seriesRole] = !0, _c), valuesBySeries = [];
                        for (var index in values) {
                            var seriesData = {
                                values: values[index]
                            };
                            highlights && (seriesData.highlights = highlights[index]), valuesBySeries.push([ seriesData ]);
                        }
                        var regressionDataView = data.createCategoricalDataViewBuilder().withCategory({
                            source: {
                                displayName: xColumnSource.displayName,
                                queryName: regressionXQueryName,
                                type: xColumnSource.type,
                                isMeasure: !1,
                                roles: categoricalRoles
                            },
                            values: categories,
                            identityFrom: {
                                fields: [ data.SQExprBuilder.columnRef(data.SQExprBuilder.entity("s", "RegressionEntity"), "RegressionCategories") ]
                            }
                        }).withGroupedValues({
                            groupColumn: {
                                source: {
                                    displayName: yColumnSource.displayName + "Regression",
                                    queryName: regressionSeriesQueryName,
                                    type: yColumnSource.type,
                                    isMeasure: yColumnSource.isMeasure,
                                    roles: seriesRoles
                                },
                                values: groupValues,
                                identityFrom: {
                                    fields: [ data.SQExprBuilder.columnRef(data.SQExprBuilder.entity("s", "RegressionEntity"), "RegressionSeries") ]
                                }
                            },
                            valueColumns: [ {
                                source: {
                                    displayName: yColumnSource.displayName,
                                    queryName: DataViewRegression.regressionYQueryName,
                                    type: yColumnSource.type,
                                    isMeasure: yColumnSource.isMeasure,
                                    roles: valueRoles
                                }
                            } ],
                            data: valuesBySeries
                        }).build();
                        return data.DataViewTransform.transformObjects(regressionDataView, 1, objectDescriptors, objectDefinitions, [], colorAllocatorFactory), 
                        regressionDataView;
                        var _a, _b, _c;
                    }
                }
                function hasHighlightValues(columns) {
                    return _.any(columns, function(column) {
                        var valueColumn = column;
                        return null != valueColumn.highlights;
                    });
                }
                var regressionXQueryName = "RegressionX", regressionSeriesQueryName = "RegressionSeries";
                DataViewRegression.regressionYQueryName = "RegressionY", DataViewRegression.run = run, 
                DataViewRegression.linearRegressionTransform = linearRegressionTransform;
            }(DataViewRegression = data.DataViewRegression || (data.DataViewRegression = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var DataViewSelectTransform;
            !function(DataViewSelectTransform) {
                function projectionsFromSelects(selects, projectionActiveItems) {
                    if (_.isEmpty(selects)) return {};
                    for (var projections = {}, _i = 0, selects_1 = selects; _i < selects_1.length; _i++) {
                        var select = selects_1[_i];
                        if (select) {
                            var roles = select.roles;
                            if (roles) for (var roleName in roles) if (roles[roleName]) {
                                var qp = projections[roleName];
                                qp || (qp = projections[roleName] = new data.QueryProjectionCollection([])), qp.all().push({
                                    queryRef: select.queryName
                                }), projectionActiveItems && projectionActiveItems[roleName] && (qp.activeProjectionRefs = _.map(projectionActiveItems[roleName], function(activeItem) {
                                    return activeItem.queryRef;
                                }));
                            }
                        }
                    }
                    return projections;
                }
                function createRoleKindFromMetadata(selects, metadata) {
                    for (var roleKindByQueryRef = {}, _i = 0, _a = metadata.columns; _i < _a.length; _i++) {
                        var column = _a[_i];
                        if (!(!column.index && 0 !== column.index || column.index < 0 || column.index >= selects.length)) {
                            var select = selects[column.index];
                            if (select) {
                                var queryRef = select.queryName;
                                queryRef && void 0 === roleKindByQueryRef[queryRef] && (roleKindByQueryRef[queryRef] = column.isMeasure ? powerbi.VisualDataRoleKind.Measure : powerbi.VisualDataRoleKind.Grouping);
                            }
                        }
                    }
                    return roleKindByQueryRef;
                }
                DataViewSelectTransform.projectionsFromSelects = projectionsFromSelects, DataViewSelectTransform.createRoleKindFromMetadata = createRoleKindFromMetadata;
            }(DataViewSelectTransform = data.DataViewSelectTransform || (data.DataViewSelectTransform = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createCategoricalEvalContext(colorAllocatorProvider, dataViewCategorical, selectTransforms) {
                return new CategoricalEvalContext(colorAllocatorProvider, dataViewCategorical, selectTransforms);
            }
            function findRuleInputColumn(dataViewCategorical, inputRole) {
                return findRuleInputInColumns(dataViewCategorical.values, inputRole) || findRuleInputInColumns(dataViewCategorical.categories, inputRole);
            }
            function findRuleInputInColumns(columns, inputRole) {
                if (columns) for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                    var column = columns_1[_i], roles = column.source.roles;
                    if (roles && roles[inputRole]) return column;
                }
            }
            function findValueColumn(columns, selectIdx) {
                if (columns) for (var _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
                    var column = columns_2[_i];
                    if (!column.identity && column.source.index === selectIdx) return column;
                }
            }
            data.createCategoricalEvalContext = createCategoricalEvalContext;
            var CategoricalEvalContext = function() {
                function CategoricalEvalContext(colorAllocatorProvider, dataView, selectTransforms) {
                    this.colorAllocatorProvider = colorAllocatorProvider, this.dataView = dataView, 
                    this.selectTransforms = selectTransforms, this.columnsByRole = {};
                }
                return CategoricalEvalContext.prototype.getColorAllocator = function(expr) {
                    return this.colorAllocatorProvider.get(expr);
                }, CategoricalEvalContext.prototype.getExprValue = function(expr) {
                    var rowIdx = this.index;
                    if (_.isNumber(rowIdx)) {
                        var selectTransforms = this.selectTransforms;
                        if (selectTransforms) {
                            var selectIdx = data.findSelectIndex(expr, selectTransforms);
                            if (-1 !== selectIdx) {
                                var dataView = this.dataView, column = findValueColumn(dataView.values, selectIdx);
                                if (column) return column.values[rowIdx];
                            }
                        }
                    }
                }, CategoricalEvalContext.prototype.getRoleValue = function(roleName) {
                    var columnsByRole = this.columnsByRole, column = columnsByRole[roleName];
                    if (column || (column = columnsByRole[roleName] = findRuleInputColumn(this.dataView, roleName)), 
                    column) {
                        var index = this.index;
                        return null != index ? column.values[this.index] : void 0;
                    }
                }, CategoricalEvalContext.prototype.setCurrentRowIndex = function(index) {
                    this.index = index;
                }, CategoricalEvalContext;
            }();
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createTableEvalContext(colorAllocatorProvider, dataViewTable, selectTransforms) {
                return new TableEvalContext(colorAllocatorProvider, dataViewTable, selectTransforms);
            }
            data.createTableEvalContext = createTableEvalContext;
            var TableEvalContext = function() {
                function TableEvalContext(colorAllocatorProvider, dataView, selectTransforms) {
                    this.colorAllocatorProvider = colorAllocatorProvider, this.dataView = dataView, 
                    this.selectTransforms = selectTransforms;
                }
                return TableEvalContext.prototype.getColorAllocator = function(expr) {
                    return this.colorAllocatorProvider.get(expr);
                }, TableEvalContext.prototype.getExprValue = function(expr) {
                    var rowIdx = this.rowIdx;
                    if (null != rowIdx) return data.getExprValueFromTable(expr, this.selectTransforms, this.dataView, rowIdx);
                }, TableEvalContext.prototype.getRoleValue = function(roleName) {}, TableEvalContext.prototype.setCurrentRowIndex = function(index) {
                    this.rowIdx = index;
                }, TableEvalContext;
            }();
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var RuleEvaluation = function() {
                function RuleEvaluation() {}
                return RuleEvaluation.prototype.evaluate = function(evalContext) {}, RuleEvaluation;
            }();
            data.RuleEvaluation = RuleEvaluation;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi), __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var ColorRuleEvaluation = function(_super) {
                function ColorRuleEvaluation(inputRole, allocator) {
                    _super.call(this), this.inputRole = inputRole, this.allocator = allocator;
                }
                return __extends(ColorRuleEvaluation, _super), ColorRuleEvaluation.prototype.evaluate = function(evalContext) {
                    var value = evalContext.getRoleValue(this.inputRole);
                    return void 0 !== value ? this.allocator.color(value) : void 0;
                }, ColorRuleEvaluation;
            }(data.RuleEvaluation);
            data.ColorRuleEvaluation = ColorRuleEvaluation;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var ConceptualSchema = function() {
                function ConceptualSchema() {}
                return ConceptualSchema.prototype.findProperty = function(entityName, propertyName) {
                    var entity = this.entities.withName(entityName);
                    if (entity && !_.isEmpty(entity.properties)) return entity.properties.withName(propertyName);
                }, ConceptualSchema.prototype.findHierarchy = function(entityName, name) {
                    var entity = this.entities.withName(entityName);
                    if (entity && !_.isEmpty(entity.hierarchies)) return entity.hierarchies.withName(name);
                }, ConceptualSchema.prototype.findHierarchyByVariation = function(variationEntityName, variationColumnName, variationName, hierarchyName) {
                    var targetEntity = this.findTargetEntityOfVariation(variationEntityName, variationColumnName, variationName);
                    if (targetEntity && !_.isEmpty(targetEntity.hierarchies)) return targetEntity.hierarchies.withName(hierarchyName);
                }, ConceptualSchema.prototype.findTargetEntityOfVariation = function(variationEntityName, variationColumnName, variationName) {
                    var variationEntity = this.entities.withName(variationEntityName);
                    if (variationEntity && !_.isEmpty(variationEntity.properties)) {
                        var variationProperty = variationEntity.properties.withName(variationColumnName);
                        if (variationProperty) {
                            var variationColumn = variationProperty.column;
                            if (variationColumn && !_.isEmpty(variationColumn.variations)) {
                                var variation = variationColumn.variations.withName(variationName);
                                return variation ? variation.navigationProperty ? variation.navigationProperty.targetEntity : variationEntity : void 0;
                            }
                        }
                    }
                }, ConceptualSchema.prototype.findPropertyWithKpi = function(entityName, kpiProperty) {
                    var entity = this.entities.withName(entityName);
                    if (entity && !_.isEmpty(entity.properties)) for (var _i = 0, _a = entity.properties; _i < _a.length; _i++) {
                        var prop = _a[_i];
                        if (prop && prop.measure && prop.measure.kpi && (prop.measure.kpi.status === kpiProperty || prop.measure.kpi.goal === kpiProperty)) return prop;
                    }
                }, ConceptualSchema;
            }();
            data.ConceptualSchema = ConceptualSchema, function(ConceptualDataCategory) {
                ConceptualDataCategory[ConceptualDataCategory.None = 0] = "None", ConceptualDataCategory[ConceptualDataCategory.Address = 1] = "Address", 
                ConceptualDataCategory[ConceptualDataCategory.City = 2] = "City", ConceptualDataCategory[ConceptualDataCategory.Company = 3] = "Company", 
                ConceptualDataCategory[ConceptualDataCategory.Continent = 4] = "Continent", ConceptualDataCategory[ConceptualDataCategory.Country = 5] = "Country", 
                ConceptualDataCategory[ConceptualDataCategory.County = 6] = "County", ConceptualDataCategory[ConceptualDataCategory.Date = 7] = "Date", 
                ConceptualDataCategory[ConceptualDataCategory.Image = 8] = "Image", ConceptualDataCategory[ConceptualDataCategory.ImageUrl = 9] = "ImageUrl", 
                ConceptualDataCategory[ConceptualDataCategory.Latitude = 10] = "Latitude", ConceptualDataCategory[ConceptualDataCategory.Longitude = 11] = "Longitude", 
                ConceptualDataCategory[ConceptualDataCategory.Organization = 12] = "Organization", 
                ConceptualDataCategory[ConceptualDataCategory.Place = 13] = "Place", ConceptualDataCategory[ConceptualDataCategory.PostalCode = 14] = "PostalCode", 
                ConceptualDataCategory[ConceptualDataCategory.Product = 15] = "Product", ConceptualDataCategory[ConceptualDataCategory.StateOrProvince = 16] = "StateOrProvince", 
                ConceptualDataCategory[ConceptualDataCategory.WebUrl = 17] = "WebUrl";
            }(data.ConceptualDataCategory || (data.ConceptualDataCategory = {}));
            data.ConceptualDataCategory;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var ScriptResultUtil, StringExtensions = jsCommon.StringExtensions, FieldExprPattern = powerbi.data.FieldExprPattern;
        !function(ScriptResultUtil) {
            function findScriptResult(dataViewMappings) {
                return dataViewMappings && 1 === dataViewMappings.length ? dataViewMappings[0].scriptResult : void 0;
            }
            function extractScriptResult(dataViewMappings) {
                var scriptResult = findScriptResult(dataViewMappings);
                if (scriptResult) {
                    var objects = dataViewMappings[0].metadata.objects, source = powerbi.DataViewObjects.getValue(objects, scriptResult.script.source), provider = powerbi.DataViewObjects.getValue(objects, scriptResult.script.provider);
                    return {
                        source: source,
                        provider: provider
                    };
                }
            }
            function extractScriptResultFromVisualConfig(dataViewMappings, objects) {
                var scriptResult = findScriptResult(dataViewMappings);
                if (scriptResult && objects) {
                    var scriptSource = powerbi.data.DataViewObjectDefinitions.getValue(objects, scriptResult.script.source, null), provider = powerbi.data.DataViewObjectDefinitions.getValue(objects, scriptResult.script.provider, null);
                    return {
                        source: scriptSource ? scriptSource.value : null,
                        provider: provider ? provider.value : null
                    };
                }
            }
            function getScriptInput(projections, selects, schema) {
                var scriptInput = {
                    VariableName: "dataset",
                    Columns: []
                };
                if (projections && selects && !_.isEmpty(selects)) {
                    var scriptInputColumnNames = [], scriptInputColumns = [];
                    for (var role in projections) for (var _i = 0, _a = projections[role].all(); _i < _a.length; _i++) {
                        var projection = _a[_i], select = selects.withName(projection.queryRef);
                        if (select) {
                            var scriptInputColumn = {
                                QueryName: select.name,
                                Name: FieldExprPattern.visit(select.expr, new ScriptInputColumnNameVisitor(schema))
                            };
                            scriptInputColumns.push(scriptInputColumn), scriptInputColumnNames.push(scriptInputColumn.Name);
                        }
                    }
                    scriptInputColumnNames = StringExtensions.ensureUniqueNames(scriptInputColumnNames);
                    for (var i = 0; i < scriptInputColumnNames.length; i++) {
                        var scriptInputColumn = scriptInputColumns[i];
                        scriptInputColumn.Name = scriptInputColumnNames[i];
                    }
                    scriptInput.Columns = scriptInputColumns;
                }
                return scriptInput;
            }
            ScriptResultUtil.findScriptResult = findScriptResult, ScriptResultUtil.extractScriptResult = extractScriptResult, 
            ScriptResultUtil.extractScriptResultFromVisualConfig = extractScriptResultFromVisualConfig, 
            ScriptResultUtil.getScriptInput = getScriptInput;
            var ScriptInputColumnNameVisitor = function() {
                function ScriptInputColumnNameVisitor(federatedSchema) {
                    this.federatedSchema = federatedSchema;
                }
                return ScriptInputColumnNameVisitor.prototype.visitColumn = function(column) {
                    return ScriptInputColumnNameVisitor.getNameForProperty(column, this.federatedSchema);
                }, ScriptInputColumnNameVisitor.prototype.visitColumnAggr = function(columnAggr) {
                    return ScriptInputColumnNameVisitor.getNameForProperty(columnAggr, this.federatedSchema);
                }, ScriptInputColumnNameVisitor.prototype.visitColumnHierarchyLevelVariation = function(columnHierarchyLevelVariation) {
                    return ScriptInputColumnNameVisitor.getVariationLevelName(columnHierarchyLevelVariation, this.federatedSchema);
                }, ScriptInputColumnNameVisitor.prototype.visitEntity = function(entity) {
                    return entity.entity;
                }, ScriptInputColumnNameVisitor.prototype.visitEntityAggr = function(entityAggr) {
                    return entityAggr.entity;
                }, ScriptInputColumnNameVisitor.prototype.visitHierarchy = function(hierarchy) {
                    return ScriptInputColumnNameVisitor.getNameForHierarchy(hierarchy, this.federatedSchema);
                }, ScriptInputColumnNameVisitor.prototype.visitHierarchyLevel = function(hierarchyLevel) {}, 
                ScriptInputColumnNameVisitor.prototype.visitHierarchyLevelAggr = function(hierarchyLevelAggr) {
                    return ScriptInputColumnNameVisitor.getNameForProperty(hierarchyLevelAggr, this.federatedSchema);
                }, ScriptInputColumnNameVisitor.prototype.visitMeasure = function(measure) {
                    return ScriptInputColumnNameVisitor.getNameForProperty(measure, this.federatedSchema);
                }, ScriptInputColumnNameVisitor.prototype.visitSelectRef = function(selectRef) {
                    return FieldExprPattern.visit(selectRef, this);
                }, ScriptInputColumnNameVisitor.prototype.visitPercentile = function(percentile) {
                    return FieldExprPattern.visit(percentile.arg, this);
                }, ScriptInputColumnNameVisitor.prototype.visitPercentOfGrandTotal = function(percentOfGrandTotal) {
                    return FieldExprPattern.visit(percentOfGrandTotal.baseExpr, this);
                }, ScriptInputColumnNameVisitor.getNameForHierarchy = function(pattern, federatedScheam) {
                    var schema = federatedScheam.schema(pattern.schema), hierarchy = schema.findHierarchy(pattern.entity, pattern.name);
                    return hierarchy ? hierarchy.name : void 0;
                }, ScriptInputColumnNameVisitor.getNameForProperty = function(pattern, federatedSchema) {
                    var schema = federatedSchema.schema(pattern.schema), property = schema.findProperty(pattern.entity, pattern.name);
                    return property ? property.name : void 0;
                }, ScriptInputColumnNameVisitor.getVariationLevelName = function(pattern, federatedSchema) {
                    var source = pattern.source, prop = federatedSchema.schema(source.schema).findProperty(source.entity, source.name);
                    if (prop) for (var variations = prop.column.variations, _i = 0, variations_1 = variations; _i < variations_1.length; _i++) {
                        var variation = variations_1[_i];
                        if (variation.name === pattern.variationName) for (var _a = 0, _b = variation.defaultHierarchy.levels; _a < _b.length; _a++) {
                            var level = _b[_a];
                            if (level.name === pattern.level.level) return level.column.name;
                        }
                    }
                }, ScriptInputColumnNameVisitor;
            }();
        }(ScriptResultUtil = powerbi.ScriptResultUtil || (powerbi.ScriptResultUtil = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var segmentation;
            !function(segmentation) {
                var DataViewMerger;
                !function(DataViewMerger) {
                    function mergeDataViews(source, segment) {
                        !powerbi.DataViewAnalysis.isMetadataEquivalent(source.metadata, segment.metadata), 
                        segment.metadata.segment || delete source.metadata.segment, source.table && segment.table && mergeTables(source.table, segment.table), 
                        source.categorical && segment.categorical && mergeCategorical(source.categorical, segment.categorical), 
                        source.tree && segment.tree && mergeTreeNodes(source.tree.root, segment.tree.root, !0), 
                        source.matrix && segment.matrix && mergeTreeNodes(source.matrix.rows.root, segment.matrix.rows.root, !1);
                    }
                    function mergeTables(source, segment) {
                        if (!_.isEmpty(segment.rows)) {
                            var mergeIndex = segment.lastMergeIndex + 1;
                            merge(source.rows, segment.rows, mergeIndex), segment.identity && merge(source.identity, segment.identity, mergeIndex);
                        }
                    }
                    function mergeCategorical(source, segment) {
                        if (source.categories && segment.categories) for (var segmentCategoriesLength = segment.categories.length, categoryIndex = 0; segmentCategoriesLength > categoryIndex; categoryIndex++) {
                            var segmentCategory = segment.categories[categoryIndex], sourceCategory = source.categories[categoryIndex], mergeIndex = segment.lastMergeIndex + 1;
                            segmentCategory.values && merge(sourceCategory.values, segmentCategory.values, mergeIndex), 
                            segmentCategory.identity && merge(sourceCategory.identity, segmentCategory.identity, mergeIndex);
                        }
                        if (source.values && segment.values) for (var segmentValuesLength = segment.values.length, valueIndex = 0; segmentValuesLength > valueIndex; valueIndex++) {
                            var segmentValue = segment.values[valueIndex], sourceValue = source.values[valueIndex];
                            !sourceValue.values && segmentValue.values && (sourceValue.values = []);
                            var mergeIndex = segment.lastMergeIndex + 1;
                            segmentValue.values && merge(sourceValue.values, segmentValue.values, mergeIndex), 
                            segmentValue.highlights && merge(sourceValue.highlights, segmentValue.highlights, mergeIndex);
                        }
                    }
                    function merge(source, segment, index) {
                        if (index >= segment.length) return segment;
                        var result = [];
                        return void 0 !== index && (result = segment.splice(0, index)), Array.prototype.push.apply(source, segment), 
                        result;
                    }
                    function mergeTreeNodes(sourceRoot, segmentRoot, allowDifferentStructure) {
                        if (segmentRoot.children && 0 !== segmentRoot.children.length) {
                            if (allowDifferentStructure && (!sourceRoot.children || 0 === sourceRoot.children.length)) return void (sourceRoot.children = segmentRoot.children);
                            var firstAppendIndex = findFirstAppendIndex(segmentRoot.children), lastSourceChild = sourceRoot.children[sourceRoot.children.length - 1], mergedChildren = merge(sourceRoot.children, segmentRoot.children, firstAppendIndex);
                            mergedChildren.length > 0 && mergeTreeNodes(lastSourceChild, mergedChildren[mergedChildren.length - 1], allowDifferentStructure);
                        }
                    }
                    function findFirstAppendIndex(children) {
                        if (0 === children.length) return 0;
                        for (var i = 0; i < children.length; i++) {
                            var childSegment = children[i];
                            if (!childSegment.isMerge) break;
                        }
                        return i;
                    }
                    DataViewMerger.mergeDataViews = mergeDataViews, DataViewMerger.mergeTables = mergeTables, 
                    DataViewMerger.mergeCategorical = mergeCategorical, DataViewMerger.mergeTreeNodes = mergeTreeNodes;
                }(DataViewMerger = segmentation.DataViewMerger || (segmentation.DataViewMerger = {}));
            }(segmentation = data.segmentation || (data.segmentation = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var ArrayExtensions = jsCommon.ArrayExtensions, SQExprRewriter = function() {
                function SQExprRewriter() {}
                return SQExprRewriter.prototype.visitColumnRef = function(expr) {
                    var origArg = expr.source, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? expr : new data.SQColumnRefExpr(rewrittenArg, expr.ref);
                }, SQExprRewriter.prototype.visitMeasureRef = function(expr) {
                    var origArg = expr.source, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? expr : new data.SQMeasureRefExpr(rewrittenArg, expr.ref);
                }, SQExprRewriter.prototype.visitAggr = function(expr) {
                    var origArg = expr.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? expr : new data.SQAggregationExpr(rewrittenArg, expr.func);
                }, SQExprRewriter.prototype.visitSelectRef = function(expr) {
                    return expr;
                }, SQExprRewriter.prototype.visitPercentile = function(expr) {
                    var origArg = expr.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? expr : new data.SQPercentileExpr(rewrittenArg, expr.k, expr.exclusive);
                }, SQExprRewriter.prototype.visitHierarchy = function(expr) {
                    var origArg = expr.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? expr : new data.SQHierarchyExpr(rewrittenArg, expr.hierarchy);
                }, SQExprRewriter.prototype.visitHierarchyLevel = function(expr) {
                    var origArg = expr.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? expr : new data.SQHierarchyLevelExpr(rewrittenArg, expr.level);
                }, SQExprRewriter.prototype.visitPropertyVariationSource = function(expr) {
                    var origArg = expr.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? expr : new data.SQPropertyVariationSourceExpr(rewrittenArg, expr.name, expr.property);
                }, SQExprRewriter.prototype.visitEntity = function(expr) {
                    return expr;
                }, SQExprRewriter.prototype.visitAnd = function(orig) {
                    var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                    return origLeft === rewrittenLeft && origRight === rewrittenRight ? orig : new data.SQAndExpr(rewrittenLeft, rewrittenRight);
                }, SQExprRewriter.prototype.visitBetween = function(orig) {
                    var origArg = orig.arg, rewrittenArg = origArg.accept(this), origLower = orig.lower, rewrittenLower = origLower.accept(this), origUpper = orig.upper, rewrittenUpper = origUpper.accept(this);
                    return origArg === rewrittenArg && origLower === rewrittenLower && origUpper === rewrittenUpper ? orig : new data.SQBetweenExpr(rewrittenArg, rewrittenLower, rewrittenUpper);
                }, SQExprRewriter.prototype.visitIn = function(orig) {
                    for (var rewrittenValues, origArgs = orig.args, rewrittenArgs = this.rewriteAll(origArgs), origValues = orig.values, i = 0, len = origValues.length; len > i; i++) {
                        var origValueTuple = origValues[i], rewrittenValueTuple = this.rewriteAll(origValueTuple);
                        origValueTuple === rewrittenValueTuple || rewrittenValues || (rewrittenValues = ArrayExtensions.take(origValues, i)), 
                        rewrittenValues && rewrittenValues.push(rewrittenValueTuple);
                    }
                    return origArgs !== rewrittenArgs || rewrittenValues ? new data.SQInExpr(rewrittenArgs, rewrittenValues || origValues) : orig;
                }, SQExprRewriter.prototype.rewriteAll = function(origExprs) {
                    for (var rewrittenResult, i = 0, len = origExprs.length; len > i; i++) {
                        var origExpr = origExprs[i], rewrittenExpr = origExpr.accept(this);
                        origExpr === rewrittenExpr || rewrittenResult || (rewrittenResult = ArrayExtensions.take(origExprs, i)), 
                        rewrittenResult && rewrittenResult.push(rewrittenExpr);
                    }
                    return rewrittenResult || origExprs;
                }, SQExprRewriter.prototype.visitOr = function(orig) {
                    var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                    return origLeft === rewrittenLeft && origRight === rewrittenRight ? orig : new data.SQOrExpr(rewrittenLeft, rewrittenRight);
                }, SQExprRewriter.prototype.visitCompare = function(orig) {
                    var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                    return origLeft === rewrittenLeft && origRight === rewrittenRight ? orig : new data.SQCompareExpr(orig.comparison, rewrittenLeft, rewrittenRight);
                }, SQExprRewriter.prototype.visitContains = function(orig) {
                    var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                    return origLeft === rewrittenLeft && origRight === rewrittenRight ? orig : new data.SQContainsExpr(rewrittenLeft, rewrittenRight);
                }, SQExprRewriter.prototype.visitExists = function(orig) {
                    var origArg = orig.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? orig : new data.SQExistsExpr(rewrittenArg);
                }, SQExprRewriter.prototype.visitNot = function(orig) {
                    var origArg = orig.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? orig : new data.SQNotExpr(rewrittenArg);
                }, SQExprRewriter.prototype.visitStartsWith = function(orig) {
                    var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                    return origLeft === rewrittenLeft && origRight === rewrittenRight ? orig : new data.SQStartsWithExpr(rewrittenLeft, rewrittenRight);
                }, SQExprRewriter.prototype.visitConstant = function(expr) {
                    return expr;
                }, SQExprRewriter.prototype.visitDateSpan = function(orig) {
                    var origArg = orig.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? orig : new data.SQDateSpanExpr(orig.unit, rewrittenArg);
                }, SQExprRewriter.prototype.visitDateAdd = function(orig) {
                    var origArg = orig.arg, rewrittenArg = origArg.accept(this);
                    return origArg === rewrittenArg ? orig : new data.SQDateAddExpr(orig.unit, orig.amount, rewrittenArg);
                }, SQExprRewriter.prototype.visitNow = function(orig) {
                    return orig;
                }, SQExprRewriter.prototype.visitDefaultValue = function(orig) {
                    return orig;
                }, SQExprRewriter.prototype.visitAnyValue = function(orig) {
                    return orig;
                }, SQExprRewriter.prototype.visitArithmetic = function(orig) {
                    var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                    return origLeft === rewrittenLeft && origRight === rewrittenRight ? orig : new data.SQArithmeticExpr(rewrittenLeft, rewrittenRight, orig.operator);
                }, SQExprRewriter.prototype.visitScopedEval = function(orig) {
                    var origExpression = orig.expression, rewrittenExpression = origExpression.accept(this), origScope = orig.scope, rewrittenScope = this.rewriteAll(origScope);
                    return origExpression === rewrittenExpression && origScope === rewrittenScope ? orig : new data.SQScopedEvalExpr(rewrittenExpression, rewrittenScope);
                }, SQExprRewriter.prototype.visitWithRef = function(orig) {
                    return orig;
                }, SQExprRewriter.prototype.visitTransformTableRef = function(orig) {
                    return orig;
                }, SQExprRewriter.prototype.visitTransformOutputRoleRef = function(orig) {
                    return orig;
                }, SQExprRewriter.prototype.visitFillRule = function(orig) {
                    var origInput = orig.input, rewrittenInput = origInput.accept(this), origRule = orig.rule, origGradient2 = origRule.linearGradient2, rewrittenGradient2 = origGradient2;
                    origGradient2 && (rewrittenGradient2 = this.visitLinearGradient2(origGradient2));
                    var origGradient3 = origRule.linearGradient3, rewrittenGradient3 = origGradient3;
                    if (origGradient3 && (rewrittenGradient3 = this.visitLinearGradient3(origGradient3)), 
                    origInput !== rewrittenInput || origGradient2 !== rewrittenGradient2 || origGradient3 !== rewrittenGradient3) {
                        var rewrittenRule = {};
                        return rewrittenGradient2 && (rewrittenRule.linearGradient2 = rewrittenGradient2), 
                        rewrittenGradient3 && (rewrittenRule.linearGradient3 = rewrittenGradient3), new data.SQFillRuleExpr(rewrittenInput, rewrittenRule);
                    }
                    return orig;
                }, SQExprRewriter.prototype.visitLinearGradient2 = function(origGradient2) {
                    var origMin = origGradient2.min, rewrittenMin = this.visitFillRuleStop(origMin), origMax = origGradient2.max, rewrittenMax = this.visitFillRuleStop(origMax);
                    return origMin !== rewrittenMin || origMax !== rewrittenMax ? {
                        min: rewrittenMin,
                        max: rewrittenMax
                    } : origGradient2;
                }, SQExprRewriter.prototype.visitLinearGradient3 = function(origGradient3) {
                    var origMin = origGradient3.min, rewrittenMin = this.visitFillRuleStop(origMin), origMid = origGradient3.mid, rewrittenMid = this.visitFillRuleStop(origMid), origMax = origGradient3.max, rewrittenMax = this.visitFillRuleStop(origMax);
                    return origMin !== rewrittenMin || origMid !== rewrittenMid || origMax !== rewrittenMax ? {
                        min: rewrittenMin,
                        mid: rewrittenMid,
                        max: rewrittenMax
                    } : origGradient3;
                }, SQExprRewriter.prototype.visitFillRuleStop = function(stop) {
                    var origColor = stop.color, rewrittenColor = stop.color.accept(this), origValue = stop.value, rewrittenValue = origValue;
                    if (origValue && (rewrittenValue = origValue.accept(this)), origColor !== rewrittenColor || origValue !== rewrittenValue) {
                        var rewrittenStop = {
                            color: rewrittenColor
                        };
                        return rewrittenValue && (rewrittenStop.value = rewrittenValue), rewrittenStop;
                    }
                    return stop;
                }, SQExprRewriter.prototype.visitResourcePackageItem = function(orig) {
                    return orig;
                }, SQExprRewriter;
            }();
            data.SQExprRewriter = SQExprRewriter;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi), __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var EqualsToInRewriter;
            !function(EqualsToInRewriter) {
                function run(expr) {
                    return expr.accept(new Rewriter());
                }
                EqualsToInRewriter.run = run;
                var Rewriter = function(_super) {
                    function Rewriter() {
                        _super.call(this);
                    }
                    return __extends(Rewriter, _super), Rewriter.prototype.visitCompare = function(expr) {
                        if (expr.comparison !== data.QueryComparisonKind.Equal) return this.visitUnsupported(expr);
                        if (!this.isSupported(expr.left) || !this.isSupported(expr.right)) return this.visitUnsupported(expr);
                        var leftIsComparand = this.isComparand(expr.left), rightIsComparand = this.isComparand(expr.right);
                        if (leftIsComparand === rightIsComparand) return this.visitUnsupported(expr);
                        var operand = leftIsComparand ? expr.left : expr.right, value = leftIsComparand ? expr.right : expr.left, current = this.current;
                        return current ? (current.add(operand, value), expr) : data.SQExprBuilder.inExpr([ operand ], [ [ value ] ]);
                    }, Rewriter.prototype.visitOr = function(expr) {
                        if (!this.isSupported(expr.left) || !this.isSupported(expr.right)) return this.visitUnsupported(expr);
                        var current;
                        return this.current || (current = this.current = new InBuilder()), expr.left.accept(this), 
                        expr.right.accept(this), current ? (this.current = null, current.complete() || expr) : expr;
                    }, Rewriter.prototype.visitAnd = function(expr) {
                        if (!this.isSupported(expr.left) || !this.isSupported(expr.right)) return this.visitUnsupported(expr);
                        var current = this.current;
                        return current ? (current.cancel(), expr) : _super.prototype.visitAnd.call(this, expr);
                    }, Rewriter.prototype.visitUnsupported = function(expr) {
                        var current = this.current;
                        return current && current.cancel(), expr;
                    }, Rewriter.prototype.isSupported = function(expr) {
                        return expr instanceof data.SQCompareExpr || expr instanceof data.SQColumnRefExpr || expr instanceof data.SQConstantExpr || expr instanceof data.SQHierarchyLevelExpr || expr instanceof data.SQOrExpr || expr instanceof data.SQAndExpr;
                    }, Rewriter.prototype.isComparand = function(expr) {
                        return expr instanceof data.SQColumnRefExpr || expr instanceof data.SQHierarchyLevelExpr;
                    }, Rewriter;
                }(data.SQExprRewriter), InBuilder = function() {
                    function InBuilder() {}
                    return InBuilder.prototype.add = function(operand, value) {
                        if (!this.cancelled) {
                            if (this.operand && !data.SQExpr.equals(operand, this.operand)) return void this.cancel();
                            this.operand = operand;
                            var values = this.values;
                            values || (values = this.values = []), values.push(value);
                        }
                    }, InBuilder.prototype.cancel = function() {
                        this.cancelled = !0;
                    }, InBuilder.prototype.complete = function() {
                        return !this.cancelled && this.operand ? data.SQExprBuilder.inExpr([ this.operand ], _.map(this.values, function(v) {
                            return [ v ];
                        })) : void 0;
                    }, InBuilder;
                }();
            }(EqualsToInRewriter = data.EqualsToInRewriter || (data.EqualsToInRewriter = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi, __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var SQExprConverter;
            !function(SQExprConverter) {
                function asScopeIdsContainer(filter, fieldSQExprs) {
                    var filterItems = filter.conditions(), filterItem = filterItems[0];
                    if (filterItem) {
                        var visitor = new FilterScopeIdsCollectorVisitor(fieldSQExprs);
                        if (filterItem.accept(visitor)) return visitor.getResult();
                    }
                }
                function getFirstComparandValue(identity) {
                    var comparandExpr = identity.expr.accept(new FindComparandVisitor());
                    return comparandExpr ? comparandExpr.value : void 0;
                }
                SQExprConverter.asScopeIdsContainer = asScopeIdsContainer, SQExprConverter.getFirstComparandValue = getFirstComparandValue;
            }(SQExprConverter = data.SQExprConverter || (data.SQExprConverter = {}));
            var FilterScopeIdsCollectorVisitor = function(_super) {
                function FilterScopeIdsCollectorVisitor(fieldSQExprs) {
                    _super.call(this), this.isRoot = !0, this.isNot = !1, this.keyExprsCount = null, 
                    this.valueExprs = [], this.fieldExprs = [];
                    for (var _i = 0, fieldSQExprs_1 = fieldSQExprs; _i < fieldSQExprs_1.length; _i++) {
                        var field = fieldSQExprs_1[_i];
                        this.fieldExprs.push(data.SQExprBuilder.removeEntityVariables(field));
                    }
                }
                return __extends(FilterScopeIdsCollectorVisitor, _super), FilterScopeIdsCollectorVisitor.prototype.getResult = function() {
                    for (var valueExprs = this.valueExprs, scopeIds = [], valueCount = this.keyExprsCount || 1, startIndex = 0, endIndex = valueCount, len = valueExprs.length; len > startIndex && len >= endIndex; ) {
                        var values = valueExprs.slice(startIndex, endIndex), scopeId = FilterScopeIdsCollectorVisitor.getScopeIdentity(this.fieldExprs, values);
                        jsCommon.ArrayExtensions.isInArray(scopeIds, scopeId, powerbi.DataViewScopeIdentity.equals) || scopeIds.push(scopeId), 
                        startIndex += valueCount, endIndex += valueCount;
                    }
                    return {
                        isNot: this.isNot,
                        scopeIds: scopeIds
                    };
                }, FilterScopeIdsCollectorVisitor.getScopeIdentity = function(fieldExprs, valueExprs) {
                    for (var compoundSQExpr, i = 0, len = fieldExprs.length; len > i; i++) {
                        var equalsExpr = data.SQExprBuilder.equal(fieldExprs[i], valueExprs[i]);
                        compoundSQExpr = compoundSQExpr ? data.SQExprBuilder.and(compoundSQExpr, equalsExpr) : equalsExpr;
                    }
                    return data.createDataViewScopeIdentity(compoundSQExpr);
                }, FilterScopeIdsCollectorVisitor.prototype.visitOr = function(expr) {
                    return null !== this.keyExprsCount ? this.unsupportedSQExpr() : (this.isRoot = !1, 
                    expr.left.accept(this) && expr.right.accept(this));
                }, FilterScopeIdsCollectorVisitor.prototype.visitNot = function(expr) {
                    return this.isRoot ? (this.isNot = !0, expr.arg.accept(this)) : this.unsupportedSQExpr();
                }, FilterScopeIdsCollectorVisitor.prototype.visitConstant = function(expr) {
                    return this.isRoot && expr.type.primitiveType === powerbi.PrimitiveType.Null ? this.unsupportedSQExpr() : (this.valueExprs.push(expr), 
                    !0);
                }, FilterScopeIdsCollectorVisitor.prototype.visitCompare = function(expr) {
                    return null !== this.keyExprsCount ? this.unsupportedSQExpr() : (this.isRoot = !1, 
                    expr.comparison !== data.QueryComparisonKind.Equal ? this.unsupportedSQExpr() : expr.left.accept(this) && expr.right.accept(this));
                }, FilterScopeIdsCollectorVisitor.prototype.visitIn = function(expr) {
                    this.keyExprsCount = 0;
                    var result;
                    this.isRoot = !1;
                    for (var _i = 0, _a = expr.args; _i < _a.length; _i++) {
                        var arg = _a[_i];
                        if (result = arg.accept(this), !result) return this.unsupportedSQExpr();
                        this.keyExprsCount++;
                    }
                    if (this.keyExprsCount !== this.fieldExprs.length) return this.unsupportedSQExpr();
                    for (var values = expr.values, _b = 0, values_1 = values; _b < values_1.length; _b++) for (var valueTuple = values_1[_b], _c = (valueTuple.length, 
                    0), valueTuple_1 = valueTuple; _c < valueTuple_1.length; _c++) {
                        var value = valueTuple_1[_c];
                        if (result = value.accept(this), !result) return this.unsupportedSQExpr();
                    }
                    return result;
                }, FilterScopeIdsCollectorVisitor.prototype.visitColumnRef = function(expr) {
                    if (this.isRoot) return this.unsupportedSQExpr();
                    var fixedExpr = data.SQExprBuilder.removeEntityVariables(expr);
                    return null !== this.keyExprsCount ? data.SQExpr.equals(this.fieldExprs[this.keyExprsCount], fixedExpr) : data.SQExpr.equals(this.fieldExprs[0], fixedExpr);
                }, FilterScopeIdsCollectorVisitor.prototype.visitDefaultValue = function(expr) {
                    return this.isRoot || null !== this.keyExprsCount ? this.unsupportedSQExpr() : (this.valueExprs.push(expr), 
                    !0);
                }, FilterScopeIdsCollectorVisitor.prototype.visitAnyValue = function(expr) {
                    return this.isRoot || null !== this.keyExprsCount ? this.unsupportedSQExpr() : (this.valueExprs.push(expr), 
                    !0);
                }, FilterScopeIdsCollectorVisitor.prototype.visitDefault = function(expr) {
                    return this.unsupportedSQExpr();
                }, FilterScopeIdsCollectorVisitor.prototype.unsupportedSQExpr = function() {
                    return !1;
                }, FilterScopeIdsCollectorVisitor;
            }(data.DefaultSQExprVisitor), FindComparandVisitor = function(_super) {
                function FindComparandVisitor() {
                    _super.apply(this, arguments);
                }
                return __extends(FindComparandVisitor, _super), FindComparandVisitor.prototype.visitAnd = function(expr) {
                    return expr.left.accept(this) || expr.right.accept(this);
                }, FindComparandVisitor.prototype.visitCompare = function(expr) {
                    if (expr.comparison === data.QueryComparisonKind.Equal) {
                        if (expr.right instanceof data.SQConstantExpr) return expr.right;
                        if (expr.left instanceof data.SQConstantExpr) return expr.left;
                    }
                }, FindComparandVisitor;
            }(data.DefaultSQExprVisitor);
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi, __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var ScopeIdentityExtractor, ArrayExtensions = jsCommon.ArrayExtensions;
            !function(ScopeIdentityExtractor) {
                function getKeys(expr) {
                    var extractor = new ScopeIdExtractorImpl();
                    return expr.accept(extractor), extractor.malformed ? null : ArrayExtensions.emptyToNull(extractor.keys);
                }
                function getValues(expr) {
                    var extractor = new ScopeIdExtractorImpl();
                    return expr.accept(extractor), extractor.malformed ? null : ArrayExtensions.emptyToNull(extractor.values);
                }
                function getInExpr(expr) {
                    var extractor = new ScopeIdExtractorImpl();
                    if (expr.accept(extractor), !extractor.malformed) {
                        var keys = ArrayExtensions.emptyToNull(extractor.keys), keyValues = ArrayExtensions.emptyToNull(extractor.values);
                        return keys && keyValues ? data.SQExprBuilder.inExpr(keys, [ keyValues ]) : void 0;
                    }
                }
                ScopeIdentityExtractor.getKeys = getKeys, ScopeIdentityExtractor.getValues = getValues, 
                ScopeIdentityExtractor.getInExpr = getInExpr;
                var ScopeIdExtractorImpl = function(_super) {
                    function ScopeIdExtractorImpl() {
                        _super.apply(this, arguments), this.keys = [], this.values = [];
                    }
                    return __extends(ScopeIdExtractorImpl, _super), ScopeIdExtractorImpl.prototype.visitAnd = function(expr) {
                        expr.left.accept(this), expr.right.accept(this);
                    }, ScopeIdExtractorImpl.prototype.visitCompare = function(expr) {
                        return expr.comparison !== data.QueryComparisonKind.Equal ? void this.visitDefault(expr) : (expr.left.accept(this), 
                        void expr.right.accept(this));
                    }, ScopeIdExtractorImpl.prototype.visitColumnRef = function(expr) {
                        this.keys.push(expr);
                    }, ScopeIdExtractorImpl.prototype.visitHierarchyLevel = function(expr) {
                        this.keys.push(expr);
                    }, ScopeIdExtractorImpl.prototype.visitConstant = function(expr) {
                        this.values.push(expr);
                    }, ScopeIdExtractorImpl.prototype.visitArithmetic = function(expr) {
                        this.keys.push(expr);
                    }, ScopeIdExtractorImpl.prototype.visitDefault = function(expr) {
                        this.malformed = !0;
                    }, ScopeIdExtractorImpl;
                }(data.DefaultSQExprVisitor);
            }(ScopeIdentityExtractor = data.ScopeIdentityExtractor || (data.ScopeIdentityExtractor = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var PrimitiveValueEncoding;
            !function(PrimitiveValueEncoding) {
                function decimal(value) {
                    return value + "M";
                }
                function double(value) {
                    return value + "D";
                }
                function integer(value) {
                    return value + "L";
                }
                function dateTime(value) {
                    var date = new Date(value.getTime() - 6e4 * value.getTimezoneOffset()), dateTimeString = date.toISOString();
                    return jsCommon.StringExtensions.endsWith(dateTimeString, "Z") && (dateTimeString = dateTimeString.substr(0, dateTimeString.length - 1)), 
                    "datetime'" + dateTimeString + "'";
                }
                function text(value) {
                    return "'" + value.replace(SingleQuoteRegex, "''") + "'";
                }
                function nullEncoding() {
                    return "null";
                }
                function boolean(value) {
                    return value ? "true" : "false";
                }
                var SingleQuoteRegex = /'/g;
                PrimitiveValueEncoding.decimal = decimal, PrimitiveValueEncoding["double"] = double, 
                PrimitiveValueEncoding.integer = integer, PrimitiveValueEncoding.dateTime = dateTime, 
                PrimitiveValueEncoding.text = text, PrimitiveValueEncoding.nullEncoding = nullEncoding, 
                PrimitiveValueEncoding["boolean"] = boolean;
            }(PrimitiveValueEncoding = data.PrimitiveValueEncoding || (data.PrimitiveValueEncoding = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createSQAggregationOperations(datetimeMinMaxSupported) {
                return new SQAggregationOperations(datetimeMinMaxSupported);
            }
            function getMetadataForUnderlyingType(expr, schema) {
                var metadata = data.SQExprBuilder.removeAggregate(expr).getMetadata(schema);
                return metadata || (metadata = expr.getMetadata(schema)), metadata;
            }
            var Agg = powerbi.data.QueryAggregateFunction;
            data.createSQAggregationOperations = createSQAggregationOperations;
            var SQAggregationOperations = function() {
                function SQAggregationOperations(datetimeMinMaxSupported) {
                    this.datetimeMinMaxSupported = datetimeMinMaxSupported;
                }
                return SQAggregationOperations.prototype.getSupportedAggregates = function(expr, schema, targetTypes, forConsumption) {
                    var metadata = getMetadataForUnderlyingType(expr, schema);
                    if (!metadata) return [];
                    var valueType = metadata.type, fieldKind = metadata.kind, isPropertyIdentity = metadata.idOnEntityKey;
                    if (!valueType) return [];
                    if (1 === fieldKind) return [];
                    if (valueType.numeric || valueType.integer) {
                        var aggregates_1 = [ Agg.Sum, Agg.Avg, Agg.Min, Agg.Max, Agg.Count, Agg.CountNonNull, Agg.StandardDeviation, Agg.Variance ], fieldExpr = data.SQExprConverter.asFieldPattern(expr), fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr), currentSchema = schema.schema(fieldExprItem.schema);
                        return currentSchema.capabilities.supportsMedian && aggregates_1.push(Agg.Median), 
                        aggregates_1;
                    }
                    var aggregates = [];
                    (this.datetimeMinMaxSupported || forConsumption) && valueType.dateTime && (_.isEmpty(targetTypes) || powerbi.ValueType.isCompatibleTo(valueType, targetTypes)) && (aggregates.push(Agg.Min), 
                    aggregates.push(Agg.Max));
                    var distinctCountAggExists = data.SQExprInfo.getAggregate(expr) === Agg.Count;
                    return isPropertyIdentity && !distinctCountAggExists || aggregates.push(Agg.Count), 
                    aggregates.push(Agg.CountNonNull), aggregates;
                }, SQAggregationOperations.prototype.isSupportedAggregate = function(expr, schema, aggregate, targetTypes, forConsumption) {
                    var supportedAggregates = this.getSupportedAggregates(expr, schema, targetTypes, forConsumption);
                    return _.contains(supportedAggregates, aggregate);
                }, SQAggregationOperations.prototype.createExprWithAggregate = function(expr, schema, aggregateNonNumericFields, targetTypes, preferredAggregate) {
                    var aggregate;
                    return aggregate = null != preferredAggregate && this.isSupportedAggregate(expr, schema, preferredAggregate, targetTypes) ? preferredAggregate : expr.getDefaultAggregate(schema, aggregateNonNumericFields), 
                    void 0 !== aggregate && (expr = data.SQExprBuilder.aggregate(expr, aggregate)), 
                    expr;
                }, SQAggregationOperations;
            }();
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var SQHierarchyExprUtils;
            !function(SQHierarchyExprUtils) {
                function getConceptualHierarchyLevelFromExpr(conceptualSchema, fieldExpr) {
                    var hierarchyLevel = getHierarchyLevel(fieldExpr);
                    return hierarchyLevel ? SQHierarchyExprUtils.getConceptualHierarchyLevel(conceptualSchema, hierarchyLevel.schema, hierarchyLevel.entity, hierarchyLevel.name, hierarchyLevel.level) : void 0;
                }
                function getConceptualHierarchyLevel(conceptualSchema, schemaName, entity, hierarchy, hierarchyLevel) {
                    var schema = conceptualSchema.schema(schemaName), conceptualHierarchy = schema.findHierarchy(entity, hierarchy);
                    return conceptualHierarchy ? conceptualHierarchy.levels.withName(hierarchyLevel) : void 0;
                }
                function getConceptualHierarchy(sqExpr, federatedSchema) {
                    if (sqExpr instanceof data.SQHierarchyExpr) {
                        var hierarchy = sqExpr;
                        if (sqExpr.arg instanceof data.SQEntityExpr) {
                            var entityExpr = sqExpr.arg;
                            return federatedSchema.schema(entityExpr.schema).findHierarchy(entityExpr.entity, hierarchy.hierarchy);
                        }
                        if (sqExpr.arg instanceof data.SQPropertyVariationSourceExpr) {
                            var variationExpr = sqExpr.arg, sourceEntityExpr = variationExpr.arg;
                            return federatedSchema.schema(sourceEntityExpr.schema).findHierarchyByVariation(sourceEntityExpr.entity, variationExpr.property, variationExpr.name, hierarchy.hierarchy);
                        }
                    }
                }
                function expandExpr(schema, expr, suppressHierarchyLevelExpansion) {
                    return SQExprHierarchyToHierarchyLevelConverter.convert(expr, schema) || SQExprVariationConverter.expand(expr, schema) || !suppressHierarchyLevelExpansion && SQExprHierarchyLevelConverter.expand(expr, schema) || expr;
                }
                function isHierarchyOrVariation(schema, expr) {
                    if (expr instanceof data.SQHierarchyExpr || expr instanceof data.SQHierarchyLevelExpr) return !0;
                    var conceptualProperty = expr.getConceptualProperty(schema);
                    if (conceptualProperty) {
                        var column = conceptualProperty.column;
                        if (column && column.variations && column.variations.length > 0) return !0;
                    }
                    return !1;
                }
                function getSourceVariationExpr(hierarchyLevelExpr) {
                    var fieldExprPattern = data.SQExprConverter.asFieldPattern(hierarchyLevelExpr);
                    if (fieldExprPattern.columnHierarchyLevelVariation) {
                        var entity = data.SQExprBuilder.entity(fieldExprPattern.columnHierarchyLevelVariation.source.schema, fieldExprPattern.columnHierarchyLevelVariation.source.entity);
                        return data.SQExprBuilder.columnRef(entity, fieldExprPattern.columnHierarchyLevelVariation.source.name);
                    }
                }
                function getSourceHierarchy(hierarchyLevelExpr) {
                    var fieldExprPattern = data.SQExprConverter.asFieldPattern(hierarchyLevelExpr), hierarchyLevel = fieldExprPattern.hierarchyLevel;
                    if (hierarchyLevel) {
                        var entity = data.SQExprBuilder.entity(hierarchyLevel.schema, hierarchyLevel.entity, hierarchyLevel.entityVar);
                        return data.SQExprBuilder.hierarchy(entity, hierarchyLevel.name);
                    }
                }
                function getHierarchySourceAsVariationSource(hierarchyLevelExpr) {
                    if (hierarchyLevelExpr.arg instanceof data.SQHierarchyExpr) {
                        var hierarchyRef = hierarchyLevelExpr.arg;
                        return hierarchyRef.arg instanceof data.SQPropertyVariationSourceExpr ? hierarchyRef.arg : void 0;
                    }
                }
                function areHierarchyLevelsOrdered(allLevels, firstExpr, secondExpr) {
                    if (!(firstExpr instanceof data.SQHierarchyLevelExpr && secondExpr instanceof data.SQHierarchyLevelExpr)) return !1;
                    var firstLevel = firstExpr, secondLevel = secondExpr;
                    if (!data.SQExpr.equals(firstLevel.arg, secondLevel.arg)) return !1;
                    var firstIndex = data.SQExprUtils.indexOfExpr(allLevels, firstLevel), secondIndex = data.SQExprUtils.indexOfExpr(allLevels, secondLevel);
                    return -1 !== firstIndex && -1 !== secondIndex && secondIndex > firstIndex;
                }
                function getInsertionIndex(allLevels, orderedSubsetOfLevels, expr) {
                    for (var insertIndex = 0; insertIndex < orderedSubsetOfLevels.length && areHierarchyLevelsOrdered(allLevels, orderedSubsetOfLevels[insertIndex], expr); ) insertIndex++;
                    return insertIndex;
                }
                function getHierarchyLevel(fieldExpr) {
                    return fieldExpr.hierarchyLevel || fieldExpr.hierarchyLevelAggr || fieldExpr.columnHierarchyLevelVariation && fieldExpr.columnHierarchyLevelVariation.level;
                }
                SQHierarchyExprUtils.getConceptualHierarchyLevelFromExpr = getConceptualHierarchyLevelFromExpr, 
                SQHierarchyExprUtils.getConceptualHierarchyLevel = getConceptualHierarchyLevel, 
                SQHierarchyExprUtils.getConceptualHierarchy = getConceptualHierarchy, SQHierarchyExprUtils.expandExpr = expandExpr, 
                SQHierarchyExprUtils.isHierarchyOrVariation = isHierarchyOrVariation, SQHierarchyExprUtils.getSourceVariationExpr = getSourceVariationExpr, 
                SQHierarchyExprUtils.getSourceHierarchy = getSourceHierarchy, SQHierarchyExprUtils.getHierarchySourceAsVariationSource = getHierarchySourceAsVariationSource, 
                SQHierarchyExprUtils.areHierarchyLevelsOrdered = areHierarchyLevelsOrdered, SQHierarchyExprUtils.getInsertionIndex = getInsertionIndex;
            }(SQHierarchyExprUtils = data.SQHierarchyExprUtils || (data.SQHierarchyExprUtils = {}));
            var SQExprHierarchyToHierarchyLevelConverter;
            !function(SQExprHierarchyToHierarchyLevelConverter) {
                function convert(sqExpr, federatedSchema) {
                    if (sqExpr instanceof data.SQHierarchyExpr) {
                        var hierarchyExpr = sqExpr, conceptualHierarchy = SQHierarchyExprUtils.getConceptualHierarchy(hierarchyExpr, federatedSchema);
                        if (conceptualHierarchy) return _.map(conceptualHierarchy.levels, function(hierarchyLevel) {
                            return data.SQExprBuilder.hierarchyLevel(sqExpr, hierarchyLevel.name);
                        });
                    }
                }
                SQExprHierarchyToHierarchyLevelConverter.convert = convert;
            }(SQExprHierarchyToHierarchyLevelConverter = data.SQExprHierarchyToHierarchyLevelConverter || (data.SQExprHierarchyToHierarchyLevelConverter = {}));
            var SQExprHierarchyLevelConverter;
            !function(SQExprHierarchyLevelConverter) {
                function expand(expr, schema) {
                    var exprs = [];
                    if (expr instanceof data.SQHierarchyLevelExpr) {
                        var fieldExpr = data.SQExprConverter.asFieldPattern(expr);
                        if (fieldExpr.hierarchyLevel) {
                            var fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr), hierarchy = schema.schema(fieldExprItem.schema).findHierarchy(fieldExprItem.entity, fieldExpr.hierarchyLevel.name);
                            if (hierarchy) for (var hierarchyLevels = hierarchy.levels, _i = 0, hierarchyLevels_1 = hierarchyLevels; _i < hierarchyLevels_1.length; _i++) {
                                var hierarchyLevel = hierarchyLevels_1[_i];
                                if (hierarchyLevel.name === fieldExpr.hierarchyLevel.level) {
                                    exprs.push(expr);
                                    break;
                                }
                                exprs.push(data.SQExprBuilder.hierarchyLevel(data.SQExprBuilder.hierarchy(data.SQExprBuilder.entity(fieldExprItem.schema, fieldExprItem.entity, fieldExprItem.entityVar), hierarchy.name), hierarchyLevel.name));
                            }
                        }
                    }
                    return _.isEmpty(exprs) ? void 0 : exprs;
                }
                SQExprHierarchyLevelConverter.expand = expand;
            }(SQExprHierarchyLevelConverter || (SQExprHierarchyLevelConverter = {}));
            var SQExprVariationConverter;
            !function(SQExprVariationConverter) {
                function expand(expr, schema) {
                    var exprs, conceptualProperty = expr.getConceptualProperty(schema);
                    if (conceptualProperty) {
                        var column = conceptualProperty.column;
                        if (column && column.variations && column.variations.length > 0) {
                            var variations = column.variations, variation = variations[0], fieldExpr = data.SQExprConverter.asFieldPattern(expr), fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);
                            if (exprs = [], variation.defaultHierarchy) for (var hierarchyExpr = data.SQExprBuilder.hierarchy(data.SQExprBuilder.propertyVariationSource(data.SQExprBuilder.entity(fieldExprItem.schema, fieldExprItem.entity, fieldExprItem.entityVar), variation.name, conceptualProperty.name), variation.defaultHierarchy.name), _i = 0, _a = variation.defaultHierarchy.levels; _i < _a.length; _i++) {
                                var level = _a[_i];
                                exprs.push(data.SQExprBuilder.hierarchyLevel(hierarchyExpr, level.name));
                            }
                        }
                    }
                    return exprs;
                }
                SQExprVariationConverter.expand = expand;
            }(SQExprVariationConverter || (SQExprVariationConverter = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var SQExprGroupUtils;
            !function(SQExprGroupUtils) {
                function groupExprs(schema, exprs) {
                    for (var groups = [], i = 0, len = exprs.length; len > i; i++) {
                        var expr = exprs[i];
                        expr instanceof data.SQHierarchyLevelExpr ? addChildToGroup(schema, groups, expr, i) : groups.push({
                            expr: expr,
                            children: null,
                            selectQueryIndex: i
                        });
                    }
                    return groups;
                }
                function addChildToGroup(schema, groups, expr, selectQueryIndex) {
                    var shouldAddExpressionToNewGroup = !0, exprSource = data.SQHierarchyExprUtils.getSourceVariationExpr(expr) || data.SQHierarchyExprUtils.getSourceHierarchy(expr), lastGroup = _.last(groups);
                    if (lastGroup && lastGroup.children && data.SQExpr.equals(lastGroup.expr, exprSource)) {
                        var expandedExpr = data.SQHierarchyExprUtils.expandExpr(schema, expr.arg);
                        if (expandedExpr instanceof Array) {
                            var allHierarchyLevels = expandedExpr;
                            shouldAddExpressionToNewGroup = !data.SQHierarchyExprUtils.areHierarchyLevelsOrdered(allHierarchyLevels, _.last(lastGroup.children), expr);
                        }
                    }
                    shouldAddExpressionToNewGroup ? groups.push({
                        expr: exprSource,
                        children: [ expr ],
                        selectQueryIndex: selectQueryIndex
                    }) : lastGroup.children.push(expr);
                }
                SQExprGroupUtils.groupExprs = groupExprs;
            }(SQExprGroupUtils = data.SQExprGroupUtils || (data.SQExprGroupUtils = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi, __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            function defaultAggregateForDataType(type) {
                return type.integer || type.numeric ? data.QueryAggregateFunction.Sum : data.QueryAggregateFunction.Count;
            }
            function defaultAggregateToQueryAggregateFunction(aggregate) {
                switch (aggregate) {
                  case 6:
                    return data.QueryAggregateFunction.Avg;

                  case 3:
                    return data.QueryAggregateFunction.CountNonNull;

                  case 7:
                    return data.QueryAggregateFunction.Count;

                  case 5:
                    return data.QueryAggregateFunction.Max;

                  case 4:
                    return data.QueryAggregateFunction.Min;

                  case 2:
                    return data.QueryAggregateFunction.Sum;

                  default:
                    return;
                }
            }
            var StringExtensions = jsCommon.StringExtensions, SQExpr = function() {
                function SQExpr(kind) {
                    this._kind = kind;
                }
                return SQExpr.equals = function(x, y, ignoreCase) {
                    return SQExprEqualityVisitor.run(x, y, ignoreCase);
                }, SQExpr.prototype.validate = function(schema, aggrUtils, errors) {
                    var validator = new SQExprValidationVisitor(schema, aggrUtils, errors);
                    return this.accept(validator), validator.errors;
                }, SQExpr.prototype.accept = function(visitor, arg) {}, Object.defineProperty(SQExpr.prototype, "kind", {
                    get: function() {
                        return this._kind;
                    },
                    enumerable: !0,
                    configurable: !0
                }), SQExpr.isArithmetic = function(expr) {
                    return 22 === expr.kind;
                }, SQExpr.isColumn = function(expr) {
                    return 1 === expr.kind;
                }, SQExpr.isConstant = function(expr) {
                    return 16 === expr.kind;
                }, SQExpr.isEntity = function(expr) {
                    return 0 === expr.kind;
                }, SQExpr.isHierarchy = function(expr) {
                    return 5 === expr.kind;
                }, SQExpr.isHierarchyLevel = function(expr) {
                    return 6 === expr.kind;
                }, SQExpr.isAggregation = function(expr) {
                    return 3 === expr.kind;
                }, SQExpr.isMeasure = function(expr) {
                    return 2 === expr.kind;
                }, SQExpr.isPercentile = function(expr) {
                    return 27 === expr.kind;
                }, SQExpr.isSelectRef = function(expr) {
                    return 28 === expr.kind;
                }, SQExpr.isScopedEval = function(expr) {
                    return 25 === expr.kind;
                }, SQExpr.isWithRef = function(expr) {
                    return 26 === expr.kind;
                }, SQExpr.isTransformTableRef = function(expr) {
                    return 29 === expr.kind;
                }, SQExpr.isTransformOutputRoleRef = function(expr) {
                    return 30 === expr.kind;
                }, SQExpr.isResourcePackageItem = function(expr) {
                    return 24 === expr.kind;
                }, SQExpr.prototype.getMetadata = function(federatedSchema) {
                    var field = data.SQExprConverter.asFieldPattern(this);
                    if (field) return field.column || field.columnAggr || field.measure ? this.getMetadataForProperty(field, federatedSchema) : field.hierarchyLevel || field.hierarchyLevelAggr ? this.getMetadataForHierarchyLevel(field, federatedSchema) : field.columnHierarchyLevelVariation ? this.getMetadataForVariation(field, federatedSchema) : field.percentOfGrandTotal ? this.getMetadataForPercentOfGrandTotal() : SQExpr.getMetadataForEntity(field, federatedSchema);
                }, SQExpr.prototype.getDefaultAggregate = function(federatedSchema, forceAggregation) {
                    void 0 === forceAggregation && (forceAggregation = !1);
                    var property = this.getConceptualProperty(federatedSchema) || this.getHierarchyLevelConceptualProperty(federatedSchema);
                    if (property) {
                        var aggregate;
                        if (property && 0 === property.kind) {
                            var propertyDefaultAggregate = property.column ? property.column.defaultAggregate : null;
                            (property.type.integer || property.type.numeric) && 1 !== propertyDefaultAggregate && (aggregate = defaultAggregateToQueryAggregateFunction(propertyDefaultAggregate), 
                            void 0 === aggregate && (aggregate = defaultAggregateForDataType(property.type))), 
                            void 0 === aggregate && forceAggregation && (aggregate = data.QueryAggregateFunction.CountNonNull);
                        }
                        return aggregate;
                    }
                }, SQExpr.prototype.getKeyColumns = function(schema) {
                    var columnRefExpr = SQExprColumnRefInfoVisitor.getColumnRefSQExpr(schema, this);
                    if (columnRefExpr) {
                        var keySQExprs = [], keys = this.getPropertyKeys(schema);
                        if (keys && keys.length > 0) for (var i = 0, len = keys.length; len > i; i++) keySQExprs.push(SQExprBuilder.columnRef(columnRefExpr.source, keys[i].name)); else keySQExprs.push(columnRefExpr);
                        return keySQExprs;
                    }
                }, SQExpr.prototype.hasGroupOnKeys = function(schema) {
                    var columnRefExpr = SQExprColumnRefInfoVisitor.getColumnRefSQExpr(schema, this);
                    if (columnRefExpr) {
                        var keys = this.getPropertyKeys(schema);
                        if (!keys || keys.length < 1) return !1;
                        if (keys.length > 1) return !0;
                        var keySqExpr = SQExprBuilder.columnRef(columnRefExpr.source, keys[0].name);
                        return !SQExpr.equals(keySqExpr, this);
                    }
                }, SQExpr.prototype.getPropertyKeys = function(schema) {
                    var property = this.getConceptualProperty(schema) || this.getHierarchyLevelConceptualProperty(schema);
                    if (property) return property.column ? property.column.keys : void 0;
                }, SQExpr.prototype.getConceptualProperty = function(federatedSchema) {
                    var field = data.SQExprConverter.asFieldPattern(this);
                    if (field) {
                        var fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(field), propertyName = data.FieldExprPattern.getPropertyName(field);
                        return propertyName ? federatedSchema.schema(fieldExprItem.schema).findProperty(fieldExprItem.entity, propertyName) : void 0;
                    }
                }, SQExpr.prototype.getTargetEntityForVariation = function(federatedSchema, variationName) {
                    var property = this.getConceptualProperty(federatedSchema);
                    if (property && property.column && !_.isEmpty(property.column.variations)) for (var variations = property.column.variations, _i = 0, variations_1 = variations; _i < variations_1.length; _i++) {
                        var variation = variations_1[_i];
                        if (variation.name === variationName) return variation.navigationProperty.targetEntity.name;
                    }
                }, SQExpr.prototype.getTargetEntity = function(federatedSchema) {
                    return SQEntityExprInfoVisitor.getEntityExpr(federatedSchema, this);
                }, SQExpr.prototype.getHierarchyLevelConceptualProperty = function(federatedSchema) {
                    var field = data.SQExprConverter.asFieldPattern(this);
                    if (field) {
                        var fieldExprHierachyLevel = field.hierarchyLevel || field.hierarchyLevelAggr;
                        if (fieldExprHierachyLevel) {
                            var fieldExprEntity = data.FieldExprPattern.toFieldExprEntityItemPattern(field), hierarchy = federatedSchema.schema(fieldExprEntity.schema).findHierarchy(fieldExprEntity.entity, fieldExprHierachyLevel.name);
                            if (hierarchy) {
                                var hierarchyLevel = hierarchy.levels.withName(fieldExprHierachyLevel.level);
                                if (hierarchyLevel) return hierarchyLevel.column;
                            }
                        }
                    }
                }, SQExpr.prototype.getMetadataForVariation = function(field, federatedSchema) {
                    var columnHierarchyLevelVariation = field.columnHierarchyLevelVariation, fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(field), sourceProperty = federatedSchema.schema(fieldExprItem.schema).findProperty(fieldExprItem.entity, columnHierarchyLevelVariation.source.name);
                    if (sourceProperty && sourceProperty.column && sourceProperty.column.variations) for (var _i = 0, _a = sourceProperty.column.variations; _i < _a.length; _i++) {
                        var variation = _a[_i];
                        if (variation.defaultHierarchy && variation.defaultHierarchy.levels) for (var _b = 0, _c = variation.defaultHierarchy.levels; _b < _c.length; _b++) {
                            var level = _c[_b];
                            if (level.name === columnHierarchyLevelVariation.level.level) {
                                var property = level.column;
                                return {
                                    kind: 1 === property.kind ? 1 : 0,
                                    type: property.type,
                                    format: property.format,
                                    idOnEntityKey: property.column ? property.column.idOnEntityKey : !1,
                                    defaultAggregate: property.column ? property.column.defaultAggregate : null
                                };
                            }
                        }
                    }
                }, SQExpr.prototype.getMetadataForHierarchyLevel = function(field, federatedSchema) {
                    var property = this.getHierarchyLevelConceptualProperty(federatedSchema);
                    if (property) return this.getPropertyMetadata(field, property);
                }, SQExpr.prototype.getMetadataForPercentOfGrandTotal = function() {
                    return {
                        kind: 1,
                        format: "#,##0.00%",
                        type: powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Double)
                    };
                }, SQExpr.prototype.getPropertyMetadata = function(field, property) {
                    var format = property.format, type = property.type, columnAggregate = field.columnAggr || field.hierarchyLevelAggr;
                    if (columnAggregate) switch (columnAggregate.aggregate) {
                      case data.QueryAggregateFunction.Count:
                      case data.QueryAggregateFunction.CountNonNull:
                        type = powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Integer), format = void 0;
                        break;

                      case data.QueryAggregateFunction.Avg:
                        type.integer && (type = powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Double));
                    }
                    return {
                        kind: 1 === property.kind || columnAggregate && void 0 !== columnAggregate.aggregate ? 1 : 0,
                        type: type,
                        format: format,
                        idOnEntityKey: property.column ? property.column.idOnEntityKey : !1,
                        aggregate: columnAggregate ? columnAggregate.aggregate : void 0,
                        defaultAggregate: property.column ? property.column.defaultAggregate : null
                    };
                }, SQExpr.prototype.getMetadataForProperty = function(field, federatedSchema) {
                    var property = this.getConceptualProperty(federatedSchema);
                    if (property) return this.getPropertyMetadata(field, property);
                }, SQExpr.getMetadataForEntity = function(field, federatedSchema) {
                    var fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(field), entity = federatedSchema.schema(fieldExprItem.schema).entities.withName(fieldExprItem.entity);
                    if (entity && field.entityAggr) switch (field.entityAggr.aggregate) {
                      case data.QueryAggregateFunction.Count:
                      case data.QueryAggregateFunction.CountNonNull:
                        return {
                            kind: 1,
                            type: powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Integer),
                            format: void 0,
                            idOnEntityKey: !1,
                            aggregate: field.entityAggr.aggregate
                        };
                    }
                }, SQExpr;
            }();
            data.SQExpr = SQExpr, data.defaultAggregateForDataType = defaultAggregateForDataType, 
            data.defaultAggregateToQueryAggregateFunction = defaultAggregateToQueryAggregateFunction;
            var SQEntityExpr = function(_super) {
                function SQEntityExpr(schema, entity, variable) {
                    _super.call(this, 0), this.schema = schema, this.entity = entity, variable && (this.variable = variable);
                }
                return __extends(SQEntityExpr, _super), SQEntityExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitEntity(this, arg);
                }, SQEntityExpr;
            }(SQExpr);
            data.SQEntityExpr = SQEntityExpr;
            var SQArithmeticExpr = function(_super) {
                function SQArithmeticExpr(left, right, operator) {
                    _super.call(this, 22), this.left = left, this.right = right, this.operator = operator;
                }
                return __extends(SQArithmeticExpr, _super), SQArithmeticExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitArithmetic(this, arg);
                }, SQArithmeticExpr;
            }(SQExpr);
            data.SQArithmeticExpr = SQArithmeticExpr;
            var SQScopedEvalExpr = function(_super) {
                function SQScopedEvalExpr(expression, scope) {
                    _super.call(this, 25), this.expression = expression, this.scope = scope;
                }
                return __extends(SQScopedEvalExpr, _super), SQScopedEvalExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitScopedEval(this, arg);
                }, SQScopedEvalExpr.prototype.getMetadata = function(federatedSchema) {
                    return this.expression.getMetadata(federatedSchema);
                }, SQScopedEvalExpr;
            }(SQExpr);
            data.SQScopedEvalExpr = SQScopedEvalExpr;
            var SQWithRefExpr = function(_super) {
                function SQWithRefExpr(expressionName) {
                    _super.call(this, 26), this.expressionName = expressionName;
                }
                return __extends(SQWithRefExpr, _super), SQWithRefExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitWithRef(this, arg);
                }, SQWithRefExpr;
            }(SQExpr);
            data.SQWithRefExpr = SQWithRefExpr;
            var SQPropRefExpr = function(_super) {
                function SQPropRefExpr(kind, source, ref) {
                    _super.call(this, kind), this.source = source, this.ref = ref;
                }
                return __extends(SQPropRefExpr, _super), SQPropRefExpr;
            }(SQExpr);
            data.SQPropRefExpr = SQPropRefExpr;
            var SQColumnRefExpr = function(_super) {
                function SQColumnRefExpr(source, ref) {
                    _super.call(this, 1, source, ref);
                }
                return __extends(SQColumnRefExpr, _super), SQColumnRefExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitColumnRef(this, arg);
                }, SQColumnRefExpr;
            }(SQPropRefExpr);
            data.SQColumnRefExpr = SQColumnRefExpr;
            var SQMeasureRefExpr = function(_super) {
                function SQMeasureRefExpr(source, ref) {
                    _super.call(this, 2, source, ref);
                }
                return __extends(SQMeasureRefExpr, _super), SQMeasureRefExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitMeasureRef(this, arg);
                }, SQMeasureRefExpr;
            }(SQPropRefExpr);
            data.SQMeasureRefExpr = SQMeasureRefExpr;
            var SQAggregationExpr = function(_super) {
                function SQAggregationExpr(arg, func) {
                    _super.call(this, 3), this.arg = arg, this.func = func;
                }
                return __extends(SQAggregationExpr, _super), SQAggregationExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitAggr(this, arg);
                }, SQAggregationExpr;
            }(SQExpr);
            data.SQAggregationExpr = SQAggregationExpr;
            var SQPercentileExpr = function(_super) {
                function SQPercentileExpr(arg, k, exclusive) {
                    _super.call(this, 27), this.arg = arg, this.k = k, this.exclusive = exclusive;
                }
                return __extends(SQPercentileExpr, _super), SQPercentileExpr.prototype.getMetadata = function(federatedSchema) {
                    var argMetadata = this.arg.getMetadata(federatedSchema);
                    return argMetadata ? {
                        kind: 1,
                        type: argMetadata.type
                    } : void 0;
                }, SQPercentileExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitPercentile(this, arg);
                }, SQPercentileExpr;
            }(SQExpr);
            data.SQPercentileExpr = SQPercentileExpr;
            var SQPropertyVariationSourceExpr = function(_super) {
                function SQPropertyVariationSourceExpr(arg, name, property) {
                    _super.call(this, 4), this.arg = arg, this.name = name, this.property = property;
                }
                return __extends(SQPropertyVariationSourceExpr, _super), SQPropertyVariationSourceExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitPropertyVariationSource(this, arg);
                }, SQPropertyVariationSourceExpr;
            }(SQExpr);
            data.SQPropertyVariationSourceExpr = SQPropertyVariationSourceExpr;
            var SQHierarchyExpr = function(_super) {
                function SQHierarchyExpr(arg, hierarchy) {
                    _super.call(this, 5), this.arg = arg, this.hierarchy = hierarchy;
                }
                return __extends(SQHierarchyExpr, _super), SQHierarchyExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitHierarchy(this, arg);
                }, SQHierarchyExpr;
            }(SQExpr);
            data.SQHierarchyExpr = SQHierarchyExpr;
            var SQHierarchyLevelExpr = function(_super) {
                function SQHierarchyLevelExpr(arg, level) {
                    _super.call(this, 6), this.arg = arg, this.level = level;
                }
                return __extends(SQHierarchyLevelExpr, _super), SQHierarchyLevelExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitHierarchyLevel(this, arg);
                }, SQHierarchyLevelExpr;
            }(SQExpr);
            data.SQHierarchyLevelExpr = SQHierarchyLevelExpr;
            var SQSelectRefExpr = function(_super) {
                function SQSelectRefExpr(expressionName) {
                    _super.call(this, 28), this.expressionName = expressionName;
                }
                return __extends(SQSelectRefExpr, _super), SQSelectRefExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitSelectRef(this, arg);
                }, SQSelectRefExpr;
            }(SQExpr);
            data.SQSelectRefExpr = SQSelectRefExpr;
            var SQAndExpr = function(_super) {
                function SQAndExpr(left, right) {
                    _super.call(this, 7), this.left = left, this.right = right;
                }
                return __extends(SQAndExpr, _super), SQAndExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitAnd(this, arg);
                }, SQAndExpr;
            }(SQExpr);
            data.SQAndExpr = SQAndExpr;
            var SQBetweenExpr = function(_super) {
                function SQBetweenExpr(arg, lower, upper) {
                    _super.call(this, 8), this.arg = arg, this.lower = lower, this.upper = upper;
                }
                return __extends(SQBetweenExpr, _super), SQBetweenExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitBetween(this, arg);
                }, SQBetweenExpr;
            }(SQExpr);
            data.SQBetweenExpr = SQBetweenExpr;
            var SQInExpr = function(_super) {
                function SQInExpr(args, values) {
                    _super.call(this, 9), this.args = args, this.values = values;
                }
                return __extends(SQInExpr, _super), SQInExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitIn(this, arg);
                }, SQInExpr;
            }(SQExpr);
            data.SQInExpr = SQInExpr;
            var SQOrExpr = function(_super) {
                function SQOrExpr(left, right) {
                    _super.call(this, 10), this.left = left, this.right = right;
                }
                return __extends(SQOrExpr, _super), SQOrExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitOr(this, arg);
                }, SQOrExpr;
            }(SQExpr);
            data.SQOrExpr = SQOrExpr;
            var SQCompareExpr = function(_super) {
                function SQCompareExpr(comparison, left, right) {
                    _super.call(this, 12), this.comparison = comparison, this.left = left, this.right = right;
                }
                return __extends(SQCompareExpr, _super), SQCompareExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitCompare(this, arg);
                }, SQCompareExpr;
            }(SQExpr);
            data.SQCompareExpr = SQCompareExpr;
            var SQContainsExpr = function(_super) {
                function SQContainsExpr(left, right) {
                    _super.call(this, 11), this.left = left, this.right = right;
                }
                return __extends(SQContainsExpr, _super), SQContainsExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitContains(this, arg);
                }, SQContainsExpr;
            }(SQExpr);
            data.SQContainsExpr = SQContainsExpr;
            var SQStartsWithExpr = function(_super) {
                function SQStartsWithExpr(left, right) {
                    _super.call(this, 13), this.left = left, this.right = right;
                }
                return __extends(SQStartsWithExpr, _super), SQStartsWithExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitStartsWith(this, arg);
                }, SQStartsWithExpr;
            }(SQExpr);
            data.SQStartsWithExpr = SQStartsWithExpr;
            var SQExistsExpr = function(_super) {
                function SQExistsExpr(arg) {
                    _super.call(this, 14), this.arg = arg;
                }
                return __extends(SQExistsExpr, _super), SQExistsExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitExists(this, arg);
                }, SQExistsExpr;
            }(SQExpr);
            data.SQExistsExpr = SQExistsExpr;
            var SQNotExpr = function(_super) {
                function SQNotExpr(arg) {
                    _super.call(this, 15), this.arg = arg;
                }
                return __extends(SQNotExpr, _super), SQNotExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitNot(this, arg);
                }, SQNotExpr;
            }(SQExpr);
            data.SQNotExpr = SQNotExpr;
            var SQConstantExpr = function(_super) {
                function SQConstantExpr(type, value, valueEncoded) {
                    _super.call(this, 16), this.type = type, this.value = value, this.valueEncoded = valueEncoded;
                }
                return __extends(SQConstantExpr, _super), SQConstantExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitConstant(this, arg);
                }, SQConstantExpr.prototype.getMetadata = function(federatedSchema) {
                    return {
                        kind: 1,
                        type: this.type
                    };
                }, SQConstantExpr;
            }(SQExpr);
            data.SQConstantExpr = SQConstantExpr;
            var SQDateSpanExpr = function(_super) {
                function SQDateSpanExpr(unit, arg) {
                    _super.call(this, 17), this.unit = unit, this.arg = arg;
                }
                return __extends(SQDateSpanExpr, _super), SQDateSpanExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitDateSpan(this, arg);
                }, SQDateSpanExpr;
            }(SQExpr);
            data.SQDateSpanExpr = SQDateSpanExpr;
            var SQDateAddExpr = function(_super) {
                function SQDateAddExpr(unit, amount, arg) {
                    _super.call(this, 18), this.unit = unit, this.arg = arg, this.amount = amount;
                }
                return __extends(SQDateAddExpr, _super), SQDateAddExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitDateAdd(this, arg);
                }, SQDateAddExpr;
            }(SQExpr);
            data.SQDateAddExpr = SQDateAddExpr;
            var SQNowExpr = function(_super) {
                function SQNowExpr() {
                    _super.call(this, 19);
                }
                return __extends(SQNowExpr, _super), SQNowExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitNow(this, arg);
                }, SQNowExpr;
            }(SQExpr);
            data.SQNowExpr = SQNowExpr;
            var SQDefaultValueExpr = function(_super) {
                function SQDefaultValueExpr() {
                    _super.call(this, 21);
                }
                return __extends(SQDefaultValueExpr, _super), SQDefaultValueExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitDefaultValue(this, arg);
                }, SQDefaultValueExpr;
            }(SQExpr);
            data.SQDefaultValueExpr = SQDefaultValueExpr;
            var SQAnyValueExpr = function(_super) {
                function SQAnyValueExpr() {
                    _super.call(this, 20);
                }
                return __extends(SQAnyValueExpr, _super), SQAnyValueExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitAnyValue(this, arg);
                }, SQAnyValueExpr;
            }(SQExpr);
            data.SQAnyValueExpr = SQAnyValueExpr;
            var SQFillRuleExpr = function(_super) {
                function SQFillRuleExpr(input, fillRule) {
                    _super.call(this, 23), this.input = input, this.rule = fillRule;
                }
                return __extends(SQFillRuleExpr, _super), SQFillRuleExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitFillRule(this, arg);
                }, SQFillRuleExpr;
            }(SQExpr);
            data.SQFillRuleExpr = SQFillRuleExpr;
            var SQResourcePackageItemExpr = function(_super) {
                function SQResourcePackageItemExpr(packageName, packageType, itemName) {
                    _super.call(this, 24), this.packageName = packageName, this.packageType = packageType, 
                    this.itemName = itemName;
                }
                return __extends(SQResourcePackageItemExpr, _super), SQResourcePackageItemExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitResourcePackageItem(this, arg);
                }, SQResourcePackageItemExpr;
            }(SQExpr);
            data.SQResourcePackageItemExpr = SQResourcePackageItemExpr;
            var SQTransformTableRefExpr = function(_super) {
                function SQTransformTableRefExpr(source) {
                    _super.call(this, 29), this.source = source;
                }
                return __extends(SQTransformTableRefExpr, _super), SQTransformTableRefExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitTransformTableRef(this, arg);
                }, SQTransformTableRefExpr;
            }(SQExpr);
            data.SQTransformTableRefExpr = SQTransformTableRefExpr;
            var SQTransformOutputRoleRefExpr = function(_super) {
                function SQTransformOutputRoleRefExpr(role, transform) {
                    _super.call(this, 30), this.role = role, transform && (this.transform = transform);
                }
                return __extends(SQTransformOutputRoleRefExpr, _super), SQTransformOutputRoleRefExpr.prototype.accept = function(visitor, arg) {
                    return visitor.visitTransformOutputRoleRef(this, arg);
                }, SQTransformOutputRoleRefExpr;
            }(SQExpr);
            data.SQTransformOutputRoleRefExpr = SQTransformOutputRoleRefExpr;
            var SQExprBuilder;
            !function(SQExprBuilder) {
                function entity(schema, entity, variable) {
                    return new SQEntityExpr(schema, entity, variable);
                }
                function columnRef(source, prop) {
                    return new SQColumnRefExpr(source, prop);
                }
                function measureRef(source, prop) {
                    return new SQMeasureRefExpr(source, prop);
                }
                function aggregate(source, aggregate) {
                    return new SQAggregationExpr(source, aggregate);
                }
                function selectRef(expressionName) {
                    return new SQSelectRefExpr(expressionName);
                }
                function percentile(source, k, exclusive) {
                    return new SQPercentileExpr(source, k, exclusive);
                }
                function arithmetic(left, right, operator) {
                    return new SQArithmeticExpr(left, right, operator);
                }
                function scopedEval(expression, scope) {
                    return new SQScopedEvalExpr(expression, scope);
                }
                function withRef(expressionName) {
                    return new SQWithRefExpr(expressionName);
                }
                function hierarchy(source, hierarchy) {
                    return new SQHierarchyExpr(source, hierarchy);
                }
                function propertyVariationSource(source, name, property) {
                    return new SQPropertyVariationSourceExpr(source, name, property);
                }
                function hierarchyLevel(source, level) {
                    return new SQHierarchyLevelExpr(source, level);
                }
                function transformTableRef(source) {
                    return new SQTransformTableRefExpr(source);
                }
                function transformOutputRoleRef(role, transform) {
                    return new SQTransformOutputRoleRefExpr(role, transform);
                }
                function and(left, right) {
                    return left ? right ? new SQAndExpr(left, right) : left : right;
                }
                function between(arg, lower, upper) {
                    return new SQBetweenExpr(arg, lower, upper);
                }
                function inExpr(args, values) {
                    return new SQInExpr(args, values);
                }
                function or(left, right) {
                    if (!left) return right;
                    if (!right) return left;
                    if (left instanceof SQInExpr && right instanceof SQInExpr) {
                        var inExpr_1 = tryUseInExprs(left, right);
                        if (inExpr_1) return inExpr_1;
                    }
                    return new SQOrExpr(left, right);
                }
                function tryUseInExprs(left, right) {
                    if (left.args && right.args) {
                        var leftArgLen = left.args.length, rightArgLen = right.args.length;
                        if (leftArgLen === rightArgLen) {
                            for (var i = 0; leftArgLen > i; ++i) if (!SQExpr.equals(left.args[i], right.args[i])) return;
                            var combinedValues = left.values.concat(right.values);
                            return SQExprBuilder.inExpr(left.args, combinedValues);
                        }
                    }
                }
                function compare(kind, left, right) {
                    return new SQCompareExpr(kind, left, right);
                }
                function contains(left, right) {
                    return new SQContainsExpr(left, right);
                }
                function exists(arg) {
                    return new SQExistsExpr(arg);
                }
                function equal(left, right) {
                    return compare(data.QueryComparisonKind.Equal, left, right);
                }
                function not(arg) {
                    return new SQNotExpr(arg);
                }
                function startsWith(left, right) {
                    return new SQStartsWithExpr(left, right);
                }
                function nullConstant() {
                    return new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Null), null, data.PrimitiveValueEncoding.nullEncoding());
                }
                function now() {
                    return new SQNowExpr();
                }
                function defaultValue() {
                    return new SQDefaultValueExpr();
                }
                function anyValue() {
                    return new SQAnyValueExpr();
                }
                function boolean(value) {
                    return new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Boolean), value, data.PrimitiveValueEncoding["boolean"](value));
                }
                function dateAdd(unit, amount, arg) {
                    return new SQDateAddExpr(unit, amount, arg);
                }
                function dateTime(value, valueEncoded) {
                    return void 0 === valueEncoded && (valueEncoded = data.PrimitiveValueEncoding.dateTime(value)), 
                    new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.DateTime), value, valueEncoded);
                }
                function dateSpan(unit, arg) {
                    return new SQDateSpanExpr(unit, arg);
                }
                function decimal(value, valueEncoded) {
                    return void 0 === valueEncoded && (valueEncoded = data.PrimitiveValueEncoding.decimal(value)), 
                    new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Decimal), value, valueEncoded);
                }
                function double(value, valueEncoded) {
                    return void 0 === valueEncoded && (valueEncoded = data.PrimitiveValueEncoding["double"](value)), 
                    new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Double), value, valueEncoded);
                }
                function integer(value, valueEncoded) {
                    return void 0 === valueEncoded && (valueEncoded = data.PrimitiveValueEncoding.integer(value)), 
                    new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Integer), value, valueEncoded);
                }
                function text(value, valueEncoded) {
                    return new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Text), value, valueEncoded || data.PrimitiveValueEncoding.text(value));
                }
                function typedConstant(value, type) {
                    return null == value ? nullConstant() : _.isBoolean(value) ? boolean(value) : _.isString(value) ? text(value) : _.isNumber(value) ? type.integer && powerbi.Double.isInteger(value) ? integer(value) : double(value) : value instanceof Date ? dateTime(value) : void 0;
                }
                function setAggregate(expr, aggregate) {
                    return FieldExprChangeAggregateRewriter.rewrite(expr, aggregate);
                }
                function removeAggregate(expr) {
                    return FieldExprRemoveAggregateRewriter.rewrite(expr);
                }
                function setPercentOfGrandTotal(expr) {
                    return SQExprSetPercentOfGrandTotalRewriter.rewrite(expr);
                }
                function removePercentOfGrandTotal(expr) {
                    return SQExprRemovePercentOfGrandTotalRewriter.rewrite(expr);
                }
                function removeEntityVariables(expr) {
                    return SQExprRemoveEntityVariablesRewriter.rewrite(expr);
                }
                function fillRule(expr, rule) {
                    return new SQFillRuleExpr(expr, rule);
                }
                function resourcePackageItem(packageName, packageType, itemName) {
                    return new SQResourcePackageItemExpr(packageName, packageType, itemName);
                }
                SQExprBuilder.entity = entity, SQExprBuilder.columnRef = columnRef, SQExprBuilder.measureRef = measureRef, 
                SQExprBuilder.aggregate = aggregate, SQExprBuilder.selectRef = selectRef, SQExprBuilder.percentile = percentile, 
                SQExprBuilder.arithmetic = arithmetic, SQExprBuilder.scopedEval = scopedEval, SQExprBuilder.withRef = withRef, 
                SQExprBuilder.hierarchy = hierarchy, SQExprBuilder.propertyVariationSource = propertyVariationSource, 
                SQExprBuilder.hierarchyLevel = hierarchyLevel, SQExprBuilder.transformTableRef = transformTableRef, 
                SQExprBuilder.transformOutputRoleRef = transformOutputRoleRef, SQExprBuilder.and = and, 
                SQExprBuilder.between = between, SQExprBuilder.inExpr = inExpr, SQExprBuilder.or = or, 
                SQExprBuilder.compare = compare, SQExprBuilder.contains = contains, SQExprBuilder.exists = exists, 
                SQExprBuilder.equal = equal, SQExprBuilder.not = not, SQExprBuilder.startsWith = startsWith, 
                SQExprBuilder.nullConstant = nullConstant, SQExprBuilder.now = now, SQExprBuilder.defaultValue = defaultValue, 
                SQExprBuilder.anyValue = anyValue, SQExprBuilder["boolean"] = boolean, SQExprBuilder.dateAdd = dateAdd, 
                SQExprBuilder.dateTime = dateTime, SQExprBuilder.dateSpan = dateSpan, SQExprBuilder.decimal = decimal, 
                SQExprBuilder["double"] = double, SQExprBuilder.integer = integer, SQExprBuilder.text = text, 
                SQExprBuilder.typedConstant = typedConstant, SQExprBuilder.setAggregate = setAggregate, 
                SQExprBuilder.removeAggregate = removeAggregate, SQExprBuilder.setPercentOfGrandTotal = setPercentOfGrandTotal, 
                SQExprBuilder.removePercentOfGrandTotal = removePercentOfGrandTotal, SQExprBuilder.removeEntityVariables = removeEntityVariables, 
                SQExprBuilder.fillRule = fillRule, SQExprBuilder.resourcePackageItem = resourcePackageItem;
            }(SQExprBuilder = data.SQExprBuilder || (data.SQExprBuilder = {}));
            var SQExprInfo;
            !function(SQExprInfo) {
                function getAggregate(expr) {
                    return SQExprAggregateInfoVisitor.getAggregate(expr);
                }
                SQExprInfo.getAggregate = getAggregate;
            }(SQExprInfo = data.SQExprInfo || (data.SQExprInfo = {}));
            var SQExprEqualityVisitor = function() {
                function SQExprEqualityVisitor(ignoreCase) {
                    this.ignoreCase = ignoreCase;
                }
                return SQExprEqualityVisitor.run = function(x, y, ignoreCase) {
                    return x = x || null, y = y || null, x === y ? !0 : !x != !y ? !1 : ignoreCase ? x.accept(SQExprEqualityVisitor.ignoreCaseInstance, y) : x.accept(SQExprEqualityVisitor.instance, y);
                }, SQExprEqualityVisitor.prototype.visitColumnRef = function(expr, comparand) {
                    return comparand instanceof SQColumnRefExpr && expr.ref === comparand.ref && this.equals(expr.source, comparand.source);
                }, SQExprEqualityVisitor.prototype.visitMeasureRef = function(expr, comparand) {
                    return comparand instanceof SQMeasureRefExpr && expr.ref === comparand.ref && this.equals(expr.source, comparand.source);
                }, SQExprEqualityVisitor.prototype.visitAggr = function(expr, comparand) {
                    return comparand instanceof SQAggregationExpr && expr.func === comparand.func && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitPercentile = function(expr, comparand) {
                    return comparand instanceof SQPercentileExpr && expr.exclusive === comparand.exclusive && expr.k === comparand.k && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitHierarchy = function(expr, comparand) {
                    return comparand instanceof SQHierarchyExpr && expr.hierarchy === comparand.hierarchy && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitHierarchyLevel = function(expr, comparand) {
                    return comparand instanceof SQHierarchyLevelExpr && expr.level === comparand.level && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitPropertyVariationSource = function(expr, comparand) {
                    return comparand instanceof SQPropertyVariationSourceExpr && expr.name === comparand.name && expr.property === comparand.property && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitSelectRef = function(expr, comparand) {
                    return comparand instanceof SQSelectRefExpr && expr.expressionName === comparand.expressionName;
                }, SQExprEqualityVisitor.prototype.visitBetween = function(expr, comparand) {
                    return comparand instanceof SQBetweenExpr && this.equals(expr.arg, comparand.arg) && this.equals(expr.lower, comparand.lower) && this.equals(expr.upper, comparand.upper);
                }, SQExprEqualityVisitor.prototype.visitIn = function(expr, comparand) {
                    if (!(comparand instanceof SQInExpr && this.equalsAll(expr.args, comparand.args))) return !1;
                    var values = expr.values, compareValues = comparand.values;
                    if (values.length !== compareValues.length) return !1;
                    for (var i = 0, len = values.length; len > i; i++) if (!this.equalsAll(values[i], compareValues[i])) return !1;
                    return !0;
                }, SQExprEqualityVisitor.prototype.visitEntity = function(expr, comparand) {
                    return comparand instanceof SQEntityExpr && expr.schema === comparand.schema && expr.entity === comparand.entity && this.optionalEqual(expr.variable, comparand.variable);
                }, SQExprEqualityVisitor.prototype.visitAnd = function(expr, comparand) {
                    return comparand instanceof SQAndExpr && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
                }, SQExprEqualityVisitor.prototype.visitOr = function(expr, comparand) {
                    return comparand instanceof SQOrExpr && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
                }, SQExprEqualityVisitor.prototype.visitCompare = function(expr, comparand) {
                    return comparand instanceof SQCompareExpr && expr.comparison === comparand.comparison && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
                }, SQExprEqualityVisitor.prototype.visitContains = function(expr, comparand) {
                    return comparand instanceof SQContainsExpr && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
                }, SQExprEqualityVisitor.prototype.visitDateSpan = function(expr, comparand) {
                    return comparand instanceof SQDateSpanExpr && expr.unit === comparand.unit && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitDateAdd = function(expr, comparand) {
                    return comparand instanceof SQDateAddExpr && expr.unit === comparand.unit && expr.amount === comparand.amount && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitExists = function(expr, comparand) {
                    return comparand instanceof SQExistsExpr && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitNot = function(expr, comparand) {
                    return comparand instanceof SQNotExpr && this.equals(expr.arg, comparand.arg);
                }, SQExprEqualityVisitor.prototype.visitNow = function(expr, comparand) {
                    return comparand instanceof SQNowExpr;
                }, SQExprEqualityVisitor.prototype.visitDefaultValue = function(expr, comparand) {
                    return comparand instanceof SQDefaultValueExpr;
                }, SQExprEqualityVisitor.prototype.visitAnyValue = function(expr, comparand) {
                    return comparand instanceof SQAnyValueExpr;
                }, SQExprEqualityVisitor.prototype.visitResourcePackageItem = function(expr, comparand) {
                    return comparand instanceof SQResourcePackageItemExpr && expr.packageName === comparand.packageName && expr.packageType === comparand.packageType && expr.itemName === comparand.itemName;
                }, SQExprEqualityVisitor.prototype.visitStartsWith = function(expr, comparand) {
                    return comparand instanceof SQStartsWithExpr && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
                }, SQExprEqualityVisitor.prototype.visitConstant = function(expr, comparand) {
                    return comparand instanceof SQConstantExpr && expr.type === comparand.type ? expr.type.text && this.ignoreCase ? StringExtensions.equalIgnoreCase(expr.valueEncoded, comparand.valueEncoded) : expr.valueEncoded === comparand.valueEncoded : !1;
                }, SQExprEqualityVisitor.prototype.visitFillRule = function(expr, comparand) {
                    if (comparand instanceof SQFillRuleExpr && this.equals(expr.input, comparand.input)) {
                        var leftRule = expr.rule, rightRule = comparand.rule;
                        if (leftRule === rightRule) return !0;
                        var leftLinearGradient2 = leftRule.linearGradient2, rightLinearGradient2 = rightRule.linearGradient2;
                        if (leftLinearGradient2 && rightLinearGradient2) return this.visitLinearGradient2(leftLinearGradient2, rightLinearGradient2);
                        var leftLinearGradient3 = leftRule.linearGradient3, rightLinearGradient3 = rightRule.linearGradient3;
                        if (leftLinearGradient3 && rightLinearGradient3) return this.visitLinearGradient3(leftLinearGradient3, rightLinearGradient3);
                    }
                    return !1;
                }, SQExprEqualityVisitor.prototype.visitLinearGradient2 = function(left2, right2) {
                    return this.equalsFillRuleStop(left2.min, right2.min) && this.equalsFillRuleStop(left2.max, right2.max);
                }, SQExprEqualityVisitor.prototype.visitLinearGradient3 = function(left3, right3) {
                    return this.equalsFillRuleStop(left3.min, right3.min) && this.equalsFillRuleStop(left3.mid, right3.mid) && this.equalsFillRuleStop(left3.max, right3.max);
                }, SQExprEqualityVisitor.prototype.equalsFillRuleStop = function(stop1, stop2) {
                    return this.equals(stop1.color, stop2.color) ? stop1.value ? this.equals(stop1.value, stop2.value) : stop1.value === stop2.value : !1;
                }, SQExprEqualityVisitor.prototype.visitArithmetic = function(expr, comparand) {
                    return comparand instanceof SQArithmeticExpr && expr.operator === comparand.operator && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
                }, SQExprEqualityVisitor.prototype.visitScopedEval = function(expr, comparand) {
                    return comparand instanceof SQScopedEvalExpr && this.equals(expr.expression, comparand.expression) && this.equalsAll(expr.scope, comparand.scope);
                }, SQExprEqualityVisitor.prototype.visitWithRef = function(expr, comparand) {
                    return comparand instanceof SQWithRefExpr && expr.expressionName === comparand.expressionName;
                }, SQExprEqualityVisitor.prototype.visitTransformTableRef = function(expr, comparand) {
                    return comparand instanceof SQTransformTableRefExpr && expr.source === comparand.source;
                }, SQExprEqualityVisitor.prototype.visitTransformOutputRoleRef = function(expr, comparand) {
                    return comparand instanceof SQTransformOutputRoleRefExpr && expr.role === comparand.role && expr.transform === comparand.transform;
                }, SQExprEqualityVisitor.prototype.optionalEqual = function(x, y) {
                    return x && y ? x === y : !0;
                }, SQExprEqualityVisitor.prototype.equals = function(x, y) {
                    return x.accept(this, y);
                }, SQExprEqualityVisitor.prototype.equalsAll = function(x, y) {
                    var len = x.length;
                    if (len !== y.length) return !1;
                    for (var i = 0; len > i; i++) if (!this.equals(x[i], y[i])) return !1;
                    return !0;
                }, SQExprEqualityVisitor.instance = new SQExprEqualityVisitor(!1), SQExprEqualityVisitor.ignoreCaseInstance = new SQExprEqualityVisitor(!0), 
                SQExprEqualityVisitor;
            }(), SQExprRootRewriter = function(_super) {
                function SQExprRootRewriter() {
                    _super.apply(this, arguments);
                }
                return __extends(SQExprRootRewriter, _super), SQExprRootRewriter.prototype.visitDefault = function(expr) {
                    return expr;
                }, SQExprRootRewriter;
            }(data.DefaultSQExprVisitor), SQExprValidationVisitor = function(_super) {
                function SQExprValidationVisitor(schema, aggrUtils, errors) {
                    _super.call(this), this.schema = schema, this.aggrUtils = aggrUtils, errors && (this.errors = errors);
                }
                return __extends(SQExprValidationVisitor, _super), SQExprValidationVisitor.prototype.visitIn = function(expr) {
                    for (var inExpr = _super.prototype.visitIn.call(this, expr), args = inExpr.args, values = inExpr.values, _i = 0, values_1 = values; _i < values_1.length; _i++) for (var valueTuple = values_1[_i], i = 0, len = valueTuple.length; len > i; ++i) this.validateCompatibleType(args[i], valueTuple[i]);
                    return inExpr;
                }, SQExprValidationVisitor.prototype.visitCompare = function(expr) {
                    var compareExpr = _super.prototype.visitCompare.call(this, expr);
                    return this.validateCompatibleType(compareExpr.left, compareExpr.right), compareExpr;
                }, SQExprValidationVisitor.prototype.visitColumnRef = function(expr) {
                    var fieldExpr = data.SQExprConverter.asFieldPattern(expr);
                    if (fieldExpr) {
                        var fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr), entity = this.validateEntity(fieldExprItem.schema, fieldExprItem.entity);
                        if (entity) {
                            var prop = entity.properties.withName(fieldExpr.column.name);
                            prop && 0 === prop.kind && this.isQueryable(fieldExpr) || this.register(3);
                        }
                    }
                    return expr;
                }, SQExprValidationVisitor.prototype.visitMeasureRef = function(expr) {
                    var fieldExpr = data.SQExprConverter.asFieldPattern(expr);
                    if (fieldExpr) {
                        var fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr), entity = this.validateEntity(fieldExprItem.schema, fieldExprItem.entity);
                        if (entity) {
                            var prop = entity.properties.withName(fieldExpr.measure.name);
                            prop && 1 === prop.kind && this.isQueryable(fieldExpr) || this.register(4);
                        }
                    }
                    return expr;
                }, SQExprValidationVisitor.prototype.visitAggr = function(expr) {
                    var aggregateExpr = _super.prototype.visitAggr.call(this, expr), columnRefExpr = SQExprColumnRefInfoVisitor.getColumnRefSQExpr(this.schema, aggregateExpr.arg);
                    return columnRefExpr && (this.aggrUtils.isSupportedAggregate(expr, this.schema, expr.func, null, !0) || this.register(0)), 
                    aggregateExpr;
                }, SQExprValidationVisitor.prototype.visitHierarchy = function(expr) {
                    var fieldExpr = data.SQExprConverter.asFieldPattern(expr);
                    if (fieldExpr) {
                        var fieldExprItem = fieldExpr.hierarchy;
                        fieldExprItem ? this.validateHierarchy(fieldExprItem.schema, fieldExprItem.entity, fieldExprItem.name) : this.register(5);
                    }
                    return expr;
                }, SQExprValidationVisitor.prototype.visitHierarchyLevel = function(expr) {
                    var fieldExpr = data.SQExprConverter.asFieldPattern(expr);
                    if (fieldExpr) {
                        var hierarchyLevelFieldExprItem = fieldExpr.hierarchyLevel;
                        hierarchyLevelFieldExprItem ? this.validateHierarchyLevel(hierarchyLevelFieldExprItem.schema, hierarchyLevelFieldExprItem.entity, hierarchyLevelFieldExprItem.name, hierarchyLevelFieldExprItem.level) : fieldExpr.columnHierarchyLevelVariation || this.register(6);
                    }
                    return expr;
                }, SQExprValidationVisitor.prototype.visitPercentile = function(expr) {
                    if (expr.arg.accept(this), _.isEmpty(this.errors)) {
                        var argMetadata = expr.arg.getMetadata(this.schema);
                        argMetadata && 0 === argMetadata.kind && argMetadata.type && (argMetadata.type.integer || argMetadata.type.numeric) || this.register(10);
                    }
                    return expr;
                }, SQExprValidationVisitor.prototype.visitEntity = function(expr) {
                    return this.validateEntity(expr.schema, expr.entity), expr;
                }, SQExprValidationVisitor.prototype.visitContains = function(expr) {
                    return this.validateOperandsAndTypeForStartOrContains(expr.left, expr.right), expr;
                }, SQExprValidationVisitor.prototype.visitStartsWith = function(expr) {
                    return this.validateOperandsAndTypeForStartOrContains(expr.left, expr.right), expr;
                }, SQExprValidationVisitor.prototype.visitArithmetic = function(expr) {
                    return this.validateArithmeticTypes(expr.left, expr.right), expr;
                }, SQExprValidationVisitor.prototype.visitScopedEval = function(expr) {
                    for (var _i = 0, _a = expr.scope; _i < _a.length; _i++) {
                        var scopeRef = _a[_i];
                        SQExpr.isWithRef(scopeRef) || SQExpr.isColumn(scopeRef) || this.register(11);
                    }
                    return expr;
                }, SQExprValidationVisitor.prototype.visitWithRef = function(expr) {
                    return expr;
                }, SQExprValidationVisitor.prototype.visitTransformTableRef = function(expr) {
                    return expr;
                }, SQExprValidationVisitor.prototype.visitTransformOutputRoleRef = function(expr) {
                    return expr;
                }, SQExprValidationVisitor.prototype.validateOperandsAndTypeForStartOrContains = function(left, right) {
                    left instanceof SQColumnRefExpr ? this.visitColumnRef(left) : left instanceof SQHierarchyLevelExpr ? this.visitHierarchyLevel(left) : this.register(7), 
                    right instanceof SQConstantExpr && right.type.text ? this.validateCompatibleType(left, right) : this.register(8);
                }, SQExprValidationVisitor.prototype.validateArithmeticTypes = function(left, right) {
                    data.SQExprUtils.supportsArithmetic(left, this.schema) || this.register(7), data.SQExprUtils.supportsArithmetic(right, this.schema) || this.register(8);
                }, SQExprValidationVisitor.prototype.validateCompatibleType = function(left, right) {
                    var leftMetadata = left.getMetadata(this.schema), leftType = leftMetadata && leftMetadata.type, rightMetadata = right.getMetadata(this.schema), rightType = rightMetadata && rightMetadata.type;
                    leftType && rightType && !leftType.isCompatibleFrom(rightType) && this.register(9);
                }, SQExprValidationVisitor.prototype.validateEntity = function(schemaName, entityName) {
                    var schema = this.schema.schema(schemaName);
                    if (schema) {
                        var entity = schema.entities.withName(entityName);
                        if (entity) return entity;
                        this.register(2);
                    } else this.register(1);
                }, SQExprValidationVisitor.prototype.validateHierarchy = function(schemaName, entityName, hierarchyName) {
                    var entity = this.validateEntity(schemaName, entityName);
                    if (entity) {
                        var hierarchy = entity.hierarchies.withName(hierarchyName);
                        if (hierarchy) return hierarchy;
                        this.register(5);
                    }
                }, SQExprValidationVisitor.prototype.validateHierarchyLevel = function(schemaName, entityName, hierarchyName, levelName) {
                    var hierarchy = this.validateHierarchy(schemaName, entityName, hierarchyName);
                    if (hierarchy) {
                        var hierarchyLevel = hierarchy.levels.withName(levelName);
                        if (hierarchyLevel) return hierarchyLevel;
                        this.register(6);
                    }
                }, SQExprValidationVisitor.prototype.register = function(error) {
                    this.errors || (this.errors = []), this.errors.push(error);
                }, SQExprValidationVisitor.prototype.isQueryable = function(fieldExpr) {
                    var fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(fieldExpr);
                    if (fieldExpr.hierarchyLevel || fieldExpr.hierarchyLevelAggr) {
                        var hierarchyLevelConceptualProperty = data.SQHierarchyExprUtils.getConceptualHierarchyLevelFromExpr(this.schema, fieldExpr);
                        return hierarchyLevelConceptualProperty && 1 !== hierarchyLevelConceptualProperty.column.queryable;
                    }
                    return 1 !== this.schema.schema(fieldExprItem.schema).findProperty(fieldExprItem.entity, data.FieldExprPattern.getPropertyName(fieldExpr)).queryable;
                }, SQExprValidationVisitor;
            }(data.SQExprRewriter);
            data.SQExprValidationVisitor = SQExprValidationVisitor;
            var SQExprAggregateInfoVisitor = function(_super) {
                function SQExprAggregateInfoVisitor() {
                    _super.apply(this, arguments);
                }
                return __extends(SQExprAggregateInfoVisitor, _super), SQExprAggregateInfoVisitor.prototype.visitAggr = function(expr) {
                    return expr.func;
                }, SQExprAggregateInfoVisitor.prototype.visitDefault = function(expr) {}, SQExprAggregateInfoVisitor.getAggregate = function(expr) {
                    var visitor = new SQExprAggregateInfoVisitor();
                    return expr.accept(visitor);
                }, SQExprAggregateInfoVisitor;
            }(data.DefaultSQExprVisitor), SQExprColumnRefInfoVisitor = function(_super) {
                function SQExprColumnRefInfoVisitor(schema) {
                    _super.call(this), this.schema = schema;
                }
                return __extends(SQExprColumnRefInfoVisitor, _super), SQExprColumnRefInfoVisitor.prototype.visitColumnRef = function(expr) {
                    return expr;
                }, SQExprColumnRefInfoVisitor.prototype.visitHierarchyLevel = function(expr) {
                    var ref = expr.level, hierarchy = expr.arg, sourceExpr = hierarchy.accept(this);
                    if (hierarchy && hierarchy.arg instanceof SQPropertyVariationSourceExpr) {
                        var propertyVariationSource = hierarchy.arg, targetEntity = sourceExpr.getTargetEntityForVariation(this.schema, propertyVariationSource.name);
                        if (sourceExpr && targetEntity) {
                            var schemaName = sourceExpr.source.schema, targetEntityExpr = SQExprBuilder.entity(schemaName, targetEntity), schemaHierarchy = this.schema.schema(schemaName).findHierarchy(targetEntity, hierarchy.hierarchy);
                            if (schemaHierarchy) for (var _i = 0, _a = schemaHierarchy.levels; _i < _a.length; _i++) {
                                var level = _a[_i];
                                if (level.name === ref) return new SQColumnRefExpr(targetEntityExpr, level.column.name);
                            }
                        }
                    } else {
                        var entityExpr = hierarchy.arg, hierarchyLevelRef = data.SQHierarchyExprUtils.getConceptualHierarchyLevel(this.schema, entityExpr.schema, entityExpr.entity, hierarchy.hierarchy, expr.level);
                        if (hierarchyLevelRef) return new SQColumnRefExpr(hierarchy.arg, hierarchyLevelRef.column.name);
                    }
                }, SQExprColumnRefInfoVisitor.prototype.visitHierarchy = function(expr) {
                    return expr.arg.accept(this);
                }, SQExprColumnRefInfoVisitor.prototype.visitPropertyVariationSource = function(expr) {
                    var propertyName = expr.property;
                    return new SQColumnRefExpr(expr.arg, propertyName);
                }, SQExprColumnRefInfoVisitor.prototype.visitAggr = function(expr) {
                    return expr.arg.accept(this);
                }, SQExprColumnRefInfoVisitor.prototype.visitDefault = function(expr) {}, SQExprColumnRefInfoVisitor.getColumnRefSQExpr = function(schema, expr) {
                    var visitor = new SQExprColumnRefInfoVisitor(schema);
                    return expr.accept(visitor);
                }, SQExprColumnRefInfoVisitor;
            }(data.DefaultSQExprVisitor), SQEntityExprInfoVisitor = function(_super) {
                function SQEntityExprInfoVisitor(schema) {
                    _super.call(this), this.schema = schema;
                }
                return __extends(SQEntityExprInfoVisitor, _super), SQEntityExprInfoVisitor.prototype.visitEntity = function(expr) {
                    return expr;
                }, SQEntityExprInfoVisitor.prototype.visitColumnRef = function(expr) {
                    return SQEntityExprInfoVisitor.getEntity(expr);
                }, SQEntityExprInfoVisitor.prototype.visitHierarchyLevel = function(expr) {
                    var columnRef = SQEntityExprInfoVisitor.getColumnRefSQExpr(this.schema, expr);
                    return SQEntityExprInfoVisitor.getEntity(columnRef);
                }, SQEntityExprInfoVisitor.prototype.visitHierarchy = function(expr) {
                    return expr.arg.accept(this);
                }, SQEntityExprInfoVisitor.prototype.visitPropertyVariationSource = function(expr) {
                    var columnRef = SQEntityExprInfoVisitor.getColumnRefSQExpr(this.schema, expr);
                    return SQEntityExprInfoVisitor.getEntity(columnRef);
                }, SQEntityExprInfoVisitor.prototype.visitAggr = function(expr) {
                    var columnRef = SQEntityExprInfoVisitor.getColumnRefSQExpr(this.schema, expr);
                    return SQEntityExprInfoVisitor.getEntity(columnRef);
                }, SQEntityExprInfoVisitor.prototype.visitMeasureRef = function(expr) {
                    return expr.source.accept(this);
                }, SQEntityExprInfoVisitor.getColumnRefSQExpr = function(schema, expr) {
                    var visitor = new SQExprColumnRefInfoVisitor(schema);
                    return expr.accept(visitor);
                }, SQEntityExprInfoVisitor.getEntity = function(columnRef) {
                    var field = data.SQExprConverter.asFieldPattern(columnRef), column = field.column;
                    return SQExprBuilder.entity(column.schema, column.entity, column.entityVar);
                }, SQEntityExprInfoVisitor.getEntityExpr = function(schema, expr) {
                    var visitor = new SQEntityExprInfoVisitor(schema);
                    return expr.accept(visitor);
                }, SQEntityExprInfoVisitor;
            }(data.DefaultSQExprVisitor), SQExprChangeAggregateRewriter = function(_super) {
                function SQExprChangeAggregateRewriter(func) {
                    _super.call(this), this.func = func;
                }
                return __extends(SQExprChangeAggregateRewriter, _super), SQExprChangeAggregateRewriter.prototype.visitAggr = function(expr) {
                    return expr.func === this.func ? expr : new SQAggregationExpr(expr.arg, this.func);
                }, SQExprChangeAggregateRewriter.prototype.visitColumnRef = function(expr) {
                    return new SQAggregationExpr(expr, this.func);
                }, SQExprChangeAggregateRewriter.rewrite = function(expr, func) {
                    var rewriter = new SQExprChangeAggregateRewriter(func);
                    return expr.accept(rewriter);
                }, SQExprChangeAggregateRewriter;
            }(SQExprRootRewriter), FieldExprChangeAggregateRewriter = function() {
                function FieldExprChangeAggregateRewriter(sqExpr, aggregate) {
                    this.sqExpr = sqExpr, this.aggregate = aggregate;
                }
                return FieldExprChangeAggregateRewriter.rewrite = function(sqExpr, aggregate) {
                    return data.FieldExprPattern.visit(sqExpr, new FieldExprChangeAggregateRewriter(sqExpr, aggregate));
                }, FieldExprChangeAggregateRewriter.prototype.visitPercentOfGrandTotal = function(pattern) {
                    return pattern.baseExpr = data.SQExprConverter.asFieldPattern(SQExprChangeAggregateRewriter.rewrite(SQExprBuilder.fieldExpr(pattern.baseExpr), this.aggregate)), 
                    SQExprBuilder.fieldExpr({
                        percentOfGrandTotal: pattern
                    });
                }, FieldExprChangeAggregateRewriter.prototype.visitColumn = function(column) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitColumnAggr = function(columnAggr) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitColumnHierarchyLevelVariation = function(columnHierarchyLevelVariation) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitSelectRef = function(selectRef) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitEntity = function(entity) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitEntityAggr = function(entityAggr) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitHierarchy = function(hierarchy) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitHierarchyLevel = function(hierarchyLevel) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitHierarchyLevelAggr = function(hierarchyLevelAggr) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitMeasure = function(measure) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.visitPercentile = function(percentile) {
                    return this.defaultRewrite();
                }, FieldExprChangeAggregateRewriter.prototype.defaultRewrite = function() {
                    return SQExprChangeAggregateRewriter.rewrite(this.sqExpr, this.aggregate);
                }, FieldExprChangeAggregateRewriter;
            }(), FieldExprRemoveAggregateRewriter = function() {
                function FieldExprRemoveAggregateRewriter(sqExpr) {
                    this.sqExpr = sqExpr;
                }
                return FieldExprRemoveAggregateRewriter.rewrite = function(sqExpr) {
                    return data.FieldExprPattern.visit(sqExpr, new FieldExprRemoveAggregateRewriter(sqExpr));
                }, FieldExprRemoveAggregateRewriter.prototype.visitPercentOfGrandTotal = function(pattern) {
                    return FieldExprRemoveAggregateRewriter.rewrite(SQExprBuilder.fieldExpr(pattern.baseExpr));
                }, FieldExprRemoveAggregateRewriter.prototype.visitColumn = function(column) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitColumnAggr = function(columnAggr) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitColumnHierarchyLevelVariation = function(columnHierarchyLevelVariation) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitSelectRef = function(selectRef) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitEntity = function(entity) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitEntityAggr = function(entityAggr) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitHierarchy = function(hierarchy) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitHierarchyLevel = function(hierarchyLevel) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitHierarchyLevelAggr = function(hierarchyLevelAggr) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitMeasure = function(measure) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.visitPercentile = function(percentile) {
                    return this.defaultRewrite();
                }, FieldExprRemoveAggregateRewriter.prototype.defaultRewrite = function() {
                    return SQExprRemoveAggregateRewriter.rewrite(this.sqExpr);
                }, FieldExprRemoveAggregateRewriter;
            }(), SQExprRemoveAggregateRewriter = function(_super) {
                function SQExprRemoveAggregateRewriter() {
                    _super.apply(this, arguments);
                }
                return __extends(SQExprRemoveAggregateRewriter, _super), SQExprRemoveAggregateRewriter.prototype.visitAggr = function(expr) {
                    return expr.arg;
                }, SQExprRemoveAggregateRewriter.rewrite = function(expr) {
                    return expr.accept(SQExprRemoveAggregateRewriter.instance);
                }, SQExprRemoveAggregateRewriter.instance = new SQExprRemoveAggregateRewriter(), 
                SQExprRemoveAggregateRewriter;
            }(SQExprRootRewriter), SQExprRemoveEntityVariablesRewriter = function(_super) {
                function SQExprRemoveEntityVariablesRewriter() {
                    _super.apply(this, arguments);
                }
                return __extends(SQExprRemoveEntityVariablesRewriter, _super), SQExprRemoveEntityVariablesRewriter.prototype.visitEntity = function(expr) {
                    return expr.variable ? SQExprBuilder.entity(expr.schema, expr.entity) : expr;
                }, SQExprRemoveEntityVariablesRewriter.rewrite = function(expr) {
                    return expr.accept(SQExprRemoveEntityVariablesRewriter.instance);
                }, SQExprRemoveEntityVariablesRewriter.instance = new SQExprRemoveEntityVariablesRewriter(), 
                SQExprRemoveEntityVariablesRewriter;
            }(data.SQExprRewriter), SQExprRemovePercentOfGrandTotalRewriter = function(_super) {
                function SQExprRemovePercentOfGrandTotalRewriter() {
                    _super.apply(this, arguments);
                }
                return __extends(SQExprRemovePercentOfGrandTotalRewriter, _super), SQExprRemovePercentOfGrandTotalRewriter.rewrite = function(expr) {
                    return expr.accept(SQExprRemovePercentOfGrandTotalRewriter.instance);
                }, SQExprRemovePercentOfGrandTotalRewriter.prototype.visitDefault = function(expr) {
                    var fieldExpr = data.SQExprConverter.asFieldPattern(expr);
                    return fieldExpr && fieldExpr.percentOfGrandTotal && (expr = SQExprBuilder.fieldExpr(fieldExpr.percentOfGrandTotal.baseExpr)), 
                    expr;
                }, SQExprRemovePercentOfGrandTotalRewriter.instance = new SQExprRemovePercentOfGrandTotalRewriter(), 
                SQExprRemovePercentOfGrandTotalRewriter;
            }(SQExprRootRewriter), SQExprSetPercentOfGrandTotalRewriter = function(_super) {
                function SQExprSetPercentOfGrandTotalRewriter() {
                    _super.apply(this, arguments);
                }
                return __extends(SQExprSetPercentOfGrandTotalRewriter, _super), SQExprSetPercentOfGrandTotalRewriter.rewrite = function(expr) {
                    return expr.accept(SQExprSetPercentOfGrandTotalRewriter.instance);
                }, SQExprSetPercentOfGrandTotalRewriter.prototype.visitDefault = function(expr) {
                    var fieldExpr = data.SQExprConverter.asFieldPattern(expr);
                    return fieldExpr && !fieldExpr.percentOfGrandTotal && (expr = SQExprBuilder.fieldExpr({
                        percentOfGrandTotal: {
                            baseExpr: data.SQExprConverter.asFieldPattern(expr)
                        }
                    })), expr;
                }, SQExprSetPercentOfGrandTotalRewriter.instance = new SQExprSetPercentOfGrandTotalRewriter(), 
                SQExprSetPercentOfGrandTotalRewriter;
            }(SQExprRootRewriter);
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi, __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var SQExprUtils, ArrayExtensions = jsCommon.ArrayExtensions, StringExtensions = jsCommon.StringExtensions;
            !function(SQExprUtils) {
                function supportsArithmetic(expr, schema) {
                    var metadata = expr.getMetadata(schema), type = metadata && metadata.type;
                    return metadata && type ? type.numeric || type.dateTime || type.duration : !1;
                }
                function indexOfExpr(items, searchElement) {
                    for (var i = 0, len = items.length; len > i; i++) if (data.SQExpr.equals(items[i], searchElement)) return i;
                    return -1;
                }
                function indexOfNamedExpr(items, searchElement) {
                    for (var i = 0, len = items.length; len > i; i++) {
                        var item = items[i];
                        if (item && data.SQExpr.equals(item.expr, searchElement)) return i;
                    }
                    return -1;
                }
                function sequenceEqual(x, y) {
                    var len = x.length;
                    if (len !== y.length) return !1;
                    for (var i = 0; len > i; i++) if (!data.SQExpr.equals(x[i], y[i])) return !1;
                    return !0;
                }
                function uniqueName(namedItems, expr, exprDefaultName) {
                    for (var names = {}, i = 0, len = namedItems.length; len > i; i++) names[namedItems[i].name] = !0;
                    return StringExtensions.findUniqueName(names, exprDefaultName || defaultName(expr));
                }
                function defaultName(expr, fallback) {
                    return void 0 === fallback && (fallback = "select"), expr ? expr.accept(SQExprDefaultNameGenerator.instance, fallback) : fallback;
                }
                function isMeasure(expr) {
                    return expr.accept(IsMeasureVisitor.instance);
                }
                function isAnyValue(expr) {
                    return expr.accept(IsAnyValueVisitor.instance);
                }
                function isDefaultValue(expr) {
                    return expr.accept(IsDefaultValueVisitor.instance);
                }
                function discourageAggregation(expr, schema) {
                    var capabilities = getSchemaCapabilities(expr, schema);
                    return capabilities && capabilities.discourageQueryAggregateUsage;
                }
                function getAggregateBehavior(expr, schema) {
                    var column = getConceptualColumn(expr, schema);
                    return column ? column.aggregateBehavior : void 0;
                }
                function getSchemaCapabilities(expr, schema) {
                    var field = data.SQExprConverter.asFieldPattern(expr);
                    if (field) {
                        var fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(field), conceptualSchema = schema.schema(fieldExprItem.schema);
                        return conceptualSchema ? conceptualSchema.capabilities : void 0;
                    }
                }
                function getKpiMetadata(expr, schema) {
                    var kpiStatusProperty = getKpiStatusProperty(expr, schema);
                    if (kpiStatusProperty) return kpiStatusProperty.kpiValue.measure.kpi.statusMetadata;
                    var kpiTrendProperty = getKpiTrendProperty(expr, schema);
                    return kpiTrendProperty ? kpiTrendProperty.kpiValue.measure.kpi.trendMetadata : void 0;
                }
                function getConceptualEntity(entityExpr, schema) {
                    var conceptualEntity = schema.schema(entityExpr.schema).entities.withName(entityExpr.entity);
                    return conceptualEntity;
                }
                function getKpiStatusProperty(expr, schema) {
                    var property = expr.getConceptualProperty(schema);
                    if (property) {
                        var kpiValue = property.kpiValue;
                        return kpiValue && kpiValue.measure.kpi.status === property ? property : void 0;
                    }
                }
                function getKpiTrendProperty(expr, schema) {
                    var property = expr.getConceptualProperty(schema);
                    if (property) {
                        var kpiValue = property.kpiValue;
                        return kpiValue && kpiValue.measure.kpi.trend === property ? property : void 0;
                    }
                }
                function getDefaultValue(fieldSQExpr, schema) {
                    var column = getConceptualColumn(fieldSQExpr, schema);
                    return column ? column.defaultValue : void 0;
                }
                function getConceptualColumn(fieldSQExpr, schema) {
                    if (fieldSQExpr && schema) {
                        var sqField = data.SQExprConverter.asFieldPattern(fieldSQExpr);
                        if (sqField) {
                            var column = sqField.column;
                            if (column) {
                                if (schema.schema(column.schema) && sqField.column.name) {
                                    var property = schema.schema(column.schema).findProperty(column.entity, sqField.column.name);
                                    if (property) return property.column;
                                }
                            } else {
                                var hierarchyLevelField = sqField.hierarchyLevel;
                                if (hierarchyLevelField) {
                                    var fieldExprItem = data.FieldExprPattern.toFieldExprEntityItemPattern(sqField), schemaName = fieldExprItem.schema;
                                    if (schema.schema(schemaName)) {
                                        var hierarchy = schema.schema(schemaName).findHierarchy(fieldExprItem.entity, hierarchyLevelField.name);
                                        if (hierarchy) {
                                            var hierarchyLevel = hierarchy.levels.withName(hierarchyLevelField.level);
                                            if (hierarchyLevel && hierarchyLevel.column) return hierarchyLevel.column.column;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                function getDefaultValues(fieldSQExprs, schema) {
                    if (!_.isEmpty(fieldSQExprs) && schema) {
                        for (var result = [], _i = 0, fieldSQExprs_1 = fieldSQExprs; _i < fieldSQExprs_1.length; _i++) {
                            var sqExpr = fieldSQExprs_1[_i], defaultValue = getDefaultValue(sqExpr, schema);
                            defaultValue && result.push(defaultValue);
                        }
                        return result;
                    }
                }
                function getDataViewScopeIdentityComparisonExpr(fieldsExpr, values) {
                    for (var compareExprs = [], i = 0; i < fieldsExpr.length; i++) compareExprs.push(data.SQExprBuilder.compare(data.QueryComparisonKind.Equal, fieldsExpr[i], values[i]));
                    if (!_.isEmpty(compareExprs)) {
                        for (var resultExpr, _i = 0, compareExprs_1 = compareExprs; _i < compareExprs_1.length; _i++) {
                            var compareExpr = compareExprs_1[_i];
                            resultExpr = data.SQExprBuilder.and(resultExpr, compareExpr);
                        }
                        return resultExpr;
                    }
                }
                function getActiveTablesNames(queryDefn) {
                    var tables = [], entitiesVisitor = new data.SQFromEntitiesVisitor();
                    if (queryDefn) {
                        var selectedItems = queryDefn.from();
                        if (void 0 !== selectedItems) for (var _i = 0, _a = selectedItems.keys(); _i < _a.length; _i++) {
                            var key = _a[_i];
                            selectedItems.source(key).accept(entitiesVisitor, null);
                        }
                    }
                    return tables = _.map(entitiesVisitor.entities, function(value) {
                        return value.entity;
                    });
                }
                function isRelatedToMany(schema, sourceExpr, targetExpr) {
                    return isRelated(schema, sourceExpr, targetExpr, 0, 2) || isRelated(schema, targetExpr, sourceExpr, 2, 0);
                }
                function isRelatedToOne(schema, sourceExpr, targetExpr) {
                    return isRelated(schema, sourceExpr, targetExpr, 2, 0) || isRelated(schema, targetExpr, sourceExpr, 0, 2);
                }
                function isRelated(schema, sourceExpr, targetExpr, sourceMultiplicity, targetMultiplicity) {
                    var source = SQExprUtils.getConceptualEntity(sourceExpr, schema);
                    if (_.isEmpty(source.navigationProperties)) return !1;
                    var target = SQExprUtils.getConceptualEntity(targetExpr, schema), queue = [];
                    for (queue.push(source); !_.isEmpty(queue); ) {
                        var current = queue.shift(), navProperties = current.navigationProperties;
                        if (!_.isEmpty(navProperties)) for (var _i = 0, navProperties_1 = navProperties; _i < navProperties_1.length; _i++) {
                            var navProperty = navProperties_1[_i];
                            if (navProperty.isActive && navProperty.targetMultiplicity === targetMultiplicity && navProperty.sourceMultiplicity === sourceMultiplicity) {
                                if (navProperty.targetEntity === target) return !0;
                                queue.push(navProperty.targetEntity);
                            }
                        }
                    }
                    return !1;
                }
                function isRelatedOneToOne(schema, sourceExpr, targetExpr) {
                    var source = SQExprUtils.getConceptualEntity(sourceExpr, schema), target = SQExprUtils.getConceptualEntity(targetExpr, schema), sourceNavigations = source.navigationProperties, targetNavigations = target.navigationProperties;
                    return _.isEmpty(sourceNavigations) && _.isEmpty(targetNavigations) ? !1 : hasOneToOneNavigation(sourceNavigations, target) || hasOneToOneNavigation(targetNavigations, source);
                }
                function hasOneToOneNavigation(navigationProperties, targetEntity) {
                    if (_.isEmpty(navigationProperties)) return !1;
                    for (var _i = 0, navigationProperties_1 = navigationProperties; _i < navigationProperties_1.length; _i++) {
                        var navigationProperty = navigationProperties_1[_i];
                        if (navigationProperty.isActive && navigationProperty.targetEntity === targetEntity && 0 === navigationProperty.sourceMultiplicity && 0 === navigationProperty.targetMultiplicity) return !0;
                    }
                    return !1;
                }
                function concatUnique(leftExprs, rightExprs) {
                    for (var concatExprs = ArrayExtensions.copy(leftExprs), _i = 0, rightExprs_1 = rightExprs; _i < rightExprs_1.length; _i++) {
                        var expr = rightExprs_1[_i];
                        -1 === indexOfExpr(concatExprs, expr) && concatExprs.push(expr);
                    }
                    return concatExprs;
                }
                SQExprUtils.supportsArithmetic = supportsArithmetic, SQExprUtils.indexOfExpr = indexOfExpr, 
                SQExprUtils.indexOfNamedExpr = indexOfNamedExpr, SQExprUtils.sequenceEqual = sequenceEqual, 
                SQExprUtils.uniqueName = uniqueName, SQExprUtils.defaultName = defaultName, SQExprUtils.isMeasure = isMeasure, 
                SQExprUtils.isAnyValue = isAnyValue, SQExprUtils.isDefaultValue = isDefaultValue, 
                SQExprUtils.discourageAggregation = discourageAggregation, SQExprUtils.getAggregateBehavior = getAggregateBehavior, 
                SQExprUtils.getSchemaCapabilities = getSchemaCapabilities, SQExprUtils.getKpiMetadata = getKpiMetadata, 
                SQExprUtils.getConceptualEntity = getConceptualEntity, SQExprUtils.getDefaultValue = getDefaultValue, 
                SQExprUtils.getDefaultValues = getDefaultValues, SQExprUtils.getDataViewScopeIdentityComparisonExpr = getDataViewScopeIdentityComparisonExpr, 
                SQExprUtils.getActiveTablesNames = getActiveTablesNames, SQExprUtils.isRelatedToMany = isRelatedToMany, 
                SQExprUtils.isRelatedToOne = isRelatedToOne, SQExprUtils.isRelatedOneToOne = isRelatedOneToOne, 
                SQExprUtils.concatUnique = concatUnique;
                var SQExprDefaultNameGenerator = function(_super) {
                    function SQExprDefaultNameGenerator() {
                        _super.apply(this, arguments);
                    }
                    return __extends(SQExprDefaultNameGenerator, _super), SQExprDefaultNameGenerator.prototype.visitEntity = function(expr) {
                        return expr.entity;
                    }, SQExprDefaultNameGenerator.prototype.visitColumnRef = function(expr) {
                        return expr.source.accept(this) + "." + expr.ref;
                    }, SQExprDefaultNameGenerator.prototype.visitMeasureRef = function(expr, fallback) {
                        return expr.source.accept(this) + "." + expr.ref;
                    }, SQExprDefaultNameGenerator.prototype.visitAggr = function(expr, fallback) {
                        return data.QueryAggregateFunction[expr.func] + "(" + expr.arg.accept(this) + ")";
                    }, SQExprDefaultNameGenerator.prototype.visitPercentile = function(expr, fallback) {
                        var func = expr.exclusive ? "Percentile.Exc(" : "Percentile.Inc(";
                        return func + expr.arg.accept(this) + ", " + expr.k + ")";
                    }, SQExprDefaultNameGenerator.prototype.visitArithmetic = function(expr, fallback) {
                        return powerbi.data.getArithmeticOperatorName(expr.operator) + "(" + expr.left.accept(this) + ", " + expr.right.accept(this) + ")";
                    }, SQExprDefaultNameGenerator.prototype.visitConstant = function(expr) {
                        return "const";
                    }, SQExprDefaultNameGenerator.prototype.visitTransformOutputRoleRef = function(expr, fallback) {
                        var name = expr.role;
                        return expr.transform && (name += "." + expr.transform), name;
                    }, SQExprDefaultNameGenerator.prototype.visitDefault = function(expr, fallback) {
                        return fallback || "expr";
                    }, SQExprDefaultNameGenerator.instance = new SQExprDefaultNameGenerator(), SQExprDefaultNameGenerator;
                }(data.DefaultSQExprVisitorWithArg), IsMeasureVisitor = function(_super) {
                    function IsMeasureVisitor() {
                        _super.apply(this, arguments);
                    }
                    return __extends(IsMeasureVisitor, _super), IsMeasureVisitor.prototype.visitMeasureRef = function(expr) {
                        return !0;
                    }, IsMeasureVisitor.prototype.visitAggr = function(expr) {
                        return !0;
                    }, IsMeasureVisitor.prototype.visitArithmetic = function(expr) {
                        return !0;
                    }, IsMeasureVisitor.prototype.visitDefault = function(expr) {
                        return !1;
                    }, IsMeasureVisitor.instance = new IsMeasureVisitor(), IsMeasureVisitor;
                }(data.DefaultSQExprVisitor), IsDefaultValueVisitor = function(_super) {
                    function IsDefaultValueVisitor() {
                        _super.apply(this, arguments);
                    }
                    return __extends(IsDefaultValueVisitor, _super), IsDefaultValueVisitor.prototype.visitCompare = function(expr) {
                        return expr.comparison !== data.QueryComparisonKind.Equal ? !1 : expr.right.accept(this);
                    }, IsDefaultValueVisitor.prototype.visitAnd = function(expr) {
                        return expr.left.accept(this) && expr.right.accept(this);
                    }, IsDefaultValueVisitor.prototype.visitDefaultValue = function(expr) {
                        return !0;
                    }, IsDefaultValueVisitor.prototype.visitDefault = function(expr) {
                        return !1;
                    }, IsDefaultValueVisitor.instance = new IsDefaultValueVisitor(), IsDefaultValueVisitor;
                }(data.DefaultSQExprVisitor), IsAnyValueVisitor = function(_super) {
                    function IsAnyValueVisitor() {
                        _super.apply(this, arguments);
                    }
                    return __extends(IsAnyValueVisitor, _super), IsAnyValueVisitor.prototype.visitCompare = function(expr) {
                        return expr.comparison !== data.QueryComparisonKind.Equal ? !1 : expr.right.accept(this);
                    }, IsAnyValueVisitor.prototype.visitAnd = function(expr) {
                        return expr.left.accept(this) && expr.right.accept(this);
                    }, IsAnyValueVisitor.prototype.visitAnyValue = function(expr) {
                        return !0;
                    }, IsAnyValueVisitor.prototype.visitDefault = function(expr) {
                        return !1;
                    }, IsAnyValueVisitor.instance = new IsAnyValueVisitor(), IsAnyValueVisitor;
                }(data.DefaultSQExprVisitor);
            }(SQExprUtils = data.SQExprUtils || (data.SQExprUtils = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var SemanticQueryRewriter = function() {
                function SemanticQueryRewriter(exprRewriter) {
                    this.exprRewriter = exprRewriter;
                }
                return SemanticQueryRewriter.prototype.rewriteFrom = function(fromValue) {
                    for (var fromContents = {}, originalFrom = fromValue, originalFromKeys = originalFrom.keys(), i = 0, len = originalFromKeys.length; len > i; i++) {
                        var keyName = originalFromKeys[i], originalSource = originalFrom.source(keyName);
                        if (data.isSQFromEntitySource(originalSource)) {
                            var originalEntityExpr = data.SQExprBuilder.entity(originalSource.schema, originalSource.entity, keyName), updatedEntityExpr = originalEntityExpr.accept(this.exprRewriter);
                            fromContents[keyName] = new data.SQFromEntitySource(updatedEntityExpr.schema, updatedEntityExpr.entity);
                        } else data.isSQFromSubquerySource(originalSource);
                    }
                    return new data.SQFrom(fromContents);
                }, SemanticQueryRewriter.prototype.rewriteSelect = function(selectItems, from) {
                    return this.rewriteNamedSQExpressions(selectItems, from);
                }, SemanticQueryRewriter.prototype.rewriteGroupBy = function(groupByitems, from) {
                    return _.isEmpty(groupByitems) ? void 0 : this.rewriteNamedSQExpressions(groupByitems, from);
                }, SemanticQueryRewriter.prototype.rewriteNamedSQExpressions = function(expressions, from) {
                    var _this = this;
                    return _.map(expressions, function(item) {
                        return {
                            name: item.name,
                            expr: data.SQExprRewriterWithSourceRenames.rewrite(item.expr.accept(_this.exprRewriter), from)
                        };
                    });
                }, SemanticQueryRewriter.prototype.rewriteOrderBy = function(orderByItems, from) {
                    if (!_.isEmpty(orderByItems)) {
                        for (var orderBy = [], i = 0, len = orderByItems.length; len > i; i++) {
                            var item = orderByItems[i], updatedExpr = data.SQExprRewriterWithSourceRenames.rewrite(item.expr.accept(this.exprRewriter), from);
                            orderBy.push({
                                direction: item.direction,
                                expr: updatedExpr
                            });
                        }
                        return orderBy;
                    }
                }, SemanticQueryRewriter.prototype.rewriteWhere = function(whereItems, from) {
                    var _this = this;
                    if (!_.isEmpty(whereItems)) {
                        for (var where = [], i = 0, len = whereItems.length; len > i; i++) {
                            var originalWhere = whereItems[i], updatedWhere = {
                                condition: data.SQExprRewriterWithSourceRenames.rewrite(originalWhere.condition.accept(this.exprRewriter), from)
                            };
                            originalWhere.target && (updatedWhere.target = _.map(originalWhere.target, function(e) {
                                return data.SQExprRewriterWithSourceRenames.rewrite(e.accept(_this.exprRewriter), from);
                            })), where.push(updatedWhere);
                        }
                        return where;
                    }
                }, SemanticQueryRewriter.prototype.rewriteTransform = function(transformItems, from) {
                    var _this = this;
                    if (!_.isEmpty(transformItems)) {
                        for (var transforms = [], _i = 0, transformItems_1 = transformItems; _i < transformItems_1.length; _i++) {
                            var transformItem = transformItems_1[_i], inputColumns = void 0;
                            transformItem.input.table && !_.isEmpty(transformItem.input.table.columns) && (inputColumns = _.map(transformItem.input.table.columns, function(c) {
                                return {
                                    role: c.role,
                                    expression: {
                                        name: c.expression.name,
                                        expr: data.SQExprRewriterWithSourceRenames.rewrite(c.expression.expr.accept(_this.exprRewriter), from)
                                    }
                                };
                            }));
                            var newTransform = {
                                name: transformItem.name,
                                algorithm: transformItem.algorithm,
                                input: {
                                    parameters: transformItem.input.parameters
                                },
                                output: transformItem.output
                            };
                            transformItem.input.table && (newTransform.input.table = {
                                name: transformItem.input.table.name,
                                columns: inputColumns
                            }), transforms.push(newTransform);
                        }
                        return transforms;
                    }
                }, SemanticQueryRewriter;
            }();
            data.SemanticQueryRewriter = SemanticQueryRewriter;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function equals(left, right) {
                if (left && right) {
                    if (isSQFromEntitySource(left) && isSQFromEntitySource(right)) return left.equals(right);
                    if (isSQFromSubquerySource(left) && isSQFromSubquerySource(right)) return left.equals(right);
                }
                return left === right;
            }
            function isSQFromEntitySource(source) {
                return null != source.entity;
            }
            function isSQFromSubquerySource(source) {
                return null != source.subquery;
            }
            var ArrayExtensions = jsCommon.ArrayExtensions, SQFromEntitySource = function() {
                function SQFromEntitySource(schema, entity) {
                    this.schema = schema, this.entity = entity;
                }
                return SQFromEntitySource.prototype.accept = function(visitor, arg) {
                    return visitor.visitEntity(this, arg);
                }, SQFromEntitySource.prototype.equals = function(source) {
                    return source && this.entity === source.entity && this.schema === source.schema;
                }, SQFromEntitySource;
            }();
            data.SQFromEntitySource = SQFromEntitySource;
            var SQFromSubquerySource = function() {
                function SQFromSubquerySource(subquery) {
                    this.subquery = subquery;
                }
                return SQFromSubquerySource.prototype.accept = function(visitor, arg) {
                    return visitor.visitSubquery(this, arg);
                }, SQFromSubquerySource.prototype.equals = function(source) {
                    return source && data.SemanticQuery.equals(this.subquery, source.subquery);
                }, SQFromSubquerySource;
            }();
            data.SQFromSubquerySource = SQFromSubquerySource;
            var SQFrom = function() {
                function SQFrom(items) {
                    this.items = items || {};
                }
                return SQFrom.prototype.keys = function() {
                    return Object.keys(this.items);
                }, SQFrom.prototype.source = function(key) {
                    return this.items[key];
                }, SQFrom.prototype.sources = function() {
                    return this.items;
                }, SQFrom.prototype.ensureSource = function(source, desiredVariableName) {
                    var key = this.getSourceKeyFromItems(source);
                    if (key) return {
                        name: key
                    };
                    var uniqueName = this.addSource(source, desiredVariableName);
                    return {
                        name: uniqueName,
                        "new": !0
                    };
                }, SQFrom.prototype.remove = function(key) {
                    delete this.items[key];
                }, SQFrom.prototype.getSourceKeyFromItems = function(source) {
                    var keys = this.keys();
                    for (var i in keys) {
                        var key = keys[i], item = this.items[key];
                        if (isSQFromEntitySource(item) && isSQFromEntitySource(source) && item.equals(source)) return key;
                        if (isSQFromSubquerySource(item) && isSQFromSubquerySource(source) && item.equals(source)) return key;
                    }
                }, SQFrom.prototype.addSource = function(source, desiredVariableName) {
                    for (var candidateName = desiredVariableName || source.accept(new SQFromSourceCandidateNameVisitor(), null), uniqueName = candidateName, usedNames = {}, _i = 0, _a = this.keys(); _i < _a.length; _i++) {
                        var key = _a[_i];
                        usedNames[key] = !0;
                    }
                    return uniqueName = jsCommon.StringExtensions.findUniqueName(usedNames, uniqueName), 
                    this.items[uniqueName] = source, uniqueName;
                }, SQFrom.prototype.clone = function() {
                    var cloned = new SQFrom();
                    return $.extend(cloned.items, this.items), cloned;
                }, SQFrom.prototype.equals = function(comparand) {
                    var _this = this;
                    if (!comparand) return !1;
                    var localKeys = this.keys(), comparandKeys = comparand.keys();
                    return localKeys.length !== comparandKeys.length ? !1 : ArrayExtensions.sequenceEqual(localKeys, comparandKeys, function(localKey, comparandKey) {
                        return equals(_this.source(localKey), comparand.source(comparandKey));
                    });
                }, SQFrom;
            }();
            data.SQFrom = SQFrom, data.equals = equals, data.isSQFromEntitySource = isSQFromEntitySource, 
            data.isSQFromSubquerySource = isSQFromSubquerySource;
            var SQFromSourceCandidateNameVisitor = function() {
                function SQFromSourceCandidateNameVisitor() {}
                return SQFromSourceCandidateNameVisitor.prototype.visitEntity = function(source) {
                    var ref = source.entity, idx = ref.lastIndexOf(".");
                    return idx >= 0 && idx !== ref.length - 1 && (ref = ref.substr(idx + 1)), ref.substring(0, 1).toLowerCase();
                }, SQFromSourceCandidateNameVisitor.prototype.visitSubquery = function(source) {
                    return "q";
                }, SQFromSourceCandidateNameVisitor;
            }();
            data.SQFromSourceCandidateNameVisitor = SQFromSourceCandidateNameVisitor;
            var SQFromEntitiesVisitor = function() {
                function SQFromEntitiesVisitor() {
                    this.entities = [];
                }
                return SQFromEntitiesVisitor.prototype.visitEntity = function(source, key) {
                    this.entities.push(new data.SQEntityExpr(source.schema, source.entity, key));
                }, SQFromEntitiesVisitor.prototype.visitSubquery = function(source, key) {}, SQFromEntitiesVisitor;
            }();
            data.SQFromEntitiesVisitor = SQFromEntitiesVisitor;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi, __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var ArrayExtensions = jsCommon.ArrayExtensions, SemanticQuery = function() {
                function SemanticQuery(from, where, orderBy, select, groupBy, transformItems) {
                    this.fromValue = from, this.whereItems = where, this.orderByItems = orderBy, this.selectItems = select, 
                    this.groupByItems = groupBy, this.transformItems = transformItems;
                }
                return SemanticQuery.create = function() {
                    return SemanticQuery.empty || (SemanticQuery.empty = new SemanticQuery(new data.SQFrom(), null, null, [], null, null)), 
                    SemanticQuery.empty;
                }, SemanticQuery.createWithTrimmedFrom = function(from, where, transform, orderBy, select, groupBy) {
                    var unreferencedKeyFinder = new UnreferencedKeyFinder(from.keys());
                    if (where) for (var i = 0, len = where.length; len > i; i++) {
                        var filter = where[i];
                        filter.condition.accept(unreferencedKeyFinder);
                        var filterTarget = filter.target;
                        if (filterTarget) for (var j = 0, jlen = filterTarget.length; jlen > j; j++) filterTarget[j] && filterTarget[j].accept(unreferencedKeyFinder);
                    }
                    if (transform) for (var i = 0, len = transform.length; len > i; i++) {
                        var table = transform[i].input.table;
                        if (table && !_.isEmpty(table.columns)) for (var _i = 0, _a = table.columns; _i < _a.length; _i++) {
                            var column = _a[_i];
                            column.expression.expr.accept(unreferencedKeyFinder);
                        }
                    }
                    if (orderBy) for (var i = 0, len = orderBy.length; len > i; i++) orderBy[i].expr.accept(unreferencedKeyFinder);
                    for (var i = 0, len = select.length; len > i; i++) select[i].expr.accept(unreferencedKeyFinder);
                    if (groupBy) for (var i = 0, len = groupBy.length; len > i; i++) groupBy[i].expr.accept(unreferencedKeyFinder);
                    for (var unreferencedKeys = unreferencedKeyFinder.result(), i = 0, len = unreferencedKeys.length; len > i; i++) from.remove(unreferencedKeys[i]);
                    return new SemanticQuery(from, where, orderBy, select, groupBy, transform);
                }, SemanticQuery.prototype.from = function() {
                    return this.fromValue.clone();
                }, SemanticQuery.prototype.select = function(values) {
                    return _.isEmpty(arguments) ? this.getSelect() : this.setSelect(values);
                }, SemanticQuery.prototype.getSelect = function() {
                    return SemanticQuery.createNamedExpressionArray(this.selectItems);
                }, SemanticQuery.createNamedExpressionArray = function(items) {
                    return ArrayExtensions.extendWithName(_.map(items, function(s) {
                        return {
                            name: s.name,
                            expr: s.expr
                        };
                    }));
                }, SemanticQuery.prototype.setSelect = function(values) {
                    var from = this.fromValue.clone(), selectItems = SemanticQuery.rewriteExpressionsWithSourceRenames(values, from);
                    return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, selectItems, this.groupByItems);
                }, SemanticQuery.rewriteExpressionsWithSourceRenames = function(values, from) {
                    for (var items = [], i = 0, len = values.length; len > i; i++) {
                        var value = values[i];
                        items.push({
                            name: value.name,
                            expr: SQExprRewriterWithSourceRenames.rewrite(value.expr, from)
                        });
                    }
                    return items;
                }, SemanticQuery.prototype.removeSelect = function(expr) {
                    for (var originalItems = this.selectItems, selectItems = [], i = 0, len = originalItems.length; len > i; i++) {
                        var originalExpr = originalItems[i];
                        data.SQExpr.equals(originalExpr.expr, expr) || selectItems.push(originalExpr);
                    }
                    return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, this.transformItems, this.orderByItems, selectItems, this.groupByItems);
                }, SemanticQuery.prototype.removeOrderBy = function(expr) {
                    for (var sorts = this.orderBy(), i = sorts.length - 1; i >= 0; i--) data.SQExpr.equals(sorts[i].expr, expr) && sorts.splice(i, 1);
                    return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, this.transformItems, sorts, this.selectItems, this.groupByItems);
                }, SemanticQuery.prototype.removeTransform = function(transform) {
                    for (var transforms = this.transforms(), i = 0, len = transforms.length; len > i; i++) if (transforms[i].name === transform.name) {
                        transforms.splice(i, 1);
                        break;
                    }
                    return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, transforms, this.orderByItems, this.selectItems, this.groupByItems);
                }, SemanticQuery.prototype.selectNameOf = function(expr) {
                    var index = data.SQExprUtils.indexOfNamedExpr(this.selectItems, expr);
                    return index >= 0 ? this.selectItems[index].name : void 0;
                }, SemanticQuery.prototype.setSelectAt = function(index, expr) {
                    if (!(index >= this.selectItems.length)) {
                        var select = this.select(), from = this.fromValue.clone(), originalName = select[index].name;
                        return select[index] = {
                            name: originalName,
                            expr: SQExprRewriterWithSourceRenames.rewrite(expr, from)
                        }, SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, select, this.groupByItems);
                    }
                }, SemanticQuery.prototype.addSelect = function(expr, exprName) {
                    var selectItems = this.select(), from = this.fromValue.clone();
                    return selectItems.push(this.createNamedExpr(selectItems, from, expr, exprName)), 
                    SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, selectItems, this.groupByItems);
                }, SemanticQuery.prototype.createNamedExpr = function(currentNames, from, expr, exprName) {
                    return {
                        name: data.SQExprUtils.uniqueName(currentNames, expr, exprName),
                        expr: SQExprRewriterWithSourceRenames.rewrite(expr, from)
                    };
                }, SemanticQuery.prototype.groupBy = function(values) {
                    return _.isEmpty(arguments) ? this.getGroupBy() : this.setGroupBy(values);
                }, SemanticQuery.prototype.getGroupBy = function() {
                    return SemanticQuery.createNamedExpressionArray(this.groupByItems);
                }, SemanticQuery.prototype.setGroupBy = function(values) {
                    var from = this.fromValue.clone(), groupByItems = SemanticQuery.rewriteExpressionsWithSourceRenames(values, from);
                    return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, this.selectItems, groupByItems);
                }, SemanticQuery.prototype.addGroupBy = function(expr) {
                    var groupByItems = this.groupBy(), from = this.fromValue.clone();
                    return groupByItems.push(this.createNamedExpr(groupByItems, from, expr)), SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, this.orderByItems, this.selectItems, groupByItems);
                }, SemanticQuery.prototype.orderBy = function(values) {
                    return _.isEmpty(arguments) ? this.getOrderBy() : this.setOrderBy(values);
                }, SemanticQuery.prototype.getOrderBy = function() {
                    var result = [], orderBy = this.orderByItems;
                    if (orderBy) for (var i = 0, len = orderBy.length; len > i; i++) {
                        var clause = orderBy[i];
                        result.push({
                            expr: clause.expr,
                            direction: clause.direction
                        });
                    }
                    return result;
                }, SemanticQuery.prototype.setOrderBy = function(values) {
                    for (var updatedOrderBy = [], from = this.fromValue.clone(), i = 0, len = values.length; len > i; i++) {
                        var clause = values[i];
                        updatedOrderBy.push({
                            expr: SQExprRewriterWithSourceRenames.rewrite(clause.expr, from),
                            direction: clause.direction
                        });
                    }
                    return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.transformItems, updatedOrderBy, this.selectItems, this.groupByItems);
                }, SemanticQuery.prototype.where = function(values) {
                    return _.isEmpty(arguments) ? this.getWhere() : this.setWhere(values);
                }, SemanticQuery.prototype.getWhere = function() {
                    var result = [], whereItems = this.whereItems;
                    if (whereItems) for (var i = 0, len = whereItems.length; len > i; i++) result.push(whereItems[i]);
                    return result;
                }, SemanticQuery.prototype.setWhere = function(values) {
                    for (var updatedWhere = [], from = this.fromValue.clone(), i = 0, len = values.length; len > i; i++) {
                        var filter = values[i], updatedFilter = {
                            condition: SQExprRewriterWithSourceRenames.rewrite(filter.condition, from)
                        }, filterTarget = filter.target;
                        if (filterTarget) {
                            updatedFilter.target = [];
                            for (var j = 0, jlen = filterTarget.length; jlen > j; j++) if (filterTarget[j]) {
                                var updatedTarget = SQExprRewriterWithSourceRenames.rewrite(filterTarget[j], from);
                                updatedFilter.target.push(updatedTarget);
                            }
                        }
                        updatedWhere.push(updatedFilter);
                    }
                    return SemanticQuery.createWithTrimmedFrom(from, updatedWhere, this.transformItems, this.orderByItems, this.selectItems, this.groupByItems);
                }, SemanticQuery.prototype.addWhere = function(filter) {
                    for (var updatedWhere = this.where(), incomingWhere = filter.where(), from = this.fromValue.clone(), i = 0, len = incomingWhere.length; len > i; i++) {
                        var clause = incomingWhere[i], updatedClause = {
                            condition: SQExprRewriterWithSourceRenames.rewrite(clause.condition, from)
                        };
                        clause.target && (updatedClause.target = _.map(clause.target, function(t) {
                            return SQExprRewriterWithSourceRenames.rewrite(t, from);
                        })), updatedWhere.push(updatedClause);
                    }
                    return SemanticQuery.createWithTrimmedFrom(from, updatedWhere, this.transformItems, this.orderByItems, this.selectItems, this.groupByItems);
                }, SemanticQuery.prototype.transforms = function(transforms) {
                    return _.isEmpty(arguments) ? this.getTransforms() : this.setTransforms(transforms);
                }, SemanticQuery.prototype.getTransforms = function() {
                    var transforms = [];
                    if (!_.isEmpty(this.transformItems)) for (var _i = 0, _a = this.transformItems; _i < _a.length; _i++) {
                        var transform = _a[_i];
                        transforms.push(transform);
                    }
                    return transforms;
                }, SemanticQuery.prototype.setTransforms = function(transforms) {
                    for (var _this = this, from = this.fromValue.clone(), transformItems = [], _i = 0, transforms_1 = transforms; _i < transforms_1.length; _i++) {
                        var transform = transforms_1[_i], inputColumns = void 0;
                        transform.input.table && !_.isEmpty(transform.input.table.columns) && (inputColumns = _.map(transform.input.table.columns, function(c) {
                            return {
                                role: c.role,
                                expression: _this.createNamedExpr(ArrayExtensions.extendWithName([]), from, c.expression.expr, c.expression.name)
                            };
                        }));
                        var newTransform = {
                            name: transform.name,
                            algorithm: transform.algorithm,
                            input: {
                                parameters: transform.input.parameters
                            },
                            output: transform.output
                        };
                        transform.input.table && (newTransform.input.table = {
                            name: transform.input.table.name,
                            columns: inputColumns
                        }), transformItems.push(newTransform);
                    }
                    return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, transforms, this.orderByItems, this.selectItems, this.groupByItems);
                }, SemanticQuery.prototype.rewrite = function(exprRewriter) {
                    var rewriter = new data.SemanticQueryRewriter(exprRewriter), from = rewriter.rewriteFrom(this.fromValue), where = rewriter.rewriteWhere(this.whereItems, from), orderBy = rewriter.rewriteOrderBy(this.orderByItems, from), select = rewriter.rewriteSelect(this.selectItems, from), groupBy = rewriter.rewriteGroupBy(this.groupByItems, from), transform = rewriter.rewriteTransform(this.transformItems, from);
                    return SemanticQuery.createWithTrimmedFrom(from, where, transform, orderBy, select, groupBy);
                }, SemanticQuery.equals = function(x, y) {
                    return x.from().equals(y.from()) && ArrayExtensions.sequenceEqual(x.where(), y.where(), data.SQFilter.equals) && ArrayExtensions.sequenceEqual(x.orderBy(), y.orderBy(), data.SQUtils.sqSortDefinitionEquals) && ArrayExtensions.sequenceEqual(x.select(), y.select(), data.SQUtils.namedSQExprEquals) && ArrayExtensions.sequenceEqual(x.groupBy(), y.groupBy(), data.SQUtils.namedSQExprEquals) && ArrayExtensions.sequenceEqual(x.transforms(), y.transforms(), data.SQUtils.sqTransformEquals);
                }, SemanticQuery;
            }();
            data.SemanticQuery = SemanticQuery;
            var SemanticFilter = function() {
                function SemanticFilter(from, where) {
                    this.fromValue = from, this.whereItems = where;
                }
                return SemanticFilter.fromSQExpr = function(contract) {
                    var from = new data.SQFrom(), rewrittenContract = SQExprRewriterWithSourceRenames.rewrite(contract, from), where = [ {
                        condition: rewrittenContract
                    } ];
                    return new SemanticFilter(from, where);
                }, SemanticFilter.getDefaultValueFilter = function(fieldSQExprs) {
                    return SemanticFilter.getDataViewScopeIdentityComparisonFilters(fieldSQExprs, data.SQExprBuilder.defaultValue());
                }, SemanticFilter.getAnyValueFilter = function(fieldSQExprs) {
                    return SemanticFilter.getDataViewScopeIdentityComparisonFilters(fieldSQExprs, data.SQExprBuilder.anyValue());
                }, SemanticFilter.getDataViewScopeIdentityComparisonFilters = function(fieldSQExprs, value) {
                    if (fieldSQExprs instanceof Array) {
                        var values = Array.apply(null, Array(fieldSQExprs.length)).map(function() {
                            return value;
                        });
                        return SemanticFilter.fromSQExpr(data.SQExprUtils.getDataViewScopeIdentityComparisonExpr(fieldSQExprs, values));
                    }
                    return SemanticFilter.fromSQExpr(data.SQExprBuilder.equal(fieldSQExprs, value));
                }, SemanticFilter.prototype.from = function() {
                    return this.fromValue.clone();
                }, SemanticFilter.prototype.conditions = function() {
                    for (var expressions = [], where = this.whereItems, i = 0, len = where.length; len > i; i++) {
                        var filter = where[i];
                        expressions.push(filter.condition);
                    }
                    return expressions;
                }, SemanticFilter.prototype.where = function() {
                    for (var result = [], whereItems = this.whereItems, i = 0, len = whereItems.length; len > i; i++) result.push(whereItems[i]);
                    return result;
                }, SemanticFilter.prototype.rewrite = function(exprRewriter) {
                    var rewriter = new data.SemanticQueryRewriter(exprRewriter), from = rewriter.rewriteFrom(this.fromValue), where = rewriter.rewriteWhere(this.whereItems, from);
                    return new SemanticFilter(from, where);
                }, SemanticFilter.prototype.validate = function(schema, aggrUtils, errors) {
                    var validator = new data.SQExprValidationVisitor(schema, aggrUtils, errors);
                    return this.rewrite(validator), validator.errors;
                }, SemanticFilter.merge = function(filters) {
                    if (_.isEmpty(filters)) return null;
                    if (1 === filters.length) return filters[0];
                    for (var firstFilter = filters[0], from = firstFilter.from(), where = ArrayExtensions.take(firstFilter.whereItems, firstFilter.whereItems.length), i = 1, len = filters.length; len > i; i++) SemanticFilter.applyFilter(filters[i], from, where);
                    return new SemanticFilter(from, where);
                }, SemanticFilter.isDefaultFilter = function(filter) {
                    return filter && 1 === filter.where().length ? data.SQExprUtils.isDefaultValue(filter.where()[0].condition) : !1;
                }, SemanticFilter.isAnyFilter = function(filter) {
                    return filter && 1 === filter.where().length ? data.SQExprUtils.isAnyValue(filter.where()[0].condition) : !1;
                }, SemanticFilter.isSameFilter = function(leftFilter, rightFilter) {
                    return jsCommon.JsonComparer.equals(leftFilter, rightFilter) ? !(SemanticFilter.isDefaultFilter(leftFilter) && SemanticFilter.isAnyFilter(rightFilter) || SemanticFilter.isAnyFilter(leftFilter) && SemanticFilter.isDefaultFilter(rightFilter)) : !1;
                }, SemanticFilter.applyFilter = function(filter, from, where) {
                    for (var filterWhereItems = filter.whereItems, i = 0; i < filterWhereItems.length; i++) {
                        var filterWhereItem = filterWhereItems[i], updatedWhereItem = {
                            condition: SQExprRewriterWithSourceRenames.rewrite(filterWhereItem.condition, from)
                        };
                        filterWhereItem.target && (updatedWhereItem.target = _.map(filterWhereItem.target, function(e) {
                            return SQExprRewriterWithSourceRenames.rewrite(e, from);
                        })), where.push(updatedWhereItem);
                    }
                }, SemanticFilter;
            }();
            data.SemanticFilter = SemanticFilter;
            var SQExprRewriterWithSourceRenames = function(_super) {
                function SQExprRewriterWithSourceRenames(renames) {
                    _super.call(this), this.renames = renames;
                }
                return __extends(SQExprRewriterWithSourceRenames, _super), SQExprRewriterWithSourceRenames.prototype.visitEntity = function(expr) {
                    var updatedName = this.renames[expr.entity];
                    return updatedName ? new data.SQEntityExpr(expr.schema, expr.entity, updatedName) : _super.prototype.visitEntity.call(this, expr);
                }, SQExprRewriterWithSourceRenames.prototype.rewriteFilter = function(filter) {
                    var updatedTargets = void 0;
                    filter.target && (updatedTargets = this.rewriteArray(filter.target));
                    var updatedCondition = filter.condition.accept(this);
                    if (filter.condition === updatedCondition && filter.target === updatedTargets) return filter;
                    var updatedFilter = {
                        condition: updatedCondition
                    };
                    return updatedTargets && (updatedFilter.target = updatedTargets), updatedFilter;
                }, SQExprRewriterWithSourceRenames.prototype.rewriteArray = function(exprs) {
                    for (var updatedExprs, i = 0, len = exprs.length; len > i; i++) {
                        var expr = exprs[i], rewrittenExpr = expr.accept(this);
                        expr === rewrittenExpr || updatedExprs || (updatedExprs = ArrayExtensions.take(exprs, i)), 
                        updatedExprs && updatedExprs.push(rewrittenExpr);
                    }
                    return updatedExprs || exprs;
                }, SQExprRewriterWithSourceRenames.rewrite = function(expr, from) {
                    var renames = QuerySourceRenameDetector.run(expr, from), rewriter = new SQExprRewriterWithSourceRenames(renames);
                    return expr.accept(rewriter);
                }, SQExprRewriterWithSourceRenames;
            }(data.SQExprRewriter);
            data.SQExprRewriterWithSourceRenames = SQExprRewriterWithSourceRenames;
            var QuerySourceRenameDetector = function(_super) {
                function QuerySourceRenameDetector(from) {
                    _super.call(this), this.from = from, this.renames = {};
                }
                return __extends(QuerySourceRenameDetector, _super), QuerySourceRenameDetector.run = function(expr, from) {
                    var detector = new QuerySourceRenameDetector(from);
                    return expr.accept(detector), detector.renames;
                }, QuerySourceRenameDetector.prototype.visitEntity = function(expr) {
                    var existingEntity = this.from.source(expr.variable);
                    if (!existingEntity || !data.isSQFromEntitySource(existingEntity) || existingEntity.schema !== expr.schema || existingEntity.entity !== expr.entity) {
                        var actualEntity = this.from.ensureSource(new data.SQFromEntitySource(expr.schema, expr.entity), expr.variable);
                        this.renames[expr.entity] = actualEntity.name;
                    }
                }, QuerySourceRenameDetector;
            }(data.DefaultSQExprVisitorWithTraversal), UnreferencedKeyFinder = function(_super) {
                function UnreferencedKeyFinder(keys) {
                    _super.call(this), this.keys = keys;
                }
                return __extends(UnreferencedKeyFinder, _super), UnreferencedKeyFinder.prototype.visitEntity = function(expr) {
                    var index = this.keys.indexOf(expr.variable);
                    index >= 0 && this.keys.splice(index, 1);
                }, UnreferencedKeyFinder.prototype.result = function() {
                    return this.keys;
                }, UnreferencedKeyFinder;
            }(data.DefaultSQExprVisitorWithTraversal);
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var SQFilter, ArrayExtensions = jsCommon.ArrayExtensions;
            !function(SQFilter) {
                function equals(leftFilter, rightFilter) {
                    return leftFilter || (leftFilter = null), rightFilter || (rightFilter = null), leftFilter === rightFilter ? !0 : !!leftFilter != !!rightFilter ? !1 : targetsEqual(leftFilter, rightFilter) ? data.SQExpr.equals(leftFilter.condition, rightFilter.condition) : !1;
                }
                function targetsEqual(leftFilter, rightFilter) {
                    return ArrayExtensions.sequenceEqual(leftFilter.target, rightFilter.target, data.SQExpr.equals);
                }
                function contains(filters, searchTarget) {
                    return !_.isEmpty(filters) && _.any(filters, function(filter) {
                        return equals(filter, searchTarget);
                    });
                }
                SQFilter.equals = equals, SQFilter.targetsEqual = targetsEqual, SQFilter.contains = contains;
            }(SQFilter = data.SQFilter || (data.SQFilter = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            var SQUtils, ArrayExtensions = jsCommon.ArrayExtensions;
            !function(SQUtils) {
                function sqSortDefinitionEquals(left, right) {
                    return left || right ? left && right ? left.direction === right.direction && data.SQExpr.equals(left.expr, right.expr) : !1 : !0;
                }
                function namedSQExprEquals(left, right) {
                    return left || right ? left && right ? data.SQExpr.equals(left.expr, right.expr) : !1 : !0;
                }
                function sqTransformTableColumnsEquals(left, right) {
                    return left || right ? left && right ? left.role === right.role && namedSQExprEquals(left.expression, right.expression) : !1 : !0;
                }
                function sqTransformTableEquals(left, right) {
                    return left || right ? left && right ? ArrayExtensions.sequenceEqual(left.columns, right.columns, function(left, right) {
                        return sqTransformTableColumnsEquals(left, right);
                    }) : !1 : !0;
                }
                function sqTransformInputEquals(left, right) {
                    return left || right ? left && right ? ArrayExtensions.sequenceEqual(left.parameters, right.parameters, function(left, right) {
                        return namedSQExprEquals(left, right);
                    }) && sqTransformTableEquals(left.table, right.table) : !1 : !0;
                }
                function sqTransformOutputEquals(left, right) {
                    return left || right ? left && right ? sqTransformTableEquals(left.table, right.table) : !1 : !0;
                }
                function sqTransformEquals(left, right) {
                    return left || right ? left && right ? left.algorithm === right.algorithm && sqTransformInputEquals(left.input, right.input) && sqTransformOutputEquals(left.output, right.output) : !1 : !0;
                }
                SQUtils.sqSortDefinitionEquals = sqSortDefinitionEquals, SQUtils.namedSQExprEquals = namedSQExprEquals, 
                SQUtils.sqTransformTableColumnsEquals = sqTransformTableColumnsEquals, SQUtils.sqTransformTableEquals = sqTransformTableEquals, 
                SQUtils.sqTransformInputEquals = sqTransformInputEquals, SQUtils.sqTransformOutputEquals = sqTransformOutputEquals, 
                SQUtils.sqTransformEquals = sqTransformEquals;
            }(SQUtils = data.SQUtils || (data.SQUtils = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createCategoricalDataViewBuilder() {
                return new CategoricalDataViewBuilder();
            }
            function getScopeIdentity(source, index, value, valueType) {
                var identities = source.identities;
                return identities ? identities[index] : data.createDataViewScopeIdentity(SQExprBuilder.equal(source.fields[0], SQExprBuilder.typedConstant(value, valueType)));
            }
            function pushIfNotExists(items, itemToAdd) {
                _.contains(items, itemToAdd) || items.push(itemToAdd);
            }
            function applySeriesData(target, source, categoryLength) {
                var values = source.values;
                target.values = values;
                var highlights = source.highlights;
                highlights && (target.highlights = highlights);
                var aggregates;
                void 0 !== source.minLocal && (aggregates || (aggregates = {}), aggregates.minLocal = source.minLocal), 
                void 0 !== source.maxLocal && (aggregates || (aggregates = {}), aggregates.maxLocal = source.maxLocal), 
                aggregates && (target.source.aggregates = aggregates, _.extend(target, aggregates));
            }
            var DataViewTransform = powerbi.data.DataViewTransform, SQExprBuilder = powerbi.data.SQExprBuilder;
            data.createCategoricalDataViewBuilder = createCategoricalDataViewBuilder;
            var CategoricalDataViewBuilder = function() {
                function CategoricalDataViewBuilder() {
                    this.categories = [], this.staticMeasureColumns = [], this.dynamicMeasureColumns = [], 
                    this.columnIndex = 0;
                }
                return CategoricalDataViewBuilder.prototype.withCategory = function(options) {
                    var categoryValues = options.values, identityFrom = options.identityFrom, type = options.source.type, categoryColumn = {
                        source: options.source,
                        identityFields: options.identityFrom.fields,
                        identity: options.identityFrom.identities || [],
                        values: categoryValues
                    };
                    if (!options.identityFrom.identities) for (var categoryIndex = 0, categoryLength = categoryValues.length; categoryLength > categoryIndex; categoryIndex++) categoryColumn.identity.push(getScopeIdentity(identityFrom, categoryIndex, categoryValues[categoryIndex], type));
                    return this.categories || (this.categories = []), this.categories.push(categoryColumn), 
                    this;
                }, CategoricalDataViewBuilder.prototype.withCategories = function(categories) {
                    return _.isEmpty(this.categories) ? this.categories = categories : Array.prototype.push.apply(this.categories, categories), 
                    this;
                }, CategoricalDataViewBuilder.prototype.withValues = function(options) {
                    for (var columns = options.columns, _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                        var column = columns_1[_i];
                        this.staticMeasureColumns.push(column.source);
                    }
                    return this.staticSeriesValues = columns, this;
                }, CategoricalDataViewBuilder.prototype.withGroupedValues = function(options) {
                    var groupColumn = options.groupColumn;
                    this.dynamicSeriesMetadata = {
                        column: groupColumn.source,
                        identityFrom: groupColumn.identityFrom,
                        values: groupColumn.values
                    };
                    for (var valueColumns = options.valueColumns, _i = 0, valueColumns_1 = valueColumns; _i < valueColumns_1.length; _i++) {
                        var valueColumn = valueColumns_1[_i];
                        this.dynamicMeasureColumns.push(valueColumn.source);
                    }
                    return this.dynamicSeriesValues = options.data, this;
                }, CategoricalDataViewBuilder.prototype.fillData = function(dataViewValues) {
                    var categoryColumn = _.first(this.categories), categoryLength = categoryColumn && categoryColumn.values ? categoryColumn.values.length : 0;
                    if (this.hasDynamicSeries()) for (var seriesIndex = 0; seriesIndex < this.dynamicSeriesMetadata.values.length; seriesIndex++) for (var seriesMeasures = this.dynamicSeriesValues[seriesIndex], measureIndex = 0, measuresLen = this.dynamicMeasureColumns.length; measuresLen > measureIndex; measureIndex++) {
                        var groupIndex = seriesIndex * measuresLen + measureIndex;
                        applySeriesData(dataViewValues[groupIndex], seriesMeasures[measureIndex], categoryLength);
                    }
                    if (this.hasStaticSeries()) for (var staticColumnsStartingIndex = this.hasDynamicSeries() ? this.dynamicSeriesValues.length * this.dynamicMeasureColumns.length : 0, measureIndex = 0, measuresLen = this.staticMeasureColumns.length; measuresLen > measureIndex; measureIndex++) applySeriesData(dataViewValues[staticColumnsStartingIndex + measureIndex], this.staticSeriesValues[measureIndex], categoryLength);
                }, CategoricalDataViewBuilder.prototype.build = function() {
                    for (var metadataColumns = [], categorical = {}, categoryMetadata = this.categories, dynamicSeriesMetadata = this.dynamicSeriesMetadata, _i = 0, categoryMetadata_1 = categoryMetadata; _i < categoryMetadata_1.length; _i++) {
                        var columnMetadata = categoryMetadata_1[_i];
                        pushIfNotExists(metadataColumns, columnMetadata.source);
                    }
                    if (this.hasDynamicSeries()) {
                        pushIfNotExists(metadataColumns, dynamicSeriesMetadata.column), categorical.values = DataViewTransform.createValueColumns([], dynamicSeriesMetadata.identityFrom.fields, dynamicSeriesMetadata.column);
                        for (var seriesValues = dynamicSeriesMetadata.values, seriesIndex = 0; seriesIndex < seriesValues.length; seriesIndex++) for (var seriesValue = seriesValues[seriesIndex], seriesIdentity = getScopeIdentity(dynamicSeriesMetadata.identityFrom, seriesIndex, seriesValue, dynamicSeriesMetadata.column.type), _a = 0, _b = this.dynamicMeasureColumns; _a < _b.length; _a++) {
                            var measure = _b[_a], column = _.toPlainObject(measure);
                            column.groupName = seriesValue, pushIfNotExists(metadataColumns, column), categorical.values.push({
                                source: column,
                                values: [],
                                identity: seriesIdentity
                            });
                        }
                        if (this.hasStaticSeries()) {
                            var dynamicSeriesGroups_1 = categorical.values.grouped();
                            categorical.values.grouped = function() {
                                return dynamicSeriesGroups_1;
                            }, this.appendStaticMeasureColumns(metadataColumns, categorical.values);
                        }
                    } else categorical.values = DataViewTransform.createValueColumns(), this.appendStaticMeasureColumns(metadataColumns, categorical.values);
                    var categories = this.categories;
                    _.isEmpty(categories) || (categorical.categories = categories), this.fillData(categorical.values);
                    var dataView = {
                        metadata: {
                            columns: metadataColumns
                        },
                        categorical: categorical
                    };
                    return this.isLegalDataView(dataView) ? dataView : void 0;
                }, CategoricalDataViewBuilder.prototype.appendStaticMeasureColumns = function(metadataColumns, valueColumns) {
                    if (!_.isEmpty(this.staticMeasureColumns)) for (var _i = 0, _a = this.staticMeasureColumns; _i < _a.length; _i++) {
                        var column = _a[_i];
                        pushIfNotExists(metadataColumns, column), valueColumns.push({
                            source: column,
                            values: []
                        });
                    }
                }, CategoricalDataViewBuilder.prototype.isLegalDataView = function(dataView) {
                    return !(this.hasDynamicSeries() && this.hasStaticSeries() && CategoricalDataViewBuilder.isVisualDataView(dataView.metadata.columns));
                }, CategoricalDataViewBuilder.isVisualDataView = function(metadataColumns) {
                    return !_.isEmpty(metadataColumns) && _.any(metadataColumns, function(metadataColumn) {
                        return !!metadataColumn.queryName;
                    });
                }, CategoricalDataViewBuilder.prototype.hasDynamicSeries = function() {
                    return !!this.dynamicSeriesMetadata;
                }, CategoricalDataViewBuilder.prototype.hasStaticSeries = function() {
                    return !!this.staticSeriesValues;
                }, CategoricalDataViewBuilder;
            }();
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createStaticEvalContext(colorAllocatorCache, dataView, selectTransforms) {
                return new StaticEvalContext(colorAllocatorCache || data.createColorAllocatorCache(), dataView || {
                    metadata: {
                        columns: []
                    }
                }, selectTransforms);
            }
            function getExprValueFromTable(expr, selectTransforms, table, rowIdx) {
                var rows = table.rows;
                if (!(_.isEmpty(rows) || rows.length <= rowIdx)) {
                    var cols = table.columns, selectIdx = findSelectIndex(expr, selectTransforms);
                    if (!(0 > selectIdx)) for (var colIdx = 0, colLen = cols.length; colLen > colIdx; colIdx++) if (selectIdx === cols[colIdx].index) return rows[rowIdx][colIdx];
                }
            }
            function findAggregateValue(expr, selectTransforms, columns) {
                var selectIdx = findSelectIndex(expr.arg, selectTransforms);
                if (!(0 > selectIdx)) for (var colIdx = 0, colLen = columns.length; colLen > colIdx; colIdx++) {
                    var column = columns[colIdx], columnAggr = column.aggregates;
                    if (selectIdx === column.index && columnAggr) {
                        var aggregateValue = findAggregates(columnAggr, expr);
                        if (void 0 !== aggregateValue) return aggregateValue;
                    }
                }
            }
            function findSelectIndex(expr, selectTransforms) {
                var queryName;
                SQExpr.isSelectRef(expr) && (queryName = expr.expressionName);
                for (var selectIdx = 0, selectLen = selectTransforms.length; selectLen > selectIdx; selectIdx++) {
                    var selectTransform = selectTransforms[selectIdx];
                    if (selectTransform && (!queryName || selectTransform.queryName)) if (queryName) {
                        if (selectTransform.queryName === queryName) return selectIdx;
                    } else if (SQExpr.equals(selectTransform.expr, expr)) return selectIdx;
                }
                return -1;
            }
            function findAggregates(aggregates, expr) {
                if (SQExpr.isPercentile(expr)) {
                    var percentile = _.find(aggregates.percentiles, function(percentile) {
                        return percentile.exclusive === expr.exclusive && percentile.k === expr.k ? !0 : void 0;
                    });
                    if (percentile) return percentile.value;
                } else if (SQExpr.isAggregation(expr)) switch (expr.func) {
                  case data.QueryAggregateFunction.Min:
                    return getOptional(aggregates.min, aggregates.minLocal);

                  case data.QueryAggregateFunction.Max:
                    return getOptional(aggregates.max, aggregates.maxLocal);
                }
            }
            function getOptional(value1, value2) {
                return void 0 !== value1 ? value1 : value2;
            }
            var SQExpr = powerbi.data.SQExpr;
            data.createStaticEvalContext = createStaticEvalContext;
            var StaticEvalContext = function() {
                function StaticEvalContext(colorAllocatorCache, dataView, selectTransforms) {
                    this.colorAllocatorCache = colorAllocatorCache, this.dataView = dataView, this.selectTransforms = selectTransforms;
                }
                return StaticEvalContext.prototype.getColorAllocator = function(expr) {
                    return this.colorAllocatorCache.get(expr);
                }, StaticEvalContext.prototype.getExprValue = function(expr) {
                    var dataView = this.dataView, selectTransforms = this.selectTransforms;
                    if (dataView && selectTransforms) {
                        if (SQExpr.isAggregation(expr) || SQExpr.isPercentile(expr)) {
                            var columnAggregate = findAggregateValue(expr, selectTransforms, dataView.metadata.columns);
                            if (void 0 !== columnAggregate) return columnAggregate;
                        }
                        return dataView.table ? getExprValueFromTable(expr, selectTransforms, dataView.table, 0) : void 0;
                    }
                }, StaticEvalContext.prototype.getRoleValue = function(roleName) {}, StaticEvalContext;
            }();
            data.getExprValueFromTable = getExprValueFromTable, data.findSelectIndex = findSelectIndex;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var data;
        !function(data) {
            function createMatrixEvalContext(colorAllocatorProvider, dataViewMatrix) {
                return data.createStaticEvalContext(colorAllocatorProvider);
            }
            data.createMatrixEvalContext = createMatrixEvalContext;
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, jsCommon = window.jsCommon, powerbi = window.powerbi;
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi_1) {
        var FormattingEncoder, StringExtensions = jsCommon.StringExtensions, Formatting = jsCommon.Formatting, RegExpExtensions = jsCommon.RegExpExtensions;
        !function(FormattingEncoder) {
            function removeLiterals(format) {
                return literalMatcher.lastIndex = 0, format.replace(literalMatcher, "");
            }
            function preserveLiterals(format, literals) {
                for (literalMatcher.lastIndex = 0; ;) {
                    var match = literalMatcher.exec(format);
                    if (!match) break;
                    var literal = match[0], literalOffset = literalMatcher.lastIndex - literal.length, token = String.fromCharCode(57600 + literals.length);
                    literals.push(literal), format = format.substr(0, literalOffset) + token + format.substr(literalMatcher.lastIndex), 
                    literalMatcher.lastIndex = literalOffset + 1;
                }
                return format;
            }
            function restoreLiterals(format, literals, quoted) {
                void 0 === quoted && (quoted = !0);
                for (var count = literals.length, i = 0; count > i; i++) {
                    var token = String.fromCharCode(57600 + i), literal = literals[i];
                    if (!quoted) {
                        var firstChar = literal[0];
                        literal = "\\" === firstChar || 1 === literal.length || literal[literal.length - 1] !== firstChar ? literal.substring(1) : literal.substring(1, literal.length - 1);
                    }
                    format = format.replace(token, literal);
                }
                return format;
            }
            var literalPatterns = [ "'[^']*'", '"[^"]*"', "\\\\.", "'[^']*$", '"[^"]*$', "\\\\$" ], literalMatcher = new RegExp(literalPatterns.join("|"), "g");
            FormattingEncoder.removeLiterals = removeLiterals, FormattingEncoder.preserveLiterals = preserveLiterals, 
            FormattingEncoder.restoreLiterals = restoreLiterals;
        }(FormattingEncoder || (FormattingEncoder = {}));
        var DateTimeFormat, IndexedTokensRegex = /({{)|(}})|{(\d+[^}]*)}/g, ZeroPlaceholder = "0", DigitPlaceholder = "#", ExponentialFormatChar = "E", NumericPlaceholders = [ ZeroPlaceholder, DigitPlaceholder ], NumericPlaceholderRegex = new RegExp(NumericPlaceholders.join("|"), "g"), FormattingService = function() {
            function FormattingService() {}
            return FormattingService.prototype.formatValue = function(value, format, culture) {
                if (void 0 === value || null === value) return "";
                var gculture = this.getCulture(culture);
                return DateTimeFormat.canFormat(value) ? DateTimeFormat.format(value, format, gculture) : NumberFormat.canFormat(value) ? NumberFormat.format(value, format, gculture) : value.toString();
            }, FormattingService.prototype.format = function(formatWithIndexedTokens, args, culture) {
                var _this = this;
                if (!formatWithIndexedTokens) return "";
                var result = formatWithIndexedTokens.replace(IndexedTokensRegex, function(match, left, right, argToken) {
                    if (left) return "{";
                    if (right) return "}";
                    var parts = argToken.split(":"), argIndex = parseInt(parts[0], 10), argFormat = parts[1];
                    return _this.formatValue(args[argIndex], argFormat, culture);
                });
                return result;
            }, FormattingService.prototype.isStandardNumberFormat = function(format) {
                return NumberFormat.isStandardFormat(format);
            }, FormattingService.prototype.formatNumberWithCustomOverride = function(value, format, nonScientificOverrideFormat, culture) {
                var gculture = this.getCulture(culture);
                return NumberFormat.formatWithCustomOverride(value, format, nonScientificOverrideFormat, gculture);
            }, FormattingService.prototype.dateFormatString = function(unit) {
                return this._dateTimeScaleFormatInfo || this.initialize(), this._dateTimeScaleFormatInfo.getFormatString(unit);
            }, FormattingService.prototype.setCurrentCulture = function(cultureSelector) {
                this._currentCultureSelector !== cultureSelector && (this._currentCulture = this.getCulture(cultureSelector), 
                this._currentCultureSelector = cultureSelector, this._dateTimeScaleFormatInfo = new DateTimeScaleFormatInfo(this._currentCulture));
            }, FormattingService.prototype.getCulture = function(cultureSelector) {
                if (null == cultureSelector) return null == this._currentCulture && this.initialize(), 
                this._currentCulture;
                var culture = Globalize.findClosestCulture(cultureSelector);
                return culture || (culture = Globalize.culture("en-US")), culture;
            }, FormattingService.prototype.initialize = function() {
                var cultureName = this.getCurrentCulture();
                this.setCurrentCulture(cultureName);
                var calendarName = this.getUrlParam("calendar");
                if (calendarName) {
                    var culture = this._currentCulture, c = culture.calendars[calendarName];
                    c && (culture.calendar = c);
                }
            }, FormattingService.prototype.getCurrentCulture = function() {
                var urlParam = this.getUrlParam("language");
                return urlParam ? urlParam : powerbi && powerbi.common && powerbi.common.cultureInfo ? powerbi.common.cultureInfo : window.navigator.userLanguage || window.navigator.language || Globalize.culture().name;
            }, FormattingService.prototype.getUrlParam = function(name) {
                var param = window.location.search.match(RegExp("[?&]" + name + "=([^&]*)"));
                return param ? param[1] : void 0;
            }, FormattingService;
        }();
        !function(DateTimeFormat) {
            function canFormat(value) {
                var result = value instanceof Date;
                return result;
            }
            function format(value, format, culture) {
                format = format || "G";
                var isStandard = 1 === format.length;
                try {
                    return isStandard ? formatDateStandard(value, format, culture) : formatDateCustom(value, format, culture);
                } catch (e) {
                    return formatDateStandard(value, "G", culture);
                }
            }
            function formatDateStandard(value, format, culture) {
                var patterns = culture.calendar.patterns;
                ensurePatterns(culture.calendar);
                var output = Formatting.findDateFormat(value, format, culture.name);
                return format = 1 === output.format.length ? patterns[output.format] : output.format, 
                culture = Globalize.culture("en-US"), Globalize.format(output.value, format, culture);
            }
            function formatDateCustom(value, format, culture) {
                var result, literals = [];
                if (format = FormattingEncoder.preserveLiterals(format, literals), format.indexOf("F") > -1) {
                    format = StringExtensions.replaceAll(format, "FFFF", "FFF");
                    var milliseconds = value.getMilliseconds();
                    if (milliseconds % 10 >= 1 && (format = StringExtensions.replaceAll(format, "FFF", "fff")), 
                    format = StringExtensions.replaceAll(format, "FFF", "FF"), milliseconds % 100 / 10 >= 1 && (format = StringExtensions.replaceAll(format, "FF", "ff")), 
                    format = StringExtensions.replaceAll(format, "FF", "F"), milliseconds % 1e3 / 100 >= 1 && (format = StringExtensions.replaceAll(format, "F", "f")), 
                    format = StringExtensions.replaceAll(format, "F", ""), "" === format || "%" === format) return "";
                }
                return format = processCustomDateTimeFormat(format), result = Globalize.format(value, format, culture), 
                result = localize(result, culture.calendar), result = FormattingEncoder.restoreLiterals(result, literals, !1);
            }
            function processCustomDateTimeFormat(format) {
                return format === _currentCachedFormat ? _currentCachedProcessedFormat : (_currentCachedFormat = format, 
                format = Formatting.fixDateTimeFormat(format), _currentCachedProcessedFormat = format, 
                format);
            }
            function localize(value, dictionary) {
                var timeSeparator = dictionary[":"];
                if (":" === timeSeparator) return value;
                for (var result = "", count = value.length, i = 0; count > i; i++) {
                    var char = value.charAt(i);
                    switch (char) {
                      case ":":
                        result += timeSeparator;
                        break;

                      default:
                        result += char;
                    }
                }
                return result;
            }
            function ensurePatterns(calendar) {
                var patterns = calendar.patterns;
                void 0 === patterns.g && (patterns.g = patterns.f.replace(patterns.D, patterns.d), 
                patterns.G = patterns.F.replace(patterns.D, patterns.d));
            }
            var _currentCachedFormat, _currentCachedProcessedFormat;
            DateTimeFormat.canFormat = canFormat, DateTimeFormat.format = format;
        }(DateTimeFormat || (DateTimeFormat = {}));
        var NumberFormat;
        !function(NumberFormat) {
            function getNonScientificFormatWithPrecision(baseFormat, numericFormat) {
                if (!numericFormat || void 0 === baseFormat) return baseFormat;
                var newFormat = "{0:" + numericFormat + "}";
                return baseFormat.replace("{0}", newFormat);
            }
            function getNumericFormat(value, baseFormat) {
                if (null == baseFormat) return baseFormat;
                if (hasFormatComponents(baseFormat)) {
                    var _a = NumberFormat.getComponents(baseFormat), positive = _a.positive, negative = _a.negative, zero = _a.zero;
                    return value > 0 ? getNumericFormatFromComponent(value, positive) : 0 === value ? getNumericFormatFromComponent(value, zero) : getNumericFormatFromComponent(value, negative);
                }
                return getNumericFormatFromComponent(value, baseFormat);
            }
            function getNumericFormatFromComponent(value, format) {
                var match = RegExpExtensions.run(NumericFormatRegex, format);
                return match ? match[0] : format;
            }
            function addDecimalsToFormat(baseFormat, decimals, trailingZeros) {
                if (null == decimals) return baseFormat;
                if (null == baseFormat && (baseFormat = ZeroPlaceholder), hasFormatComponents(baseFormat)) {
                    for (var _a = NumberFormat.getComponents(baseFormat), positive = _a.positive, negative = _a.negative, zero = _a.zero, formats = [ positive, negative, zero ], i = 0; i < formats.length; i++) formats[i] = addDecimalsToFormatComponent(formats[i], decimals, trailingZeros);
                    return formats.join(NumberFormat.NumberFormatComponentsDelimeter);
                }
                return addDecimalsToFormatComponent(baseFormat, decimals, trailingZeros);
            }
            function addDecimalsToFormatComponent(format, decimals, trailingZeros) {
                if (decimals = Math.abs(decimals), decimals >= 0) {
                    var literals = [];
                    format = FormattingEncoder.preserveLiterals(format, literals);
                    var placeholder = trailingZeros ? ZeroPlaceholder : DigitPlaceholder, decimalPlaceholders = StringExtensions.repeat(placeholder, Math.abs(decimals)), match = RegExpExtensions.run(DecimalFormatRegex, format);
                    if (match) {
                        var beforeDecimal = format.substr(0, match.index), formatDecimal = format.substr(match.index + 1, match[1].length), afterDecimal = format.substr(match.index + match[0].length);
                        if (trailingZeros) formatDecimal = decimalPlaceholders; else {
                            var decimalChange = decimalPlaceholders.length - formatDecimal.length;
                            decimalChange > 0 ? formatDecimal += decimalPlaceholders.slice(-decimalChange) : 0 > decimalChange && (formatDecimal = formatDecimal.slice(0, decimalChange));
                        }
                        formatDecimal.length > 0 && (formatDecimal = DecimalFormatCharacter + formatDecimal), 
                        format = beforeDecimal + formatDecimal + afterDecimal;
                    } else decimalPlaceholders.length > 0 && (format = format.replace(LastNumericPlaceholderRegex, "$1" + DecimalFormatCharacter + decimalPlaceholders));
                    0 !== literals.length && (format = FormattingEncoder.restoreLiterals(format, literals));
                }
                return format;
            }
            function hasFormatComponents(format) {
                return -1 !== FormattingEncoder.removeLiterals(format).indexOf(NumberFormat.NumberFormatComponentsDelimeter);
            }
            function getComponents(format) {
                var signFormat = {
                    hasNegative: !1,
                    positive: format,
                    negative: format,
                    zero: format
                }, literals = [];
                format = FormattingEncoder.preserveLiterals(format, literals);
                var signSpecificFormats = format.split(NumberFormat.NumberFormatComponentsDelimeter), formatCount = signSpecificFormats.length;
                return formatCount > 1 && (0 !== literals.length && (signSpecificFormats = _.map(signSpecificFormats, function(signSpecificFormat) {
                    return FormattingEncoder.restoreLiterals(signSpecificFormat, literals);
                })), signFormat.hasNegative = !0, signFormat.positive = signFormat.zero = signSpecificFormats[0], 
                signFormat.negative = signSpecificFormats[1], formatCount > 2 && (signFormat.zero = signSpecificFormats[2])), 
                signFormat;
            }
            function canFormat(value) {
                var result = "number" == typeof value;
                return result;
            }
            function isStandardFormat(format) {
                return StandardFormatRegex.test(format);
            }
            function format(value, format, culture) {
                format = format || "G";
                try {
                    return isStandardFormat(format) ? formatNumberStandard(value, format, culture) : formatNumberCustom(value, format, culture);
                } catch (e) {
                    return Globalize.format(value, void 0, culture);
                }
            }
            function formatWithCustomOverride(value, format, nonScientificOverrideFormat, culture) {
                return formatNumberCustom(value, format, culture, nonScientificOverrideFormat);
            }
            function formatNumberStandard(value, format, culture) {
                var result, precision = format.length > 1 ? parseInt(format.substr(1, format.length - 1), 10) : void 0, numberFormatInfo = culture.numberFormat, formatChar = format.charAt(0);
                switch (formatChar) {
                  case "e":
                  case "E":
                    void 0 === precision && (precision = 6);
                    var mantissaDecimalDigits = StringExtensions.repeat("0", precision);
                    format = "0." + mantissaDecimalDigits + formatChar + "+000", result = formatNumberCustom(value, format, culture);
                    break;

                  case "f":
                  case "F":
                    result = void 0 !== precision ? value.toFixed(precision) : value.toFixed(numberFormatInfo.decimals), 
                    result = localize(result, numberFormatInfo);
                    break;

                  case "g":
                  case "G":
                    var abs = Math.abs(value);
                    if (0 === abs || abs >= 1e-4 && 1e15 > abs) result = void 0 !== precision ? value.toPrecision(precision) : value.toString(); else {
                        if ("number" != typeof value) return String(value);
                        result = void 0 !== precision ? value.toExponential(precision) : value.toExponential(), 
                        result = result.replace("e", "E");
                    }
                    result = localize(result, numberFormatInfo);
                    break;

                  case "r":
                  case "R":
                    result = value.toString(), result = localize(result, numberFormatInfo);
                    break;

                  case "x":
                  case "X":
                    if (result = value.toString(16), "X" === formatChar && (result = result.toUpperCase()), 
                    void 0 !== precision) {
                        var actualPrecision = result.length, isNegative = 0 > value;
                        isNegative && actualPrecision--;
                        var paddingZerosCount = precision - actualPrecision, paddingZeros = void 0;
                        paddingZerosCount > 0 && (paddingZeros = StringExtensions.repeat("0", paddingZerosCount)), 
                        result = isNegative ? "-" + paddingZeros + result.substr(1) : paddingZeros + result;
                    }
                    result = localize(result, numberFormatInfo);
                    break;

                  default:
                    result = Globalize.format(value, format, culture);
                }
                return result;
            }
            function formatNumberCustom(value, format, culture, nonScientificOverrideFormat) {
                var result, numberFormatInfo = culture.numberFormat;
                if (!isFinite(value)) return Globalize.format(value, void 0);
                var formatComponents = getComponents(format);
                format = value > 0 ? formatComponents.positive : 0 === value ? formatComponents.zero : formatComponents.negative, 
                formatComponents.hasNegative && (value = Math.abs(value));
                var formatMeta = getCustomFormatMetadata(format, !0), literals = [];
                if (formatMeta.hasLiterals && (format = FormattingEncoder.preserveLiterals(format, literals)), 
                formatMeta.hasE && !nonScientificOverrideFormat) {
                    var scientificMatch = RegExpExtensions.run(ScientificFormatRegex, format);
                    if (scientificMatch) {
                        var formatM = format.substr(0, scientificMatch.index), formatE = format.substr(scientificMatch.index + 2), precision = getCustomFormatPrecision(formatM, formatMeta), scale = getCustomFormatScale(formatM, formatMeta);
                        if (1 !== scale && (value *= scale), "number" != typeof value) return String(value);
                        var s = value.toExponential(precision), indexOfE = s.indexOf("e"), mantissa = s.substr(0, indexOfE), exp = s.substr(indexOfE + 1), resultM = fuseNumberWithCustomFormat(mantissa, formatM, numberFormatInfo), resultE = fuseNumberWithCustomFormat(exp, formatE, numberFormatInfo);
                        "+" === resultE.charAt(0) && "+" !== scientificMatch[0].charAt(1) && (resultE = resultE.substr(1));
                        var e = scientificMatch[0].charAt(0);
                        result = resultM + e + resultE;
                    }
                }
                if (void 0 === result) {
                    var valueFormatted = void 0, isValueGlobalized = !1, precision = getCustomFormatPrecision(format, formatMeta), scale = getCustomFormatScale(format, formatMeta);
                    if (1 !== scale && (value *= scale), value = parseFloat(toNonScientific(value, precision)), 
                    nonScientificOverrideFormat) {
                        var numericFormat = NumberFormat.getNumericFormat(value, format);
                        nonScientificOverrideFormat = getNonScientificFormatWithPrecision(nonScientificOverrideFormat, numericFormat), 
                        valueFormatted = powerbi_1.formattingService.format(nonScientificOverrideFormat, [ value ], culture.name), 
                        isValueGlobalized = !0;
                    } else valueFormatted = toNonScientific(value, precision);
                    result = fuseNumberWithCustomFormat(valueFormatted, format, numberFormatInfo, nonScientificOverrideFormat, isValueGlobalized);
                }
                return formatMeta.hasLiterals && (result = FormattingEncoder.restoreLiterals(result, literals, !1)), 
                _lastCustomFormatMeta = formatMeta, result;
            }
            function toNonScientific(value, precision) {
                var result = "", precisionZeros = 0;
                precision > 16 && (precisionZeros = precision - 16, precision = 16);
                var digitsBeforeDecimalPoint = powerbi_1.Double.log10(Math.abs(value));
                if (16 > digitsBeforeDecimalPoint) {
                    if (digitsBeforeDecimalPoint > 0) {
                        var maxPrecision = 16 - digitsBeforeDecimalPoint;
                        precision > maxPrecision && (precisionZeros += precision - maxPrecision, precision = maxPrecision);
                    }
                    result = value.toFixed(precision);
                } else if (16 === digitsBeforeDecimalPoint) result = value.toFixed(0), precisionZeros += precision, 
                precisionZeros > 0 && (result += "."); else {
                    if ("number" != typeof value) return String(value);
                    result = value.toExponential(15);
                    var indexOfE = result.indexOf("e");
                    if (indexOfE > 0) {
                        var indexOfDot = result.indexOf("."), mantissa = result.substr(0, indexOfE), exp = result.substr(indexOfE + 1), powerZeros = parseInt(exp, 10) - (mantissa.length - indexOfDot - 1);
                        result = mantissa.replace(".", "") + StringExtensions.repeat("0", powerZeros), precision > 0 && (result = result + "." + StringExtensions.repeat("0", precision));
                    }
                }
                return precisionZeros > 0 && (result += StringExtensions.repeat("0", precisionZeros)), 
                result;
            }
            function getCustomFormatMetadata(format, calculatePrecision, calculateScale) {
                if (void 0 !== _lastCustomFormatMeta && format === _lastCustomFormatMeta.format) return _lastCustomFormatMeta;
                for (var literals = [], escaped = FormattingEncoder.preserveLiterals(format, literals), result = {
                    format: format,
                    hasLiterals: 0 !== literals.length,
                    hasE: !1,
                    hasCommas: !1,
                    hasDots: !1,
                    hasPercent: !1,
                    hasPermile: !1,
                    precision: void 0,
                    scale: void 0
                }, i = 0, length_1 = escaped.length; length_1 > i; i++) {
                    var c = escaped.charAt(i);
                    switch (c) {
                      case "e":
                      case "E":
                        result.hasE = !0;
                        break;

                      case ",":
                        result.hasCommas = !0;
                        break;

                      case ".":
                        result.hasDots = !0;
                        break;

                      case "%":
                        result.hasPercent = !0;
                        break;

                      case "‰":
                        result.hasPermile = !0;
                    }
                }
                var formatComponents = getComponents(format);
                return calculatePrecision && (result.precision = getCustomFormatPrecision(formatComponents.positive, result)), 
                calculateScale && (result.scale = getCustomFormatScale(formatComponents.positive, result)), 
                result;
            }
            function getCustomFormatPrecision(format, formatMeta) {
                if (formatMeta.precision > -1) return formatMeta.precision;
                var result = 0;
                if (formatMeta.hasDots) {
                    formatMeta.hasLiterals && (format = FormattingEncoder.removeLiterals(format));
                    var dotIndex = format.indexOf(".");
                    if (dotIndex > -1) {
                        for (var count = format.length, i = dotIndex; count > i; i++) {
                            var char = format.charAt(i);
                            if (char.match(NumericPlaceholderRegex) && result++, char === ExponentialFormatChar) break;
                        }
                        result = Math.min(19, result);
                    }
                }
                return formatMeta.precision = result, result;
            }
            function getCustomFormatScale(format, formatMeta) {
                if (formatMeta.scale > -1) return formatMeta.scale;
                var result = 1;
                if (formatMeta.hasPercent && format.indexOf("%") > -1 && (result = 100 * result), 
                formatMeta.hasPermile && format.indexOf("‰") > -1 && (result = 1e3 * result), formatMeta.hasCommas) {
                    var dotIndex = format.indexOf(".");
                    -1 === dotIndex && (dotIndex = format.length);
                    for (var i = dotIndex - 1; i > -1; i--) {
                        var char = format.charAt(i);
                        if ("," !== char) break;
                        result /= 1e3;
                    }
                }
                return formatMeta.scale = result, result;
            }
            function fuseNumberWithCustomFormat(value, format, numberFormatInfo, nonScientificOverrideFormat, isValueGlobalized) {
                var suppressModifyValue = !!nonScientificOverrideFormat, formatParts = format.split(".", 2);
                if (2 === formatParts.length) {
                    var wholeFormat = formatParts[0], fractionFormat = formatParts[1], displayUnit = "";
                    nonScientificOverrideFormat && (displayUnit = nonScientificOverrideFormat.replace(NumericalPlaceHolderRegex, ""), 
                    value = value.replace(displayUnit, ""));
                    var globalizedDecimalSeparator = numberFormatInfo["."], decimalSeparator = isValueGlobalized ? globalizedDecimalSeparator : ".", valueParts = value.split(decimalSeparator, 2), wholeValue = 1 === valueParts.length ? valueParts[0] + displayUnit : valueParts[0], fractionValue = 2 === valueParts.length ? valueParts[1] + displayUnit : "";
                    fractionValue = fractionValue.replace(TrailingZerosRegex, "");
                    var wholeFormattedValue = fuseNumberWithCustomFormatLeft(wholeValue, wholeFormat, numberFormatInfo, suppressModifyValue), fractionFormattedValue = fuseNumberWithCustomFormatRight(fractionValue, fractionFormat, suppressModifyValue);
                    return fractionFormattedValue.fmtOnly || "" === fractionFormattedValue.value ? wholeFormattedValue + fractionFormattedValue.value : wholeFormattedValue + globalizedDecimalSeparator + fractionFormattedValue.value;
                }
                return fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue);
            }
            function fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue) {
                var groupSymbolIndex = format.indexOf(","), enableGroups = groupSymbolIndex > -1 && groupSymbolIndex < Math.max(format.lastIndexOf("0"), format.lastIndexOf("#")) && numberFormatInfo[","], groupDigitCount = 0, groupIndex = 0, groupSizes = numberFormatInfo.groupSizes || [ 3 ], groupSize = groupSizes[0], groupSeparator = numberFormatInfo[","], sign = "", firstChar = value.charAt(0);
                "+" !== firstChar && "-" !== firstChar || (sign = numberFormatInfo[firstChar], value = value.substr(1));
                for (var isZero = "0" === value, result = "", leftBuffer = "", vi = value.length - 1, fmtOnly = !0, fi = format.length - 1; fi > -1; fi--) {
                    var formatChar = format.charAt(fi);
                    switch (formatChar) {
                      case ZeroPlaceholder:
                      case DigitPlaceholder:
                        fmtOnly = !1, "" !== leftBuffer && (result = leftBuffer + result, leftBuffer = ""), 
                        suppressModifyValue || ((vi > -1 || formatChar === ZeroPlaceholder) && enableGroups && (groupDigitCount === groupSize ? (result = groupSeparator + result, 
                        groupIndex++, groupIndex < groupSizes.length && (groupSize = groupSizes[groupIndex]), 
                        groupDigitCount = 1) : groupDigitCount++), vi > -1 ? (isZero && formatChar === DigitPlaceholder || (result = value.charAt(vi) + result), 
                        vi--) : formatChar !== DigitPlaceholder && (result = formatChar + result));
                        break;

                      case ",":
                        break;

                      default:
                        leftBuffer = formatChar + leftBuffer;
                    }
                }
                if (!suppressModifyValue) {
                    if (vi > -1 && "" !== result) if (enableGroups) for (;vi > -1; ) groupDigitCount === groupSize ? (result = groupSeparator + result, 
                    groupIndex++, groupIndex < groupSizes.length && (groupSize = groupSizes[groupIndex]), 
                    groupDigitCount = 1) : groupDigitCount++, result = value.charAt(vi) + result, vi--; else result = value.substr(0, vi + 1) + result;
                    return sign + leftBuffer + result;
                }
                return fmtOnly ? sign + leftBuffer + result : sign + leftBuffer + value + result;
            }
            function fuseNumberWithCustomFormatRight(value, format, suppressModifyValue) {
                var vi = 0, fCount = format.length, vCount = value.length;
                if (suppressModifyValue) {
                    var lastChar = format.charAt(fCount - 1);
                    return lastChar.match(NumericPlaceholderRegex) ? {
                        value: value,
                        fmtOnly: "" === value
                    } : {
                        value: value + lastChar,
                        fmtOnly: "" === value
                    };
                }
                for (var result = "", fmtOnly = !0, fi = 0; fCount > fi; fi++) {
                    var formatChar = format.charAt(fi);
                    if (vCount > vi) switch (formatChar) {
                      case ZeroPlaceholder:
                      case DigitPlaceholder:
                        result += value[vi++], fmtOnly = !1;
                        break;

                      default:
                        result += formatChar;
                    } else formatChar !== DigitPlaceholder && (result += formatChar, fmtOnly = fmtOnly && formatChar !== ZeroPlaceholder);
                }
                return {
                    value: result,
                    fmtOnly: fmtOnly
                };
            }
            function localize(value, dictionary) {
                var plus = dictionary["+"], minus = dictionary["-"], dot = dictionary["."], comma = dictionary[","];
                if ("+" === plus && "-" === minus && "." === dot && "," === comma) return value;
                for (var count = value.length, result = "", i = 0; count > i; i++) {
                    var char = value.charAt(i);
                    switch (char) {
                      case "+":
                        result += plus;
                        break;

                      case "-":
                        result += minus;
                        break;

                      case ".":
                        result += dot;
                        break;

                      case ",":
                        result += comma;
                        break;

                      default:
                        result += char;
                    }
                }
                return result;
            }
            var NumericalPlaceHolderRegex = /\{.+\}/, ScientificFormatRegex = /e[+-]*[0#]+/i, StandardFormatRegex = /^[a-z]\d{0,2}$/i, TrailingZerosRegex = /0+$/, DecimalFormatRegex = /\.([0#]*)/g, NumericFormatRegex = /[0#,\.]+[0,#]*/g, LastNumericPlaceholderRegex = /([0#])(?=[^0#]*$)/, DecimalFormatCharacter = ".";
            NumberFormat.NumberFormatComponentsDelimeter = ";", NumberFormat.getNumericFormat = getNumericFormat, 
            NumberFormat.addDecimalsToFormat = addDecimalsToFormat, NumberFormat.hasFormatComponents = hasFormatComponents, 
            NumberFormat.getComponents = getComponents;
            var _lastCustomFormatMeta;
            NumberFormat.canFormat = canFormat, NumberFormat.isStandardFormat = isStandardFormat, 
            NumberFormat.format = format, NumberFormat.formatWithCustomOverride = formatWithCustomOverride, 
            NumberFormat.getCustomFormatMetadata = getCustomFormatMetadata;
        }(NumberFormat = powerbi_1.NumberFormat || (powerbi_1.NumberFormat = {}));
        var DateTimeScaleFormatInfo = function() {
            function DateTimeScaleFormatInfo(culture) {
                var calendar = culture.calendar, patterns = calendar.patterns, monthAbbreviations = calendar.months.namesAbbr, cultureHasMonthAbbr = monthAbbreviations && monthAbbreviations[0], yearMonthPattern = patterns.Y, monthDayPattern = patterns.M, fullPattern = patterns.f, longTimePattern = patterns.T, shortTimePattern = patterns.t, separator = fullPattern.indexOf(",") > -1 ? ", " : " ", hasYearSymbol = 0 === yearMonthPattern.indexOf("yyyy'") && yearMonthPattern.length > 6 && "'" === yearMonthPattern[6];
                this.YearPattern = hasYearSymbol ? yearMonthPattern.substr(0, 7) : "yyyy";
                var yearPos = fullPattern.indexOf("yy"), monthPos = fullPattern.indexOf("MMMM");
                this.MonthPattern = cultureHasMonthAbbr && monthPos > -1 ? yearPos > monthPos ? "MMM yyyy" : "yyyy MMM" : yearMonthPattern, 
                this.DayPattern = cultureHasMonthAbbr ? monthDayPattern.replace("MMMM", "MMM") : monthDayPattern;
                var minutePos = fullPattern.indexOf("mm"), pmPos = fullPattern.indexOf("tt"), shortHourPattern = pmPos > -1 ? shortTimePattern.replace(":mm ", "") : shortTimePattern;
                switch (this.HourPattern = minutePos > yearPos ? this.DayPattern + separator + shortHourPattern : shortHourPattern + separator + this.DayPattern, 
                this.MinutePattern = shortTimePattern, this.SecondPattern = longTimePattern, this.MillisecondPattern = longTimePattern.replace("ss", "ss.fff"), 
                culture.name) {
                  case "fi-FI":
                    this.DayPattern = this.DayPattern.replace("'ta'", ""), this.HourPattern = this.HourPattern.replace("'ta'", "");
                }
            }
            return DateTimeScaleFormatInfo.prototype.getFormatString = function(unit) {
                switch (unit) {
                  case powerbi_1.DateTimeUnit.Year:
                    return this.YearPattern;

                  case powerbi_1.DateTimeUnit.Month:
                    return this.MonthPattern;

                  case powerbi_1.DateTimeUnit.Week:
                  case powerbi_1.DateTimeUnit.Day:
                    return this.DayPattern;

                  case powerbi_1.DateTimeUnit.Hour:
                    return this.HourPattern;

                  case powerbi_1.DateTimeUnit.Minute:
                    return this.MinutePattern;

                  case powerbi_1.DateTimeUnit.Second:
                    return this.SecondPattern;

                  case powerbi_1.DateTimeUnit.Millisecond:
                    return this.MillisecondPattern;
                }
            }, DateTimeScaleFormatInfo;
        }();
        powerbi_1.formattingService = new FormattingService();
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi), __extends = (window.powerbitests, 
    window.InJs, window.debug, window.jasmine, window.Microsoft, this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    });
    !function(powerbi) {
        var data;
        !function(data) {
            var SQExprShortSerializer;
            !function(SQExprShortSerializer) {
                function serialize(expr) {
                    return JSON.stringify(expr.accept(SQExprSerializer.instance));
                }
                function serializeArray(exprs) {
                    for (var str = "[", i = 0, len = exprs.length; len > i; i++) i > 0 && (str += ","), 
                    str += SQExprShortSerializer.serialize(exprs[i]);
                    return str + "]";
                }
                SQExprShortSerializer.serialize = serialize, SQExprShortSerializer.serializeArray = serializeArray;
                var SQExprSerializer = function(_super) {
                    function SQExprSerializer() {
                        _super.apply(this, arguments);
                    }
                    return __extends(SQExprSerializer, _super), SQExprSerializer.prototype.visitColumnRef = function(expr) {
                        return {
                            col: {
                                s: expr.source.accept(this),
                                r: expr.ref
                            }
                        };
                    }, SQExprSerializer.prototype.visitMeasureRef = function(expr) {
                        return {
                            measure: {
                                s: expr.source.accept(this),
                                r: expr.ref
                            }
                        };
                    }, SQExprSerializer.prototype.visitAggr = function(expr) {
                        return {
                            agg: {
                                a: expr.arg.accept(this),
                                f: expr.func
                            }
                        };
                    }, SQExprSerializer.prototype.visitEntity = function(expr) {
                        return {
                            e: expr.entity
                        };
                    }, SQExprSerializer.prototype.visitHierarchyLevel = function(expr) {
                        return {
                            h: expr.arg.accept(this),
                            l: expr.level
                        };
                    }, SQExprSerializer.prototype.visitHierarchy = function(expr) {
                        return {
                            e: expr.arg.accept(this),
                            h: expr.hierarchy
                        };
                    }, SQExprSerializer.prototype.visitPropertyVariationSource = function(expr) {
                        return {
                            e: expr.arg.accept(this),
                            n: expr.name,
                            p: expr.property
                        };
                    }, SQExprSerializer.prototype.visitAnd = function(expr) {
                        return {
                            and: {
                                l: expr.left.accept(this),
                                r: expr.right.accept(this)
                            }
                        };
                    }, SQExprSerializer.prototype.visitCompare = function(expr) {
                        return {
                            comp: {
                                k: expr.comparison,
                                l: expr.left.accept(this),
                                r: expr.right.accept(this)
                            }
                        };
                    }, SQExprSerializer.prototype.visitConstant = function(expr) {
                        return {
                            "const": {
                                t: expr.type.primitiveType,
                                v: expr.value
                            }
                        };
                    }, SQExprSerializer.prototype.visitArithmetic = function(expr) {
                        return {
                            arithmetic: {
                                o: expr.operator,
                                l: expr.left.accept(this),
                                r: expr.right.accept(this)
                            }
                        };
                    }, SQExprSerializer.prototype.visitScopedEval = function(expr) {
                        return {
                            scopedEval: {
                                e: expr.expression.accept(this),
                                s: serializeArray(expr.scope)
                            }
                        };
                    }, SQExprSerializer.prototype.visitWithRef = function(expr) {
                        return {
                            withRef: {
                                e: expr.expressionName
                            }
                        };
                    }, SQExprSerializer.prototype.visitTransformTableRef = function(expr) {
                        return {
                            transformTableRef: {
                                source: expr.source
                            }
                        };
                    }, SQExprSerializer.prototype.visitTransformOutputRoleRef = function(expr) {
                        var ref = {
                            transformOutputRoleRef: {
                                role: expr.role
                            }
                        };
                        return expr.transform && (ref.transformOutputRoleRef.transform = expr.transform), 
                        ref;
                    }, SQExprSerializer.prototype.visitDefault = function(expr) {}, SQExprSerializer.instance = new SQExprSerializer(), 
                    SQExprSerializer;
                }(data.DefaultSQExprVisitor);
            }(SQExprShortSerializer = data.SQExprShortSerializer || (data.SQExprShortSerializer = {}));
        }(data = powerbi.data || (powerbi.data = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var visuals;
        !function(visuals) {
            var Selector = powerbi.data.Selector, SelectionId = function() {
                function SelectionId(selector, highlight) {
                    this.selector = selector, this.highlight = highlight, this.key = JSON.stringify({
                        selector: selector ? Selector.getKey(selector) : null,
                        highlight: highlight
                    }), this.keyWithoutHighlight = JSON.stringify({
                        selector: selector ? Selector.getKey(selector) : null
                    });
                }
                return SelectionId.prototype.equals = function(other) {
                    return this.selector && other.selector ? this.highlight === other.highlight && Selector.equals(this.selector, other.selector) : !this.selector == !other.selector && this.highlight === other.highlight;
                }, SelectionId.prototype.includes = function(other, ignoreHighlight) {
                    void 0 === ignoreHighlight && (ignoreHighlight = !1);
                    var thisSelector = this.selector, otherSelector = other.selector;
                    if (!thisSelector || !otherSelector) return !1;
                    var thisData = thisSelector.data, otherData = otherSelector.data;
                    if (!thisData && thisSelector.metadata && thisSelector.metadata !== otherSelector.metadata) return !1;
                    if (!ignoreHighlight && this.highlight !== other.highlight) return !1;
                    if (thisData) {
                        if (!otherData) return !1;
                        if (thisData.length > 0) for (var i = 0, ilen = thisData.length; ilen > i; i++) {
                            var thisValue = thisData[i];
                            if (!otherData.some(function(otherValue) {
                                return powerbi.DataViewScopeIdentity.equals(thisValue, otherValue);
                            })) return !1;
                        }
                    }
                    return !0;
                }, SelectionId.prototype.getKey = function() {
                    return this.key;
                }, SelectionId.prototype.getKeyWithoutHighlight = function() {
                    return this.keyWithoutHighlight;
                }, SelectionId.prototype.hasIdentity = function() {
                    return this.selector && !!this.selector.data;
                }, SelectionId.prototype.getSelector = function() {
                    return this.selector;
                }, SelectionId.prototype.getSelectorsByColumn = function() {
                    return this.selectorsByColumn;
                }, SelectionId.createNull = function(highlight) {
                    return void 0 === highlight && (highlight = !1), new SelectionId(null, highlight);
                }, SelectionId.createWithId = function(id, highlight) {
                    void 0 === highlight && (highlight = !1);
                    var selector = null;
                    return id && (selector = {
                        data: [ id ]
                    }), new SelectionId(selector, highlight);
                }, SelectionId.createWithMeasure = function(measureId, highlight) {
                    void 0 === highlight && (highlight = !1);
                    var selector = {
                        metadata: measureId
                    }, selectionId = new SelectionId(selector, highlight);
                    return selectionId.selectorsByColumn = {
                        metadata: measureId
                    }, selectionId;
                }, SelectionId.createWithIdAndMeasure = function(id, measureId, highlight) {
                    void 0 === highlight && (highlight = !1);
                    var selector = {};
                    id && (selector.data = [ id ]), measureId && (selector.metadata = measureId), id || measureId || (selector = null);
                    var selectionId = new SelectionId(selector, highlight);
                    return selectionId;
                }, SelectionId.createWithIdAndMeasureAndCategory = function(id, measureId, queryName, highlight) {
                    void 0 === highlight && (highlight = !1);
                    var selectionId = this.createWithIdAndMeasure(id, measureId, highlight);
                    return selectionId.selector && (selectionId.selectorsByColumn = {}, id && queryName && (selectionId.selectorsByColumn.dataMap = {}, 
                    selectionId.selectorsByColumn.dataMap[queryName] = id), measureId && (selectionId.selectorsByColumn.metadata = measureId)), 
                    selectionId;
                }, SelectionId.createWithIds = function(id1, id2, highlight) {
                    void 0 === highlight && (highlight = !1);
                    var selector = null, selectorData = SelectionId.idArray(id1, id2);
                    return selectorData && (selector = {
                        data: selectorData
                    }), new SelectionId(selector, highlight);
                }, SelectionId.createWithIdsAndMeasure = function(id1, id2, measureId, highlight) {
                    void 0 === highlight && (highlight = !1);
                    var selector = {}, selectorData = SelectionId.idArray(id1, id2);
                    return selectorData && (selector.data = selectorData), measureId && (selector.metadata = measureId), 
                    id1 || id2 || measureId || (selector = null), new SelectionId(selector, highlight);
                }, SelectionId.createWithSelectorForColumnAndMeasure = function(dataMap, measureId, highlight) {
                    void 0 === highlight && (highlight = !1);
                    var selectionId, keys = Object.keys(dataMap);
                    selectionId = 2 === keys.length ? this.createWithIdsAndMeasure(dataMap[keys[0]], dataMap[keys[1]], measureId, highlight) : 1 === keys.length ? this.createWithIdsAndMeasure(dataMap[keys[0]], null, measureId, highlight) : this.createWithIdsAndMeasure(null, null, measureId, highlight);
                    var selectorsByColumn = {};
                    return _.isEmpty(dataMap) || (selectorsByColumn.dataMap = dataMap), measureId && (selectorsByColumn.metadata = measureId), 
                    dataMap || measureId || (selectorsByColumn = null), selectionId.selectorsByColumn = selectorsByColumn, 
                    selectionId;
                }, SelectionId.createWithHighlight = function(original) {
                    var newId = new SelectionId(original.getSelector(), !0);
                    return newId.selectorsByColumn = original.selectorsByColumn, newId;
                }, SelectionId.idArray = function(id1, id2) {
                    if (id1 || id2) {
                        var data_1 = [];
                        return id1 && data_1.push(id1), id2 && id2 !== id1 && data_1.push(id2), data_1;
                    }
                }, SelectionId;
            }();
            visuals.SelectionId = SelectionId;
            var SelectionIdBuilder = function() {
                function SelectionIdBuilder() {}
                return SelectionIdBuilder.builder = function() {
                    return new SelectionIdBuilder();
                }, SelectionIdBuilder.prototype.withCategoryIdentity = function(categoryColumn, identity) {
                    return categoryColumn && categoryColumn.source && categoryColumn.source.queryName && (this.ensureDataMap()[categoryColumn.source.queryName] = identity), 
                    this;
                }, SelectionIdBuilder.prototype.withCategory = function(categoryColumn, index) {
                    return categoryColumn && categoryColumn.source && categoryColumn.source.queryName && categoryColumn.identity && (this.ensureDataMap()[categoryColumn.source.queryName] = categoryColumn.identity[index]), 
                    this;
                }, SelectionIdBuilder.prototype.withSeries = function(seriesColumn, valueColumn) {
                    return seriesColumn && seriesColumn.source && seriesColumn.source.queryName && valueColumn && (this.ensureDataMap()[seriesColumn.source.queryName] = valueColumn.identity), 
                    this;
                }, SelectionIdBuilder.prototype.withMeasure = function(measureId) {
                    return this.measure = measureId, this;
                }, SelectionIdBuilder.prototype.createSelectionId = function() {
                    return SelectionId.createWithSelectorForColumnAndMeasure(this.ensureDataMap(), this.measure);
                }, SelectionIdBuilder.prototype.ensureDataMap = function() {
                    return this.dataMap || (this.dataMap = {}), this.dataMap;
                }, SelectionIdBuilder;
            }();
            visuals.SelectionIdBuilder = SelectionIdBuilder;
        }(visuals = powerbi.visuals || (powerbi.visuals = {}));
    }(powerbi || (powerbi = {}));
}, function(module, exports) {
    var powerbi, powerbi = (window.jsCommon, window.powerbi);
    window.powerbitests, window.InJs, window.debug, window.jasmine, window.Microsoft;
    !function(powerbi) {
        var VisualStylePresetHelpers;
        !function(VisualStylePresetHelpers) {
            function getStylePreset(stylePresets, name) {
                if (stylePresets) {
                    _.isEmpty(name) && (name = stylePresets.defaultPresetName);
                    var preset = stylePresets.presets[name];
                    return preset || (preset = stylePresets.presets[stylePresets.defaultPresetName]), 
                    preset;
                }
            }
            function getStylePresetsEnum(stylePresets) {
                var members = [];
                if (stylePresets) {
                    var presets = stylePresets.presets;
                    if (presets) for (var name_1 in presets) {
                        var stylePreset = presets[name_1];
                        members.push({
                            value: stylePreset.name,
                            displayName: stylePreset.displayName
                        });
                    }
                }
                return powerbi.createEnumType(members);
            }
            VisualStylePresetHelpers.getStylePreset = getStylePreset, VisualStylePresetHelpers.getStylePresetsEnum = getStylePresetsEnum;
        }(VisualStylePresetHelpers = powerbi.VisualStylePresetHelpers || (powerbi.VisualStylePresetHelpers = {}));
    }(powerbi || (powerbi = {}));
} ]);