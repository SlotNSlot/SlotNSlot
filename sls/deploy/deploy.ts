import * as fs from 'fs';
import addGitTag from './helpers/addGitTag';
import pushToS3 from './helpers/pushToS3';
import pushGitTag from './helpers/pushGitTag';
import recordGitTag from './helpers/recordGitTag';
import copyJsToRoot from './helpers/copyJsToRoot';

async function deploy() {
  const NEW_TAG: string = (new Date()).toISOString().replace(/:/g, '-');
  fs.writeFileSync('./version', NEW_TAG);

  try {
    // await addGitTag(NEW_TAG);
    // await pushGitTag();
    await pushToS3(NEW_TAG);
    // await recordGitTag(NEW_TAG);
    await copyJsToRoot(NEW_TAG);
    console.log('ALL TASKS ARE DONE!');
  } catch (err) {
    throw err;
  }
}

deploy();
