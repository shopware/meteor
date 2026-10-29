<!-- Overrides Docus' docs layout: the sidebar gets a fixed column at the left
     edge, so the content takes all the remaining width (see .docs-layout in
     main.css). -->
<template>
  <UMain class="docs-layout">
    <UContainer>
      <UPage
        :ui="{
          root: 'lg:grid-cols-[15rem_minmax(0,1fr)]',
          left: 'lg:col-span-1',
          center: 'lg:col-span-1 w-full max-w-[1602px] mx-auto',
        }"
      >
        <template #left>
          <UPageAside>
            <DocsAsideLeftTop />
            <DocsAsideLeftBody />
          </UPageAside>
        </template>
        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
