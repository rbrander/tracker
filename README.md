# Tracker

a visual GPS trip tracker

---

## Requirements

- node v20
- npm v10

## Development

Once the repo has been updated (git pull),

run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser

### Optional

While running the server, the app can be exposed to be run via a tunnel using the command:

```bash
npm run serve
```

---

## Deployment

Once the code has been finished and ready to deploy, a docker container is created and run locally before being pushed to the registry for the server to pull down and run.

The docker container needs to built for the platform that it is intended to run on. The server will want `linux/amd64` and a MacBook Pro would like `linux/arm64/v8`, so these are passed when building using the `--platform` option.

```bash
npm run docker:build
npm run docker:run
```

At this point you can test the container by connecting to the same port (3000). Ensure the port is available by closing any previously run dev server instances.

When finally ready to deploy it can be don all in one step:

```bash
npm run docker:deploy
```

This will build the docker image for the `linux/amd64` platform, tag, and push the image to the server.
