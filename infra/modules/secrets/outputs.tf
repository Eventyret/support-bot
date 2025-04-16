output "secrets_name" {
  description = "Name of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.app_secrets.name
}
