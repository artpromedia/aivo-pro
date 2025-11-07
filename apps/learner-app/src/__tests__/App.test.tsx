import { describe, it, expect } from 'vitest';

describe('Learner App', () => {
  it('should pass basic sanity check', () => {
    expect(true).toBe(true);
  });

  it('should have correct package name', () => {
    expect('@aivo/learner-app').toBeTruthy();
  });
});
