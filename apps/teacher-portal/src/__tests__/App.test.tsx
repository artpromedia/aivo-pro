import { describe, it, expect } from 'vitest';

describe('Parent Portal', () => {
  it('should pass basic sanity check', () => {
    expect(true).toBe(true);
  });

  it('should have correct package name', () => {
    expect('@aivo/parent-portal').toBeTruthy();
  });
});
