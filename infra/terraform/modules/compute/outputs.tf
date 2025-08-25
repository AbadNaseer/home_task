output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.main.id
}

output "instance_public_ip" {
  description = "Public IP assigned to the instance (Elastic IP)"
  value       = aws_eip.main.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name for the instance"
  value       = aws_eip.main.public_dns
}
