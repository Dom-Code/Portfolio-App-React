import localforage from 'localforage';
import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (input: string | undefined) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: input,
        };
      });

      // onBuild will run the callback function if we have a file that matches the filter.

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }

        // check cache if file exists.
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, '')
          .replace('/"/g', '\\"')
          .replace(/'/g, "\\'");
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}'
            document.head.appendChild(style)
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // store result in cache
        await fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // store result in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
