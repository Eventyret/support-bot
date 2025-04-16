# AWS Deployment for Support Bot

This document outlines the AWS infrastructure setup for the `support-bot` project using OpenTofu (Terraform). The infrastructure is designed to follow AWS best practices with proper security configurations.

## Architecture Overview

The deployment consists of the following components:

- **Frontend**: Hosted in an S3 bucket configured for static website hosting
- **Backend**: Containerized Express.js API running on ECS Fargate
- **Database**: External MongoDB (connection string stored in AWS Secrets Manager)
- **Networking**: Custom VPC with public and private subnets
- **Security**: IAM roles with least privilege, security groups, and encrypted secrets

![Architecture Diagram](https://via.placeholder.com/800x600.png?text=Support+Bot+AWS+Architecture)

## Prerequisites

Before deploying, you need:

1. AWS account with appropriate permissions
2. AWS CLI installed and configured
3. GitHub repository set up with required secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (defaults to eu-west-2)
   - `TF_VAR_mongodb_uri` (MongoDB connection string)

## Deployment Process

### Initial Infrastructure Setup

1. Run the `terraform-apply.yml` GitHub workflow (manually triggered) to provision:
   - VPC and networking components
   - S3 bucket for frontend
   - ECR repository for backend container
   - ECS Fargate for hosting the backend
   - Secrets Manager for securely storing environment variables

2. After the initial deployment, note the outputs:
   - ECR repository URL
   - S3 bucket name
   - ECS cluster and service names
   - ALB DNS name

### Application Deployment

Once the infrastructure is in place, you can deploy the application:

1. **Backend**: Push to the `main` branch to trigger the `backend-deploy.yml` workflow
2. **Frontend**: Push to the `main` branch to trigger the `frontend-deploy.yml` workflow

The GitHub Actions workflows will:
- Build and push Docker images to ECR (backend)
- Build and upload static assets to S3 (frontend)
- Update the ECS service to use the new images (backend)

## Infrastructure Details

### VPC and Networking

- Custom VPC with CIDR block `10.0.0.0/16`
- 3 public subnets for load balancers
- 3 private subnets for ECS tasks
- NAT gateways for outbound connectivity
- Security groups for ECS and ALB

### S3 for Frontend

- Bucket configured for static website hosting
- Public access enabled
- CORS configured for web access

### ECS for Backend

- Fargate for serverless container execution
- Private subnets for security
- Auto-scaling configuration
- Application Load Balancer for HTTP/HTTPS traffic
- Task definitions with secrets integration

### Secrets Management

- AWS Secrets Manager for secure storage
- JSON format for multiple secrets in a single secret
- IAM roles with least privilege access

## Access and Security

- No SSH access to containers (serverless Fargate)
- ALB endpoint for backend API access
- S3 website URL for frontend access
- IAM roles with least privilege
- Security groups restricting traffic

## Monitoring and Logs

- CloudWatch Logs for container logs
- CloudWatch Metrics for container and ALB metrics
- ECS task health monitoring

## Cost Optimization

This setup is designed to be cost-effective:

- Fargate only charges for actual usage
- S3 has minimal costs for small static sites
- NAT Gateways are the main ongoing cost (one per availability zone for high availability)

## Customization

You may need to customize:

1. Domain names and HTTPS certificates (not included in base setup)
2. Additional environment variables in the Secrets Manager
3. Auto-scaling settings for ECS tasks
4. CloudFront distribution for better frontend performance and HTTPS

## Troubleshooting

- Check GitHub Actions workflow runs for deployment issues
- Review CloudWatch Logs for container application errors
- Verify IAM permissions for any access issues
- Ensure your MongoDB instance is accessible from AWS VPC

## Cleanup

To avoid incurring charges, delete resources when not needed:

1. Run the `terraform-apply.yml` workflow with the `-destroy` flag (you'll need to modify the workflow to support this)
2. Or manually delete resources in the AWS Console

## Security Considerations

- Secrets are never stored in code or Terraform state
- Containers run with minimal privileges
- Network security follows AWS best practices
- Regular updates should be applied to containers 