## Get involved

Thank you for taking a interest in making Meteor a better project! 💙

To contribute code (features or bug fixes) open up a pull request.
In case you want to make a larger change to the code base, open up
an issue first before writing any code. That way you don't lose your
valuable time in case we might reject the pull request.

Shopware is available under [MIT license](./LICENSE.md).
Contribute your code under MIT license.

If you've never contributed to a open source project you might
find the [this guide](https://opensource.guide/how-to-contribute/) helpful.

## Code of conduct

To understand which action we tolerate we expect you to read
our [code of conduct](./CONTRIBUTING.md).

## Bugs

Please take a look at the [existing issues](https://github.com/shopware/meteor/issues)
before creating a new one. That way keep the number of duplicate issues low.
Complete the issue template as much as possible when creating a new issue.

To get your bug fixed faster, add a link to a 
[project with the bug](https://stackblitz.com/edit/vitejs-vite-emem8b?file=index.html&terminal=dev)
for us to reproduce in the issue's description.

## Feature Requests

Search trough the [list of existing feature requests](https://github.com/shopware/meteor/issues),
before you create a issue. If somebody already requested your feature you
can up-vote that issue. This helps us to see what the community wants the most.

If there does not already exist a feature request for your idea,
you can [request a feature](https://github.com/shopware/meteor/issues/new).

## Creating a pull request

The first step is to clone your repo. Then, install the dependencies with:

```sh
pnpm install
```

In case you have not installed pnpm execute `npm install -g pnpm`.
If you want to install pnpm through another way take a look at their documentation.

Make sure to follow these steps before you push your branch:

1. You linted your code with `pnpm run lint:eslint`
2. There are no type errors, run `pnpm run lint:types`
3. Run `pnpm run test:unit` to see if all tests pass
4. You generated a changeset with `npx changeset`

After completing all the tests you can submit your pull request.

### Create a changelog

We create and manage our changelogs with changesets. Follow these steps
to create a changelog:

1. Run `npx changesets`
2. Select the packages you updated
3. Define your version bump for each package
4. Write a meaningful changelog message

Feel free to check out the [changesets documentation](https://github.com/changesets/changesets?tab=readme-ov-file#documentation)
for more information on how to work with it.