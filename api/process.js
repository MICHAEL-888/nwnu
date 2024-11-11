import CryptoJS from 'crypto-js';

const f1123a = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920];

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { clientID, DES, key, code, length } = req.body;

        if (clientID) {
            const result = calculateClientIDResult(clientID);
            res.status(200).json({ result });
        } else if (DES && key) {
            const result = performTripleDESEncryption(DES, key);
            res.status(200).json({ result });
        } else if (code && length) {
            const result = f(stringToUint8Array(code), length);
            res.status(200).json({ result });
        } else {
            res.status(400).json({ error: 'Invalid input' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

function calculateClientIDResult(clientID) {
    const bb = g((clientID >> 8) & 65535, clientID & 255);
    return Array.from(bb).map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

function g(i, i2) {
    let bArr = new Uint8Array(16);
    bArr[0] = i2 & 255;
    bArr[1] = i & 255;
    bArr[2] = (i >> 8) & 255;
    bArr[3] = 0;
    for (let i3 = 4; i3 < 8; i3++) {
        bArr[i3] = ~bArr[i3 - 4];
    }
    for (let i4 = 8; i4 < 12; i4++) {
        bArr[i4] = bArr[i4 - 8] ^ bArr[15 - i4];
    }
    bArr[12] = bArr[8] ^ 161;
    bArr[13] = bArr[9] ^ 27;
    bArr[14] = bArr[10] ^ 193;
    bArr[15] = bArr[11] ^ 29;
    let bArr2 = new Uint8Array(24);
    bArr2.set(bArr.slice(0, 16), 0);
    bArr2.set(bArr.slice(0, 8), 16);
    return bArr2;
}

function performTripleDESEncryption(text, key) {
    const keyHex = CryptoJS.enc.Hex.parse(key);
    const messageHex = CryptoJS.enc.Utf8.parse(text);
    const encrypted = CryptoJS.TripleDES.encrypt(messageHex, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

function f(Code, length) {
    let i = 0;
    for (let i2 = 0; i2 < length; i2++) {
        i = f1123a[((i >> 8) ^ Code[i2]) & 255] ^ (i << 8);
    }
    return 65535 & i;
}

function stringToUint8Array(str) {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
    }
    return arr;
}
