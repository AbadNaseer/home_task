#!/bin/bash

# GitHub Self-Hosted Runner Setup Script
# Run this on your EC2 instance (52.55.88.75)

set -e

echo "🚀 Setting up GitHub Self-Hosted Runner"
echo "======================================="

# Update system
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker (if not already installed)
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    sudo systemctl enable docker
    sudo systemctl start docker
fi

# Install Node.js (for building Next.js apps)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "📦 Installing GitHub CLI..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt-get update
    sudo apt-get install gh -y
fi

# Create runner user
sudo useradd -m -s /bin/bash runner || true
sudo usermod -aG docker runner

# Create runner directory
sudo mkdir -p /opt/actions-runner
sudo chown runner:runner /opt/actions-runner

# Switch to runner user and setup
sudo -u runner bash << 'EOF'
cd /opt/actions-runner

# Download latest runner
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -o '"tag_name": "v[^"]*' | cut -d'"' -f4 | cut -c2-)
curl -o actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz -L https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# Extract runner
tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# Make executable
chmod +x ./config.sh
chmod +x ./run.sh
EOF

echo ""
echo "✅ Runner setup complete!"
echo ""
echo "🔑 Next steps:"
echo "1. Get a registration token from GitHub:"
echo "   Go to: https://github.com/AbadNaseer/home_task/settings/actions/runners"
echo "   Click 'New self-hosted runner' → Linux x64"
echo "   Copy the token from the configure command"
echo ""
echo "2. Configure the runner:"
echo "   sudo -u runner bash"
echo "   cd /opt/actions-runner"
echo "   ./config.sh --url https://github.com/AbadNaseer/home_task --token YOUR_TOKEN_HERE"
echo ""
echo "3. Install as service:"
echo "   sudo ./svc.sh install runner"
echo "   sudo ./svc.sh start"
echo ""
echo "4. Verify runner is online at:"
echo "   https://github.com/AbadNaseer/home_task/settings/actions/runners"
