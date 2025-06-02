// import js from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import pluginVue from "eslint-plugin-vue";
import * as parserVue from "vue-eslint-parser";

export default [
  // Configuración base de JavaScript
  // js.configs.recommended,

  // Configuraciones recomendadas de Vue
  ...pluginVue.configs["flat/essential"],
  ...pluginVue.configs["flat/strongly-recommended"],
  ...pluginVue.configs["flat/recommended"],

  // Configuración de Prettier (debe ir al final)
  configPrettier,

  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.nuxt/**",
      "**/.output/**",
      "**/coverage/**",
      "**/*.d.ts",
    ],
  },

  {
    files: ["**/*.vue", "**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // parser: "@typescript-eslint/parser", // para <script lang="ts">
        // ecmaFeatures: {
        //   jsx: true,
        // },
      },
      globals: {
        // Globales del navegador
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",

        // Globales de Node.js (para archivos de configuración)
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",

        // Globales de Vue
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
        defineOptions: "readonly",
        defineSlots: "readonly",
        defineModel: "readonly",
      },
    },

    plugins: {
      vue: pluginVue,
      prettier: pluginPrettier,
    },

    rules: {
      // === REGLAS DE VUE ===

      // Componentes
      "vue/multi-word-component-names": "off",
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/component-definition-name-casing": ["error", "PascalCase"],
      "vue/custom-event-name-casing": ["error", "camelCase"],

      // Template
      "vue/html-indent": ["error", 2],
      "vue/html-closing-bracket-newline": [
        "error",
        {
          singleline: "never",
          multiline: "always",
        },
      ],
      "vue/html-closing-bracket-spacing": "error",
      "vue/html-end-tags": "error",
      "vue/html-quotes": ["error", "double"],
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ],
      // "vue/max-attributes-per-line": [
      //   "error",
      //   {
      //     singleline: 3,
      //     multiline: 1,
      //   },
      // ],
      "vue/mustache-interpolation-spacing": ["error", "always"],
      // "vue/no-multi-spaces": "error",
      // "vue/no-spaces-around-equal-signs-in-attribute": "error",

      // Directivas
      "vue/v-bind-style": ["error", "shorthand"],
      "vue/v-on-style": ["error", "shorthand"],
      "vue/v-slot-style": ["error", "shorthand"],
      "vue/prefer-true-attribute-shorthand": "error",

      // Script
      "vue/block-lang": ["error", { script: { lang: ["ts", "js"] } }],
      "vue/block-order": [
        "error",
        {
          order: ["template", "script", "style"],
        },
      ],
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/define-macros-order": [
        "error",
        {
          order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
        },
      ],
      // "vue/no-setup-props-destructure": "error",
      // "vue/script-setup-uses-vars": "error",

      // Composition API
      "vue/prefer-define-options": "error",
      "vue/require-macro-variable-name": [
        "error",
        {
          defineProps: "props",
          defineEmits: "emit",
          defineSlots: "slots",
          useSlots: "slots",
          useAttrs: "attrs",
        },
      ],

      // Mejores prácticas
      "vue/no-unused-vars": "error",
      "vue/no-unused-components": "warn",
      "vue/no-unused-refs": "error",
      "vue/no-undef-properties": "error",
      // "vue/no-undef-components": "error",
      "vue/prefer-separate-static-class": "error",
      "vue/prefer-template": "error",
      "vue/require-component-is": "error",
      "vue/return-in-computed-property": "error",
      "vue/use-v-on-exact": "error",
      "vue/valid-define-props": "error",

      // === REGLAS DE JAVASCRIPT ===

      // Estilo de código
      indent: ["error", 2, { SwitchCase: 1 }],
      // quotes: ["error", "double", { avoidEscape: true }],
      // semi: ["error", "never"],
      // "comma-dangle": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      // "space-before-function-paren": ["error", "always"],
      "keyword-spacing": "error",
      "space-infix-ops": "error",
      "eol-last": "error",
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],

      // Buenas prácticas
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-alert": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "arrow-spacing": "error",
      "no-duplicate-imports": "error",
      "no-useless-return": "error",
      "no-else-return": "error",
      "prefer-template": "error",

      // Errores comunes
      // "no-undef": "error",
      "no-unreachable": "error",
      "no-unsafe-negation": "error",
      "valid-typeof": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "multi-line"],

      // === PRETTIER ===
      "prettier/prettier": [
        "warn",
        {
          singleQuote: false,
          trailingComma: "all",
          arrowParens: "always",
          endOfLine: "lf",
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          bracketSpacing: true,
        },
      ],
    },
  },

  // Configuración específica para archivos TypeScript
  // {
  //   files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
  //   rules: {
  //     // Desactivar reglas de JS que pueden conflictuar con TS
  //     "no-undef": "off", // TypeScript ya maneja esto
  //   },
  // },

  // // Configuración específica para archivos de configuración
  // {
  //   files: ["**/vite.config.*", "**/vitest.config.*", "**/cypress.config.*", "**/playwright.config.*"],
  //   rules: {
  //     "no-console": "off",
  //   },
  // },
];
