/*
  This script waits for the master controller script to become available.
  With orchestrators like Kubernetes, the master controller file may be fed in through
  a volume container at runtime and so it is necessary to wait for it before launch.
*/
require('dotenv').config();
const fsUtil = require('socketcluster/fsutil');

const { waitForFile } = fsUtil;

const masterControllerPath = process.env.KAIROS_MASTER_DEFAULT_CONTROLLER || './server.js';
const bootInterval = Number(process.env.KAIROS_BOOT_CHECK_INTERVAL) || 200;
const bootTimeout = Number(process.env.KAIROS_BOOT_TIMEOUT) || 10000;
const bootStartTime = Date.now();

const errorMessage = `Failed to locate the master controller file at path ${masterControllerPath} `
  + 'before KAIROS_BOOT_TIMEOUT';

waitForFile(masterControllerPath, bootInterval, bootStartTime, bootTimeout, errorMessage)
  .catch((err) => {
    console.error(`> Boot error: ${err.message}`);
    process.exit(1);
  });
