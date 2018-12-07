/*
 * Copyright © 2018 Atomist, Inc.
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
    InMemoryProject,
} from "@atomist/automation-client";
import * as assert from "power-assert";
import * as readPkgUp from "read-pkg-up";
import {
    IsMe,
} from "../../lib/machine/pushTest";

describe("pushTest", () => {

    describe("IsMe", () => {

        it("should identify itself", async () => {
            const pkg = await readPkgUp({ cwd: __dirname });
            const p = InMemoryProject.of({ path: "package.json", content: JSON.stringify(pkg.pkg) });
            const b = await IsMe.predicate(p);
            assert(b);
        });

        it("should return false for other SDM", async () => {
            const p = InMemoryProject.of({ path: "package.json", content: `{"name":"@atomist/other-sdm"}` });
            const b = await IsMe.predicate(p);
            assert(!b);
        });

        it("should return false for non-Node project", async () => {
            const p = InMemoryProject.of();
            const b = await IsMe.predicate(p);
            assert(!b);
        });

    });

});
