#!/usr/bin/env node

import { sync as glob } from 'globby';
import markdownit from 'markdown-it';
import anchorPlugin from 'markdown-it-anchor';
import * as fs from 'node:fs';
import * as path from 'node:path';
import matter from 'gray-matter';
import mustache from 'mustache';

function renderMarkdown({ wrapper, patterns, outDir, markdownSettings }) {
    const md = new markdownit(markdownSettings)
        .use(anchorPlugin, {
            slugify: s => String(s)
                .trim()
                .replace(/[^A-Za-z0-9\-_.!~*'()]/g, '')
                .slice(0, 15)
                .toLowerCase(),
        });

    const files = glob(patterns).sort();

    const wrapperTemplate = fs.readFileSync(wrapper, 'utf-8');

    const allPages = files.map((file) => {
        const pageText = fs.readFileSync(file, 'utf-8');
        const page = matter(pageText);

        const pageUrl = page.data.slug
            ? path.join(path.dirname(file), page.data.slug)
            : file.replace(/\.md$/, '');

        return {
            ...page.data,
            content: page.content,
            url: pageUrl,
        };
    });

    const pagesByType = groupBy(allPages, (it) => it.type ?? '?');

    for (const page of allPages) {
        const contentMd = mustache.render(page.content, {
            ...page,
            pages: allPages,
            ...pagesByType,
        });

        const contentHtml = md.render(contentMd);

        const rendered = mustache.render(wrapperTemplate, {
            ...page,
            content: contentHtml,
        });

        const outFile = path.join(outDir, page.url + '.html');
        save(outFile, rendered);
    }
}

function save(dest, content) {
    if (process.env.DRY_RUN === '1') {
        console.log('save', dest);
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
}

function groupBy(items, keyFn) {
    const result = {};

    for (const item of items) {
        const key = keyFn(item);
        result[key] ??= [];
        result[key].push(item);
    }

    return result;
}

renderMarkdown({
    wrapper: 'wrapper.html',
    outDir: 'dist',
    patterns: ['**/*.md', '!node_modules/**', '!dist/**'],
    markdownSettings: {
        html: true,
        linkfiy: true,
    },
});
console.log('Build successful');