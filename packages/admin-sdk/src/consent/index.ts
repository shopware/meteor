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

export const request = (messageOptions: Omit<consentRequest, 'responseType'>): Promise<Consent> => {
  return new Promise((resolve, reject) => {
    const unhandle = createHandler('consentRequestResponse')((message) => {
      if (message.name !== messageOptions.consent) {
        return Promise.resolve();
      }

      unhandle();
      resolve(Consent.fromStatusResponse(message.consent));
      return Promise.resolve();
    });

    createSender('consentRequest')(messageOptions).catch((reason: unknown) => {
      unhandle();
      reject(reason);
    });
  });
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

    consent: string,
    requestMessage?: string,
    privacyLink?: string,
};

export type consentRequestResponse = {
    responseType: void,

    name: string,
    consent: ConsentStatusResponseType,
}
