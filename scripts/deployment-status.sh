#!/bin/bash

# Deployment monitoring script
# Run this on your self-hosted runner to monitor deployments

echo "📊 Team Tasks Deployment Status"
echo "==============================="
echo "Time: $(date)"
echo "Host: $(hostname)"
echo "IP: 52.55.88.75"
echo ""

# Check if container is running
if docker ps -q -f name=team-tasks > /dev/null; then
    echo "✅ Container Status: RUNNING"
    
    # Get container details
    echo "📦 Container Details:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" -f name=team-tasks
    echo ""
    
    # Check health status
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' team-tasks 2>/dev/null || echo "unknown")
    echo "💚 Health Status: $HEALTH_STATUS"
    
    # Test endpoints
    echo ""
    echo "🔍 Testing Endpoints:"
    
    # Local health check
    if curl -s -f http://localhost:3000/api/healthz > /dev/null; then
        echo "✅ Local health check: PASS"
    else
        echo "❌ Local health check: FAIL"
    fi
    
    # External health check
    if curl -s -f http://52.55.88.75:3000/api/healthz > /dev/null; then
        echo "✅ External health check: PASS"
    else
        echo "❌ External health check: FAIL"
    fi
    
    # Test main page
    if curl -s -f http://localhost:3000 > /dev/null; then
        echo "✅ Main page: ACCESSIBLE"
    else
        echo "❌ Main page: NOT ACCESSIBLE"
    fi
    
    echo ""
    echo "📊 Container Stats:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" team-tasks
    
    echo ""
    echo "📋 Recent Container Logs:"
    docker logs team-tasks --tail 10
    
else
    echo "❌ Container Status: NOT RUNNING"
    echo ""
    echo "🔍 Checking for recent containers:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}" | head -5
fi

echo ""
echo "🖥️ System Resources:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)% used"
echo "Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5" used)"}')"

echo ""
echo "🐳 Docker Info:"
echo "Images: $(docker images -q | wc -l)"
echo "Containers: $(docker ps -a -q | wc -l)"
echo "Running: $(docker ps -q | wc -l)"

echo ""
echo "🌐 Network Test:"
if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    echo "✅ Internet connectivity: OK"
else
    echo "❌ Internet connectivity: FAILED"
fi

echo ""
echo "📱 Quick Access Links:"
echo "🏠 App: http://52.55.88.75:3000"
echo "💚 Health: http://52.55.88.75:3000/api/healthz"
echo "🔐 Login: http://52.55.88.75:3000/login"
echo ""
