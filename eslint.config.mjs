import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // react-hooks/set-state-in-effect es excesivamente estricta.
      // Marca como error patrones válidos de React como:
      //   - setMounted(true) para evitar hydration mismatch
      //   - setState en callbacks de event listeners
      //   - setState en setTimeout callbacks dentro de effects
      // Estos son patrones estándar y correctos. La regla los detecta
      // como "cascading renders" pero en la práctica son el uso
      // recomendado de React para sincronizar estado con sistemas externos.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
