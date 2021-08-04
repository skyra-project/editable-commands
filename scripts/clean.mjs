await (await import('fs/promises')).rm(new URL('../dist', import.meta.url), { force: true, recursive: true });
