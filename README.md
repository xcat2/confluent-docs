# Confluent documentation

[![Build Status](https://github.com/xcat2/confluent-docs/workflows/build/badge.svg)](https://github.com/xcat2/confluent-docs/actions) [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/xcat2/confluent-docs/blob/master/LICENSE)

The [confluent documentation](https://xcat2.github.io/confluent-docs/) is built using [Zensical](https://zensical.org/). All **Markdown** files in the `docs` directory are automatically added to the documentation.
Site settings are in `mkdocs.yml`. Navigation can be customized using `.nav.yml` files located in each directory.

Since Markdown is supported by most Git web hosting platforms, you can also view or edit the documentation online without using Zensical.

## Prerequisites

To generate the documentation you need Zensical and [Pandoc](https://pandoc.org/installing.html). Install Pandoc with your system package manager. To install the Python dependencies, run:

```bash
pip3 install -r requirements.txt --user
```

Alternatively, you can install these within a Python virtual environment.

Furthermore, you should have the [confluent repository](https://github.com/xcat2/confluent) cloned to `../confluent`.

## Viewing and editing live documentation

For development purposes, you can use the following command to start a local web server that watches the files in the `docs` directory and updates the documentation on changes:

```bash
zensical serve
```

Then, access the live documentation at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Building HTML documentation

To build static HTML pages, use either:

```bash
./makeattribdoc          # generate node_attributes.md from ../confluent
bash makeman             # generate man pages from ../confluent using Pandoc
zensical build --strict  # build HTML pages
```

or

```bash
make all
```

The generated HTML pages will be placed in the `_site` directory. You can copy this directory to a web server or open it directly in a web browser.

## Publishing

Pull requests run a clean strict build, including social cards. Pushes to `master` or `main` also publish `_site` to the existing `gh-pages` branch using `ghp-import`.

Social cards are generated natively by Zensical. To include them in a local build, run:

```bash
SOCIAL_CARDS=true zensical build --clean --strict
```

## Migration notes

The configuration retains the classic theme, navigation, release notes, feeds, tags, image lightboxes, and redirects from the ProperDocs site. These features are implemented natively in Zensical, so separate MkDocs plugin packages are not required.

Zensical does not yet support the `privacy` and `document-dates` plugins. Fonts currently load from Google Fonts, and page creation/update dates are omitted. Social-card generation also downloads fonts at build time. See [issue #14](https://github.com/xcat2/confluent-docs/issues/14) for the migration discussion.
