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

import { SoftwareDeliveryMachineConfiguration } from "@atomist/sdm";
import * as assert from "power-assert";
import {
    canDeploy,
    canDockerPush,
} from "../../lib/machine/config";

describe("config", () => {

    describe("canDockerPush", () => {

        it("should return false if no config", () => {
            assert(!canDockerPush(undefined));
        });

        it("should return false if no sdm", () => {
            assert(!canDockerPush({}));
        });

        it("should return false if no docker", () => {
            assert(!canDockerPush({ sdm: {} }));
        });

        it("should return false if empty build", () => {
            assert(!canDockerPush({ sdm: { build: {} } }));
        });

        it("should return false if empty docker", () => {
            assert(!canDockerPush({ sdm: { build: { docker: {} } } }));
        });

        it("should return false if no registry", () => {
            assert(!canDockerPush({ sdm: { build: { docker: { user: "neil", password: "young" } } } }));
        });

        it("should return false if no user", () => {
            assert(!canDockerPush({ sdm: { build: { docker: { registry: "songs-for-judy", password: "young" } } } }));
        });

        it("should return false if no password", () => {
            assert(!canDockerPush({ sdm: { build: { docker: { registry: "songs-for-judy", user: "neil" } } } }));
        });

        it("should return true if complete", () => {
            assert(canDockerPush({ sdm: { build: { docker: { registry: "songs-for-judy", user: "neil", password: "young" } } } }));
        });

    });

    describe("canDeploy", () => {

        let atmMode: string;
        before(() => {
            if (process.env.ATOMIST_MODE) {
                atmMode = process.env.ATOMIST_MODE;
                delete process.env.ATOMIST_MODE;
            }
        });
        after(() => {
            if (atmMode) {
                process.env.ATOMIST_MODE = atmMode;
            }
        });

        it("should return false if no config", () => {
            assert(!canDeploy(undefined));
        });

        it("should return false if empty config", () => {
            const c: SoftwareDeliveryMachineConfiguration = {} as any;
            assert(!canDeploy(c));
        });

        it("should return false if no API key", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                workspaceIds: ["A1234546"],
                sdm: {
                    build: {
                        docker: {
                            registry: "songs-for-judy",
                            user: "neil",
                            password: "young",
                        },
                    },
                },
            } as any;
            assert(!canDeploy(c));
        });

        it("should return false if no workspace", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "0123456789ABCDEF0123456789ABCDEF",
                sdm: {
                    build: {
                        docker: {
                            registry: "songs-for-judy",
                            user: "neil",
                            password: "young",
                        },
                    },
                },
            } as any;
            assert(!canDeploy(c));
        });

        it("should return false if no sdm", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "0123456789ABCDEF0123456789ABCDEF",
                workspaceIds: ["A1234546"],
            } as any;
            assert(!canDeploy(c));
        });

        it("should return false if no docker", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "0123456789ABCDEF0123456789ABCDEF",
                workspaceIds: ["A1234546"],
                sdm: {
                    prompt: false,
                },
            } as any;
            assert(!canDeploy(c));
        });

        it("should return false if no registry", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "0123456789ABCDEF0123456789ABCDEF",
                workspaceIds: ["A1234546"],
                sdm: {
                    build: {
                        docker: {
                            user: "neil",
                            password: "young",
                        },
                    },
                },
            } as any;
            assert(!canDeploy(c));
        });

        it("should return false if no user", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "0123456789ABCDEF0123456789ABCDEF",
                workspaceIds: ["A1234546"],
                sdm: {
                    build: {
                        docker: {
                            registry: "songs-for-judy",
                            password: "young",
                        },
                    },
                },
            } as any;
            assert(!canDeploy(c));
        });

        it("should return false if no password", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "0123456789ABCDEF0123456789ABCDEF",
                workspaceIds: ["A1234546"],
                sdm: {
                    build: {
                        docker: {
                            registry: "songs-for-judy",
                            user: "neil",
                        },
                    },
                },
            } as any;
            assert(!canDeploy(c));
        });

        it("should return true if complete", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "0123456789ABCDEF0123456789ABCDEF",
                workspaceIds: ["A1234546"],
                sdm: {
                    build: {
                        docker: {
                            registry: "songs-for-judy",
                            user: "neil",
                            password: "young",
                        },
                    },
                },
            } as any;
            assert(canDeploy(c));
        });

        it("should return false if API key is not valid", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "7db45d78-ef47-46d0-8199-dfd30fef7ad4",
                workspaceIds: ["A1234546"],
                sdm: {
                    build: {
                        docker: {
                            registry: "songs-for-judy",
                            user: "neil",
                            password: "young",
                        },
                    },
                },
            } as any;
            assert(!canDeploy(c));
        });

        it("should return false if workspace ID is local", () => {
            const c: SoftwareDeliveryMachineConfiguration = {
                apiKey: "0123456789ABCDEF0123456789ABCDEF",
                workspaceIds: ["local"],
                sdm: {
                    build: {
                        docker: {
                            registry: "songs-for-judy",
                            user: "neil",
                            password: "young",
                        },
                    },
                },
            } as any;
            assert(!canDeploy(c));
        });

    });

});
