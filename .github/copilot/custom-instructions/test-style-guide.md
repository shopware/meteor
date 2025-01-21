Always use `it` as the method for test.

Every test file must end with `.spec.ts`.

Every test must follow the AAA pattern: ARRANGE, ACT & ASSERT.

All tests use Vitest.

Every component/vue test uses `@testing-library/vue` instead of `@vue/test-utils`.

When rendering a component with `render` do not destructure the result. Always import
the methods to retrieve DOM elements from the `@testing-library/vue` package
at the top of the file.

Use `userEvent` from `@testing-library/user-event` to simulate user interaction. Do
not use `fireEvent` from `@testing-library/vue`.

Never check implementation details like internal methods or classnames.

If possible, prefer the assertion matchers of `@testing-library/jest-dom` and
`jest-extended` over the default assertion matchers of vitest.

Do not save a DOM element to a variable. When retrieving an DOM element
always call the methods of `@testing-library/vue`. This way we always
have the latest DOM state and never rely on old out-dated values.

Here's an example of a test:

```ts
it("does not emit an event when clicking on a button", async () => {
  // ARRANGE
  const handler = vi.fn();

  render(Button, {
    props: { disabled: true, onClick: handler },
  });

  // ACT
  await userEvent.click(screen.getByRole("button")).click();

  // ASSERT
  expect(handler).not.toHaveBeenCalled();
  expect(screen.getByRole("button")).toBeDisabled();
});
```

Write the names of the test in a user-facing / user-friendly way. Someone
who has never written a single line of code should understand what is
happening. Avoid mentioning things like function names or prop names or
event handlers, only focus on the expected behaviour.

Do not include the word "should" in a test title. Write test titles like
they are a fact.
