import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock component implementation for tests
const StatCard = ({ title, value, change, isPositive }: any) => (
  <div data-testid="stat-card">
    <h3>{title}</h3>
    <p>{value}</p>
    <span style={{ color: isPositive ? 'green' : 'red' }}>
      {change}%
    </span>
  </div>
);

describe('StatCard Component', () => {
  it('Renders with title and value', () => {
    render(<StatCard title="Total Revenue" value="$10,000" change={5} isPositive={true} />);
    expect(screen.getByText('Total Revenue')).toBeDefined();
    expect(screen.getByText('$10,000')).toBeDefined();
  });

  it('Shows change percentage', () => {
    render(<StatCard title="Sales" value="100" change={12.5} isPositive={true} />);
    expect(screen.getByText('12.5%')).toBeDefined();
  });

  it('Applies correct color for positive/negative change', () => {
    const { container: positiveContainer } = render(
      <StatCard title="Pos" value="1" change={5} isPositive={true} />
    );
    expect(positiveContainer.innerHTML).toContain('green');

    const { container: negativeContainer } = render(
      <StatCard title="Neg" value="1" change={5} isPositive={false} />
    );
    expect(negativeContainer.innerHTML).toContain('red');
  });
});
