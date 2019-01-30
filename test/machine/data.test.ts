/*
 * Copyright © 2019 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from "power-assert";
import {
    addSecret,
    annotateIngress,
    selfDeployAppData,
} from "../../lib/machine/data";

/* tslint:disable:max-file-line-count */

describe("data", () => {

    describe("addSecret", () => {

        it("should add the configuration as a secret", () => {
            const a: any = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                workspaceId: "F0RT4P4CH3",
                deploymentSpec: {
                    apiVersion: "apps/v1",
                    kind: "Deployment",
                    metadata: {
                        name: "pixies",
                    },
                    spec: {
                        replicas: 1,
                        template: {
                            metadata: {
                                name: "pixies",
                            },
                            spec: {
                                containers: [
                                    {
                                        name: "pixies",
                                        image: "come/on:pilgrim",
                                    },
                                ],
                            },
                        },
                        strategy: {
                            type: "RollingUpdate",
                            rollingUpdate: {
                                maxUnavailable: 0,
                                maxSurge: 1,
                            },
                        },
                    },
                },
            };
            const g: any = {
                sdm: {
                    configuration: {
                        apiKey: "0123456789ABCDEF",
                        workspaceIds: ["SURF3RR05A", a.workspaceId],
                        name: "@pixies/come-on-pilgrim",
                        version: "1987.9.28",
                        environment: a.environment,
                        sdm: {
                            build: {
                                docker: {
                                    registry: "pixies",
                                    user: "francis",
                                    password: "LevitateMe",
                                },
                            },
                        },
                    },
                },
            };
            const r = addSecret(a, g);
            const e = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                workspaceId: "F0RT4P4CH3",
                deploymentSpec: {
                    apiVersion: "apps/v1",
                    kind: "Deployment",
                    metadata: {
                        name: "pixies",
                    },
                    spec: {
                        replicas: 1,
                        template: {
                            metadata: {
                                name: "pixies",
                            },
                            spec: {
                                containers: [
                                    {
                                        env: [
                                            {
                                                name: "ATOMIST_CONFIG_PATH",
                                                value: "/opt/atm/client.config.json",
                                            },
                                        ],
                                        name: "pixies",
                                        image: "come/on:pilgrim",
                                        volumeMounts: [
                                            {
                                                mountPath: "/opt/atm",
                                                name: "sdm-config",
                                                readOnly: true,
                                            },
                                        ],

                                    },
                                ],
                                volumes: [
                                    {
                                        name: "sdm-config",
                                        secret: {
                                            secretName: "pixies",
                                            defaultMode: 256,
                                        },
                                    },
                                ],
                            },
                        },
                        strategy: {
                            type: "RollingUpdate",
                            rollingUpdate: {
                                maxUnavailable: 0,
                                maxSurge: 1,
                            },
                        },
                    },
                },
                secrets: [
                    {
                        apiVersion: "v1",
                        kind: "Secret",
                        type: "Opaque",
                        metadata: {
                            name: "pixies",
                        },
                        data: {
                            // tslint:disable-next-line:max-line-length
                            "client.config.json": "eyJuYW1lIjoiQHBpeGllcy9jb21lLW9uLXBpbGdyaW1fYW1oZXJzdF80YWQiLCJhcGlLZXkiOiIwMTIzNDU2Nzg5QUJDREVGIiwid29ya3NwYWNlSWRzIjpbIkYwUlQ0UDRDSDMiXSwiZW52aXJvbm1lbnQiOiJhbWhlcnN0Iiwic2RtIjp7ImJ1aWxkIjp7ImRvY2tlciI6eyJyZWdpc3RyeSI6InBpeGllcyIsInVzZXIiOiJmcmFuY2lzIiwicGFzc3dvcmQiOiJMZXZpdGF0ZU1lIn19fX0=",
                        },
                    },
                ],
            };
            assert.deepStrictEqual(r, e);
        });

        it("should append the configuration as a secret", () => {
            const a: any = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                workspaceId: "F0RT4P4CH3",
                deploymentSpec: {
                    apiVersion: "apps/v1",
                    kind: "Deployment",
                    metadata: {
                        name: "pixies",
                    },
                    spec: {
                        replicas: 1,
                        template: {
                            metadata: {
                                name: "pixies",
                            },
                            spec: {
                                containers: [
                                    {
                                        env: [
                                            {
                                                name: "ATOMIST_GOAL_LAUNCHER",
                                                value: "kubernetes",
                                            },
                                        ],
                                        name: "pixies",
                                        image: "come/on:pilgrim",
                                    },
                                ],
                            },
                        },
                        strategy: {
                            type: "RollingUpdate",
                            rollingUpdate: {
                                maxUnavailable: 0,
                                maxSurge: 1,
                            },
                        },
                    },
                },
                secrets: [{
                    apiVersion: "v1",
                    kind: "Secret",
                    type: "Opaque",
                    metadata: {
                        name: "band",
                    },
                    data: {
                        vocals: "QmxhY2sgRnJhbmNpcw==",
                        guitar: "Sm9leSBTYW50aWFnbw==",
                        bass: "S2ltIERlYWw=",
                        drums: "RGF2aWQgTG92ZXJpbmc=",
                    },
                }],
            };
            const g = {
                sdm: {
                    configuration: {
                        apiKey: "0123456789ABCDEF",
                        workspaceIds: ["SURF3RR05A", a.workspaceId],
                        name: "@pixies/come-on-pilgrim",
                        version: "1987.9.28",
                        environment: a.environment,
                        sdm: {
                            build: {
                                docker: {
                                    registry: "pixies",
                                    user: "francis",
                                    password: "LevitateMe",
                                },
                            },
                        },
                    },
                },
            };
            const r = addSecret(a, g as any);
            const e = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                workspaceId: "F0RT4P4CH3",
                deploymentSpec: {
                    apiVersion: "apps/v1",
                    kind: "Deployment",
                    metadata: {
                        name: "pixies",
                    },
                    spec: {
                        replicas: 1,
                        template: {
                            metadata: {
                                name: "pixies",
                            },
                            spec: {
                                containers: [
                                    {
                                        env: [
                                            {
                                                name: "ATOMIST_GOAL_LAUNCHER",
                                                value: "kubernetes",
                                            },
                                            {
                                                name: "ATOMIST_CONFIG_PATH",
                                                value: "/opt/atm/client.config.json",
                                            },
                                        ],
                                        name: "pixies",
                                        image: "come/on:pilgrim",
                                        volumeMounts: [
                                            {
                                                mountPath: "/opt/atm",
                                                name: "sdm-config",
                                                readOnly: true,
                                            },
                                        ],

                                    },
                                ],
                                volumes: [
                                    {
                                        name: "sdm-config",
                                        secret: {
                                            secretName: "pixies",
                                            defaultMode: 256,
                                        },
                                    },
                                ],
                            },
                        },
                        strategy: {
                            type: "RollingUpdate",
                            rollingUpdate: {
                                maxUnavailable: 0,
                                maxSurge: 1,
                            },
                        },
                    },
                },
                secrets: [
                    a.secrets[0],
                    {
                        apiVersion: "v1",
                        kind: "Secret",
                        type: "Opaque",
                        metadata: {
                            name: "pixies",
                        },
                        data: {
                            // tslint:disable-next-line:max-line-length
                            "client.config.json": "eyJuYW1lIjoiQHBpeGllcy9jb21lLW9uLXBpbGdyaW1fYW1oZXJzdF80YWQiLCJhcGlLZXkiOiIwMTIzNDU2Nzg5QUJDREVGIiwid29ya3NwYWNlSWRzIjpbIkYwUlQ0UDRDSDMiXSwiZW52aXJvbm1lbnQiOiJhbWhlcnN0Iiwic2RtIjp7ImJ1aWxkIjp7ImRvY2tlciI6eyJyZWdpc3RyeSI6InBpeGllcyIsInVzZXIiOiJmcmFuY2lzIiwicGFzc3dvcmQiOiJMZXZpdGF0ZU1lIn19fX0=",
                        },
                    },
                ],
            };
            assert.deepStrictEqual(r, e);
        });

    });

    describe("annotateIngress", () => {

        it("should add annotations to ingress", () => {
            const a = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                path: "/",
                workspaceId: "FORTAPACHE",
            };
            const u = annotateIngress(a, "minikube");
            const e = {
                metadata: {
                    annotations: {
                        "kubernetes.io/ingress.class": "nginx",
                        "nginx.ingress.kubernetes.io/rewrite-target": "/",
                        "nginx.ingress.kubernetes.io/ssl-redirect": "false",
                    },
                },
            };
            assert.deepStrictEqual(u.ingressSpec, e);
        });

        it("should properly merge ingress spec", () => {
            const a = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                path: "/",
                workspaceId: "FORTAPACHE",
                ingressSpec: {
                    metadata: {
                        annotations: {
                            "nginx.ingress.kubernetes.io/rewrite-target": "/deal",
                            "nginx.ingress.kubernetes.io/client-body-buffer-size": "1m",
                            "nginx.ingress.kubernetes.io/ssl-redirect": "false",
                        },
                    },
                },
            };
            const u = annotateIngress(a, "minikube");
            const e = {
                metadata: {
                    annotations: {
                        "kubernetes.io/ingress.class": "nginx",
                        "nginx.ingress.kubernetes.io/rewrite-target": "/deal",
                        "nginx.ingress.kubernetes.io/client-body-buffer-size": "1m",
                        "nginx.ingress.kubernetes.io/ssl-redirect": "false",
                    },
                },
            };
            assert.deepStrictEqual(u.ingressSpec, e);
        });

        it("should not add anything if no path", () => {
            const a = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                workspaceId: "FORTAPACHE",
            };
            const u = annotateIngress(a, "minikube");
            assert.deepStrictEqual(u, a);
        });

        it("should not add anything if context not minikube", () => {
            const a = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                path: "/",
                workspaceId: "FORTAPACHE",
            };
            const u = annotateIngress(a, "doolittle");
            assert.deepStrictEqual(u, a);
        });

    });

    describe("selfDeployAppData", () => {

        let atmMode: string;
        before(() => {
            if (process.env.ATOMIST_MODE) {
                atmMode = process.env.ATOMIST_MODE;
            }
            process.env.ATOMIST_MODE = "local";
        });
        after(() => {
            if (atmMode) {
                process.env.ATOMIST_MODE = atmMode;
            } else {
                delete process.env.ATOMIST_MODE;
            }
        });
        it("should make ready the deployment", async () => {
            const a: any = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                workspaceId: "F0RT4P4CH3",
                deploymentSpec: {
                    apiVersion: "apps/v1",
                    kind: "Deployment",
                    metadata: {
                        name: "pixies",
                    },
                    spec: {
                        replicas: 1,
                        template: {
                            metadata: {
                                name: "pixies",
                            },
                            spec: {
                                containers: [
                                    {
                                        name: "pixies",
                                        image: "come/on:pilgrim",
                                    },
                                ],
                            },
                        },
                        strategy: {
                            type: "RollingUpdate",
                            rollingUpdate: {
                                maxUnavailable: 0,
                                maxSurge: 1,
                            },
                        },
                    },
                },
            };
            const p: any = {};
            const g: any = {
                sdm: {
                    configuration: {
                        apiKey: "0123456789ABCDEF",
                        workspaceIds: ["SURF3RR05A", a.workspaceId],
                        name: "@pixies/come-on-pilgrim",
                        version: "1987.9.28",
                        environment: a.environment,
                        sdm: {
                            build: {
                                docker: {
                                    registry: "pixies",
                                    user: "francis",
                                    password: "LevitateMe",
                                },
                            },
                        },
                    },
                },
            };
            const r = await selfDeployAppData(a, p, g);
            const e = {
                environment: "amherst",
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "sdm",
                workspaceId: "F0RT4P4CH3",
                deploymentSpec: {
                    apiVersion: "apps/v1",
                    kind: "Deployment",
                    metadata: {
                        name: "pixies",
                    },
                    spec: {
                        replicas: 1,
                        template: {
                            metadata: {
                                name: "pixies",
                            },
                            spec: {
                                containers: [
                                    {
                                        env: [
                                            {
                                                name: "ATOMIST_GOAL_LAUNCHER",
                                                value: "kubernetes",
                                            },
                                            {
                                                name: "ATOMIST_CONFIG_PATH",
                                                value: "/opt/atm/client.config.json",
                                            },
                                        ],
                                        name: "pixies",
                                        image: "come/on:pilgrim",
                                        volumeMounts: [
                                            {
                                                mountPath: "/opt/atm",
                                                name: "sdm-config",
                                                readOnly: true,
                                            },
                                        ],

                                    },
                                ],
                                volumes: [
                                    {
                                        name: "sdm-config",
                                        secret: {
                                            secretName: "pixies",
                                            defaultMode: 256,
                                        },
                                    },
                                ],
                            },
                        },
                        strategy: {
                            type: "RollingUpdate",
                            rollingUpdate: {
                                maxUnavailable: 0,
                                maxSurge: 1,
                            },
                        },
                    },
                },
                secrets: [
                    {
                        apiVersion: "v1",
                        kind: "Secret",
                        type: "Opaque",
                        metadata: {
                            name: "pixies",
                        },
                        data: {
                            // tslint:disable-next-line:max-line-length
                            "client.config.json": "eyJuYW1lIjoiQHBpeGllcy9jb21lLW9uLXBpbGdyaW1fYW1oZXJzdF9zZG0iLCJhcGlLZXkiOiIwMTIzNDU2Nzg5QUJDREVGIiwid29ya3NwYWNlSWRzIjpbIkYwUlQ0UDRDSDMiXSwiZW52aXJvbm1lbnQiOiJhbWhlcnN0Iiwic2RtIjp7ImJ1aWxkIjp7ImRvY2tlciI6eyJyZWdpc3RyeSI6InBpeGllcyIsInVzZXIiOiJmcmFuY2lzIiwicGFzc3dvcmQiOiJMZXZpdGF0ZU1lIn19fX0=",
                        },
                    },
                ],
            };
            assert.deepStrictEqual(r, e);
        });

    });

});
