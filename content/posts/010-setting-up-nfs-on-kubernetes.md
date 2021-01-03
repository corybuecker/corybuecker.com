---
title: Setting up Network File System (NFS) on Kubernetes
published: 2021-01-02 05:52:41
# revised: 2020-11-29 14:30:53
draft: true
# preview: Compiling a program like GnuPG (GPG) from source is not difficult. However, there are many individual dependencies, and this post breaks them down.
# description: Compiling GnuPG (GPG) from source on Apple Silicon with Big Sur
slug: setting-up-nfs-on-kubernetes
---

This is the first part in a series aimed at setting up a mail server in Kubernetes (K8s). Mail server software has always confused me. I am approaching this as a learning experience. One word of warning; misconfigured mail servers are risky. They can be an mechanism for malicious actors to send spam and malware and make it seem as though you sent it. I recommend against using it as your primary email server until you understand each setting and the networking involved.

## Why Kubernetes?

Postfix and Dovecot have been around for quite a while. The documentation, for the most part, assumes deployment on standalone servers.

Kubernetes has the benefit of standardized configuration via Docker and Helm charts. I have a hobby Kubernetes cluster configured for automatic TLS certificate generation.

My particular Kubernetes cluster is hosted by [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine), so some of the configuration settings may be specific to that product.

## External traffic policy and TCP forwarding

Kubernetes will normally obscure the client (external) IP address of ingress connections. This enables a second hop through a balanced load balancer. However, in order to apply basic Postfix spam filtering, I need to retain the client IP addresses through to the pod. In GKE and Amazon Kubernetes, this can be achieved by configuring the [external traffic policy of load balancer to `Local`](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip).

If using the NGINX ingress controller, be sure to run the controller as a `DaemonSet`. Otherwise, nodes without the controller will fail the health check.

I use the Helm chart, so I have an additional configuration file that looks like:

```yaml
tcp:
  993: "default/dovecot:993"
  587: "default/postfix:587::PROXY"
  25: "default/postfix:25::PROXY"
controller:
  kind: DaemonSet
  service:
    externalTrafficPolicy: Local
```

The TCP settings allow the controller to forward TCP traffic to the correct services. The PROXY setting causes NGINX to [enable the proxy protocol](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/) for those ports. This is also required to pass the originating IP address to the service.

## NFS

Before getting to Postfix and Dovecot, I need a large storage space for the email. Kubernetes' persistent volumes work very well, but they have a specific limitation for this use case. The [access mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) for most volumes is `ReadWriteOnce`, which means the volume is attached to a single node. For a mail server, I want multiple pods of Dovecot on multiple nodes to be able to read and write to the same volume. Otherwise, some email would be written to volume A and some to volume B.

There are only a few volume types that support `ReadWriteMany`, but the easiest to configure is NFS.

### Dedicated instance

This is the rare case where I setup a instance outside of the K8s cluster to dedicate it as a NFS server. In the future, I may explore moving this instance into K8s. It's a bit hypocritical because Postfix and Dovecot are also largely setup on dedicated servers. That said, I am more interested in getting a mail server setup than setting up NFS in K8s.

