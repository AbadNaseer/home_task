# Terraform infra (learning-focused)

This folder contains the Terraform configuration used to provision a small
learning environment in AWS: a VPC, a public subnet, a security group, and
a single EC2 instance that runs your Dockerized app via `cloud-init.sh`.

Layout
- `main.tf` - root orchestration: generates a local SSH key, calls modules.
- `variables.tf` - root variables and defaults (free-tier friendly).
- `outputs.tf` - outputs aggregated from modules.
- `cloud-init.sh` - user-data script executed by the EC2 instance at boot.
- `modules/network` - VPC, subnet, IGW, route table, and security group.
- `modules/compute` - EC2 instance + Elastic IP.

Quick start (learning)
1. Configure AWS credentials: `aws configure`
2. Create a safe tfvars file that restricts SSH to your IP:
   - Get your IP: `(Invoke-RestMethod -Uri 'https://ipinfo.io/ip').Trim()`
   - Write `terraform.tfvars` with: `allowed_ssh_cidrs = ["YOUR_IP/32"]`
3. Initialize and plan:
   - `terraform init`
   - `terraform plan -var-file=terraform.tfvars`
4. Apply when ready:
   - `terraform apply -var-file=terraform.tfvars`

Cleanup
- `terraform destroy -var-file=terraform.tfvars` (removes resources)

Notes for learners
- This project intentionally keeps secrets and a private key in the module
  folder for convenience. Do not commit private keys to git in real projects.
