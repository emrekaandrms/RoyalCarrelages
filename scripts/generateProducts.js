const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Betik çıktısı: workspace kök dizininde products.json
 *
 * products.json formatı:
 * [
 *   {
 *     id: string,
 *     koleksiyonu: string,
 *     olcusu: string,
 *     renk: string,
 *     finish: null,
 *     imagePath: string // Orijinal görsele göre relative path
 *   }
 * ]
 */

const BASE_DIR = path.join(__dirname, '..', 'Urun_Gorselleri');
const OUTPUT_FILE = path.join(__dirname, '..', 'products.json');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PUBLIC_IMAGES_DIR = path.join(PUBLIC_DIR, 'Urun_Gorselleri');

/**
 * Belirtilen klasörü rekürsif olarak gezer ve .jpg /.jpeg dosya yollarını döner.
 * @param {string} dir
 * @returns {string[]}
 */
function collectImagePaths(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectImagePaths(fullPath));
    } else if (entry.isFile() && /\.jpe?g$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Token bir ölçü bilgisini temsil ediyor mu? (örn. 60X120, 120X240X20)
 * @param {string} token
 */
function isSizeToken(token) {
  return /^(\d{1,4}X){1,2}\d{1,4}$/i.test(token);
}

/**
 * Dosya adından ürün bilgilerini çözümler.
 * @param {string} filename Sadece ad, uzantısız
 * @returns {{ koleksiyonu: string, olcusu: string, renk: string }}
 */
function parseProductInfo(filename) {
  // Variant kısmını (_(n)) kaldır
  const variantRemoved = filename.replace(/_?\(\d+\)$/i, '');

  const tokens = variantRemoved.split('_').filter(Boolean);

  const sizeIndex = tokens.findIndex(isSizeToken);
  if (sizeIndex === -1) {
    throw new Error(`Ölçü bilgisi bulunamadı: ${filename}`);
  }

  const koleksiyonuTokens = tokens.slice(0, sizeIndex);
  const renkTokens = tokens.slice(sizeIndex + 1);

  return {
    koleksiyonu: koleksiyonuTokens.join(' '),
    olcusu: tokens[sizeIndex],
    renk: renkTokens.join(' '),
  };
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

const slugify = (str) =>
  str
    .toString()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .toLowerCase();

function createProducts() {
  const images = collectImagePaths(BASE_DIR);
  const products = [];

  for (const imgPath of images) {
    const relativeOriginal = path.relative(path.join(__dirname, '..'), imgPath); // Urun_Gorselleri/...

    // Kopyalama
    const destPath = path.join(PUBLIC_DIR, relativeOriginal);
    ensureDir(path.dirname(destPath));
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(imgPath, destPath);
    }

    const { name } = path.parse(imgPath);
    try {
      const { koleksiyonu, olcusu, renk } = parseProductInfo(name);
      const slug = slugify(`${koleksiyonu}-${renk}-${olcusu}`);
      products.push({
        id: crypto.randomUUID(),
        koleksiyonu,
        olcusu,
        renk,
        finish: null,
        imagePath: relativeOriginal,
        slug,
      });
    } catch (err) {
      console.warn(err.message);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`✅ ${products.length} ürün oluşturuldu. Çıktı: ${OUTPUT_FILE}`);
}

createProducts(); 