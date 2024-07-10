export function generateRandomCode(codesize = 16) {
  const currentTime = new Date().getTime();
  const seed = currentTime % 2147483647;
  let random = seed;
  let code = "";
  for (let i = 0; i < codesize; i++) {
    random = (random * 16807) % 2147483647;
    code += (random % 10).toString();
  }
  return code;
}
