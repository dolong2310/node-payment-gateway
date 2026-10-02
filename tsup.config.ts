import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    core: "src/core/index.ts",
    momo: "src/momo/index.ts",
    vnpay: "src/vnpay/index.ts",
    zalopay: "src/zalopay/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ["crypto", "fs", "path"],
  outDir: "dist",
});
