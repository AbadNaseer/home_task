/*
  Providers

  This file declares Terraform providers separately from orchestration logic
  so learners can clearly see provider configuration and override it using
  environment variables or CLI flags when experimenting.
*/
provider "aws" {
  region = var.aws_region
}
