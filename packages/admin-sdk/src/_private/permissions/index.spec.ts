import { createSender } from '../../channel';
import { grant, isGranted } from './index';

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

    expect(sender).toHaveBeenCalledWith();
  });

  it('creates a sender for the granted check', () => {
    expect(createSender).toHaveBeenCalledWith('servicePermissionIsGranted', {});
    expect(isGranted).toEqual(expect.any(Function));
  });

  it('sends the granted check request', async () => {
    const sender = (createSender as jest.Mock).mock.results[1]?.value as jest.Mock;

    await isGranted();

    expect(sender).toHaveBeenCalledWith();
  });
});
