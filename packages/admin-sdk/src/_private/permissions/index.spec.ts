import { createSender } from '../../channel';
import { grant } from './index';

jest.mock('../../channel', () => ({
  createSender: jest.fn(() => jest.fn()),
}));

describe('Private Service Permissions', () => {
  it('creates a sender for granting permissions', () => {
    expect(createSender).toHaveBeenCalledWith('servicePermissionGrant', {});
    expect(grant).toEqual(expect.any(Function));
  });

  it('sends the grant request without a revision', async () => {
    const sender = (createSender as jest.Mock).mock.results[0]?.value as jest.Mock;

    await grant();

    expect(sender).toHaveBeenCalledWith({});
  });
});
