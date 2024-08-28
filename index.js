import express from "express";
import "dotenv/config";
import DigestClient from "digest-fetch";
import cors from "cors";
import xml2js from "xml2js";

const parser = new xml2js.Parser();
let xmlData;
const app = express();
app.use(express.json());
const port = process.env.PORT || 4242;
const user = process.env.HIKUSER;
const password = process.env.HIKPASSWORD;
const url = process.env.HIKURL;

app.use(cors());
app.get("/", (req, res) => {
  res.json({
    hello: "world",
  });
});
app.get("/api/relay/:deviceId/on", async (req, res) => {
  const client = new DigestClient(user, password, {
    algorithm: "MD5",
  });
  const on = await client.fetch(
    `${url}/ISAPI/AccessControl/RemoteControl/door/${req.params.deviceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
      },
      body: `
      <?xml version="1.0" encoding="UTF-8"?><RemoteControlDoor xmlns="http://www.isapi.org/ver20/XMLSchema" version="2.0"><cmd>alwaysOpen</cmd></RemoteControlDoor>`,
    }
  );
  const result = await on.text();
  parser.parseString(result, (err, res) => (xmlData = res));
  if (xmlData) {
    res.json({ isOpen: true, relayID: req.params.deviceId, ...xmlData });
  }
});

app.get("/api/relay/:deviceId/off", async (req, res) => {
  const client = new DigestClient(user, password, {
    algorithm: "MD5",
  });
  const on = await client.fetch(
    `${url}/ISAPI/AccessControl/RemoteControl/door/${req.params.deviceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
      },
      body: `
      <?xml version="1.0" encoding="UTF-8"?><RemoteControlDoor xmlns="http://www.isapi.org/ver20/XMLSchema" version="2.0"><cmd>alwaysClose</cmd></RemoteControlDoor>`,
    }
  );
  const result = await on.text();
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
