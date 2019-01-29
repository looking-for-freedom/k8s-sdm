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

import { GitProject } from "@atomist/automation-client";
import {
    encodeSecret,
    KubernetesApplication,
    KubernetesDeploy,
} from "@atomist/sdm-pack-k8s";
import * as stringify from "json-stringify-safe";

/** Name of SDM secret. */
export const sdmSecretName = "sdm";
/** Key containing the SDM configuration in the SDM secret. */
export const sdmSecretConfigKey = "client.config.json";

/**
 * Add current SDM configuration as secret to application data.  The
 * secret name will be [[sdmSecretName]] and the key in the secret
 * data containing the encoded configuration will be
 * [[sdmSecretConfigKey]].
 *
 * @param app Current value of application data
 * @param p Project being deployed
 * @param goal Kubernetes deployment goal
 * @return Kubernetes application data with SDM configuration as secret.
 */
export async function addSecret(app: KubernetesApplication, p: GitProject, goal: KubernetesDeploy): Promise<KubernetesApplication> {
    const secretData: { [key: string]: string } = {};
    secretData[sdmSecretConfigKey] = stringify(goal.sdm.configuration, sdmConfigFilter);
    const configSecret = encodeSecret(sdmSecretName, secretData);
    if (app.secrets) {
        app.secrets.push(configSecret);
    } else {
        app.secrets = [configSecret];
    }
    return app;
}

/** Remove non-configuration values from SDM configuration */
function sdmConfigFilter<T>(k: string, v: T): T | undefined {
    const excludes = [
        "artifactStore",
        "credentialsResolver",
        "logFactory",
        "projectLoader",
        "projectPersister",
        "repoFinder",
        "repoRefResolver",
        "targets",
        "preferenceStoreFactory",
        "parameterPromptFactory",
        "goalScheduler",
        "adminAddressChannels",
    ];
    if (excludes.includes(k)) {
        return undefined;
    }
    return v;
}
