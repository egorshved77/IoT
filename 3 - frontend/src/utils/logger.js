import log from 'loglevel';

// Configure log level based on environment
const logLevel = import.meta.env.VITE_LOG_LEVEL || 'info';

log.setLevel(logLevel);

// Optionally add a custom handler to format messages
const originalFactory = log.methodFactory;

log.methodFactory = (methodName, logLevel, loggerName) => {
  const rawLog = originalFactory(methodName, logLevel, loggerName);

  return (...args) => {
    const now = new Date().toLocaleTimeString();
    rawLog(`[${now}] [${methodName.toUpperCase()}]`, ...args);
  };
};

log.rebuild();

export default log;
