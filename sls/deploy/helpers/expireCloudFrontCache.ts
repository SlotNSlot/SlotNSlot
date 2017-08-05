const AWS = require('aws-sdk');

const cloudfront = new AWS.CloudFront();
let cloudfrontProductionId: string;
if (process.env.NODE_ENV === "production") {
  cloudfrontProductionId = 'E2P9PNNPXVN2HE';
} else {
  cloudfrontProductionId = 'E3R0FKX17MAJ0I';
}

function expireCloudFrontCache() {
  return new Promise(function(resolve, reject) {
      console.log('CloudFront Invalidation Started');
      cloudfront.createInvalidation({
        DistributionId: cloudfrontProductionId,
        InvalidationBatch: {
          CallerReference: `CI-Invalidation-${Date.now().toString()}`,
          Paths: {
            Quantity: 1,
            Items: [
              "/*"
            ]
          }
        }
      }, function(err: Error, data: any) {
        if (err) { reject(err); }
        else { resolve(data); }
      });
    }).then(function(invalidation: any) {
    return new Promise(function(resolve, reject) {
      var handle = setInterval(function() {
        cloudfront.getInvalidation({
          Id: invalidation.Id,
          DistributionId: cloudfrontProductionId
        }, function(err: Error, invalidation: any) {
          if (invalidation.Status == 'Completed') {
            console.log('Done');
            clearInterval(handle);
            resolve();
          } else {
            console.log('*');
          }
        });
      }, 1000);
    });
  });
}

expireCloudFrontCache().then(() => {
  console.log('Every cache has been expired');
})

