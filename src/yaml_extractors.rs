use chrono::{DateTime, Utc};
use yaml_rust::Yaml;

pub fn extract_optional_date(field: &Yaml) -> Option<DateTime<Utc>> {
  match DateTime::parse_from_rfc3339(field.as_str()?) {
    Ok(datetime) => Some(datetime.with_timezone(&Utc)),
    Err(_) => None,
  }
}

pub fn extract_string_with_default(field: &Yaml) -> String {
  field.as_str().map(|s| String::from(s)).unwrap_or_default()
}

pub fn extract_date_with_default(field: &Yaml) -> DateTime<Utc> {
  match field.as_str() {
    Some(date_string) => match DateTime::parse_from_rfc3339(date_string) {
      Ok(datetime) => datetime.with_timezone(&Utc),
      Err(_) => Utc::now(),
    },
    None => Utc::now(),
  }
}
