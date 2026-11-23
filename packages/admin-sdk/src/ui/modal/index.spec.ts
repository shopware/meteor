import { send } from '../../channel';
import type { ModalCloseListener, ModalCloseResult } from './index';
import { getProps, open } from './index';

jest.mock('../../channel', () => ({
  send: jest.fn(),
  createSender: (messageType: string) => (options: unknown) => (jest.requireMock('../../channel') as { send: jest.Mock }).send(messageType, options),
}));

const sendMock = send as jest.Mock;

type OpenMessage = { onResult: ModalCloseListener };

const openMessage = (): OpenMessage => sendMock.mock.calls.find(([type]) => type === 'uiModalOpen')?.[1] as OpenMessage;

const setSearch = (search: string): void => {
  window.history.replaceState({}, '', `/${search}`);
};

describe('ui.modal', () => {
  beforeEach(() => {
    sendMock.mockReset();
    setSearch('');
  });

  describe('open', () => {
    it('sends the options with props and a result callback', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });

      await open({ locationId: 'test-modal', props: { tab: 'tone' } });

      expect(sendMock).toHaveBeenCalledWith('uiModalOpen', expect.objectContaining({
        locationId: 'test-modal',
        props: { tab: 'tone' },
        onResult: expect.any(Function),
      }));
    });

    it('reports result support from the Administration response', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });

      const modal = await open({ locationId: 'test-modal' });

      expect(modal.supportsResult).toBe(true);
    });

    it('reports no result support when an older Administration answers without data', async () => {
      sendMock.mockResolvedValue(undefined);

      const modal = await open({ locationId: 'test-modal' });

      expect(modal.supportsResult).toBe(false);
    });

    it('settles closed with the result', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });
      const modal = await open<{ saved: boolean }>({ locationId: 'test-modal' });

      openMessage().onResult({ reason: 'closed', data: { saved: true } });

      await expect(modal.closed).resolves.toEqual({ reason: 'closed', data: { saved: true } });
    });

    it('calls every close listener once', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });
      const modal = await open({ locationId: 'test-modal' });
      const first = jest.fn();
      const second = jest.fn();
      modal.onClose(first);
      modal.onClose(second);

      openMessage().onResult({ reason: 'dismissed' });
      openMessage().onResult({ reason: 'closed' });

      expect(first).toHaveBeenCalledTimes(1);
      expect(first).toHaveBeenCalledWith({ reason: 'dismissed' });
      expect(second).toHaveBeenCalledTimes(1);
    });

    it('calls a listener added after closing right away', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });
      const modal = await open({ locationId: 'test-modal' });
      openMessage().onResult({ reason: 'dismissed' });
      const listener = jest.fn();

      modal.onClose(listener);

      expect(listener).toHaveBeenCalledWith({ reason: 'dismissed' });
    });

    it('does not call a removed listener', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });
      const modal = await open({ locationId: 'test-modal' });
      const listener = jest.fn();
      const off = modal.onClose(listener);

      off();
      openMessage().onResult({ reason: 'dismissed' });

      expect(listener).not.toHaveBeenCalled();
    });

    it('keeps calling listeners after one throws', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      const modal = await open({ locationId: 'test-modal' });
      const listener = jest.fn();
      modal.onClose(() => {
        throw new Error('broken');
      });
      modal.onClose(listener);

      openMessage().onResult({ reason: 'dismissed' } as ModalCloseResult);

      expect(listener).toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it('closes its own location', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });
      const modal = await open({ locationId: 'test-modal' });

      await modal.close();

      expect(sendMock).toHaveBeenCalledWith('uiModalClose', { locationId: 'test-modal' });
    });

    it('updates its own location', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });
      const modal = await open({ locationId: 'test-modal' });

      await modal.update({ title: 'New title' });

      expect(sendMock).toHaveBeenCalledWith('uiModalUpdate', { title: 'New title', locationId: 'test-modal' });
    });

    it('rejects an update of a text modal', async () => {
      sendMock.mockResolvedValue({ supportsResult: true });
      const modal = await open({ textContent: 'Hello' });

      await expect(modal.update({ title: 'New title' })).rejects.toThrow('locationId');
    });
  });

  describe('getProps', () => {
    it('asks the Administration for the props of the current location', async () => {
      setSearch('?location-id=test-modal&sw-modal-props=1');
      sendMock.mockResolvedValue({ tab: 'tone' });

      await expect(getProps()).resolves.toEqual({ tab: 'tone' });
      expect(sendMock).toHaveBeenCalledWith('uiModalGetProps', { locationId: 'test-modal' });
    });

    it('answers null without asking when the location was opened without props', async () => {
      setSearch('?location-id=test-modal');

      await expect(getProps()).resolves.toBeNull();
      expect(sendMock).not.toHaveBeenCalled();
    });

    it('answers null without asking outside a location', async () => {
      setSearch('?sw-modal-props=1');

      await expect(getProps()).resolves.toBeNull();
      expect(sendMock).not.toHaveBeenCalled();
    });
  });
});
