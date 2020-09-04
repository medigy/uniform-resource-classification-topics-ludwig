import * as ur from "@shah/uniform-resource";
export interface TopicsClassificationLudwigResults {
    readonly prediction: {
        primary: string;
        suggestions: string[];
    };
}
export interface LudwigTopicsNotClassifiableResource extends ur.UniformResource {
    readonly ludwigTopicsNotClassifiableRemarks: string;
}
export declare function isLudwigTopicsClassifiableResource(o: any): o is LudwigTopicsNotClassifiableResource;
export interface LudwigClassifiedResource extends ur.UniformResource {
    readonly ludwigTopicsClassification: TopicsClassificationLudwigResults;
}
export declare function isTopicsClassifiedResource(o: any): o is LudwigClassifiedResource;
export declare class LudwigTopicsClassifier implements ur.UniformResourceTransformer {
    static readonly singleton: LudwigTopicsClassifier;
    constructor();
    callTopicsAPI(ctx: ur.ResourceTransformerContext, resource: ur.UniformResource, input: object): Promise<LudwigTopicsNotClassifiableResource | LudwigClassifiedResource>;
    flow(ctx: ur.ResourceTransformerContext, resource: ur.UniformResource): Promise<LudwigTopicsNotClassifiableResource | LudwigClassifiedResource>;
}
