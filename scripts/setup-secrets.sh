#!/bin/bash

# GitHub Secrets Setup Helper
# This script helps you set up the required GitHub secrets for the CI/CD pipeline

echo "🔐 GitHub Secrets Setup Helper"
echo "=============================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed."
    echo "Please install it: https://cli.github.com/"
    echo "Or set secrets manually in GitHub UI: Settings > Secrets and variables > Actions"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Get current repository
REPO=$(gh repo view --json owner,name --jq '.owner.login + "/" + .name')
echo "📦 Current repository: $REPO"
echo ""

echo "Required secrets for CI/CD:"
echo "- SUPABASE_URL: Your Supabase project URL"
echo "- SUPABASE_ANON_KEY: Your Supabase anonymous key"
echo "- VM_HOST: Your AWS EC2 public IP (e.g., 13.200.158.181)"
echo "- VM_USER: SSH username for your EC2 instance (usually 'ubuntu')"
echo "- VM_SSH_KEY: Your private SSH key content"
echo "- VM_SSH_PORT: SSH port (optional, defaults to 22)"
echo ""

read -p "Do you want to set these secrets now? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "To set secrets manually, go to:"
    echo "https://github.com/$REPO/settings/secrets/actions"
    exit 0
fi

echo ""
echo "🔧 Setting up secrets..."

# Function to set a secret
set_secret() {
    local name=$1
    local description=$2
    local is_multiline=${3:-false}
    
    echo ""
    echo "Setting $name ($description):"
    
    if [ "$is_multiline" = true ]; then
        echo "Enter/paste the value (press Ctrl+D when done):"
        value=$(cat)
    else
        read -s -p "Enter value: " value
        echo ""
    fi
    
    if [ -z "$value" ]; then
        echo "⚠️ Skipping empty value for $name"
        return
    fi
    
    if echo "$value" | gh secret set "$name"; then
        echo "✅ Set $name"
    else
        echo "❌ Failed to set $name"
    fi
}

# Set each secret
set_secret "SUPABASE_URL" "Your Supabase project URL"
set_secret "SUPABASE_ANON_KEY" "Your Supabase anonymous key" 
set_secret "VM_HOST" "Your AWS EC2 public IP"
set_secret "VM_USER" "SSH username (usually 'ubuntu')"
set_secret "VM_SSH_KEY" "Your private SSH key content" true
set_secret "VM_SSH_PORT" "SSH port (optional, defaults to 22)"

echo ""
echo "🎉 Secrets setup complete!"
echo ""
echo "To test the setup:"
echo "1. Create a PR to main branch"
echo "2. Check the PR validation workflow runs"
echo "3. Merge the PR to trigger deployment"
echo ""
echo "GitHub Actions: https://github.com/$REPO/actions"
