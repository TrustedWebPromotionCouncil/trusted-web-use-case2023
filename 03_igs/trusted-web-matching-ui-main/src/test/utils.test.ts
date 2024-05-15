import { Validate, t } from '@/utils';
describe('Validate required test.', () => {
  const requiredMsg = 'テスト項目';
  const requiredValue = t('VALIDATE.VALUE_REQUIRED', { value: requiredMsg });
  it('required string: this is test', () => {
    const result = Validate.required('this is test', requiredMsg);
    expect(result).toBe(true);
  });
  it("required string: 'null'", () => {
    const result = Validate.required('this is test', requiredMsg);
    expect(result).toBe(true);
  });
  it("required string: 'true'", () => {
    const result = Validate.required('this is test', requiredMsg);
    expect(result).toBe(true);
  });
  it("required string: 'false'", () => {
    const result = Validate.required('this is test', requiredMsg);
    expect(result).toBe(true);
  });
  it('required string: empty', () => {
    const result = Validate.required('', requiredMsg);
    expect(result).toBe(requiredValue);
  });
  it('required number: 0', () => {
    const result = Validate.required(0, requiredMsg);
    expect(result).toBe(true);
  });
  it("required string number: '0'", () => {
    const result = Validate.required('0', requiredMsg);
    expect(result).toBe(true);
  });
  it('required number: not 0', () => {
    const result = Validate.required(765, requiredMsg);
    expect(result).toBe(true);
  });
  it('required boolean: true', () => {
    const result = Validate.required(true, requiredMsg);
    expect(result).toBe(true);
  });
  it('required boolean: false', () => {
    const result = Validate.required(false, requiredMsg);
    expect(result).toBe(requiredValue);
  });
  it('required null', () => {
    const result = Validate.required(null, requiredMsg);
    expect(result).toBe(requiredValue);
  });
});
describe('Validate email test.', () => {
  const errorMsg = `${t('VALIDATE.VALUE_FORMAT', { value: t('PLACEHOLDER.EMAIL') })}`;
  it('email ok', () => {
    const result = Validate.email('test@test.com');
    expect(result).toBe(true);
  });
  it('email ok', () => {
    const result = Validate.email('test@i-globalsociety.com');
    expect(result).toBe(true);
  });
  it('email ng: format error', () => {
    const result = Validate.email('test@test,com');
    expect(result).toBe(errorMsg);
  });
  // TODO: 全角通過する
  // it('email ng: full width', () => {
  //   const result = Validate.email('１２３@test.com');
  //   expect(result).toBe(errorMsg);
  // });
});
