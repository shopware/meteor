<script setup lang="ts">
import {
  MtTable,
  MtTableCaption,
  MtTableHeader,
  MtTableBody,
  MtTableFooter,
  MtTableRow,
  MtTableHeaderCell,
  MtTableCell,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-table>
    <mt-table-caption>Items of order 10023</mt-table-caption>

    <mt-table-header>
      <mt-table-row>
        <mt-table-header-cell scope="col">Item</mt-table-header-cell>
        <mt-table-header-cell scope="col" align="end">Quantity</mt-table-header-cell>
        <mt-table-header-cell scope="col" align="end">Price</mt-table-header-cell>
      </mt-table-row>
    </mt-table-header>

    <mt-table-body>
      <mt-table-row>
        <mt-table-cell>Aviator shirt</mt-table-cell>
        <mt-table-cell align="end">2</mt-table-cell>
        <mt-table-cell align="end">€79.80</mt-table-cell>
      </mt-table-row>
      <mt-table-row>
        <mt-table-cell>Linen cap</mt-table-cell>
        <mt-table-cell align="end">1</mt-table-cell>
        <mt-table-cell align="end">€19.00</mt-table-cell>
      </mt-table-row>
      <mt-table-row>
        <mt-table-cell>Shipping</mt-table-cell>
        <mt-table-cell align="end">1</mt-table-cell>
        <mt-table-cell align="end">€4.90</mt-table-cell>
      </mt-table-row>
    </mt-table-body>

    <mt-table-footer>
      <mt-table-row>
        <mt-table-header-cell scope="row" colspan="2">Total</mt-table-header-cell>
        <mt-table-cell align="end">€103.70</mt-table-cell>
      </mt-table-row>
    </mt-table-footer>
  </mt-table>
</template>
