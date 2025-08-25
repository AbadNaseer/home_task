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
Quick start (learning)
1. Configure AWS credentials: `aws configure` or export env vars.
2. Copy `terraform.tfvars.example` -> `terraform.tfvars` and replace YOUR_IP with your public IP (or let the helper script create it):
   - Example: `cp terraform.tfvars.example terraform.tfvars` then edit the file.
3. Use the helper script to detect your IP, init, plan and optionally apply:
   - `.\	erraform\deploy.ps1` (runs interactively)
   - `.\terraform\deploy.ps1 -ProfileName teamtasks -AutoApprove` (non-interactive)

Manual alternative (without the helper):
 - `terraform init`
 - `terraform plan -var-file=terraform.tfvars`
 - `terraform apply -var-file=terraform.tfvars`

Cleanup
- `terraform destroy -var-file=terraform.tfvars` (removes resources)

Notes for learners
- This project intentionally keeps secrets and a private key in the module
  folder for convenience. Do not commit private keys to git in real projects.

IAM quick setup (if your Terraform user lacks EC2/VPC permissions)
- If the `terraform-deployer` user is missing permissions (error mentions ec2:DescribeImages), you can create and attach a minimal policy.
- Run as an admin:
   - `cd infra/terraform/iam`
   - `.
      attach-policy.ps1 -ProfileName admin-profile -UserName terraform-deployer`
   - This creates a `TerraformDeployerEC2VPCPolicy` and attaches it to the user.
   - After that, re-run the deploy helper: `..\deploy.ps1 -ProfileName teamtasks`
