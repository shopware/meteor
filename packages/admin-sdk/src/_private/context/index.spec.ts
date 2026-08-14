import { createSender } from '../../channel';
import { isService } from './index';

jest.mock('../../channel', () => ({
  createSender: jest.fn(() => jest.fn()),
}));

describe('Private Service Context', () => {
  it('creates a sender for the service check', () => {
    expect(createSender).toHaveBeenCalledWith('contextIsService', {});
    expect(isService).toEqual(expect.any(Function));
  });

  it('sends the service check request', async () => {
    const sender = (createSender as jest.Mock).mock.results[0]?.value as jest.Mock;

    await isService();

    expect(sender).toHaveBeenCalledWith();
  });
});
