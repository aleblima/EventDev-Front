import antfu from '@antfu/eslint-config'
import sonarjs from 'eslint-plugin-sonarjs'

export default antfu(
  {
    react: true,
    typescript: {
      tsconfigPath: './tsconfig.json'
    },

    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
      jsx: true
    },

    formatters: {
      css: true,
      html: true,
      markdown: 'prettier'
    },

    ignores: ['dist/', 'build/', '.next/', 'node_modules/', '*.min.js', '.vscode/', '**/*.md', 'eslint.config.js', '*.yml', '*.yaml', '*.json']
  },
  {
    plugins: {
      sonarjs
    },
    rules: {
      // ============================================
      // Clean Code & Best Practices
      // ============================================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'curly': ['error', 'all'], // Enforce curly braces for all control statements
      'eqeqeq': ['error', 'always'], // Enforce strict equality
      'no-var': 'error',
      'prefer-const': 'error',
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'max-depth': ['error', 3],
      'complexity': ['error', 10]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // ============================================
      // TypeScript Rules
      // ============================================
      '@typescript-eslint/no-explicit-any': 'error', // Ban 'any' type
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'error'
    }
  },
  {
    rules: {
      // ============================================
      // React Rules
      // ============================================
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off',
      'react/prefer-destructuring-assignment': 'off',
      'react-refresh/only-export-components': 'off',
      'react/no-array-index-key': 'warn',

      // ============================================
      // TypeScript Rules - Type Safety (sem type information)
      // ============================================
      'ts/no-explicit-any': 'error',
      'ts/no-non-null-assertion': 'error',
      'ts/array-type': ['error', { default: 'array-simple' }],

      // ============================================
      // General Code Quality
      // ============================================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'warn',
      'no-useless-return': 'off',

      // ============================================
      // Imports - Prevenir não utilizados
      // ============================================
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ],

      // ============================================
      // Import Rules - Preferir imports absolutos (@/) ao invés de relativos (../)
      // ============================================
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../../*', '../../../*', './*'],
              message:
                'Use absolute imports with @ alias (e.g., @/hooks/useLanguage) instead of relative imports (e.g., ../hooks/useLanguage or ./component)'
            }
          ]
        }
      ],

      // ============================================
      // Antfu Config Overrides
      // ============================================
      'antfu/consistent-list-newline': 'off',
      'antfu/if-newline': 'off',
      'antfu/no-import-dist': 'off',
      'antfu/import-dedupe': 'error',
      'antfu/no-top-level-await': 'off',

      // ============================================
      // Node e performance
      // ============================================
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',

      // ============================================
      // Style Rules - General
      // ============================================
      'style/arrow-parens': ['error', 'always'],
      'style/array-bracket-spacing': ['error', 'never'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/linebreak-style': ['error', 'unix'],
      'style/object-curly-spacing': ['error', 'always'],
      'style/quote-props': ['error', 'consistent'],
      'style/semi': ['error', 'never'],
      'style/comma-dangle': ['error', 'never'],
      'style/no-multi-spaces': 'error',
      'style/no-trailing-spaces': 'error',

      // ============================================
      // Style Rules - JSX Specific
      // ============================================
      'style/jsx-quotes': ['error', 'prefer-double'],
      'style/jsx-first-prop-new-line': ['error', 'multiline'],
      'style/jsx-indent-props': ['error', 2],
      'style/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      'style/jsx-closing-tag-location': 'error',
      'style/jsx-closing-bracket-location': ['error', 'after-props'],
      'style/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never'
        }
      ],

      // ============================================
      // Style Rules - Line Length & Formatting
      // ============================================
      'style/max-len': [
        'error',
        {
          code: 150,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true
        }
      ],

      'style/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: 'always'
        }
      ],

      'style/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 1,
          outerIIFEBody: 1,
          MemberExpression: 1,
          FunctionDeclaration: { parameters: 1, body: 1 },
          FunctionExpression: { parameters: 1, body: 1 },
          CallExpression: { arguments: 1 },
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          flatTernaryExpressions: false,
          ignoreComments: false,
          ignoredNodes: ['TemplateLiteral *'],
          offsetTernaryExpressions: true
        }
      ],

      // ============================================
      // Style Rules - Member Delimiter
      // ============================================
      'style/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'none' },
          singleline: { delimiter: 'semi', requireLast: false }
        }
      ],

      // ============================================
      // Style Rules - Object & Operator Formatting
      // ============================================
      'style/object-curly-newline': [
        'error',
        {
          ObjectExpression: { consistent: true },
          ObjectPattern: { consistent: true },
          ImportDeclaration: { consistent: true },
          ExportDeclaration: { consistent: true }
        }
      ],

      'style/operator-linebreak': [
        'error',
        'before',
        {
          overrides: {
            '=': 'after',
            '+=': 'after',
            '-=': 'after',
            '*=': 'after',
            '/=': 'after',
            '%=': 'after',
            '**=': 'after',
            '<<=': 'after',
            '>>=': 'after',
            '>>>=': 'after',
            '&=': 'after',
            '^=': 'after',
            '|=': 'after'
          }
        }
      ],

      // ============================================
      // Performance - ordenação otimizada
      // ============================================
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'side-effect',
            'style',
            'object',
            'unknown'
          ],
          newlinesBetween: 'always'
        }
      ],

      // ============================================
      // Unicorn Overrides - Compatibilidade com lib target
      // ============================================
      'unicorn/prefer-at': 'off',

      // ============================================
      // SonarJS Rules - Code Quality & Security
      // ============================================
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-single-boolean-return': 'error'
    }
  }
)
