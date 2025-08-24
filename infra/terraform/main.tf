# -----------------------------------------------------------------------------
# Root Terraform module
# This file is the root entrypoint for provisioning infrastructure for the
# project. It keeps only the orchestration logic and lightweight resources
# (local key generation and module calls). Heavy lifting (network + compute)
# lives in the modules directory.
#
# Purpose:
# - Generate a local SSH key pair (private key is written to the module path).
# - Create an AWS Key Pair using the generated public key.
# - Call the 'network' module (VPC, subnet, IGW, SG).
# - Call the 'compute' module (EC2 + EIP) and wire module outputs to root outputs.
#
# Learning tips:
# - Inspect files in `modules/network` and `modules/compute` to understand
#   how the logical components map to real AWS resources.
# - Keep secrets out of user-data and code; the root module writes a private
#   key file for convenience during learning but in production use a secure
#   secret manager and avoid committing keys.
# -----------------------------------------------------------------------------
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

/* Provider is declared in providers.tf for clarity. */

# Generate SSH key pair locally (private key saved to module path)
resource "tls_private_key" "main" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key" {
  content         = tls_private_key.main.private_key_pem
  filename        = "${path.module}/${var.project_name}-key.pem"
  file_permission = "0600"
}

# Create an AWS key pair using the generated public key
resource "aws_key_pair" "main" {
  key_name   = "${var.project_name}-key"
  public_key = tls_private_key.main.public_key_openssh

  tags = {
    Name        = "${var.project_name}-key"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Network module: VPC, subnet, IGW, route table, security group
module "network" {
  source = "./modules/network"

  project_name      = var.project_name
  environment       = var.environment
  aws_region        = var.aws_region
  vpc_cidr          = var.vpc_cidr
  public_subnet_cidr = var.public_subnet_cidr
  allowed_ssh_cidrs = var.allowed_ssh_cidrs
}

# Compute module: EC2 instance + EIP
module "compute" {
  source = "./modules/compute"

  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region

  instance_type      = var.instance_type
  subnet_id          = module.network.public_subnet_id
  security_group_ids = [module.network.security_group_id]
  key_name           = aws_key_pair.main.key_name
  root_block_device  = var.root_block_device
}

output "private_key_path" {
  description = "Path to the private key file"
  value       = local_file.private_key.filename
  sensitive   = true
}
