/**
 * COLORPALETTE.TSX - COLOR SYSTEM DEMONSTRATION COMPONENT
 * =====================================================
 * 
 * Kipengele cha kuonyesha mfumo wa rangi - Color system demonstration component
 * 
 * PURPOSE / MADHUMUNI:
 * This component showcases the refined color palette system, including:
 * - Core design system colors
 * - Semantic color variations
 * - Tanzanian-inspired color schemes
 * - Gradient utilities
 * - Focus states and shadows
 * 
 * USAGE / MATUMIZI:
 * - Development reference for designers and developers
 * - Color system documentation
 * - Design token showcase
 * - Accessibility testing
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ColorPalette: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent mb-4">
            Refined Color Palette System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive color system designed for accessibility, consistency, and visual appeal.
            Built with HSL values for better color manipulation and dark mode support.
          </p>
        </div>

        {/* Core Design System Colors */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Core Design System Colors</CardTitle>
            <p className="text-muted-foreground">Essential colors for UI components and layouts</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-lg border shadow-medium"></div>
                <div className="text-center">
                  <p className="font-semibold text-primary">Primary</p>
                  <p className="text-xs text-muted-foreground">hsl(var(--primary))</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-secondary rounded-lg border shadow-medium"></div>
                <div className="text-center">
                  <p className="font-semibold text-secondary-foreground">Secondary</p>
                  <p className="text-xs text-muted-foreground">hsl(var(--secondary))</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-muted rounded-lg border shadow-medium"></div>
                <div className="text-center">
                  <p className="font-semibold text-muted-foreground">Muted</p>
                  <p className="text-xs text-muted-foreground">hsl(var(--muted))</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-accent rounded-lg border shadow-medium"></div>
                <div className="text-center">
                  <p className="font-semibold text-accent-foreground">Accent</p>
                  <p className="text-xs text-muted-foreground">hsl(var(--accent))</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Semantic Color System */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Semantic Color System</CardTitle>
            <p className="text-muted-foreground">Colors with specific meanings and use cases</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-success rounded-lg border shadow-medium"></div>
                <div className="text-center">
                  <p className="font-semibold text-success">Success</p>
                  <p className="text-xs text-muted-foreground">Positive actions & states</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-warning rounded-lg border shadow-medium"></div>
                <div className="text-center">
                  <p className="font-semibold text-warning">Warning</p>
                  <p className="text-xs text-muted-foreground">Caution & attention</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-info rounded-lg border shadow-medium"></div>
                <div className="text-center">
                  <p className="font-semibold text-info">Info</p>
                  <p className="text-xs text-muted-foreground">Information & guidance</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-destructive rounded-lg border shadow-medium"></div>
                <div className="text-center">
                  <p className="font-semibold text-destructive">Error</p>
                  <p className="text-xs text-muted-foreground">Errors & destructive actions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tanzanian-Inspired Color System */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Tanzanian-Inspired Color System</CardTitle>
            <p className="text-muted-foreground">Colors inspired by Tanzania's natural beauty and landscapes</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Safari Colors */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Safari - Warm Earth Tones</h3>
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="space-y-2">
                    <div className={`h-16 bg-safari-${shade} rounded-lg border shadow-soft`}></div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">{shade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kilimanjaro Colors */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Kilimanjaro - Mountain Greens</h3>
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="space-y-2">
                    <div className={`h-16 bg-kilimanjaro-${shade} rounded-lg border shadow-soft`}></div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">{shade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Serengeti Colors */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Serengeti - Sunset Oranges</h3>
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="space-y-2">
                    <div className={`h-16 bg-serengeti-${shade} rounded-lg border shadow-soft`}></div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">{shade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gradient System */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Gradient System</CardTitle>
            <p className="text-muted-foreground">Predefined gradients for consistent visual effects</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Primary Gradients</h3>
                <div className="space-y-3">
                  <div className="h-16 primary-gradient rounded-lg border shadow-medium"></div>
                  <p className="text-sm text-muted-foreground">primary-gradient</p>
                  
                  <div className="h-16 primary-gradient-light rounded-lg border shadow-soft"></div>
                  <p className="text-sm text-muted-foreground">primary-gradient-light</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Tanzanian Gradients</h3>
                <div className="space-y-3">
                  <div className="h-16 safari-gradient rounded-lg border shadow-medium"></div>
                  <p className="text-sm text-muted-foreground">safari-gradient</p>
                  
                  <div className="h-16 serengeti-gradient rounded-lg border shadow-medium"></div>
                  <p className="text-sm text-muted-foreground">serengeti-gradient</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Shadow System */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Enhanced Shadow System</CardTitle>
            <p className="text-muted-foreground">Consistent shadow utilities for depth and hierarchy</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="h-24 bg-card rounded-lg shadow-soft border"></div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">shadow-soft</p>
                  <p className="text-xs text-muted-foreground">Subtle depth</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-24 bg-card rounded-lg shadow-medium border"></div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">shadow-medium</p>
                  <p className="text-xs text-muted-foreground">Medium depth</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-24 bg-card rounded-lg shadow-strong border"></div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">shadow-strong</p>
                  <p className="text-xs text-muted-foreground">Strong depth</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-24 bg-card rounded-lg shadow-colored border"></div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">shadow-colored</p>
                  <p className="text-xs text-muted-foreground">Primary tinted</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Focus States */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Focus State System</CardTitle>
            <p className="text-muted-foreground">Accessible focus indicators for keyboard navigation</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <button className="w-full h-16 bg-primary text-primary-foreground rounded-lg focus-ring-primary focus:outline-none">
                  Primary Focus
                </button>
                <p className="text-sm text-muted-foreground text-center">focus-ring-primary</p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full h-16 bg-success text-success-foreground rounded-lg focus-ring-success focus:outline-none">
                  Success Focus
                </button>
                <p className="text-sm text-muted-foreground text-center">focus-ring-success</p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full h-16 bg-warning text-warning-foreground rounded-lg focus-ring-warning focus:outline-none">
                  Warning Focus
                </button>
                <p className="text-sm text-muted-foreground text-center">focus-ring-warning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Glassmorphism Effects */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Glassmorphism Effects</CardTitle>
            <p className="text-muted-foreground">Modern glass-like visual effects with backdrop blur</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-32 glass-light rounded-lg border shadow-medium"></div>
                <p className="text-sm text-muted-foreground text-center">glass-light</p>
              </div>
              
              <div className="space-y-3">
                <div className="h-32 glass-dark rounded-lg border shadow-medium"></div>
                <p className="text-sm text-muted-foreground text-center">glass-dark</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Usage Examples</CardTitle>
            <p className="text-muted-foreground">Common patterns and combinations</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Interactive Elements</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-primary to-serengeti-500 text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Primary Action Button
                  </button>
                  
                  <button className="w-full bg-success text-success-foreground py-3 px-6 rounded-lg shadow-medium hover:shadow-strong transform hover:scale-105 transition-all duration-300">
                    Success Action Button
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Status Indicators</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                    <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                    <Badge className="bg-destructive text-destructive-foreground">Error</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-primary text-primary">Primary</Badge>
                    <Badge variant="outline" className="border-serengeti-500 text-serengeti-600">Serengeti</Badge>
                    <Badge variant="outline" className="border-kilimanjaro-500 text-kilimanjaro-600">Kilimanjaro</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColorPalette;
