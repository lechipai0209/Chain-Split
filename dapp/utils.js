import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const decryptPayload = (data, nonce, sharedSecret) => {
  if (!sharedSecret) throw new Error("missing shared secret");
   
  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );
  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
  
}; 


const encryptPayload = (payload, sharedSecret) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );

  return [nonce, encryptedPayload];
};

export {decryptPayload, encryptPayload} ;