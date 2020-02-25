# Zeit Starter Template

- [**Parcel**](https://parceljs.org/getting_started.html) for asset bundling.
- [**Zeit**](https://zeit.co/docs/) for static and serverless hosting.

## Getting Started

```sh
# setup (requires now)
npm -g i now
npm i

# start dev server at localhost:8888
npm start

# (on gitlab)
# deploy staging by merging into `develop`
# deploy production by merging into `master`
```

## Notes

- Parcel [module resolution](https://parceljs.org/module_resolution.html) handles "/" and "~" paths automagically.
- Use environment variables for secrets and configuration.
  - Save production secrets with `now secret` and reference their `@keys` in `now.json`.
  - Save development secrets in local .env files (`cp extras/example.env .env && cp extras/example.env.build .env.build`). Do not check these in!
- Separate deployments with CI pipelines (`cp extras/example.gitlab-ci.yml .gitlab-ci.yml`).
- When in doubt, aim to follow these principles:
  - https://github.com/elsewhencode/project-guidelines
  - https://3factor.app/
  - http://madeofmetaphors.com/shapes
  - http://madeofmetaphors.com/boundaries-and-infinities
