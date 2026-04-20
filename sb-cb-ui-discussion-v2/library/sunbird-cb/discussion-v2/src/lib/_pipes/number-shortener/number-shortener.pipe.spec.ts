import { NumberShortenerPipe } from './number-shortener.pipe';

describe('NumberShortenerPipe', () => {
  let pipe: NumberShortenerPipe;

  beforeEach(() => {
    pipe = new NumberShortenerPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should handle null and undefined values', () => {
    expect(pipe.transform(null)).toBe('0');
    expect(pipe.transform(undefined)).toBe('0');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe('0');
  });

  it('should handle numbers less than 1000', () => {
    expect(pipe.transform(999)).toBe('999');
    expect(pipe.transform(-999)).toBe('-999');
  });

  it('should format thousands correctly', () => {
    expect(pipe.transform(1234)).toBe('1.2K');
    expect(pipe.transform(5678)).toBe('5.7K');
    expect(pipe.transform(-1234)).toBe('-1.2K');
  });

  it('should format millions correctly', () => {
    expect(pipe.transform(1234567)).toBe('1.2M');
    expect(pipe.transform(-1234567)).toBe('-1.2M');
  });

  it('should format billions correctly', () => {
    expect(pipe.transform(1234567890)).toBe('1.2B');
  });

  it('should handle custom decimal places', () => {
    expect(pipe.transform(1234, 2)).toBe('1.23K');
    expect(pipe.transform(1234, 0)).toBe('1K');
  });
});
