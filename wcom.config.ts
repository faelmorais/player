import {
  litPlugin,
  MARKDOWN_PLUGIN_DEFAULT_CONFIG,
  markdownPlugin,
  Plugin,
  vscodePlugin,
} from '@wcom/cli';
import prettier from 'prettier';

export default [
  litPlugin(),
  eventDiscoveryPlugin(),
  dependencyDiscoveryPlugin(),
  storybookPlugin(),
  markdownPlugin(),
  vscodePlugin(),
  prettierPlugin(),
];

// TODO: Plugin to discover component events.
function eventDiscoveryPlugin(): Plugin {
  return {
    name: 'vds-events',

    async postbuild(components) {
      // look for sourceFile ending in `.events`
      // if found then look for componentmeta with matching sourceDir
      // read `.events` and if classdec + extension of VdsEvents or something then use
      // unpack into event meta
      // attach to componentmeta
      return components;
    },
  };
}

// TODO: Plugin to discover component dependencies/dependents.
function dependencyDiscoveryPlugin(): Plugin {
  return {
    name: 'vds-deps',

    async postbuild(components) {
      // look for deps in the side effect file `vds-*.ts`.
      return components;
    },
  };
}

// TODO: Plugin to generate component Storybook controls/stories.
function storybookPlugin(): Plugin {
  return {
    name: 'vds-storybook',
  };
}

/**
 * Formats markdown files generated by the `markdownPlugin` with Prettier.
 */
function prettierPlugin(): Plugin {
  return {
    name: 'vds-prettier',
    async transform(components, fs) {
      await Promise.all(
        components.map(async component => {
          const markdownPath = MARKDOWN_PLUGIN_DEFAULT_CONFIG.outputPath(
            component,
            fs,
          ) as string;

          const markdown = (await fs.readFile(markdownPath)).toString();

          const formattedMarkdown = prettier.format(markdown, {
            arrowParens: 'avoid',
            parser: 'markdown',
            singleQuote: true,
            trailingComma: 'all',
          });

          await fs.writeFile(markdownPath, formattedMarkdown);
        }),
      );
    },
  };
}