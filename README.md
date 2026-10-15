# Confluent documentation

[![Build Status](https://github.com/xcat2/confluent-docs/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/xcat2/confluent-docs/actions/workflows/build.yml)
[![Docs](https://img.shields.io/website?url=https%3A%2F%2Fxcat2.github.io%2Fconfluent-docs%2F&label=docs)](https://xcat2.github.io/confluent-docs/)
[![Confluent release](https://img.shields.io/github/v/release/xcat2/confluent?label=confluent)](https://github.com/xcat2/confluent/releases)
[![License](https://img.shields.io/github/license/xcat2/confluent-docs)](https://github.com/xcat2/confluent-docs/blob/master/LICENSE)

The [confluent documentation](https://xcat2.github.io/confluent-docs/) is built using [Zensical](https://zensical.org/). All **Markdown** files in the `docs` directory are automatically added to the documentation.
Site settings are in `zensical.toml`. Navigation can be customized using `.nav.yml` files located in each directory.

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

Social cards are enabled for every build. Their first generation downloads fonts. To run a clean build, use:

```bash
zensical build --clean --strict
```
