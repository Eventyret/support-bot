terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "support-bot-tf-state"
    key            = "terraform.tfstate"
    region         = "eu-west-2"
    encrypt        = true
    dynamodb_table = "support-bot-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "support-bot"
      Environment = var.environment
      ManagedBy   = "OpenTofu"
    }
  }
}

# Create VPC and networking components
module "vpc" {
  source = "./modules/vpc"

  environment        = var.environment
  project_name       = var.project_name
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  private_subnets    = var.private_subnets
  public_subnets     = var.public_subnets
}

# Create ECR Repository
module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}

# Create S3 bucket for frontend hosting
module "s3_frontend" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
  bucket_name  = var.frontend_bucket_name
}

# Create Secrets Manager for storing sensitive data
module "secrets" {
  source = "./modules/secrets"

  project_name = var.project_name
  environment  = var.environment
  mongodb_uri  = var.mongodb_uri
}

# Create ECS Fargate service for backend
module "ecs" {
  source = "./modules/ecs"

  project_name                = var.project_name
  environment                 = var.environment
  vpc_id                      = module.vpc.vpc_id
  private_subnets             = module.vpc.private_subnets
  public_subnets              = module.vpc.public_subnets
  ecs_task_execution_role_arn = module.vpc.ecs_task_execution_role_arn
  ecs_task_role_arn           = module.vpc.ecs_task_role_arn
  ecr_repository_url          = module.ecr.repository_url
  secrets_arn                 = module.secrets.secrets_arn
  container_port              = var.container_port
  container_cpu               = var.container_cpu
  container_memory            = var.container_memory
  desired_count               = var.desired_count
}

# Store the ALB DNS name in Parameter Store for stable reference
resource "aws_ssm_parameter" "alb_dns_name" {
  name        = "/support-bot/${var.environment}/alb-dns-name"
  description = "DNS name of the Application Load Balancer"
  type        = "String"
  value       = module.ecs.alb_dns_name
  overwrite   = true

  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}
