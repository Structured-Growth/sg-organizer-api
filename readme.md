# Structured Growth Organize API

## Features

- Automatic versioning with [semantic-release](https://semantic-release.gitbook.io/semantic-release/);
- Automatic creating NPM package and Docker image;
- Generate routes from controllers (using [tsoa](https://tsoa-community.github.io/docs/introduction.html));
- Generate API docs (json, html) from controllers (
  using [tsoa](https://tsoa-community.github.io/docs/introduction.html));
- Different operating modes:
    - Standalone web server powered by [express.js](https://expressjs.com/);
    - Lambda handler for HTTP events;
    - Lambda handler for EventBridge, SQS events;
- Configured Sequelize for database connections;
- GitHub workflows
    - Lint commit messages with [Commitlint](https://commitlint.js.org/#/);
    - Check code style with [Prettier](https://prettier.io/) on PR is opened/reopened;
    - Create release, npm package and docker image on push to the `main` branch.
    - Generating API docs and storing them as release assets.

## Getting started

1. Press **Use this template** button at the top right to create new repository using this template.

2. Clone created repository.

3. Make sure you have access to the [Microservice SDK repository](https://github.com/Structured-Growth/microservice-sdk-ts). It's the main dependency.

4. Create a personal GitHub access token in order to be able to install dependencies from private npm registries. Go to
   the [Developer Settings](https://github.com/settings/tokens) and generate classic access token.

5. Install dependencies:
    ```shell
    GITHUB_TOKEN=<your-token-here> npm i
    ```

6. A new `.env` file will be created under the project root. Fill it with correct values.

7. Change package name to actual in these places:
    - `package.json:name`
    - `package.json:scripts.build-docker`
    - `package.json:repository.url`

8. In case you want to use local database in a docker container run this command:
    ```shell
     docker-compose up -d
     ```

9. Start the local web server
    ```shell
    npm run dev
    ```

### Available commands

- `npm run dev` - starts the web server in a development mode;
- `npm run dev-cli` - run CLI interface in a development mode;
- `npm run dev-link-sdk` - links [SDK]((https://github.com/Structured-Growth/microservice-sdk-ts)) (read more below);
- `npm run build` - compile project to `.dist` folder;
- `npm run build-docker` - creates a docker image for distribution;
- `npm run routes` - generates routes from controller definitions;
- `npm run docs` - generates API docs from controller definitions;
- `npm start` - starts the web server from the `.dist` folder.

## Configure your repository

1. Make the `main` branch protected and deny direct push to it.
2. Create `dev` branch.

## API Localization

The API uses the `i18n` library along with the Translate API to support multilingual functionality.

### Deploying the API with Terraform and Translate API

To enable full multilingual support, ensure that the Translate API is deployed and a **Translate Client ID** is created.

Set the following global environment variables:

- `TRANSLATE_API_URL` – the current URL of the Translate API
- `TRANSLATE_API_CLIENT_ID` – the client ID used to authenticate with the Translate API
- `DEFAULT_LANGUAGE` – the default language of the API (e.g. `en-US`)
- `DEFAULT_AVAILABLE_LANGUAGES` – a comma-separated list of supported languages (e.g. `en-US,zh-CN,pt-BR`)
- `DEFAULT_TRANSLATE_DIRECTORY_PATH` – path to the file with default translations

When adding new texts, follow the `i18n` workflow:

- Replace static text with i18n tokens in the format:
  ```js
  this.i18n.__("system.ping.service")
  ```
- Add the corresponding translation to the default locale file.

Upon deployment via Terraform:
- New tokens are automatically added to the Translate API
- Modified tokens are updated
- Removed tokens are deleted from the Translate API

### Running the API Without the Translate API (Single Instance)

For a single-instance API setup (e.g., local development or testing), follow these steps:
- Use all global variables from the .env.example file
- Set TRANSLATE_API_URL to an empty string

In this setup:
- Only the local translation file is used
- Only the default language is supported
- Add new texts using the same token format:
  ```js
  this.i18n.__("system.ping.service")
  ```
- Ensure the default translation is present in the local file

### Changing the Default Language

To change the API’s default language:
1. Update the DEFAULT_LANGUAGE variable (e.g., zh-CN, pt-BR)
2. Rename the corresponding translation file in the path set by DEFAULT_TRANSLATE_DIRECTORY_PATH

**Note:** Language codes must conform to the i18n format, such as: `en-US`, `zh-CN`, `pt-BR`

## Build

Docker image registry is the main distribution channel for our microservices. This repository provides GitHub workflows
for automated build and push an image to a private docker registry.

### Configure GitHub workflow

Firstly create a docker repository with the same name as package. For example `<aws_account_id>.dkr.ecr.<region>.amazonaws.com/sg-organize-api` 

In order to create and push new image you have to set GitHub Actions Secrets that provides access to a private registry.

1. Go to the Repository Settings > Secrets & Variables > Actions;
2. Create these secrets:
    - `REGISTRY_URI` - URI of a private Docker registry (like <aws_account_id>.dkr.ecr.<region>.amazonaws.com, without repository name);
    - `AWS_ACCESS_KEY_ID` - IAM access token with write permissions on ECR;
    - `AWS_SECRET_ACCESS_KEY`
    - `AWS_DEFAULT_REGION`
3. Push to the `main` branch to run Release workflow;

### Build and test docker image locally

In order to install dependencies from private npm registries you have to provide your `GITHUB_TOKEN` as an environment
variable.

#### Build image

```
GITHUB_TOKEN=<your-token> npm run build-docker
```

#### Running image as standalone web server

```shell
docker run --rm -it \
  --env-file ./.env -p 3300:3300 \
  --entrypoint npm \
  structured-growth/sg-organize-api \
  start web
```

#### Running image as Lambda function for HTTP events

```shell
docker run --rm -it \
  --env-file ./.env -p 8080:8080 \
  structured-growth/sg-organize-api \
  .dist/src/lambda-http.handler
```

#### Running image as Lambda function for EventBridge events

```shell
docker run --rm -it \
  --env-file ./.env -p 8080:8080 \
  structured-growth/sg-organize-api \
  .dist/src/lambda-eventbridge.handler
```

#### Running image as Lambda function for SQS events

```shell
docker run --rm -it \
  --env-file ./.env -p 8080:8080 \
  structured-growth/sg-organize-api \
  .dist/src/lambda-sqs.handler
```

## Deploy

There are a lot of options to deploy the docker image:

1. Lambda function
   with [custom container image](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html#cfn-lambda-function-code-imageuri)
   .
2. AWS ECS
3. Run in any environment where docker is installed.

For correct work you have to provide correct environment variables. You can find the list of required environment
variables in the `.env.example` file.

Application may require external resources for correct work. For example, already set up database instance, event buses
or queues, etc. Information about required resources you can find in the `.env.example` file.

## Link SDK

Sometimes you may want to extend functionality of
the [Microservice SDK](https://github.com/Structured-Growth/microservice-sdk-ts). To make development process easier you
can clone SDK repository and link it to this project. All changed made in the SDK will automatically appear here. So you
don't need to create a new package to test your changes.

```shell
cd <sdk-dir>
npm link
cd <this-project-dir>
npm run dev-link-sdk
```

