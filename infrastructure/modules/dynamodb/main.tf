resource "aws_dynamodb_table" "patients" {
  name = "${var.prefix}Patients_${var.env}"
  read_capacity = 20
  write_capacity = 20
  hash_key = "patientId"

  attribute {
    name = "patientId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "providers" {
  name = "${var.prefix}Providers_${var.env}"
  read_capacity = 20
  write_capacity = 20
  hash_key = "providerId"

  attribute {
    name = "providerId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "visits" {
  name = "${var.prefix}Visits_${var.env}"
  read_capacity = 20
  write_capacity = 20
  hash_key = "visitId"

  attribute {
    name = "visitId"
    type = "S"
  }
  attribute {
    name = "patientId"
    type = "S"
  }
  attribute {
    name = "providerId"
    type = "S"
  }
  attribute {
    name = "visitDateTime"
    type = "S"
  }

  global_secondary_index {
    name = "PatientProviderIndex"
    read_capacity = 10
    write_capacity = 10
    hash_key = "patientId"
    range_key = "providerId"
    projection_type = "ALL"
  }
  global_secondary_index {
    name = "PatientVisitDateIndex"
    read_capacity = 10
    write_capacity = 10
    hash_key = "patientId"
    range_key = "visitDateTime"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "questionnaireTemplates" {
  name = "${var.prefix}QuestionnaireTemplates_${var.env}"
  read_capacity = 20
  write_capacity = 20
  hash_key = "category"
  range_key = "templateId"
  attribute {
    name = "category"
    type = "S"
  }
  attribute {
    name = "templateId"
    type = "S"
  }
  global_secondary_index {
    name = "TemplateIdIndex"
    read_capacity = 10
    write_capacity = 10
    hash_key = "templateId"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "patientQuestionnaires" {
  name = "${var.prefix}PatientQuestionnaires_${var.env}"
  read_capacity = 20
  write_capacity = 20
  hash_key = "patientId"
  range_key = "questionnaireId"
  attribute = {
    name = "patientId"
    type = "S"
  }
  attribute = {
    name = "questionnaireId"
    type = "S"
  }
  attribute {
    name = "category"
    type = "S"
  }
  attribute {
    name = "dueDate"
    type = "S"
  }
  global_secondary_index {
    name = "QuestionnaireIdIndex"
    read_capacity = 10
    write_capacity = 10
    hash_key = "questionnaireId"
    projection_type = "ALL"
  }
  local_secondary_index {
    name = "PatientCategoryIndex"
    range_key = "category"
    projection_type = "ALL"
  }
  local_secondary_index {
    name = "PatientDueDateIndex"
    range_key = "dueDate"
    projection_type = "ALL"
  }
}
