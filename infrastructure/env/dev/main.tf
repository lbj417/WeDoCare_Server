provider "aws" {
  profile = "${var.aws_profile}"
  region  = "${var.aws_region}"
}

module "dynamodb" {
  source = "../../modules/dynamodb"

  prefix = "${var.prefix}"
  env = "${var.env}"
}
