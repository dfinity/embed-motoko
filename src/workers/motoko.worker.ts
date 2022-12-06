import mo from 'motoko/interpreter';
import { PackageInfo } from 'motoko/lib/package';
import motokoBasePackage from 'motoko/packages/latest/base.json';
import { expose } from 'comlink';

mo.setRunStepLimit(100_000);

const mainFile = mo.file('mo');

expose(async function updatePackages(packages: Record<string, PackageInfo>) {
  mo.clearPackages();
  mo.loadPackage(motokoBasePackage);
  await mo.installPackages(packages);
});

expose(async function run(code: string) {
  mainFile.write(code);
  return mo.run(code);
});
