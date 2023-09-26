import Debug "mo:base/Debug";
import Text "mo:base/Text";

import { Backend } "../Backend";

let backend = await Backend();

let cases = [
  ("/services/oembed?format=xml&url=https%3A%2F%2Fembed.smartcontracts.org%2Fabcdef&maxheight=800&lines=5", "<?xml version=\221.0\22 encoding=\22utf-8\22 standalone=\22yes\22?><oembed><version>1.0</version><provider_name>Embed Motoko</provider_name><provider_url>https://embed.motoko.org</provider_url><type>rich</type><width>800</width><height>285</height><html>&lt;iframe src=&quot;https://embed.smartcontracts.org/abcdef&quot; width=&quot;800&quot; height=&quot;285&quot; style=&quot;border:0&quot; /&gt;</html></oembed>"),
  ("/services/oembed?format=xml&url=https%3A%2F%2Fembed.motoko.org%2Fabcdef&maxheight=800&lines=5", "<?xml version=\221.0\22 encoding=\22utf-8\22 standalone=\22yes\22?><oembed><version>1.0</version><provider_name>Embed Motoko</provider_name><provider_url>https://embed.motoko.org</provider_url><type>rich</type><width>800</width><height>285</height><html>&lt;iframe src=&quot;https://embed.motoko.org/abcdef&quot; width=&quot;800&quot; height=&quot;285&quot; style=&quot;border:0&quot; /&gt;</html></oembed>"),
];

for ((url, expected) in cases.vals()) {
  Debug.print(url);
  let request = {
    method = "GET";
    headers = [];
    url;
    body = "" : Blob;
  };
  let received = (await backend.http_request(request)).body;
  Debug.print(debug_show Text.decodeUtf8(received));
  assert received == Text.encodeUtf8(expected);
  Debug.print("");
};
