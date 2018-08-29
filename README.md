# @atomist/k8-automation

[![atomist sdm goals](http://badge.atomist.com/T29E48P34/atomist/k8-automation/7f92c63a-cd89-448e-8360-e9c507f87099)](https://app.atomist.com/workspace/T29E48P34)
[![npm version](https://img.shields.io/npm/v/@atomist/k8-automation.svg)](https://www.npmjs.com/package/@atomist/k8-automation)
[![Docker Pulls](https://img.shields.io/docker/pulls/atomist/k8-automation.svg)](https://hub.docker.com/r/atomist/k8-automation/)

This repository contains automations for deploying applications to
Kubernetes using the [Atomist][atomist] API.  Currently, deploying
Docker images as deployments with optional services and ingress rules
is supported.

This project uses the [`@atomist/automation-client`][client] and
[`@atomist/sdm`][sdm] node modules to implement a local client that
connects to the Atomist API for software and executes goals on behalf
of a software delivery machine (SDM).

See the [Atomist documentation][atomist-doc] for more information on
what SDMs are and what they can do for you using the Atomist API for
software.

[client]: https://github.com/atomist/automation-client-ts (@atomist/automation-client Node Module)
[sdm]: https://github.com/atomist/sdm (@atomist/sdm Node Module)
[atomist-doc]: https://docs.atomist.com/ (Atomist Documentation)

## Prerequisites

Below are brief instructions on how to get started running this
project yourself.  If you just want to use the functionality this
project provides, see the [Atomist documentation][atomist-doc].

### Atomist workspace

You need an Atomist workspace.  If you do not already have an Atomist
workspace, you can sign up with Atomist at
[https://app.atomist.com/][atm-app].  See the [Atomist User
Guide][atm-user] for detailed instructions on how to sign up with
Atomist.

[atm-app]: https://app.atomist.com/ (Atomist Web Interface)
[atm-user]: https://docs.atomist.com/user/ (Atomist User Guide)

### Kubernetes

This automation works with [Kubernetes][kube], so you need a
Kubernetes cluster with a functioning ingress controller, such as
[ingress-nginx][].

If you do not have access to a Kubernetes cluster, you can create one
on your local system using [minikube][].  Once you have minikube
running, you can create an ingress controller in the cluster using the
ingress add-on.

```console
$ minikube start
$ minikube addons enable ingress
```

[kube]: https://kubernetes.io/ (Kubernetes)
[ingress-nginx]: https://github.com/kubernetes/ingress-nginx (Ingress nginx)
[minikube]: https://kubernetes.io/docs/getting-started-guides/minikube/ (Minikube)

## Configuration

You can run k8-automation in either "cluster-wide" mode or
"namespace-scoped" mode.  In cluster-wide mode, k8-automation is able
to deploy and update applications in any namespace but it requires a
user with cluster-admin role privileges to install it.  If you only
have access to admin role privileges in a namespace, you can install
k8-automation in namespace-scoped mode, where it will only be able to
deploy and update resources in that namespace.

## Running

See the [Atomist Kubernetes documentation][atomist-kube] for detailed
instructions on using Atomist with Kubernetes.  Briefly, if you
already have an [Atomist workspace][atomist-getting-started], you can
run the following commands to create the necessary resources in your
Kubernetes cluster.  Replace `WORKSPACE_ID` with your Atomist
workspace/team ID and `TOKEN` with a GitHub token with "read:org"
scopes for a user within the GitHub organization linked to your
Atomist workspace.

```
$ kubectl apply --filename=https://raw.githubusercontent.com/atomist/k8-automation/master/assets/kubectl/cluster-wide.yaml
$ kubectl create secret --namespace=k8-automation generic automation \
    --from-literal=config='{"teamIds":["WORKSPACE_ID"],"token":"TOKEN"}'
```

[atomist-kube]: https://docs.atomist.com/user/kubernetes/ (Atomist - Kubernetes)
[atomist-getting-started]: https://docs.atomist.com/user/ (Atomist - Getting Started)

## SDM interface

The KubeDeploy event handler triggers off an SDM Goal with the
following properties:

JSON Path | Value
----------|------
`fulfillment.name` | @atomist/k8-automation
`fulfillment.method` | side-effect
`state` | requested

In addition, it expects the SDM Goal to have a `data` property that
when parsed as JSON has a `kubernetes` property whose value is an
object with the following properties:

Property | Required | Description
---------|----------|------------
`name` | Yes | Name of the resources that will be created
`environment` | Yes | Must equal the value of the running k8-automation instance's `configuration.environment`
`ns` | No | Namespace to create the resources in, default is "default"
`imagePullSecret` | No | Name of the Kubernetes image pull secret, if omitted the deployment spec is not provided an image pull secret
`port` | No | Port the container service listens on, if omitted the deployment spec will have no configured liveness or readiness probe and no service will be created
`path` | No | Absolute path under the hostname the ingress controller should use for this service, if omitted no ingress rule is created
`host` | No | Host name to use in ingress rule, only has effect if `path` is provided, if omitted when `path` is provided, the rule is created under the wildcard host
`protocol` | No | Scheme to use when setting the URL for the service endpoint, "https" or "http", default is "https" if `tlsSecret` is provided, "http" otherwise
`replicas` | No | Number of replicas (pods) deployment should have
`tlsSecret` | No | Name of existing [Kubernetes TLS secret][kube-tls] to use when configuring the ingress
`deploymentSpec` | No | Stringified JSON Kubernetes deployment spec to overlay on top of default deployment spec, it only needs to contain the properties you want to add or override from the default
`serviceSpec` | No | Stringified JSON Kubernetes service spec to overlay on top of default service spec, it only needs to contain the properties you want to add or override from the default

Full details for the `kubernetes` property can be found in the TypeDoc
for [`KubeApplication`][kube-app].

[kube-tls]: https://kubernetes.io/docs/concepts/services-networking/ingress/#tls (Kubernetes Ingress TLS)
[kube-app]: https://atomist.github.io/k8-automation/interfaces/_lib_k8_.kubeapplication.html (Atomist - KubeApplication - TypeDoc)

## Support

General support questions should be discussed in the `#support`
channel in the [Atomist community Slack workspace][slack].

If you find a problem, please create an [issue][].

[issue]: https://github.com/atomist/k8-automation/issues

## Development

You will need to install [Node.js][node] to build and test this
project.

[node]: https://nodejs.org/ (Node.js)

### Build and test

Install dependencies.

```
$ npm install
```

Use the `build` package script to compile, test, lint, and build the
documentation.

```
$ npm run build
```

### Release

Releases are handled via the [Atomist SDM][atomist-sdm].  Just press
the 'Approve' button in the Atomist dashboard or Slack.

[atomist-sdm]: https://github.com/atomist/atomist-sdm (Atomist Software Delivery Machine)

---

Created by [Atomist][atomist].
Need Help?  [Join our Slack workspace][slack].

[atomist]: https://atomist.com/ (Atomist - How Teams Deliver Software)
[slack]: https://join.atomist.com/ (Atomist Community Slack)
