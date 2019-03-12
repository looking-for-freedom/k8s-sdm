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

import {
    goals,
    SoftwareDeliveryMachine,
    SoftwareDeliveryMachineConfiguration,
    whenPushSatisfies,
} from "@atomist/sdm";
import {
    createSoftwareDeliveryMachine,
    isInLocalMode,
    Version,
} from "@atomist/sdm-core";
import { Build } from "@atomist/sdm-pack-build";
import {
    DefaultDockerImageNameCreator,
    DockerBuild,
} from "@atomist/sdm-pack-docker";
import {
    k8sSupport,
    KubernetesDeploy,
} from "@atomist/sdm-pack-k8s";
import {
    nodeBuilder,
    NodeModulesProjectListener,
    NodeProjectVersioner,
    NpmCompileProjectListener,
    NpmVersionProjectListener,
} from "@atomist/sdm-pack-node";
import { canDeploy } from "./config";
import { selfDeployAppData } from "./data";
import { dockerOptions } from "./docker";
import { IsMe } from "./pushTest";

/**
 * Configure k8s-sdm by adding sdm-pack-k8s.  If running in local
 * mode, k8s-sdm will be configured to build and, if there is a valid
 * workspace ID and API key, deploy itself.
 */
export function machine(configuration: SoftwareDeliveryMachineConfiguration): SoftwareDeliveryMachine {

    const sdm = createSoftwareDeliveryMachine({
        name: "Kubernetes Software Delivery Machine",
        configuration,
    });

    sdm.addExtensionPacks(k8sSupport({ registerCluster: true }));

    if (isInLocalMode()) {
        const version = new Version().with({
            name: "npm-versioner",
            versioner: NodeProjectVersioner,
            pushTest: IsMe,
        });

        const build = new Build().with({
            name: "npm-run-build",
            builder: nodeBuilder(
                { command: "npm", args: ["run", "compile"] },
                { command: "npm", args: ["test"] },
            ),
            pushTest: IsMe,
        })
            .withProjectListener(NodeModulesProjectListener);

        const dockerBuild = new DockerBuild().with({
            name: "npm-docker-build",
            imageNameCreator: DefaultDockerImageNameCreator,
            options: dockerOptions(sdm),
            pushTest: IsMe,
        })
            .withProjectListener(NodeModulesProjectListener)
            .withProjectListener(NpmVersionProjectListener)
            .withProjectListener(NpmCompileProjectListener);

        const deploy = new KubernetesDeploy({ environment: configuration.environment })
            .with({ applicationData: selfDeployAppData });

        const dockerBuildGoals = goals("docker build")
            .plan(version)
            .plan(build).after(version)
            .plan(dockerBuild).after(build);

        const deployGoals = goals("docker build and deploy")
            .plan(dockerBuildGoals)
            .plan(deploy).after(dockerBuildGoals);

        const meGoals = (canDeploy(configuration)) ? deployGoals : dockerBuildGoals;

        sdm.withPushRules(whenPushSatisfies(IsMe).setGoals(meGoals));
    }

    return sdm;
}
