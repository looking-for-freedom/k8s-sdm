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
    ApolloGraphClientFactory,
    AxiosHttpClient,
    Configuration,
    configurationValue,
    HttpClient,
    HttpClientFactory,
    logger,
    WSWebSocketFactory,
} from "@atomist/automation-client";
import { configureLogzio } from "@atomist/automation-client-ext-logzio";
import {
    ConfigureOptions,
    configureSdm,
} from "@atomist/sdm-core";
// @ts-ignore
import { buildAxiosFetch } from "axios-fetch";
import * as tunneling from "tunnel";
import * as WebSocket from "ws";
import { checkConfiguration } from "./lib/machine/config";
import { machine } from "./lib/machine/machine";
import axios, {AxiosRequestConfig} from "./node_modules/axios";

const machineOptions: ConfigureOptions = {
    requiredConfigurationValues: [
        "environment",
    ],
};

class ProxyAxiosHttpClientFactory implements HttpClientFactory {

    public create(url?: string): HttpClient {
        return new ProxyAxiosHttpClient();
    }
}

function createAxiosRequestConfig(config: AxiosRequestConfig): AxiosRequestConfig {
    const proxy = configurationValue<tunneling.ProxyOptions>("sdm.proxy", buildProxyConfig());
    const tunnel = tunneling.httpsOverHttp({
        proxy,
    });

    return {
        ...config,
        httpsAgent: tunnel,
        proxy: false,
    };
}

class ProxyAxiosHttpClient extends AxiosHttpClient {

    protected configureOptions(config: AxiosRequestConfig): AxiosRequestConfig {
        return createAxiosRequestConfig(config);
    }
}

class ProxyWSWebSocketFactory extends WSWebSocketFactory {

    protected configureOptions(options: WebSocket.ClientOptions): WebSocket.ClientOptions {
        const proxy = configurationValue<tunneling.ProxyOptions>("sdm.proxy", buildProxyConfig());
        const tunnel = tunneling.httpsOverHttp({
            proxy,
        });

        return {
            ...options,
            agent: tunnel,
        };
    }
}

class ProxyApolloGraphClientFactory extends ApolloGraphClientFactory {

    protected configure(config: Configuration): GlobalFetch["fetch"] {
        return buildAxiosFetch(axios.create(createAxiosRequestConfig({})));
    }
}

export const configuration: Configuration = {
    postProcessors: [
        checkConfiguration,
        configureLogzio,
        configureSdm(machine, machineOptions),
        async (config: Configuration) => {
            if (isProxySet() && isProxyTunneling()) {
                config.http.client.factory = new ProxyAxiosHttpClientFactory();
                config.ws.client.factory = new ProxyWSWebSocketFactory();
                config.graphql.client.factory = new ProxyApolloGraphClientFactory();
            }
            return config;
        },
    ],
    cluster: {
        workers: 2,
    },
};

export function isProxySet(): boolean {
    return (
        process.env.hasOwnProperty("https_proxy") ||
        process.env.hasOwnProperty("HTTPS_PROXY")
    );
}

export function isProxyTunneling(): boolean {
    return parseProxyDetails()[1].toLowerCase() === "http";
}

export function parseProxyDetails(): RegExpExecArray {
    /**
     * Match groups
     * 1 - protocol (http/https)
     * 2 - user/pass (plus @)
     * 3 - user
     * 4 - pass
     * 5 - proxy host
     * 6 - :port
     * 7 - port
     */
    const parseProxy = /^(https?):\/\/(([^:]{1,128}):([^@]{1,256})@)?([^:\/]{1,255})(:([0-9]{1,5}))?\/?/;
    return parseProxy.exec(
        process.env.hasOwnProperty("https_proxy") ? process.env.https_proxy : process.env.HTTPS_PROXY,
    );

}

export function buildProxyConfig(): tunneling.ProxyOptions {
    logger.debug(`Tunneling Proxy detected, configuring`);
    const proxy = parseProxyDetails();
    let proxyDetails: tunneling.ProxyOptions = {
        host: proxy[5],
        headers: undefined,
    };

    if (proxy[7]) {
        proxyDetails = {
            ...proxyDetails,
            port: parseInt(proxy[7], undefined),
        };
    }

    if (proxy[3] && proxy[4]) {
        proxyDetails = {
            ...proxyDetails,
            proxyAuth: `${proxy[3]}:${proxy[4]}`,
        };
    }

    return proxyDetails;
}
