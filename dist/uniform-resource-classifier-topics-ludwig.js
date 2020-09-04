var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@shah/traverse-urls", "@shah/uniform-resource", "form-data"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LudwigTopicsClassifier = exports.isTopicsClassifiedResource = exports.isLudwigTopicsClassifiableResource = void 0;
    const tru = __importStar(require("@shah/traverse-urls"));
    const ur = __importStar(require("@shah/uniform-resource"));
    const form_data_1 = __importDefault(require("form-data"));
    function isLudwigTopicsClassifiableResource(o) {
        return o && "suggestedTopicsNotClassifiableResource" in o;
    }
    exports.isLudwigTopicsClassifiableResource = isLudwigTopicsClassifiableResource;
    function isTopicsClassifiedResource(o) {
        return o && "ludwigTopicsClassification" in o;
    }
    exports.isTopicsClassifiedResource = isTopicsClassifiedResource;
    class LudwigTopicsClassifier {
        constructor() {
        }
        callTopicsAPI(ctx, resource, input) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield tru.call("https://prod.ludwig.ml.infra.medigy.com/predict", input, new tru.FormDataCallOptions({ fetchTimeOut: 120000 }));
                if (tru.isCallResult(result)) {
                    return Object.assign(Object.assign({}, resource), { ludwigTopicsClassification: result.callResultPOJO });
                }
                else {
                    return Object.assign(Object.assign({}, resource), { ludwigTopicsNotClassifiableRemarks: `Unable to classify: ${result.error}, ${JSON.stringify(result.postBodyPOJO)}` });
                }
            });
        }
        flow(ctx, resource) {
            return __awaiter(this, void 0, void 0, function* () {
                let content = '', title = '', shortDescription = '';
                if (ur.isMozillaReadabilityContent(resource)) {
                    const readable = resource.mozillaReadability();
                    return this.callTopicsAPI(ctx, resource, readable.textContent);
                }
                if (ur.isFollowedResource(resource) && tru.isTerminalTextContentResult(resource.terminalResult)) {
                    const enriched = yield ur.EnrichMozillaReadabilityContent.singleton.flow(ctx, resource);
                    if (ur.isMozillaReadabilityContent(enriched)) {
                        const readable = enriched.mozillaReadability();
                        // console.log(readable.textContent);
                        // return this.callTopicsAPI(ctx, resource, readable.textContent)
                        content = readable.textContent;
                    }
                    else {
                        return Object.assign(Object.assign({}, resource), { ludwigTopicsNotClassifiableRemarks: `Unable to obtain Mozilla Readability content` });
                    }
                    const enrichedCuratable = yield ur.EnrichCuratableContent.singleton.flow(ctx, resource);
                    if (ur.isCuratableContentResource(enrichedCuratable)) {
                        title = enrichedCuratable.curatableContent.title;
                    }
                    var form = new form_data_1.default();
                    form.append("title", title);
                    form.append("shortDescription", '');
                    form.append("content", content);
                    // console.log("test", this.callTopicsAPI(ctx, resource, form))
                    return this.callTopicsAPI(ctx, resource, form);
                }
                return Object.assign(Object.assign({}, resource), { ludwigTopicsNotClassifiableRemarks: `No readable text found` });
            });
        }
    }
    exports.LudwigTopicsClassifier = LudwigTopicsClassifier;
    LudwigTopicsClassifier.singleton = new LudwigTopicsClassifier();
});
//# sourceMappingURL=uniform-resource-classifier-topics-ludwig.js.map