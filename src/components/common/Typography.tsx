/**
 * TYPOGRAPHY.TSX - TYPOGRAPHY SYSTEM DEMONSTRATION COMPONENT
 * =========================================================
 * 
 * Kipengele cha kuonyesha mfumo wa typography - Typography system demonstration component
 * 
 * PURPOSE / MADHUMUNI:
 * This component showcases the comprehensive typography system, including:
 * - Font family variations (Display, Sans, Mono)
 * - Font size scale (xs to 9xl)
 * - Font weight scale (thin to black)
 * - Line height variations
 * - Letter spacing options
 * - Text color utilities
 * - Typography component classes
 * 
 * USAGE / MATUMIZI:
 * - Development reference for designers and developers
 * - Typography system documentation
 * - Design token showcase
 * - Accessibility testing
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Typography: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-display-1 bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent mb-4">
            Typography System
          </h1>
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
            A comprehensive typography system designed for consistency, readability, and visual hierarchy.
            Built with CSS custom properties for easy theming and customization.
          </p>
        </div>

        {/* Font Family System */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Font Family System</CardTitle>
            <p className="text-body-medium text-muted-foreground">Different font families for different use cases</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="text-heading-3 text-foreground">Display Font</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-display text-2xl font-bold">Poppins Display</p>
                  <p className="text-caption text-muted-foreground mt-2">Perfect for headings and titles</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-heading-3 text-foreground">Sans Font</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-body text-2xl font-normal">Inter Sans</p>
                  <p className="text-caption text-muted-foreground mt-2">Ideal for body text and UI elements</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-heading-3 text-foreground">Mono Font</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-mono text-2xl font-normal">JetBrains Mono</p>
                  <p className="text-caption text-muted-foreground mt-2">Great for code and technical content</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Size Scale */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Font Size Scale</CardTitle>
            <p className="text-body-medium text-muted-foreground">Consistent font size scale based on 1.25 ratio (Major Third)</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-9xl font-black">Aa</span>
                <div className="text-right">
                  <p className="text-label">9xl - 8rem (128px)</p>
                  <p className="text-caption text-muted-foreground">Display headings</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-8xl font-extrabold">Aa</span>
                <div className="text-right">
                  <p className="text-label">8xl - 6rem (96px)</p>
                  <p className="text-caption text-muted-foreground">Hero sections</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-7xl font-bold">Aa</span>
                <div className="text-right">
                  <p className="text-label">7xl - 4.5rem (72px)</p>
                  <p className="text-caption text-muted-foreground">Page titles</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-6xl font-bold">Aa</span>
                <div className="text-right">
                  <p className="text-label">6xl - 3.75rem (60px)</p>
                  <p className="text-caption text-muted-foreground">Section headers</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-5xl font-semibold">Aa</span>
                <div className="text-right">
                  <p className="text-label">5xl - 3rem (48px)</p>
                  <p className="text-caption text-muted-foreground">Main headings</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-4xl font-semibold">Aa</span>
                <div className="text-right">
                  <p className="text-label">4xl - 2.25rem (36px)</p>
                  <p className="text-caption text-muted-foreground">Sub headings</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-3xl font-semibold">Aa</span>
                <div className="text-right">
                  <p className="text-label">3xl - 1.875rem (30px)</p>
                  <p className="text-caption text-muted-foreground">Card titles</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-2xl font-semibold">Aa</span>
                <div className="text-right">
                  <p className="text-label">2xl - 1.5rem (24px)</p>
                  <p className="text-caption text-muted-foreground">Component titles</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-display text-xl font-semibold">Aa</span>
                <div className="text-right">
                  <p className="text-label">xl - 1.25rem (20px)</p>
                  <p className="text-caption text-muted-foreground">Small headings</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-body text-lg font-medium">Aa</span>
                <div className="text-right">
                  <p className="text-label">lg - 1.125rem (18px)</p>
                  <p className="text-caption text-muted-foreground">Large body text</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-body text-base font-normal">Aa</span>
                <div className="text-right">
                  <p className="text-label">base - 1rem (16px)</p>
                  <p className="text-caption text-muted-foreground">Default body text</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-body text-sm font-normal">Aa</span>
                <div className="text-right">
                  <p className="text-label">sm - 0.875rem (14px)</p>
                  <p className="text-caption text-muted-foreground">Small body text</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-body text-xs font-medium">Aa</span>
                <div className="text-right">
                  <p className="text-label">xs - 0.75rem (12px)</p>
                  <p className="text-caption text-muted-foreground">Captions and labels</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Weight Scale */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Font Weight Scale</CardTitle>
            <p className="text-body-medium text-muted-foreground">Complete range of font weights for different emphasis levels</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-thin">Thin (100)</p>
                <p className="text-caption text-muted-foreground mt-1">Ultra-light weight</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-extralight">Extra Light (200)</p>
                <p className="text-caption text-muted-foreground mt-1">Very light weight</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-light">Light (300)</p>
                <p className="text-caption text-muted-foreground mt-1">Light weight</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-normal">Normal (400)</p>
                <p className="text-caption text-muted-foreground mt-1">Regular weight</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-medium">Medium (500)</p>
                <p className="text-caption text-muted-foreground mt-1">Medium weight</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-semibold">Semi Bold (600)</p>
                <p className="text-caption text-muted-foreground mt-1">Semi-bold weight</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-bold">Bold (700)</p>
                <p className="text-caption text-muted-foreground mt-1">Bold weight</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-extrabold">Extra Bold (800)</p>
                <p className="text-caption text-muted-foreground mt-1">Extra-bold weight</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-black">Black (900)</p>
                <p className="text-caption text-muted-foreground mt-1">Ultra-bold weight</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Height Scale */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Line Height Scale</CardTitle>
            <p className="text-body-medium text-muted-foreground">Different line heights for optimal readability</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body text-lg leading-none">Leading None (1.0)</p>
                <p className="text-caption text-muted-foreground mt-1">Tight spacing for headings</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body text-lg leading-tight">Leading Tight (1.25)</p>
                <p className="text-caption text-muted-foreground mt-1">Compact spacing for subheadings</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body text-lg leading-snug">Leading Snug (1.375)</p>
                <p className="text-caption text-muted-foreground mt-1">Comfortable spacing for titles</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body text-lg leading-normal">Leading Normal (1.5)</p>
                <p className="text-caption text-muted-foreground mt-1">Standard spacing for body text</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body text-lg leading-relaxed">Leading Relaxed (1.625)</p>
                <p className="text-caption text-muted-foreground mt-1">Comfortable spacing for long text</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body text-lg leading-loose">Leading Loose (2.0)</p>
                <p className="text-caption text-muted-foreground mt-1">Generous spacing for readability</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Letter Spacing Scale */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Letter Spacing Scale</CardTitle>
            <p className="text-body-medium text-muted-foreground">Letter spacing variations for different text styles</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-bold tracking-tighter">Tighter (-0.05em)</p>
                <p className="text-caption text-muted-foreground mt-1">Compact letter spacing</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-bold tracking-tight">Tight (-0.025em)</p>
                <p className="text-caption text-muted-foreground mt-1">Slightly compact spacing</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-bold tracking-normal">Normal (0em)</p>
                <p className="text-caption text-muted-foreground mt-1">Default letter spacing</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-bold tracking-wide">Wide (0.025em)</p>
                <p className="text-caption text-muted-foreground mt-1">Slightly expanded spacing</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-bold tracking-wider">Wider (0.05em)</p>
                <p className="text-caption text-muted-foreground mt-1">Expanded letter spacing</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display text-xl font-bold tracking-widest">Widest (0.1em)</p>
                <p className="text-caption text-muted-foreground mt-1">Maximum letter spacing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Component Classes */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Typography Component Classes</CardTitle>
            <p className="text-body-medium text-muted-foreground">Pre-built typography combinations for consistent usage</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display-1">Display 1 - Hero Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-display-1</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display-2">Display 2 - Section Headers</p>
                <p className="text-caption text-muted-foreground mt-1">text-display-2</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-display-3">Display 3 - Page Titles</p>
                <p className="text-caption text-muted-foreground mt-1">text-display-3</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-heading-1">Heading 1 - Main Headings</p>
                <p className="text-caption text-muted-foreground mt-1">text-heading-1</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-heading-2">Heading 2 - Sub Headings</p>
                <p className="text-caption text-muted-foreground mt-1">text-heading-2</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-heading-3">Heading 3 - Component Titles</p>
                <p className="text-caption text-muted-foreground mt-1">text-heading-3</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body-large">Body Large - Enhanced Readability</p>
                <p className="text-caption text-muted-foreground mt-1">text-body-large</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body-medium">Body Medium - Standard Content</p>
                <p className="text-caption text-muted-foreground mt-1">text-body-medium</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-body-small">Body Small - Compact Information</p>
                <p className="text-caption text-muted-foreground mt-1">text-body-small</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-caption">Caption - Supporting Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-caption</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-label">Label - Form Labels</p>
                <p className="text-caption text-muted-foreground mt-1">text-label</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-button">Button - Button Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-button</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-code">Code - Technical Content</p>
                <p className="text-caption text-muted-foreground mt-1">text-code</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text Color Utilities */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Text Color Utilities</CardTitle>
            <p className="text-body-medium text-muted-foreground">Semantic color system for text elements</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-primary text-lg font-semibold">Primary Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-primary</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-secondary text-lg font-semibold">Secondary Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-secondary</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted text-lg font-semibold">Muted Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-muted</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-accent text-lg font-semibold">Accent Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-accent</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-success text-lg font-semibold">Success Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-success</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-warning text-lg font-semibold">Warning Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-warning</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-info text-lg font-semibold">Info Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-info</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-destructive text-lg font-semibold">Destructive Text</p>
                <p className="text-caption text-muted-foreground mt-1">text-destructive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link and Emphasis Styles */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Link and Emphasis Styles</CardTitle>
            <p className="text-body-medium text-muted-foreground">Special text styles for links and emphasis</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-heading-3">Link Styles</h3>
                <div className="space-y-3">
                  <a href="#" className="text-link text-lg">Primary Link Style</a>
                  <p className="text-caption text-muted-foreground">text-link</p>
                  
                  <a href="#" className="text-link-muted text-lg">Muted Link Style</a>
                  <p className="text-caption text-muted-foreground">text-link-muted</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-heading-3">Emphasis Styles</h3>
                <div className="space-y-3">
                  <p className="text-emphasis text-lg">Emphasis Text Style</p>
                  <p className="text-caption text-muted-foreground">text-emphasis</p>
                  
                  <p className="text-subtle text-lg">Subtle Text Style</p>
                  <p className="text-caption text-muted-foreground">text-subtle</p>
                  
                  <p className="text-muted text-lg">Muted Text Style</p>
                  <p className="text-caption text-muted-foreground">text-muted</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Usage Examples</CardTitle>
            <p className="text-body-medium text-muted-foreground">Common patterns and combinations</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-heading-3">Article Layout</h3>
                <article className="space-y-4">
                  <h1 className="text-display-2">Article Title</h1>
                  <p className="text-body-large text-muted-foreground">Article subtitle with enhanced readability</p>
                  <p className="text-body-medium">This is the main content of the article. It uses the body-medium class for optimal readability and consistent spacing.</p>
                  <p className="text-body-medium">The typography system ensures that all text elements maintain proper hierarchy and visual balance throughout the content.</p>
                </article>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-heading-3">Component Example</h3>
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <h4 className="text-heading-3">Component Title</h4>
                  <p className="text-body-small">Component description with smaller text for supporting information.</p>
                  <div className="flex items-center space-x-2">
                    <Badge className="text-caption">Label</Badge>
                    <Badge variant="outline" className="text-caption">Status</Badge>
                  </div>
                  <button className="text-button bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                    Action Button
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Typography;
