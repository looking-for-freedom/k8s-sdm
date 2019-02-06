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

import { logger } from "@atomist/automation-client";
import { predicatePushTest } from "@atomist/sdm";
import * as readPkgUp from "read-pkg-up";

/** True if the project receiving the push is this project. */
export const IsMe = predicatePushTest("IsMe", async p => {
    try {
        const mePkgInfo = await readPkgUp({ cwd: __dirname });
        if (!mePkgInfo || !mePkgInfo.pkg) {
            logger.warn(`Failed to read SDM package.json, returning false`);
            return false;
        }
        const mePkg = mePkgInfo.pkg;
        const pushPkgFile = await p.getFile("package.json");
        if (!pushPkgFile) {
            // not this project and not worth logging
            return false;
        }
        const pushPkgContent = await pushPkgFile.getContent();
        const pushPkg: readPkgUp.Package = JSON.parse(pushPkgContent);
        if (mePkg.name === pushPkg.name) {
            return true;
        }
    } catch (e) {
        logger.warn(`Failed to determine if this push was from this package, returning false: ${e.message}`);
    }
    return false;
});
