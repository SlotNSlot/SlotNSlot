import * as fs from 'fs';
import addGitTag from './helpers/addGitTag';
import pushToS3 from './helpers/pushToS3';
import pushGitTag from './helpers/pushGitTag';
import recordGitTag from './helpers/recordGitTag';
import copyJsToRoot from './helpers/copyJsToRoot';

function deploy() {
  const NEW_TAG: string = (new Date()).toISOString().replace(/:/g, '-');
  fs.writeFileSync('./version', NEW_TAG);

  pushToS3(NEW_TAG)
    .then(() => copyJsToRoot(NEW_TAG))
    .then(() => addGitTag(NEW_TAG))
    .then(() => pushGitTag())
    .then(() => console.log('ALL TASKS ARE DONE!'));
}

deploy();
