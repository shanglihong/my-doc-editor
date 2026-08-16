#!/usr/bin/env node
/**
 * setup-drawio.mjs
 *
 * 在 npm install 后自动执行，下载 draw.io webapp 静态资源到 public/drawio/。
 * 若资源已存在（通过检测 public/drawio/js 目录）则跳过，避免重复下载。
 *
 * 使用方式：
 *   npm run setup:drawio      手动执行
 *   postinstall 自动触发      npm install 后自动运行
 */

import { existsSync, mkdirSync, rmSync, createWriteStream, readdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import { createGunzip } from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const DRAWIO_VERSION = '31.1.8';
const DRAWIO_ZIP_URL = `https://github.com/jgraph/drawio/archive/refs/tags/v${DRAWIO_VERSION}.zip`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DRAWIO = path.join(ROOT, 'public', 'drawio');
const TMP_ZIP = path.join(ROOT, 'node_modules', '.cache', `drawio-v${DRAWIO_VERSION}.zip`);
const TMP_EXTRACT = path.join(ROOT, 'node_modules', '.cache', `drawio-extract-${DRAWIO_VERSION}`);
const WEBAPP_SRC = path.join(TMP_EXTRACT, `drawio-${DRAWIO_VERSION}`, 'src', 'main', 'webapp');

// 通过检测 js 目录判断是否已就绪，避免重复下载
const SENTINEL = path.join(PUBLIC_DRAWIO, 'js');

function log(msg) {
  console.log(`[setup-drawio] ${msg}`);
}

async function downloadFile(url, dest) {
  mkdirSync(path.dirname(dest), { recursive: true });

  log(`正在下载 draw.io v${DRAWIO_VERSION}...`);
  log(`来源: ${url}`);

  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`下载失败: HTTP ${res.status}`);

  const total = Number(res.headers.get('content-length') || 0);
  let received = 0;
  let lastPct = -1;

  const writer = createWriteStream(dest);
  const reader = res.body.getReader();

  await new Promise((resolve, reject) => {
    writer.on('error', reject);
    writer.on('finish', resolve);

    function pump() {
      reader.read().then(({ done, value }) => {
        if (done) { writer.end(); return; }
        writer.write(Buffer.from(value));
        received += value.length;
        if (total > 0) {
          const pct = Math.floor((received / total) * 100);
          if (pct !== lastPct && pct % 10 === 0) {
            log(`  下载进度: ${pct}% (${(received / 1024 / 1024).toFixed(1)} MB)`);
            lastPct = pct;
          }
        }
        pump();
      }).catch(reject);
    }
    pump();
  });

  log(`下载完成: ${(received / 1024 / 1024).toFixed(1)} MB`);
}

async function extractWebapp() {
  log('正在解压 webapp 目录...');

  rmSync(TMP_EXTRACT, { recursive: true, force: true });
  mkdirSync(TMP_EXTRACT, { recursive: true });

  // 使用系统 unzip，只解压 webapp 目录，速度快
  const pattern = `drawio-${DRAWIO_VERSION}/src/main/webapp/*`;
  await execAsync(`unzip -q "${TMP_ZIP}" "${pattern}" -d "${TMP_EXTRACT}"`);

  log('解压完成');
}

async function copyToPublic() {
  log(`正在复制到 ${PUBLIC_DRAWIO} ...`);

  // 先备份自定义 index.html
  const customIndex = path.join(PUBLIC_DRAWIO, 'index.html');
  const backupIndex = path.join(PUBLIC_DRAWIO, '_index.html.bak');
  const hasCustomIndex = existsSync(customIndex);

  if (hasCustomIndex) {
    await execAsync(`cp "${customIndex}" "${backupIndex}"`);
  }

  // macOS cp -rn 对目录不可靠，改用全量复制
  await execAsync(`cp -r "${WEBAPP_SRC}/." "${PUBLIC_DRAWIO}/"`);

  // 恢复自定义 index.html（覆盖 draw.io 原生版本）
  if (hasCustomIndex) {
    await execAsync(`mv "${backupIndex}" "${customIndex}"`);
  }

  // draw.io 原生入口保存为 drawio-app.html，供 iframe 使用
  const drawioAppHtml = path.join(PUBLIC_DRAWIO, 'drawio-app.html');
  if (!existsSync(drawioAppHtml)) {
    await execAsync(`cp "${path.join(WEBAPP_SRC, 'index.html')}" "${drawioAppHtml}"`);
    log('已生成 drawio-app.html（draw.io 原生入口）');
  }

  log('复制完成');
}

async function main() {
  // 已经存在则跳过
  if (existsSync(SENTINEL)) {
    log(`draw.io v${DRAWIO_VERSION} 静态资源已就绪，跳过下载。`);
    log(`路径: ${PUBLIC_DRAWIO}`);
    return;
  }

  log(`开始准备 draw.io v${DRAWIO_VERSION} 离线静态资源...`);
  mkdirSync(PUBLIC_DRAWIO, { recursive: true });

  // 下载（如果临时缓存已有则复用）
  if (!existsSync(TMP_ZIP)) {
    await downloadFile(DRAWIO_ZIP_URL, TMP_ZIP);
  } else {
    log(`复用缓存: ${TMP_ZIP}`);
  }

  await extractWebapp();
  await copyToPublic();

  // 清理解压临时目录（保留 zip 缓存以备重用）
  rmSync(TMP_EXTRACT, { recursive: true, force: true });

  log(`draw.io v${DRAWIO_VERSION} 静态资源部署完成！`);
  log(`访问路径: /drawio/index.html`);
}

main().catch(err => {
  console.error('[setup-drawio] 错误:', err.message);
  process.exit(1);
});
