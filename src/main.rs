use chrono::{DateTime, Utc};
use log::error;
use mustache::Template;
use pulldown_cmark::{html, CowStr, Event, Parser, Tag};
use serde::Serialize;
use std::fs::File;
use std::fs::{self};
use std::io::prelude::*;
use yaml_rust::{Yaml, YamlLoader};

mod yaml_extractors;
use yaml_extractors::*;

#[derive(Serialize)]
struct Post {
    title: String,
    published: DateTime<Utc>,
    revised: Option<DateTime<Utc>>,
    draft: bool,
    description: String,
    slug: String,
    body: Option<String>,
    preview: Option<String>,
    markdown_body: String,
    markdown_preview: String,
    children: Vec<Post>,
}

fn compile_markdown(post: &Option<String>) -> String {
    let contents = match post {
        Some(contents) => contents,
        None => "",
    };

    let parser = Parser::new(contents);

    let parser = parser.map(|event| match event {
        Event::Start(Tag::Link(_, _, _)) => Event::Html(CowStr::Borrowed("<tracked-anchor><a>")),
        Event::End(Tag::Link(_, _, _)) => Event::Html(CowStr::Borrowed("</a></tracked-anchor>")),
        _ => event,
    });

    let mut html_buf = String::new();
    html::push_html(&mut html_buf, parser);

    html_buf
}

fn load_frontmatter(contents: &String) -> Post {
    let mut frontmatter = Post {
        title: String::new(),
        published: Utc::now(),
        revised: None,
        draft: false,
        description: String::new(),
        slug: String::new(),
        preview: None,
        body: None,
        markdown_body: String::new(),
        markdown_preview: String::new(),
        children: Vec::new(),
    };

    let split_string: String = String::from("---");
    let parts: std::str::SplitN<'_, &String> = contents.splitn(3, &split_string);
    let coll: Vec<&str> = parts.collect();

    let yaml: Vec<Yaml> = match YamlLoader::load_from_str(coll[1]) {
        Ok(yaml) => yaml,
        Err(_) => Vec::<Yaml>::new(),
    };
    let hash = &yaml[0];

    frontmatter.body = Some(String::from(coll[2]));
    frontmatter.preview = Some(extract_string_with_default(&hash["preview"]));

    frontmatter.title = extract_string_with_default(&hash["title"]);
    frontmatter.published = extract_date_with_default(&hash["published"]);
    frontmatter.revised = extract_optional_date(&hash["revised"]);
    frontmatter.description = extract_string_with_default(&hash["description"]);
    frontmatter.slug = extract_string_with_default(&hash["slug"]);
    frontmatter.markdown_body = compile_markdown(&frontmatter.body);
    frontmatter.markdown_preview = compile_markdown(&frontmatter.preview);
    frontmatter
}

fn load_file(file: &String) -> String {
    match fs::read_to_string(file) {
        Ok(contents) => contents,
        Err(_) => "".to_string(),
    }
}

fn load_all_files() -> Result<Vec<String>, String> {
    match fs::read_dir("./content/posts") {
        Ok(iterator) => {
            let mut posts = Vec::new();
            for file in iterator {
                match file {
                    Ok(file) => match file.path().to_str() {
                        Some(t) => posts.push(t.to_string()),
                        None => {}
                    },
                    Err(_) => return Err("could not parse posts".to_string()),
                }
            }
            return Ok(posts);
        }
        Err(_) => return Err("could not parse posts".to_string()),
    }
}

fn load_template(path: &String) -> Template {
    let index_template = load_file(path);
    return mustache::compile_str(&index_template.to_string()).unwrap();
}

fn write_to_file(path: &String, contents: &str) -> std::io::Result<usize> {
    let mut file = match File::create(path) {
        Ok(file) => file,
        Err(err) => panic!("cannot create output"),
    };
    file.write(contents.as_bytes())
}

fn main() {
    env_logger::init();
    fs::remove_dir_all("./output");
    fs::create_dir_all("./output/post");
    let index_template = load_template(&String::from("./templates/index.mustache"));
    let post_template = load_template(&String::from("./templates/post.mustache"));

    let mut all_files: Vec<String> = match load_all_files() {
        Ok(posts) => posts,
        Err(message) => {
            error!("{}", message);
            Vec::<String>::new()
        }
    };

    all_files.sort();

    let main_post = all_files.pop();
    let main_post = load_file(&main_post.unwrap());
    let mut main_post = load_frontmatter(&main_post);
    all_files.reverse();

    for file in all_files.iter() {
        let contents = load_file(file);
        let frm = load_frontmatter(&contents);
        let post = post_template.render_to_string(&frm).unwrap();
        fs::create_dir_all(format!("./output/post/{}", frm.slug));
        write_to_file(&format!("./output/post/{}/index.html", frm.slug), &post);
        main_post.children.push(frm);
    }

    let index = index_template.render_to_string(&main_post).unwrap();
    write_to_file(&String::from("./output/index.html"), &index);
}
