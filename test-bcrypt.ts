import bcrypt from "bcryptjs";

async function main() {
  const rawKey = "ts_live_7a643ab480aedef655bcc59340b8212181fea003bef2bfe21b68254cb32e382f";
  
  const prefix = rawKey.substring(0, 12);
  console.log("Prefix extracted:", prefix);
  
  const salt = await bcrypt.genSalt(10);
  const keyHash = await bcrypt.hash(rawKey, salt);
  console.log("Hashed key:", keyHash);
  
  const isMatch = await bcrypt.compare(rawKey, keyHash);
  console.log("Does it match?", isMatch);
}

main().catch(console.error);
