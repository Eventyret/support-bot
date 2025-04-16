variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-west-2"
}

variable "environment" {
  description = "Environment name (e.g. dev, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "support-bot"
}

# VPC variables
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
}

variable "private_subnets" {
  description = "List of private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

# S3 variables
variable "frontend_bucket_name" {
  description = "Name of the S3 bucket for frontend hosting"
  type        = string
  default     = "support-bot-frontend"
}

# ECS variables
variable "container_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 3000
}

variable "container_cpu" {
  description = "CPU units for the container (1024 = 1 vCPU)"
  type        = number
  default     = 512
}

variable "container_memory" {
  description = "Memory for the container in MiB"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Desired number of containers"
  type        = number
  default     = 2
}

# Secrets variables
variable "mongodb_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
  # This will be injected from GitHub Secrets as TF_VAR_mongodb_uri
}

variable "node_env" {
  description = "App environment"
  type        = string
}

variable "n8n_webhook_url" {
  description = "n8n production webhook URL"
  type        = string
}

variable "cleanup_api_key" {
  description = "Key used for cleaning up chats"
  type        = string
}

variable "n8n_encryption_key" {
  description = "Encryption key for n8n"
  type        = string
}
