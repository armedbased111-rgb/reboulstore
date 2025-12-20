#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const form_data_1 = __importDefault(require("form-data"));
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}
function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}
function logError(message) {
    log(`❌ ${message}`, 'red');
}
function logInfo(message) {
    log(`ℹ️  ${message}`, 'cyan');
}
function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}
async function makeRequest(method, url, formData) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const httpModule = parsedUrl.protocol === 'https:' ? require('https') : require('http');
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method,
            headers: formData ? formData.getHeaders() : { 'Content-Type': 'application/json' },
        };
        const req = httpModule.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk.toString();
            });
            res.on('end', () => {
                try {
                    const jsonData = data ? JSON.parse(data) : null;
                    resolve({ status: res.statusCode || 500, data: jsonData });
                }
                catch {
                    resolve({ status: res.statusCode || 500, data });
                }
            });
        });
        req.on('error', (error) => {
            reject(error);
        });
        if (formData) {
            formData.pipe(req);
        }
        else {
            req.end();
        }
    });
}
async function testUploadSimple(productId, imagePath) {
    logInfo(`\n📤 Test 1: Upload simple - ${path.basename(imagePath)}`);
    if (!fs.existsSync(imagePath)) {
        logError(`Fichier introuvable: ${imagePath}`);
        return null;
    }
    const formData = new form_data_1.default();
    formData.append('file', fs.createReadStream(imagePath));
    formData.append('alt', 'Test upload simple');
    formData.append('order', '0');
    try {
        const response = await makeRequest('POST', `${API_BASE_URL}/products/${productId}/images`, formData);
        if (response.status === 201) {
            logSuccess(`Upload réussi! Image ID: ${response.data.id}`);
            logInfo(`URL: ${response.data.url}`);
            logInfo(`PublicId: ${response.data.publicId}`);
            return response.data;
        }
        else {
            logError(`Échec upload (${response.status}): ${JSON.stringify(response.data)}`);
            return null;
        }
    }
    catch (error) {
        logError(`Erreur: ${error.message}`);
        return null;
    }
}
async function testDeleteImage(productId, imageId) {
    logInfo(`\n🗑️  Test 2: Suppression d'image - ${imageId}`);
    try {
        const response = await makeRequest('DELETE', `${API_BASE_URL}/products/${productId}/images/${imageId}`);
        if (response.status === 204) {
            logSuccess('Suppression réussie!');
            return true;
        }
        else {
            logError(`Échec suppression (${response.status}): ${JSON.stringify(response.data)}`);
            return false;
        }
    }
    catch (error) {
        logError(`Erreur: ${error.message}`);
        return false;
    }
}
async function testUploadMultiple(productId, imagePaths, alts, orders) {
    logInfo(`\n📤 Test 3: Upload multiple - ${imagePaths.length} images`);
    const formData = new form_data_1.default();
    for (const imagePath of imagePaths) {
        if (!fs.existsSync(imagePath)) {
            logError(`Fichier introuvable: ${imagePath}`);
            return null;
        }
        formData.append('files', fs.createReadStream(imagePath));
    }
    if (alts) {
        for (const alt of alts) {
            formData.append('alts[]', alt);
        }
    }
    if (orders) {
        for (const order of orders) {
            formData.append('orders[]', order.toString());
        }
    }
    try {
        const response = await makeRequest('POST', `${API_BASE_URL}/products/${productId}/images/bulk`, formData);
        if (response.status === 201) {
            logSuccess(`Upload multiple réussi! ${response.data.length} images créées`);
            response.data.forEach((img, idx) => {
                logInfo(`  Image ${idx + 1}: ID=${img.id}, order=${img.order}, alt="${img.alt}"`);
            });
            return response.data;
        }
        else {
            logError(`Échec upload multiple (${response.status}): ${JSON.stringify(response.data)}`);
            return null;
        }
    }
    catch (error) {
        logError(`Erreur: ${error.message}`);
        return null;
    }
}
async function testUploadMultipleAutoOrder(productId, imagePaths) {
    logInfo(`\n📤 Test 4: Upload multiple avec ordre automatique - ${imagePaths.length} images`);
    const formData = new form_data_1.default();
    for (const imagePath of imagePaths) {
        if (!fs.existsSync(imagePath)) {
            logError(`Fichier introuvable: ${imagePath}`);
            return null;
        }
        formData.append('files', fs.createReadStream(imagePath));
    }
    formData.append('alts[]', 'Détail matière');
    formData.append('alts[]', 'Zoom logo');
    try {
        const response = await makeRequest('POST', `${API_BASE_URL}/products/${productId}/images/bulk`, formData);
        if (response.status === 201) {
            logSuccess(`Upload multiple réussi! ${response.data.length} images créées`);
            response.data.forEach((img, idx) => {
                logInfo(`  Image ${idx + 1}: ID=${img.id}, order=${img.order}, alt="${img.alt}"`);
            });
            return response.data;
        }
        else {
            logError(`Échec upload multiple (${response.status}): ${JSON.stringify(response.data)}`);
            return null;
        }
    }
    catch (error) {
        logError(`Erreur: ${error.message}`);
        return null;
    }
}
async function testUploadTooManyFiles(productId, imagePaths) {
    logInfo(`\n📤 Test 5: Upload multiple - trop de fichiers (${imagePaths.length} fichiers)`);
    const formData = new form_data_1.default();
    for (const imagePath of imagePaths) {
        if (fs.existsSync(imagePath)) {
            formData.append('files', fs.createReadStream(imagePath));
        }
    }
    try {
        const response = await makeRequest('POST', `${API_BASE_URL}/products/${productId}/images/bulk`, formData);
        if (response.status === 400) {
            logSuccess(`Erreur attendue reçue (${response.status})`);
            logInfo(`Message: ${JSON.stringify(response.data)}`);
            return true;
        }
        else {
            logError(`Erreur inattendue (${response.status}): ${JSON.stringify(response.data)}`);
            return false;
        }
    }
    catch (error) {
        logError(`Erreur: ${error.message}`);
        return false;
    }
}
async function testUploadWrongFormat(productId, filePath) {
    logInfo(`\n📤 Test 6: Upload fichier non-image - ${path.basename(filePath)}`);
    if (!fs.existsSync(filePath)) {
        logError(`Fichier introuvable: ${filePath}`);
        return false;
    }
    const formData = new form_data_1.default();
    formData.append('file', fs.createReadStream(filePath));
    try {
        const response = await makeRequest('POST', `${API_BASE_URL}/products/${productId}/images`, formData);
        if (response.status === 400) {
            logSuccess(`Erreur attendue reçue (${response.status})`);
            logInfo(`Message: ${JSON.stringify(response.data)}`);
            return true;
        }
        else {
            logError(`Erreur inattendue (${response.status}): ${JSON.stringify(response.data)}`);
            return false;
        }
    }
    catch (error) {
        logError(`Erreur: ${error.message}`);
        return false;
    }
}
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 8) {
        logError('Usage: ts-node scripts/test-images-upload.ts <productId> <img1> <img2> <img3> <img4> <img5> <img6> [non-image-file]');
        logInfo('Exemple: ts-node scripts/test-images-upload.ts abc-123 img1.jpg img2.jpg img3.jpg img4.jpg img5.jpg img6.jpg test.txt');
        process.exit(1);
    }
    const [productId, img1, img2, img3, img4, img5, img6, nonImageFile] = args;
    log('\n' + '='.repeat(60), 'blue');
    log('🧪 Tests d\'upload d\'images produits', 'blue');
    log('='.repeat(60), 'blue');
    logInfo(`Product ID: ${productId}`);
    logInfo(`API Base URL: ${API_BASE_URL}`);
    const results = [];
    const uploadedImage = await testUploadSimple(productId, img1);
    results.push({ test: 'Upload simple', passed: uploadedImage !== null });
    if (!uploadedImage) {
        logWarning('⚠️  Impossible de continuer sans image uploadée. Vérifiez que le backend est lancé et que le productId est valide.');
        process.exit(1);
    }
    const deleted = await testDeleteImage(productId, uploadedImage.id);
    results.push({ test: 'Suppression image', passed: deleted });
    const multipleImages = await testUploadMultiple(productId, [img2, img3, img4], ['Vue face', 'Vue profil', 'Vue dos'], [0, 1, 2]);
    results.push({ test: 'Upload multiple (3 images)', passed: multipleImages !== null });
    const autoOrderImages = await testUploadMultipleAutoOrder(productId, [img5, img6]);
    results.push({ test: 'Upload multiple ordre auto', passed: autoOrderImages !== null });
    const tooManyFiles = await testUploadTooManyFiles(productId, [
        img1,
        img2,
        img3,
        img4,
        img5,
        img6,
        img1,
        img2,
    ]);
    results.push({ test: 'Erreur: trop de fichiers', passed: tooManyFiles });
    if (nonImageFile) {
        const wrongFormat = await testUploadWrongFormat(productId, nonImageFile);
        results.push({ test: 'Erreur: fichier non-image', passed: wrongFormat });
    }
    else {
        logWarning('⚠️  Test fichier non-image ignoré (fichier non fourni)');
    }
    log('\n' + '='.repeat(60), 'blue');
    log('📊 Résumé des tests', 'blue');
    log('='.repeat(60), 'blue');
    results.forEach(({ test, passed }) => {
        if (passed) {
            logSuccess(`${test}: PASSÉ`);
        }
        else {
            logError(`${test}: ÉCHOUÉ`);
        }
    });
    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    log(`\n${passedCount}/${totalCount} tests réussis`, passedCount === totalCount ? 'green' : 'yellow');
    process.exit(passedCount === totalCount ? 0 : 1);
}
main().catch((error) => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
});
//# sourceMappingURL=test-images-upload.js.map