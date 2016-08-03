variable "aws_profile" {
  default = "wedocare"
}

variable "aws_region" {
  default = "us-east-1"
}

variable "env" {
  default = "DEV"
  description = "Target environment for tagging purposes"
}

variable "prefix" {
  default = "WeDoCare_"
}
