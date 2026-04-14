const mockStatusSender = jest.fn();
const mockRequestSender = jest.fn();
let mockConsentRequestId: string | undefined;
const mockCreateSender = jest.fn((messageType: string, options?: { requestId?: string }) => {
  if (messageType === 'consentStatus') {
    return mockStatusSender;
  }

  if (messageType === 'consentRequest') {
    mockConsentRequestId = options?.requestId;
    return mockRequestSender;
  }

  throw new Error(`Unexpected sender type: ${messageType}`);
});

const mockUnhandle = jest.fn();
let mockConsentRequestResponseHandler: ((message: unknown) => unknown) | undefined;
const mockCreateHandler = jest.fn((messageType: string) => {
  if (messageType !== 'consentRequestResponse') {
    throw new Error(`Unexpected handler type: ${messageType}`);
  }

  return (callback: (message: unknown) => unknown) => {
    mockConsentRequestResponseHandler = callback;

    return mockUnhandle;
  };
});

jest.mock('../channel', () => ({
  createSender: (messageType: string, options?: { requestId?: string }) => mockCreateSender(messageType, options),
  createHandler: (messageType: string) => mockCreateHandler(messageType),
}));

import { request, status } from './index';

describe('consent', () => {
  beforeEach(() => {
    mockStatusSender.mockReset();
    mockRequestSender.mockReset();
    mockCreateSender.mockClear();
    mockCreateHandler.mockClear();
    mockUnhandle.mockReset();
    mockConsentRequestResponseHandler = undefined;
    mockConsentRequestId = undefined;
    mockUnhandle.mockImplementation(() => {
      mockConsentRequestResponseHandler = undefined;
    });
  });

  describe('status', () => {
    it('sends the consent status request and maps the response', async () => {
      mockStatusSender.mockResolvedValue({
        name: 'newsletter',
        status: 'accepted',
        updatedAt: '2026-04-13T10:00:00.000Z',
        acceptedRevision: '2',
        latestRevision: '3',
      });

      const consent = await status({
        consent: 'newsletter',
      });

      expect(mockCreateSender).toHaveBeenCalledWith('consentStatus', undefined);
      expect(mockStatusSender).toHaveBeenCalledWith({
        consent: 'newsletter',
      });
      expect(consent).toMatchObject({
        name: 'newsletter',
        status: 'accepted',
        updatedAt: '2026-04-13T10:00:00.000Z',
        acceptedRevision: '2',
        lastRevision: '3',
      });
      expect(consent.isAccepted).toBe(true);
      expect(consent.isStale).toBe(true);
    });
  });

  describe('request', () => {
    it('registers the response handler before sending the consent request', async () => {
      mockRequestSender.mockResolvedValue(undefined);

      const { requestPromise } = request({
        consent: 'newsletter',
        requestMessage: 'Please confirm',
        privacyLink: 'https://example.com/privacy',
      });

      expect(mockCreateHandler).toHaveBeenCalledWith('consentRequestResponse');
      expect(mockCreateSender).toHaveBeenCalledWith(
        'consentRequest',
        expect.objectContaining({
          requestId: expect.any(String),
        }),
      );
      expect(mockRequestSender).toHaveBeenCalledWith({
        consent: 'newsletter',
        requestMessage: 'Please confirm',
        privacyLink: 'https://example.com/privacy',
      });
      expect(mockConsentRequestId).toEqual(expect.any(String));
      expect(mockConsentRequestResponseHandler).toEqual(expect.any(Function));

      await mockConsentRequestResponseHandler?.({
        name: 'newsletter',
        requestId: mockConsentRequestId,
        consent: {
          name: 'newsletter',
          status: 'accepted',
          updatedAt: '2026-04-13T11:00:00.000Z',
          acceptedRevision: '3',
          latestRevision: '3',
        },
      });

      const consent = await requestPromise;

      expect(consent).toMatchObject({
        name: 'newsletter',
        status: 'accepted',
        acceptedRevision: '3',
        lastRevision: '3',
      });
      expect(consent.isAccepted).toBe(true);
      expect(consent.isStale).toBe(false);
      expect(mockUnhandle).toHaveBeenCalledTimes(1);
    });

    it('ignores non-matching consent responses', async () => {
      mockRequestSender.mockResolvedValue(undefined);

      const { requestPromise } = request({
        consent: 'newsletter',
      });

      await mockConsentRequestResponseHandler?.({
        name: 'terms-and-conditions',
        requestId: mockConsentRequestId,
        consent: {
          name: 'terms-and-conditions',
          status: 'declined',
          updatedAt: null,
          acceptedRevision: null,
          latestRevision: '1',
        },
      });

      let isResolved = false;
      void requestPromise.then(() => {
        isResolved = true;
      });

      await Promise.resolve();

      expect(isResolved).toBe(false);
      expect(mockUnhandle).not.toHaveBeenCalled();

      await mockConsentRequestResponseHandler?.({
        name: 'newsletter',
        requestId: mockConsentRequestId,
        consent: {
          name: 'newsletter',
          status: 'accepted',
          updatedAt: null,
          acceptedRevision: '1',
          latestRevision: '1',
        },
      });

      await expect(requestPromise).resolves.toMatchObject({
        name: 'newsletter',
        status: 'accepted',
      });
      expect(mockUnhandle).toHaveBeenCalledTimes(1);
    });

    it('rejects and unregisters the response handler when sending fails', async () => {
      const sendError = new Error('request failed');
      mockRequestSender.mockRejectedValue(sendError);

      const { requestPromise } = request({
        consent: 'newsletter',
      })

      await expect(requestPromise).rejects.toThrow('request failed');

      expect(mockUnhandle).toHaveBeenCalledTimes(1);
    });

    it('aborts and unregisters the response handler so no further messages are handled', async () => {
      mockRequestSender.mockResolvedValue(undefined);

      const { requestPromise, abort } = request({
        consent: 'newsletter',
      });

      const abortError = new Error('request aborted');
      abort(abortError);

      expect(mockUnhandle).toHaveBeenCalledTimes(1);
      expect(mockConsentRequestResponseHandler).toBeUndefined();
      await expect(requestPromise).rejects.toThrow('request aborted');

      const handlerAfterAbort = mockConsentRequestResponseHandler;
      await handlerAfterAbort?.({
        name: 'newsletter',
        consent: {
          name: 'newsletter',
          status: 'accepted',
          updatedAt: null,
          acceptedRevision: '1',
          latestRevision: '1',
        },
      });

      expect(mockUnhandle).toHaveBeenCalledTimes(1);
    });
  });
});
