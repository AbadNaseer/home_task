output "vpc_id" {
  description = "ID of the VPC created by the network module"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet created by the network module"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "Security group ID created by the network module"
  value       = aws_security_group.main.id
}
