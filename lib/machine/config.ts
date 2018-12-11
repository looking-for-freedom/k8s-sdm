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
    Configuration,
    logger,
} from "@atomist/automation-client";
import {
    getUserConfig,
    writeUserConfig,
} from "@atomist/automation-client/lib/configuration";
import { isInLocalMode } from "@atomist/sdm-core";
import * as inquirer from "inquirer";

/**
 * When in local mode, prompt for Docker options if they are not all
 * present.  To be used as a configuration post-processor.
 */
export async function checkConfiguration(c: Configuration): Promise<Configuration> {
    if (!isInLocalMode()) {
        // only prompt in local mode
        return c;
    }
    if (c.sdm && c.sdm.docker && c.sdm.docker.registry && c.sdm.docker.user && c.sdm.docker.password) {
        // all set
        return c;
    }
    if (c.sdm && c.sdm.docker && c.sdm.docker.prompt === false) {
        return c;
    }
    if (!c.sdm) {
        c.sdm = {};
    }
    if (!c.sdm.docker) {
        c.sdm.docker = {};
    }
    if (c.sdm.docker.prompt !== false) {
        c.sdm.docker.prompt = true;
    }
    const questions: inquirer.Question[] = [
        {
            type: "confirm",
            name: "prompt",
            message: "Configure Docker Registry?",
            default: c.sdm.docker.prompt,
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
            default: c.sdm.docker.registry,
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
            default: c.sdm.docker.user,
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
            default: c.sdm.docker.password,
            when: a => a.prompt,
        },
    ];
    try {
        const answers = await inquirer.prompt(questions);
        c.sdm.docker.prompt = answers.prompt;
        c.sdm.docker.registry = answers.registry;
        c.sdm.docker.user = answers.user;
        c.sdm.docker.password = answers.password;
        let userConfig = getUserConfig();
        if (!userConfig) {
            userConfig = {};
        }
        if (!userConfig.sdm) {
            userConfig.sdm = {};
        }
        if (!userConfig.sdm.docker) {
            userConfig.sdm.docker = {};
        }
        userConfig.sdm.docker.prompt = answers.prompt;
        userConfig.sdm.docker.registry = answers.registry;
        userConfig.sdm.docker.user = answers.user;
        userConfig.sdm.docker.password = answers.password;
        await writeUserConfig(userConfig);
    } catch (e) {
        logger.error(`Failed to acquire Docker configuration values: ${e.message}`);
    }
    return c;
}
