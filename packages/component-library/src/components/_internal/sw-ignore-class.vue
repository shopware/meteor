<template>
  <!--
    Wrapper which removes class inheritance in Vue. You need to remove the class
    in the parent component like this: "this.$refs.swIgnoreClass.$el.className = '';". Additionally
    you need to get the old class values before:
    ```
    const classes = {}; // contains the classes from the sw-ignore-class commponent
    const staticClasses = (this.$vnode.data.staticClass ?? '').split(' ');

    // add attrs classes to main card
    staticClasses.forEach((className) => {
        this.$set(classes, className, true);
    });
    ```

    You can add these classes to the main, child component. A full example can be found in
    the `sw-card` component.
  -->
  <div><slot /></div>
</template>
