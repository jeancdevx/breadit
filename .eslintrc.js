module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'next/core-web-vitals',
    'plugin:tailwindcss/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}']
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['react'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/indent': 'off',
    'multiline-ternary': 'off'
  }
}
