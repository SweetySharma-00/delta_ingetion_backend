export const report = (start, received) => {
  const duration = Date.now() - start;
  return {
    duration_ms: duration,
    rows_scanned: received
  };
};