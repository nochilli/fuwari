import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path


FRONTMATTER_PATTERN = re.compile(
    r"\A(?:\ufeff)?---[ \t]*\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n|\Z)",
    re.DOTALL,
)
REPOSITORY_LINK_PATTERN = re.compile(
    r"\[Repository\]\(\s*https?://github\.com/([^/\s?#)]+)/([^/\s?#)]+)"
    r"(?:\.git)?/?(?:[?#][^)]*)?\s*\)",
    re.IGNORECASE,
)
SAFE_TAG_PATTERN = re.compile(r"[\w ./+-]+", re.UNICODE)


class MigrationError(Exception):
    pass


def parse_tags(value: str, file_path: Path) -> list[str]:
    value = value.strip()
    if not (value.startswith("[") and value.endswith("]")):
        raise MigrationError(f"{file_path}: tags must be an inline list")

    inner = value[1:-1].strip()
    if not inner:
        return []

    values: list[str] = []
    start = 0
    quote: str | None = None
    escaped = False

    for index, character in enumerate(inner):
        if escaped:
            escaped = False
        elif character == "\\" and quote == '"':
            escaped = True
        elif quote:
            if character == quote:
                quote = None
        elif character in {"'", '"'}:
            quote = character
        elif character == ",":
            values.append(inner[start:index].strip())
            start = index + 1

    if quote:
        raise MigrationError(f"{file_path}: tags contain an unterminated quote")
    values.append(inner[start:].strip())

    tags = []
    for item in values:
        if not item:
            raise MigrationError(f"{file_path}: tags contain an empty item")
        if item.startswith('"'):
            try:
                item = json.loads(item)
            except json.JSONDecodeError as error:
                raise MigrationError(f"{file_path}: invalid quoted tag: {item}") from error
        elif item.startswith("'") and item.endswith("'"):
            item = item[1:-1].replace("''", "'")
        tags.append(item)
    return tags


def format_tag(tag: str) -> str:
    if tag and SAFE_TAG_PATTERN.fullmatch(tag) and not tag.startswith(("-", "?", ":")):
        return tag
    return json.dumps(tag, ensure_ascii=False)


def migrate_content(content: str, file_path: Path, today: date) -> str:
    match = FRONTMATTER_PATTERN.match(content)
    if not match:
        raise MigrationError(f"{file_path}: missing or invalid YAML frontmatter")

    frontmatter = match.group(1)
    title_match = re.search(r"^title:[ \t]*(.+?)[ \t]*$", frontmatter, re.MULTILINE)
    if not title_match:
        raise MigrationError(f"{file_path}: frontmatter has no title")

    tags_match = re.search(r"^tags:[ \t]*(.*?)[ \t]*$", frontmatter, re.MULTILINE)
    tags = parse_tags(tags_match.group(1), file_path) if tags_match else []
    published_match = re.search(
        r"^published:[ \t]*(.+?)[ \t]*$", frontmatter, re.MULTILINE
    )
    published = published_match.group(1) if published_match else today.isoformat()

    body = content[match.end() :].strip()
    body = re.sub(
        r"(?m)^[ \t]*import Tags from [\"'](?:\.\./)+components/Tags\.astro[\"'];?[ \t]*(?:\r?\n|$)",
        "",
        body,
    )
    body = re.sub(
        r"(?m)^[ \t]*<Tags\s+tags=\{frontmatter\.tags\}\s*/>[ \t]*(?:\r?\n|$)",
        "",
        body,
    ).strip()
    body = body.replace("../../../components/", "../../components/")

    def replace_repository_link(link_match: re.Match[str]) -> str:
        owner = link_match.group(1)
        repository = link_match.group(2).removesuffix(".git")
        return f'::github{{repo="{owner}/{repository}"}}'

    body = REPOSITORY_LINK_PATTERN.sub(replace_repository_link, body)

    migrated_frontmatter = "\n".join(
        [
            "---",
            f"title: {title_match.group(1)}",
            f"published: {published}",
            "description: ''",
            "image: ''",
            f"tags: [{', '.join(format_tag(tag) for tag in tags)}]",
            "category: ''",
            "draft: false",
            "---",
        ]
    )
    return f"{migrated_frontmatter}\n\n{body}\n" if body else f"{migrated_frontmatter}\n"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Migrate Markdown posts to the current frontmatter format."
    )
    parser.add_argument("directory", type=Path, help="directory to scan recursively")
    args = parser.parse_args()

    directory = args.directory
    if not directory.is_dir():
        parser.error(f"not a directory: {directory}")

    files = sorted(
        path
        for path in directory.rglob("*")
        if path.is_file() and path.suffix.lower() == ".mdx"
    )
    if not files:
        print(f"No Markdown files found in {directory}")
        return 0

    today = date.today()
    migrations: list[tuple[Path, str]] = []
    errors: list[str] = []
    for file_path in files:
        try:
            content = file_path.read_text(encoding="utf-8")
            migrations.append((file_path, migrate_content(content, file_path, today)))
        except (OSError, UnicodeError, MigrationError) as error:
            errors.append(str(error))

    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        print("No files were changed.", file=sys.stderr)
        return 1

    for file_path, content in migrations:
        file_path.write_text(content, encoding="utf-8", newline="\n")
        print(f"Migrated {file_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
