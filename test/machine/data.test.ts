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
    localIngress,
    selfDeployAppData,
} from "../../lib/machine/data";

/* tslint:disable:max-file-line-count */

describe("data", () => {

    describe("addSecret", () => {

        it("should add the configuration as a secret", () => {
            const a = {
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
                                maxUnavailable: 0 as any,
                                maxSurge: 1 as any,
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
                        name: "@pixies/come-on-pilgrim_amherst",
                        version: "1987.9.28",
                        environment: "fort_apache_studios",
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
                    name: "Pixies - Come on Pilgrim",
                },
            };
            const r = addSecret(a, g, undefined);
            const e = {
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
                            "client.config.json": "eyJuYW1lIjoiQHBpeGllcy9jb21lLW9uLXBpbGdyaW1fYW1oZXJzdF80YWQiLCJhcGlLZXkiOiIwMTIzNDU2Nzg5QUJDREVGIiwid29ya3NwYWNlSWRzIjpbIkYwUlQ0UDRDSDMiXSwiZW52aXJvbm1lbnQiOiJmb3J0X2FwYWNoZV9zdHVkaW9zIiwiY2x1c3RlciI6eyJ3b3JrZXJzIjoyfSwic2RtIjp7ImJ1aWxkIjp7ImRvY2tlciI6eyJyZWdpc3RyeSI6InBpeGllcyIsInVzZXIiOiJmcmFuY2lzIiwicGFzc3dvcmQiOiJMZXZpdGF0ZU1lIn19fX0=",
                        },
                    },
                ],
            };
            assert.deepStrictEqual(r, e);
        });

        it("should append the configuration as a secret", () => {
            const a: any = {
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
                        name: "@pixies/come-on-pilgrim_amherst",
                        version: "1987.9.28",
                        environment: "fort_apache_studios",
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
                    name: "Pixies - Come on Pilgrim",
                },
            };
            const r = addSecret(a, g as any, "the-purple-tape");
            const e = {
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
                            "client.config.json": "eyJuYW1lIjoiQHBpeGllcy9jb21lLW9uLXBpbGdyaW1fYW1oZXJzdF80YWQiLCJhcGlLZXkiOiIwMTIzNDU2Nzg5QUJDREVGIiwid29ya3NwYWNlSWRzIjpbIkYwUlQ0UDRDSDMiXSwiZW52aXJvbm1lbnQiOiJ0aGUtcHVycGxlLXRhcGUiLCJjbHVzdGVyIjp7IndvcmtlcnMiOjJ9LCJzZG0iOnsiYnVpbGQiOnsiZG9ja2VyIjp7InJlZ2lzdHJ5IjoicGl4aWVzIiwidXNlciI6ImZyYW5jaXMiLCJwYXNzd29yZCI6Ikxldml0YXRlTWUifX19fQ==",
                        },
                    },
                ],
            };
            assert.deepStrictEqual(r, e);
        });

    });

    describe("annotateIngress", () => {

        it("should update path and add protocol & ingress spec", () => {
            const a = {
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                path: "/",
                workspaceId: "FORTAPACHE",
            };
            const u = localIngress(a, "minikube");
            const e = {
                ...a,
                path: "/4ad/pixies",
                protocol: "http",
                ingressSpec: {
                    metadata: {
                        annotations: {
                            "kubernetes.io/ingress.class": "nginx",
                            "nginx.ingress.kubernetes.io/rewrite-target": "/",
                            "nginx.ingress.kubernetes.io/ssl-redirect": "false",
                        },
                    },
                },
            };
            assert.deepStrictEqual(u, e);
        });

        it("should properly merge ingress spec", () => {
            const a = {
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
            const u = localIngress(a, "minikube");
            const e = {
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                path: "/4ad/pixies",
                protocol: "http",
                workspaceId: "FORTAPACHE",
                ingressSpec: {
                    metadata: {
                        annotations: {
                            "kubernetes.io/ingress.class": "nginx",
                            "nginx.ingress.kubernetes.io/rewrite-target": "/deal",
                            "nginx.ingress.kubernetes.io/client-body-buffer-size": "1m",
                            "nginx.ingress.kubernetes.io/ssl-redirect": "false",
                        },
                    },
                },
            };
            assert.deepStrictEqual(u, e);
        });

        it("should add ingress even if no path", () => {
            const a = {
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                workspaceId: "FORTAPACHE",
            };
            const u = localIngress(a, "minikube");
            const e = {
                ...a,
                path: "/4ad/pixies",
                protocol: "http",
                ingressSpec: {
                    metadata: {
                        annotations: {
                            "kubernetes.io/ingress.class": "nginx",
                            "nginx.ingress.kubernetes.io/rewrite-target": "/",
                            "nginx.ingress.kubernetes.io/ssl-redirect": "false",
                        },
                    },
                },
            };
            assert.deepStrictEqual(u, e);
        });

        it("should not add anything if context not minikube", () => {
            const a = {
                image: "come/on:pilgrim",
                name: "pixies",
                ns: "4ad",
                path: "/",
                workspaceId: "FORTAPACHE",
            };
            const u = localIngress(a, "doolittle");
            assert.deepStrictEqual(u, a);
        });

    });

    describe("selfDeployAppData", () => {

        let envKubeConfig: string;
        before(() => {
            if (process.env.KUBECONFIG) {
                envKubeConfig = process.env.KUBECONFIG;
            }
            process.env.KUBECONFIG = "/dev/null";
        });
        after(() => {
            if (envKubeConfig) {
                process.env.KUBECONFIG = envKubeConfig;
            } else {
                delete process.env.KUBECONFIG;
            }
        });

        it("should make ready the deployment", async () => {
            const a: any = {
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
                        name: "@pixies/come-on-pilgrim_amherst",
                        version: "1987.9.28",
                        environment: "fort_apache_studios",
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
                    name: "Pixies - Come on Pilgrim",
                },
            };
            const r = await selfDeployAppData(a, p, g);
            const e = {
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
                            "client.config.json": "eyJuYW1lIjoiQHBpeGllcy9jb21lLW9uLXBpbGdyaW1fYW1oZXJzdF9zZG0iLCJhcGlLZXkiOiIwMTIzNDU2Nzg5QUJDREVGIiwid29ya3NwYWNlSWRzIjpbIkYwUlQ0UDRDSDMiXSwiZW52aXJvbm1lbnQiOiJmb3J0X2FwYWNoZV9zdHVkaW9zIiwiY2x1c3RlciI6eyJ3b3JrZXJzIjoyfSwic2RtIjp7ImJ1aWxkIjp7ImRvY2tlciI6eyJyZWdpc3RyeSI6InBpeGllcyIsInVzZXIiOiJmcmFuY2lzIiwicGFzc3dvcmQiOiJMZXZpdGF0ZU1lIn19fX0=",
                        },
                    },
                ],
            };
            assert.deepStrictEqual(r, e);
        });

    });

});
