// src/lib/runtimeCheck.ts
import { validateRuntimeEnv } from "./env";

// ✅ run only when app boots (not at build-time)
validateRuntimeEnv();
