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
import { DockerOptions } from "@atomist/sdm-pack-docker";

/**
 * Generate docker options from the SDM configuration.  It looks in
 * the SDM configuration, specifically under
 * `sdm.configuration.sdm.build.docker` for the "push", "registry",
 * "user", and "password" properties.  If it cannot get the registry
 * from the SDM configuration, it tries to extract one from the
 * package scope of the SDM.
 *
 * @param sdm The current SDM
 * @return Docker registry information
 */
export function dockerOptions(sdm: SoftwareDeliveryMachine): DockerOptions {
    const options: DockerOptions = { push: false };
    if (sdm.configuration.sdm && sdm.configuration.sdm.build && sdm.configuration.sdm.build.docker) {
        options.registry = sdm.configuration.sdm.build.docker.registry;
        options.user = sdm.configuration.sdm.build.docker.user;
        options.password = sdm.configuration.sdm.build.docker.password;
    }
    if (!options.registry && sdm.name) {
        const pkgName = sdm.name;
        if (pkgName.startsWith("@") && pkgName.includes("/")) {
            options.registry = pkgName.substring(1).split("/", 2)[0];
        }
    }
    if (options.registry && options.user && options.password) {
        options.push = true;
    }
    return options;
}
