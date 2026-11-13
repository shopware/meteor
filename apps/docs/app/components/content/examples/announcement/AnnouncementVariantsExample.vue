<script setup lang="ts">
import { MtAnnouncement } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div style="display: grid; gap: var(--scale-size-8)">
    <mt-announcement variant="neutral" icon="regular-calendar">
      Our support team is away on December 24 and 25.
    </mt-announcement>

    <mt-announcement variant="info" icon="regular-megaphone">
      Join our live product update on Thursday, November 20, at 3:00 PM CET.
    </mt-announcement>

    <mt-announcement variant="attention" icon="regular-tools">
      Planned maintenance on Sunday, November 16, from 2:00 to 4:00 AM CET.
    </mt-announcement>

    <mt-announcement variant="critical" icon="regular-exclamation-circle">
      Orders can't be saved right now. We are working on a fix.
    </mt-announcement>

    <mt-announcement variant="positive" icon="regular-check-circle">
      Everything works again. Thanks for your patience.
    </mt-announcement>
  </div>
</template>
