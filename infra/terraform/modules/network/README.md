# Network module

Purpose
- This module creates the network foundation: a VPC, a public subnet, an
  Internet Gateway, a route table, and a security group for learn-by-doing
  deployments.

When to edit
- Change `vpc_cidr` or `public_subnet_cidr` to learn about IP ranges.
- Adjust `allowed_ssh_cidrs` to safely restrict SSH access to a specific IP.

Resources created (high level)
- aws_vpc
- aws_internet_gateway
- aws_subnet (public)
- aws_route_table
- aws_route_table_association
- aws_security_group

Learning tips
- Inspect `main.tf` to see the mapping from Terraform resources to AWS
  networking components. Try changing the subnet CIDR and re-running plan to
  see how Terraform will change the infrastructure.
