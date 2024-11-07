# Component lifecycle

To have a more stable and predictable package.

There are three stages: Future, Stable and Deprecated

## Future

In this stage, we test new ideas and gather feedback, so please [create an issue](https://github.com/shopware/meteor/issues/new/choose) to share yours.

If a component isn't helpful, we skip moving it to Stable and remove it in the next release.

During this stage we allow ourselves to make breaking changes without notice beforehand.

## Stable

You can use the component in production.

Requirements for the Stable stage:

- We covered the component with automated tests
- It makes use of the Meteor Design Tokens
- It meets the WCAG 2.1 AA level
- It has documentation in form of Storybook Stories

We document breaking changes at least one patch version before a major release.

## Deprecated

The component got deprecated, and we discourage you from using the component.

If there is an alternative way, we provide you with an upgrade guide.

Once a component got deprecated, we will remove it in the next major version.
