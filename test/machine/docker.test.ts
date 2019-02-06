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

import { SoftwareDeliveryMachine } from "@atomist/sdm";
import * as assert from "power-assert";
import { dockerOptions } from "../../lib/machine/docker";

describe("docker", () => {

    describe("dockerOptions", () => {

        it("should not push when no configuration", () => {
            const s: SoftwareDeliveryMachine = {
                configuration: {
                    sdm: {},
                },
            } as any;
            const o = dockerOptions(s);
            const e = {
                push: false,
            };
            assert.deepStrictEqual(o, e);
        });

        it("should push when given configuration", () => {
            const s: SoftwareDeliveryMachine = {
                configuration: {
                    name: "@beat/happening",
                    sdm: {
                        build: {
                            docker: {
                                password: "you",
                                registry: "us",
                                user: "me",
                            },
                        },
                    },
                },
            } as any;
            const o = dockerOptions(s);
            const e = {
                push: true,
                password: "you",
                registry: "us",
                user: "me",
            };
            assert.deepStrictEqual(o, e);
        });

        it("should get registry from SDM configuration and push", () => {
            const s: SoftwareDeliveryMachine = {
                configuration: {
                    name: "@beat/happening",
                    sdm: {
                        build: {
                            docker: {
                                password: "you",
                                user: "me",
                            },
                        },
                    },
                },
            } as any;
            const o = dockerOptions(s);
            const e = {
                push: true,
                password: "you",
                registry: "beat",
                user: "me",
            };
            assert.deepStrictEqual(o, e);
        });

    });

});
