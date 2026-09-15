import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./env";

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    enabled: true,
    path: "../web/{app,components,lib,sanity}/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "../web/sanity.types.ts",
    overloadClientMethods: true,
  },
});
