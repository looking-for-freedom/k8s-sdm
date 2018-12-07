/*
 * Copyright © 2018 Atomist, Inc.
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
    GitHubRepoRef,
} from "@atomist/automation-client";
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
    DockerOptions,
    HasDockerfile,
} from "@atomist/sdm-pack-docker";
import {
    kubernetesSupport,
} from "@atomist/sdm-pack-k8";
import {
    IsNode,
    nodeBuilder,
    NodeModulesProjectListener,
    NodeProjectCreationParametersDefinition,
    NodeProjectVersioner,
    UpdatePackageJsonIdentification,
    UpdateReadmeTitle,
} from "@atomist/sdm-pack-node";

export function machine(
    configuration: SoftwareDeliveryMachineConfiguration,
): SoftwareDeliveryMachine {

    const sdm = createSoftwareDeliveryMachine({
        name: "Kubernetes Software Delivery Machine",
        configuration,
    });

    const version = new Version().with({
        name: "npm-versioner",
        versioner: NodeProjectVersioner,
        pushTest: IsNode,
    });
    const build = new Build().with({
        name: "npm-run-build",
        builder: nodeBuilder("npm run compile", "npm test"),
        pushTest: IsNode,
    })
        .withProjectListener(NodeModulesProjectListener);
    const buildGoals = goals("build")
        .plan(version)
        .plan(build).after(version);

    const dockerBuildOptions: DockerOptions = { push: false };
    if (!isInLocalMode() && sdm.configuration.sdm && sdm.configuration.sdm.docker) {
        const d = sdm.configuration.sdm.docker;
        if (d.registry && d.user && d.password) {
            dockerBuildOptions.push = true;
            dockerBuildOptions.registry = d.registry;
            dockerBuildOptions.user = d.user;
            dockerBuildOptions.password = d.password;
        }
    }
    const dockerBuild = new DockerBuild().with({
        name: "npm-docker-build",
        imageNameCreator: DefaultDockerImageNameCreator,
        options: dockerBuildOptions,
        pushTest: IsNode,
    });
    const dockerGoals = goals("docker")
        .plan(dockerBuild).after(buildGoals);

    sdm.withPushRules(
        whenPushSatisfies(IsNode).setGoals(buildGoals),
        whenPushSatisfies(HasDockerfile).setGoals(dockerGoals),
    );

    sdm.addExtensionPacks(kubernetesSupport());

    sdm.addGeneratorCommand({
        name: "k8-sdm-generator",
        startingPoint: new GitHubRepoRef("atomist", "k8-sdm"),
        intent: "create k8-sdm",
        parameters: NodeProjectCreationParametersDefinition,
        transform: [
            UpdatePackageJsonIdentification,
            UpdateReadmeTitle,
        ],
    });

    return sdm;
}
