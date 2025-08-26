/**
 * LOADINGSTATES.TSX - LOADING STATES & ANIMATIONS DEMONSTRATION COMPONENT
 * =====================================================================
 * 
 * Kipengele cha kuonyesha hali za upakiaji na animations - Loading states and animations demonstration component
 * 
 * PURPOSE / MADHUMUNI:
 * This component showcases the comprehensive loading states and animation system, including:
 * - Skeleton loaders for different content types
 * - Loading spinners and progress indicators
 * - Page transition animations
 * - Micro-interactions and hover effects
 * - Shimmer effects and pulse animations
 * - Loading state management patterns
 * 
 * USAGE / MATUMIZI:
 * - Development reference for designers and developers
 * - Loading state system documentation
 * - Animation showcase and testing
 * - UX pattern examples
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const LoadingStates: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsLoading(false);
            setShowContent(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [isLoading]);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
    setShowContent(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-display-1 bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent mb-4">
            Loading States & Animations
          </h1>
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
            A comprehensive system for loading states, skeleton loaders, and smooth animations.
            Designed to enhance user experience and provide clear visual feedback.
          </p>
        </div>

        {/* Interactive Demo */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Interactive Loading Demo</CardTitle>
            <p className="text-body-medium text-muted-foreground">Click the button to see loading states in action</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button 
                onClick={startLoading} 
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-serengeti-500 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? 'Loading...' : 'Start Loading Demo'}
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-4 animate-fade-in">
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-serengeti-500 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-body-medium text-muted-foreground">
                  Loading... {progress}%
                </p>
              </div>
            )}

            {showContent && (
              <div className="animate-scale-in p-6 bg-success/10 border border-success/20 rounded-lg">
                <h3 className="text-heading-3 text-success mb-2">Content Loaded Successfully!</h3>
                <p className="text-body-medium text-success/80">
                  This content appeared with a smooth scale-in animation after the loading completed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skeleton Loaders */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Skeleton Loaders</CardTitle>
            <p className="text-body-medium text-muted-foreground">Placeholder content while data is loading</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Card Skeleton */}
            <div>
              <h3 className="text-heading-3 mb-4">Card Skeleton</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3 animate-pulse">
                    <div className="h-48 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List Skeleton */}
            <div>
              <h3 className="text-heading-3 mb-4">List Skeleton</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Skeleton */}
            <div>
              <h3 className="text-heading-3 mb-4">Table Skeleton</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4">
                  <div className="h-4 bg-background rounded w-1/3"></div>
                </div>
                <div className="divide-y">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 flex items-center space-x-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/6"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-4 bg-muted rounded w-1/5"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Skeleton */}
            <div>
              <h3 className="text-heading-3 mb-4">Form Skeleton</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
                <div className="h-10 bg-muted rounded w-24"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Spinners */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Loading Spinners</CardTitle>
            <p className="text-body-medium text-muted-foreground">Different types of loading indicators</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Circular Spinner */}
              <div className="text-center space-y-3">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                <p className="text-caption">Circular Spinner</p>
              </div>

              {/* Dots Spinner */}
              <div className="text-center space-y-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-caption">Dots Spinner</p>
              </div>

              {/* Pulse Spinner */}
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary rounded-full animate-pulse-soft"></div>
                <p className="text-caption">Pulse Spinner</p>
              </div>

              {/* Shimmer Spinner */}
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-muted via-primary/20 to-muted rounded-lg animate-shimmer"></div>
                <p className="text-caption">Shimmer Spinner</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicators */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Progress Indicators</CardTitle>
            <p className="text-body-medium text-muted-foreground">Different types of progress feedback</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Linear Progress */}
            <div className="space-y-3">
              <h3 className="text-heading-3">Linear Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Basic Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Gradient Progress</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-gradient-to-r from-primary to-serengeti-500 h-3 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Striped Progress</span>
                    <span>90%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-success h-2 transition-all duration-300" style={{ width: '90%' }}>
                      <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="space-y-3">
              <h3 className="text-heading-3">Circular Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.75)}`}
                        className="text-primary transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute text-lg font-semibold">75%</span>
                  </div>
                  <p className="text-caption">Primary Progress</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.45)}`}
                        className="text-success transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute text-lg font-semibold">45%</span>
                  </div>
                  <p className="text-caption">Success Progress</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.25)}`}
                        className="text-warning transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute text-lg font-semibold">25%</span>
                  </div>
                  <p className="text-caption">Warning Progress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Utilities */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Animation Utilities</CardTitle>
            <p className="text-body-medium text-muted-foreground">Pre-built animation classes for common effects</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Fade In */}
              <div className="text-center space-y-3">
                <div className="h-24 bg-primary rounded-lg animate-fade-in flex items-center justify-center text-white font-semibold">
                  Fade In
                </div>
                <p className="text-caption">animate-fade-in</p>
              </div>

              {/* Scale In */}
              <div className="text-center space-y-3">
                <div className="h-24 bg-success rounded-lg animate-scale-in flex items-center justify-center text-white font-semibold">
                  Scale In
                </div>
                <p className="text-caption">animate-scale-in</p>
              </div>

              {/* Slide Up */}
              <div className="text-center space-y-3">
                <div className="h-24 bg-warning rounded-lg animate-slide-up flex items-center justify-center text-white font-semibold">
                  Slide Up
                </div>
                <p className="text-caption">animate-slide-up</p>
              </div>

              {/* Bounce In */}
              <div className="text-center space-y-3">
                <div className="h-24 bg-info rounded-lg animate-bounce-in flex items-center justify-center text-white font-semibold">
                  Bounce In
                </div>
                <p className="text-caption">animate-bounce-in</p>
              </div>

              {/* Pulse Soft */}
              <div className="text-center space-y-3">
                <div className="h-24 bg-serengeti-500 rounded-lg animate-pulse-soft flex items-center justify-center text-white font-semibold">
                  Pulse Soft
                </div>
                <p className="text-caption">animate-pulse-soft</p>
              </div>

              {/* Shimmer */}
              <div className="text-center space-y-3">
                <div className="h-24 bg-kilimanjaro-500 rounded-lg animate-shimmer flex items-center justify-center text-white font-semibold">
                  Shimmer
                </div>
                <p className="text-caption">animate-shimmer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Micro-interactions */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Micro-interactions</CardTitle>
            <p className="text-body-medium text-muted-foreground">Subtle animations for better user feedback</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hover Effects */}
              <div className="space-y-4">
                <h3 className="text-heading-3">Hover Effects</h3>
                <div className="space-y-3">
                  <button className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                    Hover to Scale
                  </button>
                  
                  <button className="w-full bg-success text-success-foreground py-3 px-6 rounded-lg transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    Hover to Lift
                  </button>
                  
                  <button className="w-full bg-warning text-warning-foreground py-3 px-6 rounded-lg hover:bg-warning/90 hover:shadow-md transition-all duration-300">
                    Hover to Glow
                  </button>
                </div>
              </div>

              {/* Focus States */}
              <div className="space-y-4">
                <h3 className="text-heading-3">Focus States</h3>
                <div className="space-y-3">
                  <button className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg focus-ring-primary focus:outline-none transition-all duration-300">
                    Focus Me (Primary)
                  </button>
                  
                  <button className="w-full bg-success text-success-foreground py-3 px-6 rounded-lg focus-ring-success focus:outline-none transition-all duration-300">
                    Focus Me (Success)
                  </button>
                  
                  <button className="w-full bg-warning text-warning-foreground py-3 px-6 rounded-lg focus-ring-warning focus:outline-none transition-all duration-300">
                    Focus Me (Warning)
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page Transitions */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Page Transitions</CardTitle>
            <p className="text-body-medium text-muted-foreground">Smooth transitions between different states</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Loading */}
              <div className="space-y-4">
                <h3 className="text-heading-3">Content Loading</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg animate-fade-in">
                    <h4 className="text-heading-3 mb-2">Content Loaded</h4>
                    <p className="text-body-small">This content appeared with a fade-in animation.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-slide-up">
                    <h4 className="text-heading-3 mb-2">Sliding Content</h4>
                    <p className="text-body-small">This content slid up from below.</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg animate-scale-in">
                    <h4 className="text-heading-3 mb-2">Scaled Content</h4>
                    <p className="text-body-small">This content scaled in smoothly.</p>
                  </div>
                </div>
              </div>

              {/* State Changes */}
              <div className="space-y-4">
                <h3 className="text-heading-3">State Changes</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg animate-fade-in">
                    <h4 className="text-heading-3 text-success mb-2">Success State</h4>
                    <p className="text-body-small text-success/80">Operation completed successfully!</p>
                  </div>
                  
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg animate-slide-up">
                    <h4 className="text-heading-3 text-warning mb-2">Warning State</h4>
                    <p className="text-body-small text-warning/80">Please review your input.</p>
                  </div>
                  
                  <div className="p-4 bg-info/10 border border-info/20 rounded-lg animate-scale-in">
                    <h4 className="text-heading-3 text-info mb-2">Info State</h4>
                    <p className="text-body-small text-info/80">Here's some helpful information.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-heading-1">Best Practices</CardTitle>
            <p className="text-body-medium text-muted-foreground">Guidelines for implementing loading states and animations</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-heading-3">Loading States</h3>
                <ul className="space-y-2 text-body-small text-muted-foreground">
                  <li>• Always show loading indicators for async operations</li>
                  <li>• Use skeleton loaders for content that takes time to load</li>
                  <li>• Provide progress feedback for long-running operations</li>
                  <li>• Keep loading states consistent across the application</li>
                  <li>• Use appropriate loading times (not too fast, not too slow)</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-heading-3">Animations</h3>
                <ul className="space-y-2 text-body-small text-muted-foreground">
                  <li>• Keep animations subtle and purposeful</li>
                  <li>• Use consistent timing and easing functions</li>
                  <li>• Respect user preferences for reduced motion</li>
                  <li>• Ensure animations don't interfere with functionality</li>
                  <li>• Test animations on different devices and connections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadingStates;
