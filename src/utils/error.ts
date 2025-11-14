/** Handles sync errors and propogates it up the call stack */
export function handleSyncError(name: string, cb: () => any) {
  try {
    return cb();
  } catch (error) {
    console.error("An error occurred in dbConnection: ", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
