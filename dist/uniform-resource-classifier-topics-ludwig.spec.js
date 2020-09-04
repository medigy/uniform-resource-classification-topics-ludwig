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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@shah/ts-pipe", "@shah/uniform-resource", "alsatian", "./uniform-resource-classifier-topics-ludwig"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestSuite = void 0;
    const p = __importStar(require("@shah/ts-pipe"));
    const ur = __importStar(require("@shah/uniform-resource"));
    const alsatian_1 = require("alsatian");
    const urTopics = __importStar(require("./uniform-resource-classifier-topics-ludwig"));
    let TestSuite = class TestSuite {
        testcallTopicsAPI() {
            return __awaiter(this, void 0, void 0, function* () {
                const tr = p.pipe(new ur.FollowRedirectsGranular(), ur.EnrichCuratableContent.singleton, urTopics.LudwigTopicsClassifier.singleton);
                const resource = yield ur.acquireResource({ uri: "https://www.cnn.com/2020/07/30/investing/teladoc-earnings/index.html", transformer: tr });
                alsatian_1.Expect(resource).toBeDefined();
                if (urTopics.isTopicsClassifiedResource(resource)) {
                    alsatian_1.Expect(resource.ludwigTopicsClassification.prediction.suggestions.length).toBeGreaterThan(0);
                }
            });
        }
    };
    __decorate([
        alsatian_1.Timeout(60000),
        alsatian_1.Test("Test a MeSH API Call"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], TestSuite.prototype, "testcallTopicsAPI", null);
    TestSuite = __decorate([
        alsatian_1.TestFixture("Uniform Resource Test Suite")
    ], TestSuite);
    exports.TestSuite = TestSuite;
});
//# sourceMappingURL=uniform-resource-classifier-topics-ludwig.spec.js.map