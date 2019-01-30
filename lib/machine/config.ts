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
    Configuration,
    logger,
} from "@atomist/automation-client";
import {
    getUserConfig,
    writeUserConfig,
} from "@atomist/automation-client/lib/configuration";
import { SoftwareDeliveryMachineConfiguration } from "@atomist/sdm";
import { isInLocalMode } from "@atomist/sdm-core";
import * as k8s from "@kubernetes/client-node";
import * as inquirer from "inquirer";

/**
 * Test if configuration contains a valid Docker push configuration.
 */
export function canDockerPush(c: Configuration): boolean {
    return c && c.sdm && c.sdm.docker && c.sdm.docker.registry && c.sdm.docker.user && c.sdm.docker.password;
}

/**
 * When in local mode, prompt for Docker options if they are not all
 * present.  To be used as a configuration post-processor.
 */
export async function checkConfiguration(c: Configuration): Promise<Configuration> {
    if (!isInLocalMode()) {
        // only prompt in local mode
        return c;
    }
    if (canDockerPush(c)) {
        return c;
    }
    if (c.sdm && c.sdm.build && c.sdm.build.docker && c.sdm.build.docker.prompt === false) {
        return c;
    }
    if (!c.sdm) {
        c.sdm = {};
    }
    if (!c.sdm.build) {
        c.sdm.build = {};
    }
    if (!c.sdm.build.docker) {
        c.sdm.build.docker = {};
    }
    if (c.sdm.build.docker.prompt !== false) {
        c.sdm.build.docker.prompt = true;
    }
    const questions: inquirer.Question[] = [
        {
            type: "confirm",
            name: "prompt",
            message: "Configure Docker Registry?",
            default: c.sdm.build.docker.prompt,
        },
        {
            type: "input",
            name: "registry",
            message: "Docker Registry",
            validate: value => {
                if (value.length < 1) {
                    return `The registry you entered is empty`;
                }
                return true;
            },
            default: c.sdm.build.docker.registry,
            when: a => a.prompt,
        },
        {
            type: "input",
            name: "user",
            message: "Docker User",
            validate: value => {
                if (value.length < 1) {
                    return `The user you entered is empty`;
                }
                return true;
            },
            default: c.sdm.build.docker.user,
            when: a => a.prompt,
        },
        {
            type: "password",
            name: "password",
            message: "Docker Password",
            mask: "*",
            validate: value => {
                if (value.length < 1) {
                    return `The password you entered is empty`;
                }
                return true;
            },
            default: c.sdm.build.docker.password,
            when: a => a.prompt,
        },
    ];
    try {
        const answers = await inquirer.prompt(questions);
        c.sdm.build.docker.prompt = answers.prompt;
        c.sdm.build.docker.registry = answers.registry;
        c.sdm.build.docker.user = answers.user;
        c.sdm.build.docker.password = answers.password;
        let userConfig = getUserConfig();
        if (!userConfig) {
            userConfig = {};
        }
        if (!userConfig.sdm) {
            userConfig.sdm = {};
        }
        if (!userConfig.sdm.build.docker) {
            userConfig.sdm.build.docker = {};
        }
        userConfig.sdm.build.docker.prompt = answers.prompt;
        userConfig.sdm.build.docker.registry = answers.registry;
        userConfig.sdm.build.docker.user = answers.user;
        userConfig.sdm.build.docker.password = answers.password;
        await writeUserConfig(userConfig);
    } catch (e) {
        logger.error(`Failed to acquire Docker configuration values: ${e.message}`);
    }
    return c;
}

/**
 * See if the configuration has enough information to deploy.  To be
 * able to deploy, you must have a valid API key and workspace ID in
 * your configuration _and_ one of the following scenarios must be
 * true:
 *
 * -    The configuration must contain a valid Docker registry
 *      configuration.
 * -    Running in local mode and the current Kubernetes config context
 *      is "minikube".
 *
 * @param c SDM configuration
 * @return `true` if this SDM is cablable of deploying to Kubernetes, `false` otherwise
 */
export function canDeploy(c: SoftwareDeliveryMachineConfiguration): boolean {
    if (!c || !c.apiKey || !/^[A-F0-9]+$/.test(c.apiKey) ||
        !c.workspaceIds || c.workspaceIds.length < 1 || c.workspaceIds.every(w => w === "local")) {
        return false;
    }
    if (canDockerPush(c)) {
        return true;
    } else if (isInLocalMode() && kubeConfigContext() === "minikube") {
        return true;
    }
    return false;
}

/**
 * Get  current  context  from   Kubernetes  config.   It  may  return
 * `undefined` if there is no current context or there is a failure to
 * load the config.
 */
export function kubeConfigContext(): string | undefined {
    try {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        return kc.currentContext;
    } catch (e) {
        logger.info(`Failed to load default Kubernetes config: ${e.message}`);
        return undefined;
    }
}
