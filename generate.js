const fs = require('fs');
const fetch = require('node-fetch');
const yaml = require('js-yaml');

function getCategories(categories) {
    return 'export type MongoErrorCategories = \n' +
        categories
            .map(category => {
                return `  '${category}'`;
            })
            .join(' |\n') +
        ';';
}

function getCodes(codes) {
    const res = ['export const MongoError = {'];
    codes.forEach(({ code, name, categories = [] }) => {
        const val = ['{'];
        val.push(`    code: ${code},`);
        val.push(`    categories: [${categories.map(category => `'${category}'`)}]`);

        val.push('  }');

        res.push(`  ${name}: ${val.join('\n')},`);
    });
    res.push('} as const;');

    return res.join('\n');
}

async function main() {
    const version = require('./package.json').version.split('-')[0];
    const response = await fetch(`https://raw.githubusercontent.com/mongodb/mongo/r${version}/src/mongo/base/error_codes.yml`);
    fs.writeFileSync(
        'gen/error_codes.yml',
        await response.text(),
    );

    const {
        error_categories,
        error_codes,
    } = yaml.load(fs.readFileSync('gen/error_codes.yml', 'utf8'));

    fs.writeFileSync(
        'gen/index.ts',

        getCategories(error_categories) +
        '\n\n' +
        getCodes(error_codes),
    );
}

main();
