const funcs: Record<string, string> = {
  hello: 'hello',
  add: 'add',
  addJson: 'addJson',
  qsGet: 'qsGet',
  jsonGet: 'jsonGet',
  credentialOfferIssue: 'credentialOfferIssue',
  authorization: 'authorization',
  decision: 'decision',
  token: 'token',
};

for (const name in funcs) {
  if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === name) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    exports[name] = require(`../lib/${funcs[name]}`)[name];
    // console.log(name, exports[name]);
  }
}
