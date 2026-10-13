const urls = [
  ['Portfolio', 'https://portfolio-sagar-kanulla.vercel.app/'],
  ['LinkedIn', 'https://www.linkedin.com/in/vijay-sagar-kanulla-087459320'],
  ['GitHub', 'https://github.com/Sagarkanulla'],
  ['SeminarSync demo', 'https://seminardought.vercel.app/'],
  ['TaskFlow demo', 'https://taskflow-production-a420.up.railway.app']
];
const timeout = 10000;
for (const [name, url] of urls) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    if (response.status === 405 || response.status === 403) response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { Range: 'bytes=0-0' } });
    clearTimeout(timer);
    console.log(`${response.ok ? 'OK' : 'CHECK'}\t${response.status}\t${name}\t${url}`);
  } catch (error) { console.log(`UNVERIFIED\t${name}\t${url}\t${error.message}`); }
}
console.log('\nNote: an HTTP response does not prove that a project works or that its features match the portfolio description. Verify pages manually too.');
