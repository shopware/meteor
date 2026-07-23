## Get involved

Thank you for taking an interest in making Meteor a better project!

To contribute code (features or bug fixes) open up a pull request.
In case you want to make a larger change to the code base, open up
an issue first before writing any code. That way you don't lose your
valuable time in case we might reject the pull request.

Shopware is available under [MIT license](https://github.com/shopware/meteor/blob/main/LICENSE.md).
Contribute your code under MIT license.

If you've never contributed to an open source project you might
find the [this guide](https://opensource.guide/how-to-contribute/) helpful.

## Code of conduct

To understand which action we tolerate we expect you to read
our [code of conduct](https://github.com/shopware/meteor/blob/main/CODE_OF_CONDUCT.md).

## Bugs

Please take a look at the [existing issues](https://github.com/shopware/meteor/issues)
before creating a new one. That way we keep the number of duplicate issues low.
Complete the issue template as much as possible when creating a new issue.

To get your bug fixed faster, add a link to a
[project with the bug](https://stackblitz.com/edit/meteor?file=src%2FApp.vue)
for us to reproduce in the issue's description.

## Feature requests

Search through the [list of existing feature requests](https://github.com/shopware/meteor/issues),
before you create an issue. If somebody already requested your feature you
can up-vote that issue. This helps us to see what the community wants the most.

If there does not already exist a feature request for your idea,
you can [request a feature](https://github.com/shopware/meteor/issues/new?template=03-feature.yaml).

## Local development

### Running Storybook and the documentation

To work on the components themselves, start Storybook and the documentation site together from the repository root:

```sh
pnpm install
pnpm dev
```

This runs Storybook on `http://localhost:6006` and the documentation on `http://localhost:3001` in parallel, each opening in your browser. While both run locally, the `Storybook` link on a component's documentation page and the `Documentation` link in Storybook point at these local instances instead of the deployed ones, so you can move between them while developing.

To start just one of them, run `pnpm --filter @shopware-ag/meteor-component-library dev` for Storybook or `pnpm --filter meteor-docs dev` for the documentation.

### Testing your changes in another project with yalc

For local development we use `yalc` to publish packages into a virtual store and consume them from other projects.
You can find yalc [here](https://github.com/wclr/yalc) on GitHub.
To use your changes in Shopware and your extensions, you first build and publish the changed package, then add it to your project in a second step.

The walkthrough below uses the component library. Swap the package name and paths if you work on a different package.

### Publish your changes to the local yalc store

1. Make your changes in the desired package(s).
2. Build from the meteor root so the published files include your changes:

   ```sh
   npx turbo run build
   ```

   To rebuild only one package, scope the task: `npx turbo run build --filter=@shopware-ag/meteor-component-library`.

3. Publish from the package root, here `packages/component-library`:

   ```sh
   cd packages/component-library
   yalc publish --private --workspace --pure
   ```

   This copies the built package into the local yalc store, with its `workspace:` dependencies resolved to concrete versions so they install outside the monorepo.

Repeat the build and publish steps whenever you change the source again.

### Add your updated package to Shopware and your extensions

Switch to the project that should consume your changes. For the Shopware administration this is `<shopware-root-folder>/src/Administration/Resources/app/administration`:

```sh
cd <shopware-root-folder>/src/Administration/Resources/app/administration
yalc add @shopware-ag/meteor-component-library
npm install
```

`yalc add` copies the published files into a local `.yalc` folder and points the project's `package.json` at them; `npm install` then wires them into `node_modules`.
Be careful not to commit the `package.json` changes.

To pick up later changes, republish from the package and run `yalc update` in the consuming project.

Alternatively, run `yalc link @shopware-ag/meteor-component-library` to symlink the files into `node_modules` without touching `package.json`.

**Caution**: `yalc link` creates symlinks with absolute paths. If you run a containerized setup, it will fail to resolve (see: https://github.com/wclr/yalc/issues/123).
In that case use `yalc add` as shown above.

## Creating a pull request

The first step is to clone your repo. Then, install the dependencies with:

```sh
pnpm install
```

In case you have not installed pnpm execute `npm install -g pnpm`.
If you want to install pnpm through another way take a look at their documentation.

To execute scripts defined in the packages.json file of each package you have three options:

1. You use turbo: `npx turbo run <TASK_NAME>`
2. You run the script from the root with `pnpm --filter <PACKAGE_NAME> run <SCRIPT_NAME>`
3. You cd into the package directory and run the script

You can find the available turbo tasks in the turbo.json file

Don't know Turborepo? Check out their [documentation](https://turbo.build/repo/docs).

Make sure to follow these steps before you push your branch:

1. You linted your code with `pnpm run lint:eslint`
2. There are no type errors, run `pnpm run lint:types`
3. Run `pnpm run test:unit` to see if all tests pass
4. You generated a changeset with `npx changeset`

After completing all the tests you can submit your pull request.

### Create a changelog

We create and manage our changelogs with changesets. Follow these steps
to create a changelog:

1. Run `npx changeset add`
2. Select the package you updated
3. Define your version bump for this package
4. Write a meaningful changelog message
5. Repeat the step for other packages you want to change

Feel free to check out the [changesets documentation](https://github.com/changesets/changesets?tab=readme-ov-file#documentation)
for more information on how to work with it.

## Managing releases

When your pull request gets merged a GitHub Action looks at your changes. If it finds a changeset in there it will copy that changeset over to a release branch.

If you decide to release a new version, merge the release branch. Changesets will now take over. It updates the changelog files, bumps up the version numbers and it publishes the packages to npm.

That's it there is nothing more you have to do.

## Updating the visual tests

1. Copy the name of your branch
2. Go to the [actions tab](https://github.com/shopware/meteor/actions)
3. Click on [Visual tests](https://github.com/shopware/meteor/actions/workflows/visual-tests.yml) in the left sidebar
4. You then see a blue bar with a button that says `Run workflow`, click on that
5. Select your branch from the dropdown menu
6. Click on the `Run workflow` button
7. Wait...
8. Go back to your branch overview
