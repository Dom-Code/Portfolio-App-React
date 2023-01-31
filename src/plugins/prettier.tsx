import prettier from 'prettier';
import parser from 'prettier/parser-babel';

const prettierFormat = (code: string) => {
  return prettier
    .format(code, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    })
    .replace(/\n$/, '');
};

export default prettierFormat;
