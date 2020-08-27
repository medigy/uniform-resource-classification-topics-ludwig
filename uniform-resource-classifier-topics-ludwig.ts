import * as tru from "@shah/traverse-urls";
import * as ur from "@shah/uniform-resource";
import { Readable } from "stream"
import FormData from 'form-data'

// TODO: need to proper type this based on MeSH On Demand API response


export interface TopicsClassificationLudwigResults {
  readonly prediction: {
    primary: string,
    suggestions: string[]
  }
}

export interface LudwigTopicsNotClassifiableResource extends ur.UniformResource {
  readonly ludwigTopicsNotClassifiableRemarks: string;
}

export function isLudwigTopicsClassifiableResource(o: any): o is LudwigTopicsNotClassifiableResource {
  return o && "suggestedTopicsNotClassifiableResource" in o;
}

export interface LudwigClassifiedResource extends ur.UniformResource {
  readonly ludwigTopicsClassification: TopicsClassificationLudwigResults;
}

export function isTopicsClassifiedResource(o: any): o is LudwigClassifiedResource {
  return o && "ludwigTopicsClassification" in o;
}

export class LudwigTopicsClassifier implements ur.UniformResourceTransformer {
  static readonly singleton = new LudwigTopicsClassifier();

  constructor() {
  }

  async callTopicsAPI(ctx: ur.ResourceTransformerContext, resource: ur.UniformResource, input: object): Promise<LudwigTopicsNotClassifiableResource | LudwigClassifiedResource> {
    const result = await tru.call("https://ludwig.ml.infra.medigy.com/predict", input, new tru.FormDataCallOptions({ fetchTimeOut: 120000 }));
    if (tru.isCallResult(result)) {
      return {
        ...resource,
        ludwigTopicsClassification: result.callResultPOJO,
      };
    } else {
      return {
        ...resource,
        ludwigTopicsNotClassifiableRemarks: `Unable to classify: ${result.error}, ${JSON.stringify(result.postBodyPOJO)}`,
      };
    }
  }

  async flow(ctx: ur.ResourceTransformerContext, resource: ur.UniformResource): Promise<LudwigTopicsNotClassifiableResource | LudwigClassifiedResource> {
    let content = '', title = '', shortDescription = '';
    if (ur.isMozillaReadabilityContent(resource)) {

      const readable = resource.mozillaReadability();
      return this.callTopicsAPI(ctx, resource, readable.textContent)
    }
    if (ur.isFollowedResource(resource) && tru.isTerminalTextContentResult(resource.terminalResult)) {

      const enriched = await ur.EnrichMozillaReadabilityContent.singleton.flow(ctx, resource);
      if (ur.isMozillaReadabilityContent(enriched)) {
        const readable = enriched.mozillaReadability();
        // console.log(readable.textContent);

        // return this.callTopicsAPI(ctx, resource, readable.textContent)
        content = readable.textContent;
      } else {
        return {
          ...resource,
          ludwigTopicsNotClassifiableRemarks: `Unable to obtain Mozilla Readability content`,
        };
      }
      const enrichedCuratable = await ur.EnrichCuratableContent.singleton.flow(ctx, resource);
      if (ur.isCuratableContentResource(enrichedCuratable)) {
        title = enrichedCuratable.curatableContent.title;
        if(enrichedCuratable.curatableContent.description != undefined){
          shortDescription = enrichedCuratable.curatableContent.description;
        }
      }
      

      var form = new FormData();
      form.append("title", title);
      form.append("shortDescription", shortDescription);
      form.append("content", content);

      // console.log("test", this.callTopicsAPI(ctx, resource, form))
      return this.callTopicsAPI(ctx, resource, form);
    }
    return {
      ...resource,
      ludwigTopicsNotClassifiableRemarks: `No readable text found`,
    };
  }
}
