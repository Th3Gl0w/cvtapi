import express from "express";
import "dotenv/config";
import DigestClient from "digest-fetch";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());

app.get("/api/relay/:deviceId/on", async (req, res) => {
  const client = new DigestClient(process.env.USER, process.env.PASSWORD, {
    algorithm: "MD5",
  });
  const on = await client.fetch(
    `${process.env.URL}/ISAPI/AccessControl/RemoteControl/door/${req.params.deviceId}`,
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
  res.send(result);
});

app.get("/api/relay/:deviceId/off", async (req, res) => {
  const client = new DigestClient(process.env.USER, process.env.PASSWORD, {
    algorithm: "MD5",
  });
  const on = await client.fetch(
    `${process.env.URL}/ISAPI/AccessControl/RemoteControl/door/${req.params.deviceId}`,
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

app.listen(4242, () => {
  console.log("Server running on port 4242");
});
