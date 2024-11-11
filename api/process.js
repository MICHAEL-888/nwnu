import { createCipheriv } from 'crypto';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { clientID, DES, key } = req.body;

        if (clientID) {
            const result = calculateClientIDResult(clientID);
            res.status(200).json({ result });
        } else if (DES && key) {
            const result = performDESEncryption(DES, key);
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

function performDESEncryption(text, key) {
    const cipher = createCipheriv('des-ecb', Buffer.from(key), null);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
