import { generateUniqueId } from '../_internals/utils';
import { createHandler, createSender } from '../channel';

class Consent {
  static fromStatusResponse(response: Exclude<consentStatus['responseType'], null>): Consent {
    return new Consent(
      response.name,
      response.status,
      response.updatedAt,
      response.acceptedRevision,
      response.latestRevision,
    );
  }

  private constructor(
        public readonly name: string,
        public readonly status: ConsentStatusResponseType['status'],
        public readonly updatedAt: string | null,
        public readonly acceptedRevision: string | null,
        public readonly lastRevision: string | null,
  ) {}

  get isAccepted(): boolean {
    return this.status === 'accepted';
  }

  get isStale(): boolean {
    if (!this.isAccepted) {
      return false;
    }

    return this.lastRevision !== null && this.lastRevision !== this.acceptedRevision;
  }
}

export type { Consent };

export const status = async (messageData: Omit<consentStatus, 'responseType'>): Promise<Consent> => {
  const sender = createSender('consentStatus');
  const response = await sender(messageData);

  return Consent.fromStatusResponse(response);
};

export const request = (messageOptions: Omit<consentRequest, 'responseType' | 'requestId'>): {
  requestPromise: Promise<Consent>,
  abort: (reason?: unknown) => void,
} => {
  /*
   * Fake Promise.withResolvers because it is not available in our TS version
   */
  let resolve: (value: Consent | PromiseLike<Consent>) => void;
  let reject: (reason?: unknown) => void;
  const requestPromise = new Promise<Consent>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const requestId = generateUniqueId();

  const unhandle = createHandler('consentRequestResponse')((message) => {
    if (message.name !== messageOptions.consent) {
      return Promise.resolve();
    }

    if(message.requestId !== requestId) {
      return Promise.resolve();
    }

    unhandle();
    resolve(Consent.fromStatusResponse(message.consent));
    return Promise.resolve();
  });

  createSender('consentRequest', { requestId })(messageOptions).catch((reason: unknown) => {
    unhandle();
    reject(reason);
  });

  return {
    requestPromise,
    abort: (reason: unknown): void => {
      unhandle();
      reject(reason);
    },
  };
};

type ConsentStatusResponseType = {
    name: string,
    status: 'unset' | 'declined' | 'revoked' | 'accepted',
    updatedAt: string | null,
    acceptedRevision: string | null,
    latestRevision: string | null,
}

export type consentStatus = {
    responseType: ConsentStatusResponseType,

    consent: string,
};

export type consentRequest = {
    responseType: void,

    requestId: string,

    consent: string,
    requestMessage?: string,
    privacyLink?: string,
};

export type consentRequestResponse = {
    responseType: void,

    name: string,
    requestId: string,
    consent: ConsentStatusResponseType,
}
