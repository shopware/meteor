import { expect } from '@storybook/jest';
import SwPagination from './sw-pagination.vue';
import defaultPaginationStory, { Default } from './sw-pagination.stories';
import flushPromises from 'flush-promises';

export default {
  ...defaultPaginationStory,
  title: 'Interaction Tests/Table and list/sw-pagination',
  component: SwPagination,
};

export const TestOnePage = Default.bind();
TestOnePage.storyName = 'Render with one page';
TestOnePage.args = {
  ...Default.args,
  limit: 100,
};
TestOnePage.play = async () => {
  const infoText = document.querySelector('.sw-pagination__info-text');

  expect(infoText).not.toBeNull();
  expect(infoText.innerText).toEqual('1-100 of 100');
};

export const TestManyPages = Default.bind();
TestManyPages.storyName = 'Render with 100 page';
TestManyPages.args = {
  ...Default.args,
  limit: 1,
};
TestManyPages.play = async () => {
  const infoText = document.querySelector('.sw-pagination__info-text');

  expect(infoText).not.toBeNull();
  expect(infoText.innerText).toEqual('1-1 of 100');
};

export const TestPageChange = Default.bind();
TestPageChange.storyName = 'Test page change';
TestPageChange.args = Default.args,
TestPageChange.play = async () => {
  document.querySelector('.sw-segmented-control__action-id-pagination-next').click();

  await flushPromises();

  const infoText = document.querySelector('.sw-pagination__info-text');

  expect(infoText).not.toBeNull();
  expect(infoText.innerText).toEqual('26-50 of 100');
};