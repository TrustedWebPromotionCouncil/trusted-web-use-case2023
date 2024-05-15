Object.assign(globalThis, {
  self: globalThis,
  TextDecoder: require('text-encoding').TextDecoder,
  TextEncoder: require('text-encoding').TextEncoder,
});
