<script setup lang="ts">
import {
  MtTable,
  MtTableHeader,
  MtTableBody,
  MtTableRow,
  MtTableHeaderCell,
  MtTableCell,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-table aria-label="Recent orders">
    <mt-table-header>
      <mt-table-row>
        <mt-table-header-cell scope="col">Order</mt-table-header-cell>
        <mt-table-header-cell scope="col">Customer</mt-table-header-cell>
        <mt-table-header-cell scope="col">Date</mt-table-header-cell>
        <mt-table-header-cell scope="col" align="end">Total</mt-table-header-cell>
      </mt-table-row>
    </mt-table-header>

    <mt-table-body>
      <mt-table-row>
        <mt-table-cell>10023</mt-table-cell>
        <mt-table-cell>Ada Lovelace</mt-table-cell>
        <mt-table-cell>Nov 12, 2026</mt-table-cell>
        <mt-table-cell align="end">€129.90</mt-table-cell>
      </mt-table-row>
      <mt-table-row>
        <mt-table-cell>10024</mt-table-cell>
        <mt-table-cell>Grace Hopper</mt-table-cell>
        <mt-table-cell>Nov 13, 2026</mt-table-cell>
        <mt-table-cell align="end">€48.00</mt-table-cell>
      </mt-table-row>
      <mt-table-row>
        <mt-table-cell>10025</mt-table-cell>
        <mt-table-cell>Alan Turing</mt-table-cell>
        <mt-table-cell>Nov 15, 2026</mt-table-cell>
        <mt-table-cell align="end">€1,204.50</mt-table-cell>
      </mt-table-row>
    </mt-table-body>
  </mt-table>
</template>
