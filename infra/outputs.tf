output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "frontend_bucket_name" {
  description = "Name of the S3 bucket hosting the frontend"
  value       = module.s3_frontend.bucket_name
}

output "frontend_website_endpoint" {
  description = "S3 website endpoint"
  value       = module.s3_frontend.website_endpoint
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer for backend"
  value       = module.ecs.alb_dns_name
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.ecs.service_name
}

output "secrets_arn" {
  description = "ARN of the Secrets Manager secret"
  value       = module.secrets.secrets_arn
  sensitive   = true
}
