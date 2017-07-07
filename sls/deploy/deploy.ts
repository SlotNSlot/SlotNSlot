import * as fs from 'fs';
import addGitTag from './helpers/addGitTag';
import pushToS3 from './helpers/pushToS3';
import pushGitTag from './helpers/pushGitTag';
import recordGitTag from './helpers/recordGitTag';
import copyJsToRoot from './helpers/copyJsToRoot';

async function deploy() {
  const NEW_TAG: string = (new Date()).toISOString().replace(/:/g, '-');
  fs.writeFileSync('./version', NEW_TAG);

  await pushToS3(NEW_TAG);
  await copyJsToRoot(NEW_TAG);
  await addGitTag(NEW_TAG);
  await pushGitTag();
}

deploy().then(() => {
  console.log("DONE!");
});
