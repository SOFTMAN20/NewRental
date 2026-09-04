#!/bin/bash

# 🚀 Quick Deploy to wanachuo.com
# Run this script to deploy your React app

echo "🚀 Deploying Wanachuo.com..."
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the app first
echo "📦 Building app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ DEPLOYMENT SUCCESSFUL!"
        echo ""
        echo "📝 Next steps:"
        echo "1. Add domain: vercel domains add wanachuo.com"
        echo "2. Configure DNS at your registrar"
        echo "3. Visit: https://wanachuo.com"
        echo ""
    else
        echo "❌ Deployment failed. Please check the errors above."
    fi
else
    echo "❌ Build failed. Please fix errors and try again."
fi
