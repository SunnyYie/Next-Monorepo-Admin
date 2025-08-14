import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  external: ['react', 'react/jsx-runtime'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'NextSDK',
      sourcemap: true,
      globals: {
        react: 'React',
        'react/jsx-runtime': 'jsxRuntime',
      },
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
  ],
};
