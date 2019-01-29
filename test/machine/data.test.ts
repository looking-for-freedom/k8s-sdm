/*
 * Copyright © 2019 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    GitProject,
    RemoteRepoRef,
} from "@atomist/automation-client";
import {
    KubernetesApplication,
    KubernetesDeploy,
} from "@atomist/sdm-pack-k8s";
import * as assert from "power-assert";
import { addSecret } from "../../lib/machine/data";

describe("data", () => {

    describe("addSecret", () => {

        const op = () => { return; };
        const pop = () => Promise.resolve();
        const rr: RemoteRepoRef = {
            owner: "",
            repo: "",
            url: "",
            sha: "",
            path: "",
            branch: "",
            kind: "",
            remoteBase: "",
            providerType: 0 as any,
            cloneUrl: () => "",
            createRemote: () => Promise.resolve({ target: {} as any, success: true }),
            setUserConfig: () => Promise.resolve({ target: {} as any, success: true }),
            raisePullRequest: () => Promise.resolve({ target: {} as any, success: true }),
            deleteRemote: () => Promise.resolve({ target: {} as any, success: true }),
        };

        it("should add the configuration as a secret", async () => {
            const a: KubernetesApplication = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                workspaceId: "FORTAPACHE",
            };
            const p: GitProject = {} as any;
            const g: KubernetesDeploy = {
                details: {
                    displayName: "Length: 20:28",
                },
                sdm: {
                    addExtensionPacks: undefined,
                    configuration: {
                        apiKey: "0123456789ABCDEF",
                        workspaceIds: [a.workspaceId],
                        name: "@pixies/come-on-pilgrim",
                        version: "1987.9.28",
                        environment: a.environment,
                        sdm: {
                            artifactStore: {
                                storeFile: () => Promise.resolve(""),
                                checkout: () => Promise.resolve({ name: "", version: "", id: rr }),
                            },
                            logFactory: () => Promise.resolve({
                                name: "",
                                write: op,
                                flush: pop,
                                close: pop,
                                isAvailable: () => Promise.resolve(true),
                            }),
                            projectLoader: {
                                doWithProject: (par: any, ac: any) => ac(p),
                            },
                            repoFinder: () => Promise.resolve([rr]),
                            repoRefResolver: {
                                providerIdFromPush: () => "",
                                repoRefFromPush: () => rr,
                                repoRefFromSdmGoal: () => rr,
                                toRemoteRepoRef: () => rr,
                            },
                            projectPersister: () => Promise.resolve({ target: p, success: true }),
                            credentialsResolver: {
                                commandHandlerCredentials: () => Promise.resolve({ token: "notoken" }),
                                eventHandlerCredentials: () => Promise.resolve({ token: "notoken" }),
                            },
                            docker: {
                                registry: "pixies",
                                user: "francis",
                                password: "ImTired",
                            },
                            targets: () => ({
                                repoRef: rr,
                                credentials: { token: "nimrod" },
                                test: () => true,
                                bindAndValidate: () => { },
                            }),
                            preferenceStoreFactory: () => ({
                                get: (k: string) => Promise.resolve({} as any),
                                put: <T>(k: string, v: T) => Promise.resolve(v),
                            }),
                        },
                    },
                    extensionPacks: [],
                    pushMapping: undefined,
                    goalFulfillmentMapper: undefined,
                    addGoalContributions: undefined,
                    withPushRules: undefined,
                    addGoalApprovalRequestVoter: undefined,
                    setGoalApprovalRequestVoteDecisionManager: undefined,
                    name: "gary-smith",
                    addStartupListener: undefined,
                    addTriggeredListener: undefined,
                    addNewIssueListener: undefined,
                    addUpdatedIssueListener: undefined,
                },
            } as any;
            const r = await addSecret(a, p, g);
            const e = [{
                apiVersion: "v1",
                kind: "Secret",
                type: "Opaque",
                metadata: {
                    name: "sdm",
                },
                data: {
                    // tslint:disable-next-line:max-line-length
                    "client.config.json": "eyJhcGlLZXkiOiIwMTIzNDU2Nzg5QUJDREVGIiwid29ya3NwYWNlSWRzIjpbIkZPUlRBUEFDSEUiXSwibmFtZSI6IkBwaXhpZXMvY29tZS1vbi1waWxncmltIiwidmVyc2lvbiI6IjE5ODcuOS4yOCIsImVudmlyb25tZW50IjoiYW1oZXJzdCIsInNkbSI6eyJkb2NrZXIiOnsicmVnaXN0cnkiOiJwaXhpZXMiLCJ1c2VyIjoiZnJhbmNpcyIsInBhc3N3b3JkIjoiSW1UaXJlZCJ9fX0=",
                },
            }];
            assert.deepStrictEqual(r.secrets, e);
        });

    });

});
