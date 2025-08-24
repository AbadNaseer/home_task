/* ---------------------------------------------------------------------------
   Compute module

   Purpose: create a single EC2 instance for learning deployments and attach
   an Elastic IP to make the instance reachable at a stable public IP. This
   module intentionally keeps compute concerns separate from network.

   Learning notes:
   - The module selects the latest Ubuntu AMI maintained by Canonical.
   - `user_data` references the `cloud-init.sh` file at repository root so
     the instance bootstraps itself (installs Docker, docker-compose, etc.).
   - The module exposes `instance_public_ip` and `instance_public_dns` so
     the root module can show a convenient application URL.
--------------------------------------------------------------------------- */

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "security_group_ids" {
  type = list(string)
}

variable "key_name" {
  type = string
}

variable "root_block_device" {
  type = map(any)
  default = {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = true
  }
}

# Fetch a recent Ubuntu 22.04 AMI from Canonical; using 'most_recent'
# keeps the image current for learning but may change the AMI ID over time.
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 instance: lightweight, free-tier friendly by default
resource "aws_instance" "main" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = var.security_group_ids
  subnet_id              = var.subnet_id
  user_data              = file("${path.root}/cloud-init.sh")

  root_block_device {
    volume_type = var.root_block_device["volume_type"]
    volume_size = var.root_block_device["volume_size"]
    encrypted   = var.root_block_device["encrypted"]
  }

  tags = {
    Name        = "${var.project_name}-server"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Elastic IP: keeps a stable public IP for quick SSH and testing.
# Note: EIPs can have small charges if not used within free-tier limits.
resource "aws_eip" "main" {
  domain   = "vpc"
  instance = aws_instance.main.id

  tags = {
    Name        = "${var.project_name}-eip"
    Environment = var.environment
    Project     = var.project_name
  }

  depends_on = [aws_instance.main]
}

output "instance_id" {
  value = aws_instance.main.id
}

output "instance_public_ip" {
  value = aws_eip.main.public_ip
}

output "instance_public_dns" {
  value = aws_eip.main.public_dns
}
