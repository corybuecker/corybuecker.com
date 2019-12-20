---
title: Automating a Cloud Run deploy from Github Actions, part 1
drafted: 2019-12-14
published: 2019-12-19
draft: false
preview: Placeholder
---

In [a previous post](post/2019-12-08-how-to-run-a-static-site-in-google-cloud-run), I setup up a Cloud Run service to host a static site with an NGINX image. Because the underlying Next.js project is hosted in Github, I can use Github Actions to automate the building and deployment of each change to the repository. This requires a little extra work to setup permissions for Github Actions to access Google's Container Registry and Cloud Run service.

## Initialize Container Registry storage

In order to avoid assigning a Storage Admin or bucket creation permission to the service account, I first pushed a single image to Container Registry to ensure the Cloud Storage bucket exists.

    gcloud auth configure-docker
    docker pull hello-world
    docker tag hello-world gcr.io/PROJECT-ID/hello-world:latest
    docker push gcr.io/PROJECT-ID/hello-world:latest

## Create a custom role

Under IAM & admin > Roles, create a new custom role. Assign the role the following permissions for the Container Registry and Cloud Run:

- storage.buckets.get
- run.services.create
- run.services.get
- run.services.list
- run.services.update

![](posts/2019-12-14-automating-cloud-run-deploy-from-github-actions/create_a_custom_role.webp)

## Create a service account

Google recommends using the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) when [assigning a service account to run a particular Cloud Run service](https://cloud.google.com/run/docs/securing/service-identity).

In order to make things a _bit_ more convenient I am sharing a single service account for both the Container Registry and Cloud Run services. If you prefer, an alternative is to use two service accounts and two jobs in Github Actions to separate the permissions. My rationale is that a data breach in Github would likely expose both service account keys anyway.

Under IAM & admin > Service accounts, create a new service account. Be sure create a JSON key at the end before saving the service account.

![](posts/2019-12-14-automating-cloud-run-deploy-from-github-actions/create_a_service_account_key.webp)

It is a good idea to load the service account locally to test the following steps.

    gcloud auth activate-service-account --key-file PATH-TO-JSON-KEY

If you need to switch back to your primary user run this command.

    gcloud config set account user@example.com

## Assign the custom role

Under IAM & admin > IAM, add a permission to the service account. Specficially, assign the custom role to the new service account.

![](posts/2019-12-14-automating-cloud-run-deploy-from-github-actions/assign_service_account_role.webp)

## Assign Container Registry bucket permissions

Under Storage > Browser, click on the bucket containing the Docker images. It is usually a bucket whose name starts with `artifacts`.

Go to the Permissions tab and click Add members. Find the service account created earlier and add the Storage Admin permission to this bucket.

![](posts/2019-12-14-automating-cloud-run-deploy-from-github-actions/add_bucket_permissions.webp)

Confirm that the role can push to the registry.

    docker push gcr.io/PROJECT-ID/hello-world:latest

## Allow service account to act as itself

This was an unusual step required by Cloud Run. Cloud Run uses a [provided service account](https://cloud.google.com/run/docs/securing/service-identity?hl=en#runtime_service_account) as its identity when running a service. This is a great feature to limit the access of the running container.

However, we have to allow the Github Actions service account to [act as itself in order to deploy a service it will be running](https://cloud.google.com/run/docs/reference/iam/roles#additional-configuration).

Under IAM & admin > Service accounts, click on the new service account. On the right side of the page, click Add Member. Enter the service account identifier and add the Service Accounts > Service Account User role.

![](posts/2019-12-14-automating-cloud-run-deploy-from-github-actions/act_as_self.webp)

## Deploy to Cloud Run

At this point you can deploy to Cloud Run with the new service account.

    gcloud run deploy nginx \
        --image gcr.io/PROJECT-ID/nginx:$(git rev-parse HEAD) \
        --service-account github-actions@PROJECT-ID.iam.gserviceaccount.com \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated

In part 2, I will connect the new service account to Github Actions.
