variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1" # Asia Pacific (Mumbai) - good for Pakistan
}

variable "region" {
  description = "AWS region (alias for aws_region)"
  type        = string
  default     = "ap-south-1"
}

variable "key_name" {
  description = "Name for the SSH key pair"
  type        = string
  default     = "team-tasks-key"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "team-tasks"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro" # Free tier eligible
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Please override to your IP (e.g. 203.0.113.5/32) for safety
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "root_block_device" {
  description = "Root block device settings for the EC2 instance"
  type = map(any)
  default = {
    volume_type = "gp3"
    volume_size = 8
    encrypted   = true
  }
}
