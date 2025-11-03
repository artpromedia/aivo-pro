import React from 'react';
import { Hero } from '../components/Hero';
import { FeatureGrid } from '../components/FeatureGrid';
import { PricingCards } from '../components/PricingCards';
import { ComparisonTable } from '../components/ComparisonTable';

export const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeatureGrid />
      <ComparisonTable />
      <PricingCards />
    </div>
  );
};
