import { MiB, KiB } from 'src/utils/units';

describe('ConstantsTest', () => {
  it('KiB', () => {
    expect(KiB).toStrictEqual(1024 * 1);
    expect(MiB).toStrictEqual(1024 * KiB);
  });
});

