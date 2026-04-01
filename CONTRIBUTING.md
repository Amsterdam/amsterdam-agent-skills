# Contributing

Thanks for your interest in Amsterdam Agent Skills! Contributions are welcome from anyone — whether you work for the Municipality of Amsterdam or not.

## Ways to Contribute

- **New skills** — Add a skill for a domain you know well (Amsterdam-specific or public-sector relevant)
- **Improve existing skills** — Fix incorrect examples, add missing patterns, improve clarity
- **Benchmarks** — Run skills against real prompts and share results
- **Bug reports** — Open an issue if a skill produces wrong or outdated guidance

## Adding or Editing Skills

Skills are plain Markdown files — no build step, no dependencies.

1. Fork the repo and create a branch
2. Follow the skill format in [`AGENTS.md`](AGENTS.md) — it covers frontmatter, structure, naming, and quality standards
3. Key rules:
   - Every skill needs `skills/<name>/SKILL.md` with valid YAML frontmatter
   - Keep SKILL.md under 700 lines; put catalogs and listings in `references/`
   - Code examples must be copy-paste ready and verified against current library versions
   - Update the skills table in `README.md`
4. Open a pull request with a clear description of what the skill covers and why

## Guidelines

- **Language**: Skill content matches the target audience language. Meta content (README, PR descriptions) in English.
- **Quality over quantity**: One well-tested skill beats five rough ones.
- **Token-efficient**: Agents pay per token — use tables over prose, show over tell.
- **No secrets or user-specific paths**: Skills must work for everyone.

## Code of Conduct

Be respectful, constructive, and inclusive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## License

By contributing, you agree that your contributions are licensed under [EU-PL v1.2](LICENSE).
