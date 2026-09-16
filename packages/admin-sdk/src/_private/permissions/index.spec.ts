import { createSender } from '../../channel';
import { grant, isGranted } from './index';
import { compareIsShopwareVersion } from '../../context';

jest.mock('../../channel', () => ({
  createSender: jest.fn(() => jest.fn()),
}));

jest.mock('../../context', () => ({
  compareIsShopwareVersion: jest.fn(),
}));

describe('Private Service Permissions', () => {
  beforeEach(() => {
    (compareIsShopwareVersion as jest.Mock).mockResolvedValue(false);
  });

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

  it('throws without sending the grant request before Shopware 6.7.14.0', async () => {
    const sender = (createSender as jest.Mock).mock.results[0]?.value as jest.Mock;
    (compareIsShopwareVersion as jest.Mock).mockResolvedValue(true);
    sender.mockClear();

    await expect(grant()).rejects.toThrow(
      'grant() requires Shopware 6.7.14.0 or newer',
    );

    expect(compareIsShopwareVersion).toHaveBeenCalledWith('<', '6.7.14.0');
    expect(sender).not.toHaveBeenCalled();
  });

  it('throws without sending the granted check before Shopware 6.7.14.0', async () => {
    const sender = (createSender as jest.Mock).mock.results[1]?.value as jest.Mock;
    (compareIsShopwareVersion as jest.Mock).mockResolvedValue(true);
    sender.mockClear();

    await expect(isGranted()).rejects.toThrow(
      'isGranted() requires Shopware 6.7.14.0 or newer',
    );

    expect(compareIsShopwareVersion).toHaveBeenCalledWith('<', '6.7.14.0');
    expect(sender).not.toHaveBeenCalled();
  });
});
