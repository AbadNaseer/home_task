# GitHub Secrets Setup Guide

This guide helps you configure the required secrets for the CI/CD pipeline.

## Required Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### 1. Supabase Configuration
```
Name: SUPABASE_URL
Value: https://your-project-id.supabase.co

Name: SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key...
```

### 2. AWS Credentials (for Terraform in CI/CD)
```
Name: AWS_ACCESS_KEY_ID
Value: AKIA...

Name: AWS_SECRET_ACCESS_KEY
Value: your-secret-access-key
```

### 3. VM Access (for deployment)
```
Name: VM_HOST
Value: 13.200.158.181

Name: VM_USER
Value: ubuntu

Name: VM_SSH_KEY
Value: -----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
[paste entire contents of team-tasks-key.pem file]
...
-----END RSA PRIVATE KEY-----

Name: VM_SSH_PORT (optional)
Value: 22
```

## How to Get These Values

### Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

### SSH Private Key
Your private key is located at:
```
infra/terraform/team-tasks-key.pem
```

**Important**: 
- Copy the ENTIRE file content including `-----BEGIN` and `-----END` lines
- Keep the exact formatting and line breaks
- This key is generated automatically by Terraform

### VM Host
Your EC2 public IP from Terraform output:
```bash
cd infra/terraform
terraform output instance_public_ip
```

## Verification

After setting up secrets, you can test:

1. **Push to staging branch**: Triggers validation only
2. **Create PR to main**: Triggers validation
3. **Merge to main**: Triggers validation + deployment

## Security Notes

- ✅ Never commit `.env.local` or `terraform.tfvars` 
- ✅ SSH key is used only for deployment, never stored in code
- ✅ Supabase keys are environment-specific
- ✅ All secrets are encrypted by GitHub

## Troubleshooting

### Common Issues

**SSH Connection Failed**
- Verify VM_HOST is correct (get from `terraform output`)
- Ensure VM_SSH_KEY includes BEGIN/END lines
- Check security group allows SSH from GitHub Actions IPs

**Supabase Connection Failed** 
- Verify SUPABASE_URL format (should include https://)
- Check SUPABASE_ANON_KEY is the public anon key (not service role)
- Ensure RLS policies allow the operations

**Docker Image Pull Failed**
- GitHub Actions automatically handles GHCR authentication
- Check if repository is public or if GITHUB_TOKEN has correct permissions
