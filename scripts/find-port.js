#!/usr/bin/env node

import net from 'net';

/**
 * 指定されたポートが利用可能かチェック
 * @param {number} port - チェックするポート番号
 * @returns {Promise<boolean>} - 利用可能ならtrue
 */
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
}

/**
 * 利用可能なポートを見つける
 * @param {number} startPort - 開始ポート番号
 * @param {number} maxAttempts - 最大試行回数
 * @returns {Promise<number>} - 利用可能なポート番号
 */
async function findAvailablePort(startPort = 3000, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(
    `No available port found between ${startPort} and ${startPort + maxAttempts - 1}`,
  );
}

// メインの実行
(async () => {
  try {
    const startPort = parseInt(process.argv[2] || process.env.VITE_PORT || '3000');
    const port = await findAvailablePort(startPort);
    console.log(port);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
