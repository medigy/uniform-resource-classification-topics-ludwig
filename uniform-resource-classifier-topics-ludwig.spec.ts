import * as p from "@shah/ts-pipe";
import * as ur from "@shah/uniform-resource";
import { Expect, Test, TestFixture, Timeout } from "alsatian";
import * as urTopics from "./uniform-resource-classifier-topics-ludwig";

@TestFixture("Uniform Resource Test Suite")
export class TestSuite {
    @Timeout(60000)
    @Test("Test a MeSH API Call")
    async testcallTopicsAPI(): Promise<void> {
        const tr = p.pipe(new ur.FollowRedirectsGranular(), ur.EnrichCuratableContent.singleton, urTopics.LudwigTopicsClassifier.singleton);
        const resource = await ur.acquireResource({ uri: "https://www.cnn.com/2020/07/30/investing/teladoc-earnings/index.html", transformer: tr });
        Expect(resource).toBeDefined();
        if (urTopics.isTopicsClassifiedResource(resource)) {
            Expect(resource.ludwigTopicsClassification.prediction.suggestions.length).toBeGreaterThan(0);
        }
    }
}
