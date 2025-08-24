/* ---------------------------------------------------------------------------
   Network module

   Purpose: create an isolated VPC and supporting networking required for
   the compute resources. This module intentionally keeps only networking
   concerns: VPC, public subnet, Internet Gateway, route table, and a
   security group that will be attached to compute instances.

   Learning notes:
   - VPC: virtual network that isolates resources.
   - Subnet: a CIDR range inside the VPC. We use a public subnet for simple
     learn-by-doing deployments.
   - IGW + route table: required for Internet connectivity.
   - Security Group: virtual firewall. Restrict SSH to your IP by setting
     `allowed_ssh_cidrs` in the root module or a tfvars file.
   - This file contains only one security group to keep the example simple.
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

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "allowed_ssh_cidrs" {
  description = "List of CIDR blocks allowed to SSH into instances (e.g. [\"203.0.113.5/32\"])"
  type        = list(string)
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Internet Gateway: attaches the VPC to the internet
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-igw"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Public subnet: simple public subnet mapping for learning and quick access
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.project_name}-public-subnet"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Route table for public subnet -> routes 0.0.0.0/0 to the IGW
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "${var.project_name}-public-rt"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

/*
  Security group: keep it minimal and explicit so learners see what ports
  are open. We accept a dedicated list for SSH CIDRs (var.allowed_ssh_cidrs)
  and open HTTP/HTTPS and the app port to the world for testing. In a
  hardened setup you would remove 0.0.0.0/0 for app ports and place app
  behind a load balancer or ALB with TLS.
*/
resource "aws_security_group" "main" {
  name        = "${var.project_name}-sg"
  description = "Security group for ${var.project_name}"
  vpc_id      = aws_vpc.main.id

  # Add SSH rules for every CIDR the user passes in. This lets learners
  # set a single IP (/32) and avoid exposing SSH to the world.
  dynamic "ingress" {
    for_each = var.allowed_ssh_cidrs
    content {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
      description = "SSH access"
    }
  }

  # HTTP and HTTPS for learning/testing
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  # Expose app port (Next.js default dev port or container mapping). For
  # production use an ALB with TLS instead.
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Application port"
  }

  # Allow all outbound traffic from instances
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = {
    Name        = "${var.project_name}-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_id" {
  value = aws_subnet.public.id
}

output "security_group_id" {
  value = aws_security_group.main.id
}
