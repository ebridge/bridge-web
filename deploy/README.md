# Deployment via Kubernetes

## Server Setup

This is already done, but in case it has to be recreated,

1. Set up kubernetes cluster on a cloud provider.
2. Configure kubectl to point to cloud provider's cluster. 
3. Add [ingress-nginx](https://github.com/kubernetes/ingress-nginx) to cloud provider following [these instructions](https://kubernetes.github.io/ingress-nginx/deploy/).
4. Create an A record DNS with `www` host pointing to ingress external IP

## Local Setup

Set up kubectl (kubernetes command line tool) locally pointing to deploy env. I just followed the Digital Ocean instructions from the kubernetes dashboard.

Also make sure you are on a bash-compatible machine like Linux or Mac.

## Deploying services

Before deploying, make sure any updated secrets are deployed or updated before deploying containers. See the next section, [Deploying Secrets](#deploying-secrets).

1. Determine version to bump to. There is no formula for this, just use best judgement. What matters most is incrementing versions on each release. See [this article](https://medium.com/fiverr-engineering/major-minor-patch-a5298e2e1798) on determining which version to bump. More often than not, just bump the _patch_ version, e.g. `0.0.1` to `0.0.2`.

2. Create a PR with branch name `release-0.0.2` where 0.0.2 is the with the version tag you are bumping to.

3. Bump top-level [package.json](../package.json)'s `version` prop to new version.
For example
```diff
         "name": "bridge-web",
-        "version": "0.0.1"
+        "version": "0.0.2"
         "docker-registry": "ebonsignori",
```

1. Build bridge-api container and deploy it

Starting from this directory, `bridge-web/kubernetes`, follow prompts to build and push the docker image for the api project with:

```
./docker-build-push.sh api
```

Repeat the same for web,

```
./docker-build-push.sh web
```

Now we can update our Kubernetes cluster to pull down the new images,

```
kubectl apply -f bridge-api.yaml
```

Then for web,

```
kubectl apply -f bridge-web.yaml
```

## Deploy secrets

You only need to deploy or update secrets if there are changes secrets.

Secrets will be under the name `bridge-api` with the same key as their env var name in corresponding `.env.<server-env>.<app>` file.

E.g. [.env.production.api](./.env.production.api) should contain all secrets for the production api cluster.

View existing secret keys with
`kubectl get secrets`

Get a copy of [.env.production.api](./.env.production.api), add it to this directory, navigate to this directory, then deploy the secrets under the `bridge-api` key with
`kubectl create secret generic bridge-api --from-env-file=.env.production.api`

And do the same for [.env.production.web](./.env.production.web). NOTE: At time of writing there are no web secrets. Check web's [.env.secrets.example](../web/.env.secrets.example) to see if any have been added, and remove this message if they have been.
`kubectl create secret generic bridge-web --from-env-file=.env.production.web`

You can explore base64 encrypted secrets with
`kubectl get secret bridge-api -o jsonpath='{.data}'`

And you can delete secrets with
`kubectl delete secret bridge-api`

## Updating secrets

The above instructions are for the initial deploy of secrets. Further updates to already-deployed secrets can be done with the following command:
```
kubectl create secret generic bridge-api \
    ---from-env-file=.env.production.api --dry-run -o yaml | 
  kubectl apply -f -
```

Note, per [this](https://stackoverflow.com/questions/45879498/how-can-i-update-a-secret-on-kubernetes-when-it-is-generated-from-a-file) SO answer, you could just delete and then recreate secets before deploying pods since the env vars inside pods are already derived from kubernetes secrets and won't be effected until a redeploy.

This means secrets must be updated *before* deploying services if there are any changes to secrets.

## Deploying when image version tag hasn't been bumped

In development or testing you may want to rebuild an image with the same version tag and deploy it to our cluster. However, kubectl will not detect a new version when applying and will not pull it down.

To force repull an image e.g. `bridge-api`, you can run `kubectl rollout restart deployment bridge-api`

NOTE: This also works if you update secrets without changing an image.

## Ingress Controller

Deploy with:
```
kubectl apply -f ingress-service.yaml
```

Get details with:
`
kubectl describe ingress ingress-service
`
