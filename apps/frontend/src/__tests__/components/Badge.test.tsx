import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Component
const Badge = ({ variant = 'default', children }: any) => (
  <span data-testid="badge" className={`badge-${variant}`}>
    {children}
  </span>
);

describe('Badge Component', () => {
  it('Renders children text', () => {
    render(<Badge>New Item</Badge>);
    expect(screen.getByText('New Item')).toBeDefined();
  });

  it('Renders with correct variant styling', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    expect((container.firstChild as HTMLElement)?.className).toContain('badge-destructive');
  });

  it('Defaults to default variant', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect((container.firstChild as HTMLElement)?.className).toContain('badge-default');
  });
});
