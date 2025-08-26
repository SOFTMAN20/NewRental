
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Core Design System Colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Enhanced Primary Color System
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: 'hsl(var(--primary) / 0.05)',
					100: 'hsl(var(--primary) / 0.1)',
					200: 'hsl(var(--primary) / 0.2)',
					300: 'hsl(var(--primary) / 0.3)',
					400: 'hsl(var(--primary) / 0.4)',
					500: 'hsl(var(--primary) / 0.5)',
					600: 'hsl(var(--primary) / 0.6)',
					700: 'hsl(var(--primary) / 0.7)',
					800: 'hsl(var(--primary) / 0.8)',
					900: 'hsl(var(--primary) / 0.9)',
				},
				
				// Enhanced Secondary Color System
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					50: 'hsl(var(--secondary) / 0.05)',
					100: 'hsl(var(--secondary) / 0.1)',
					200: 'hsl(var(--secondary) / 0.2)',
					300: 'hsl(var(--secondary) / 0.3)',
					400: 'hsl(var(--secondary) / 0.4)',
					500: 'hsl(var(--secondary) / 0.5)',
					600: 'hsl(var(--secondary) / 0.6)',
					700: 'hsl(var(--secondary) / 0.7)',
					800: 'hsl(var(--secondary) / 0.8)',
					900: 'hsl(var(--secondary) / 0.9)',
				},
				
				// Enhanced Destructive Color System
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
					50: 'hsl(var(--destructive) / 0.05)',
					100: 'hsl(var(--destructive) / 0.1)',
					200: 'hsl(var(--destructive) / 0.2)',
					300: 'hsl(var(--destructive) / 0.3)',
					400: 'hsl(var(--destructive) / 0.4)',
					500: 'hsl(var(--destructive) / 0.5)',
					600: 'hsl(var(--destructive) / 0.6)',
					700: 'hsl(var(--destructive) / 0.7)',
					800: 'hsl(var(--destructive) / 0.8)',
					900: 'hsl(var(--destructive) / 0.9)',
				},
				
				// Enhanced Muted Color System
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
					50: 'hsl(var(--muted) / 0.05)',
					100: 'hsl(var(--muted) / 0.1)',
					200: 'hsl(var(--muted) / 0.2)',
					300: 'hsl(var(--muted) / 0.3)',
					400: 'hsl(var(--muted) / 0.4)',
					500: 'hsl(var(--muted) / 0.5)',
					600: 'hsl(var(--muted) / 0.6)',
					700: 'hsl(var(--muted) / 0.7)',
					800: 'hsl(var(--muted) / 0.8)',
					900: 'hsl(var(--muted) / 0.9)',
				},
				
				// Enhanced Accent Color System
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					50: 'hsl(var(--accent) / 0.05)',
					100: 'hsl(var(--accent) / 0.1)',
					200: 'hsl(var(--accent) / 0.2)',
					300: 'hsl(var(--accent) / 0.3)',
					400: 'hsl(var(--accent) / 0.4)',
					500: 'hsl(var(--accent) / 0.5)',
					600: 'hsl(var(--accent) / 0.6)',
					700: 'hsl(var(--accent) / 0.7)',
					800: 'hsl(var(--accent) / 0.8)',
					900: 'hsl(var(--accent) / 0.9)',
				},
				
				// Enhanced Popover Color System
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
					50: 'hsl(var(--popover) / 0.05)',
					100: 'hsl(var(--popover) / 0.1)',
					200: 'hsl(var(--popover) / 0.2)',
					300: 'hsl(var(--popover) / 0.3)',
					400: 'hsl(var(--popover) / 0.4)',
					500: 'hsl(var(--popover) / 0.5)',
					600: 'hsl(var(--popover) / 0.6)',
					700: 'hsl(var(--popover) / 0.7)',
					800: 'hsl(var(--popover) / 0.8)',
					900: 'hsl(var(--popover) / 0.9)',
				},
				
				// Enhanced Card Color System
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					50: 'hsl(var(--card) / 0.05)',
					100: 'hsl(var(--card) / 0.1)',
					200: 'hsl(var(--card) / 0.2)',
					300: 'hsl(var(--card) / 0.3)',
					400: 'hsl(var(--card) / 0.4)',
					500: 'hsl(var(--card) / 0.5)',
					600: 'hsl(var(--card) / 0.6)',
					700: 'hsl(var(--card) / 0.7)',
					800: 'hsl(var(--card) / 0.8)',
					900: 'hsl(var(--card) / 0.9)',
				},
				
				// Enhanced Sidebar Color System
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},
				
				// Enhanced Semantic Color System
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
					light: 'hsl(var(--success-light))',
					dark: 'hsl(var(--success-dark))',
					50: 'hsl(var(--success) / 0.05)',
					100: 'hsl(var(--success) / 0.1)',
					200: 'hsl(var(--success) / 0.2)',
					300: 'hsl(var(--success) / 0.3)',
					400: 'hsl(var(--success) / 0.4)',
					500: 'hsl(var(--success) / 0.5)',
					600: 'hsl(var(--success) / 0.6)',
					700: 'hsl(var(--success) / 0.7)',
					800: 'hsl(var(--success) / 0.8)',
					900: 'hsl(var(--success) / 0.9)',
				},
				
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
					light: 'hsl(var(--warning-light))',
					dark: 'hsl(var(--warning-dark))',
					50: 'hsl(var(--warning) / 0.05)',
					100: 'hsl(var(--warning) / 0.1)',
					200: 'hsl(var(--warning) / 0.2)',
					300: 'hsl(var(--warning) / 0.3)',
					400: 'hsl(var(--warning) / 0.4)',
					500: 'hsl(var(--warning) / 0.5)',
					600: 'hsl(var(--warning) / 0.6)',
					700: 'hsl(var(--warning) / 0.7)',
					800: 'hsl(var(--warning) / 0.8)',
					900: 'hsl(var(--warning) / 0.9)',
				},
				
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))',
					light: 'hsl(var(--info-light))',
					dark: 'hsl(var(--info-dark))',
					50: 'hsl(var(--info) / 0.05)',
					100: 'hsl(var(--info) / 0.1)',
					200: 'hsl(var(--info) / 0.2)',
					300: 'hsl(var(--info) / 0.3)',
					400: 'hsl(var(--info) / 0.4)',
					500: 'hsl(var(--info) / 0.5)',
					600: 'hsl(var(--info) / 0.6)',
					700: 'hsl(var(--info) / 0.7)',
					800: 'hsl(var(--info) / 0.8)',
					900: 'hsl(var(--info) / 0.9)',
				},
				
				error: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
					light: 'hsl(var(--error-light))',
					dark: 'hsl(var(--error-dark))',
					50: 'hsl(var(--destructive) / 0.05)',
					100: 'hsl(var(--destructive) / 0.1)',
					200: 'hsl(var(--destructive) / 0.2)',
					300: 'hsl(var(--destructive) / 0.3)',
					400: 'hsl(var(--destructive) / 0.4)',
					500: 'hsl(var(--destructive) / 0.5)',
					600: 'hsl(var(--destructive) / 0.6)',
					700: 'hsl(var(--destructive) / 0.7)',
					800: 'hsl(var(--destructive) / 0.8)',
					900: 'hsl(var(--destructive) / 0.9)',
				},
				
				// Enhanced Neutral Color System
				neutral: {
					DEFAULT: 'hsl(var(--neutral))',
					foreground: 'hsl(var(--neutral-foreground))',
					50: 'hsl(var(--neutral) / 0.05)',
					100: 'hsl(var(--neutral) / 0.1)',
					200: 'hsl(var(--neutral) / 0.2)',
					300: 'hsl(var(--neutral) / 0.3)',
					400: 'hsl(var(--neutral) / 0.4)',
					500: 'hsl(var(--neutral) / 0.5)',
					600: 'hsl(var(--neutral) / 0.6)',
					700: 'hsl(var(--neutral) / 0.7)',
					800: 'hsl(var(--neutral) / 0.8)',
					900: 'hsl(var(--neutral) / 0.9)',
				},
				
				// Enhanced Tanzanian-inspired colors with HSL values
				safari: {
					50: 'hsl(var(--safari-50))',
					100: 'hsl(var(--safari-100))',
					200: 'hsl(var(--safari-200))',
					300: 'hsl(var(--safari-300))',
					400: 'hsl(var(--safari-400))',
					500: 'hsl(var(--safari-500))',
					600: 'hsl(var(--safari-600))',
					700: 'hsl(var(--safari-700))',
					800: 'hsl(var(--safari-800))',
					900: 'hsl(var(--safari-900))'
				},
				
				kilimanjaro: {
					50: 'hsl(var(--kilimanjaro-50))',
					100: 'hsl(var(--kilimanjaro-100))',
					200: 'hsl(var(--kilimanjaro-200))',
					300: 'hsl(var(--kilimanjaro-300))',
					400: 'hsl(var(--kilimanjaro-400))',
					500: 'hsl(var(--kilimanjaro-500))',
					600: 'hsl(var(--kilimanjaro-600))',
					700: 'hsl(var(--kilimanjaro-700))',
					800: 'hsl(var(--kilimanjaro-800))',
					900: 'hsl(var(--kilimanjaro-900))'
				},
				
				serengeti: {
					50: 'hsl(var(--serengeti-50))',
					100: 'hsl(var(--serengeti-100))',
					200: 'hsl(var(--serengeti-200))',
					300: 'hsl(var(--serengeti-300))',
					400: 'hsl(var(--serengeti-400))',
					500: 'hsl(var(--serengeti-500))',
					600: 'hsl(var(--serengeti-600))',
					700: 'hsl(var(--serengeti-700))',
					800: 'hsl(var(--serengeti-800))',
					900: 'hsl(var(--serengeti-900))'
				}
			},
			
			// Enhanced Border Radius System
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 2px)',
				'2xl': 'calc(var(--radius) + 4px)',
				'3xl': 'calc(var(--radius) + 8px)',
			},
			
			// Enhanced Keyframes System
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'bounce-in': {
					'0%': { opacity: '0', transform: 'scale(0.3)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-down': {
					'0%': { opacity: '0', transform: 'translateY(-30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			
			// Enhanced Animation System
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in': 'slide-in 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'slide-down': 'slide-down 0.5s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s ease-in-out infinite',
			},
			
			// Enhanced Spacing System
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			
			// Enhanced Font Size System
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			
			// Enhanced Box Shadow System
			boxShadow: {
				'soft': '0 2px 8px hsl(var(--foreground) / 0.05)',
				'medium': '0 4px 16px hsl(var(--foreground) / 0.08)',
				'strong': '0 8px 32px hsl(var(--foreground) / 0.12)',
				'colored': '0 4px 16px hsl(var(--primary) / 0.15)',
				'inner-soft': 'inset 0 2px 4px hsl(var(--foreground) / 0.05)',
				'glow': '0 0 20px hsl(var(--primary) / 0.3)',
				'glow-success': '0 0 20px hsl(var(--success) / 0.3)',
				'glow-warning': '0 0 20px hsl(var(--warning) / 0.3)',
				'glow-info': '0 0 20px hsl(var(--info) / 0.3)',
				'glow-error': '0 0 20px hsl(var(--destructive) / 0.3)',
			},
			
			// Enhanced Backdrop Blur System
			backdropBlur: {
				xs: '2px',
				'4xl': '72px',
			},
			
			// Enhanced Z-Index System
			zIndex: {
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
