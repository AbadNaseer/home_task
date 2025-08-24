# Sensitive Data Management Strategy

## 🔐 Where to Store Sensitive Data

### **1. GitHub Secrets (Current Setup)**
✅ **Best for CI/CD secrets**
- SUPABASE_URL
- SUPABASE_ANON_KEY
- VM_HOST, VM_USER, VM_SSH_KEY
- Database passwords
- API keys

### **2. Environment Variables on EC2**
✅ **Best for runtime secrets**
```bash
# Create /opt/app/.env (on your EC2)
sudo mkdir -p /opt/app
sudo tee /opt/app/.env << EOF
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-db-url
NEXTAUTH_SECRET=your-secret
EOF
sudo chmod 600 /opt/app/.env
sudo chown runner:runner /opt/app/.env
```

### **3. AWS Systems Manager Parameter Store**
✅ **Best for scalable secret management**
```bash
# Store secrets in Parameter Store
aws ssm put-parameter \
    --name "/teamtasks/supabase/url" \
    --value "https://your-project.supabase.co" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/teamtasks/supabase/key" \
    --value "your-anon-key" \
    --type "SecureString"
```

### **4. HashiCorp Vault (Enterprise)**
✅ **Best for complex organizations**
- Dynamic secrets
- Secret rotation
- Audit logging
- Fine-grained access control

## 🏗️ Recommended Architecture

```
GitHub Actions (CI/CD)
├── GitHub Secrets (CI/CD keys, tokens)
│
EC2 Self-Hosted Runner
├── Environment Files (/opt/app/.env)
├── Docker Secrets (runtime)
└── AWS Parameter Store (scalable secrets)
```

## 🔄 Migration Strategy

### **Phase 1: Current (GitHub Secrets)**
- Keep using GitHub secrets for CI/CD
- Simple and secure for small teams

### **Phase 2: Hybrid (GitHub + Environment)**
- CI/CD secrets in GitHub
- Runtime secrets in environment files
- Better separation of concerns

### **Phase 3: Enterprise (Parameter Store/Vault)**
- Centralized secret management
- Secret rotation
- Audit logging
- Multiple environments

## 🛡️ Security Best Practices

### **1. Never Commit Secrets**
```bash
# .gitignore (already configured)
.env
.env.local
.env.production
*.pem
terraform.tfvars
```

### **2. Rotate Secrets Regularly**
- GitHub tokens: Every 90 days
- Database passwords: Every 30 days
- SSH keys: Every 6 months

### **3. Use Least Privilege**
- Separate read/write permissions
- Environment-specific keys
- Limited scope tokens

### **4. Monitor Secret Usage**
- AWS CloudTrail for Parameter Store
- GitHub Actions logs
- Application logging (without values!)

## 📋 Implementation Checklist

- [ ] Set up self-hosted runner
- [ ] Configure GitHub secrets
- [ ] Create environment files on EC2
- [ ] Test CI/CD pipeline
- [ ] Set up monitoring
- [ ] Document secret rotation process
