import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Json "mo:json/JSON";
import Server "mo:server";

import Types "./Types";
import Utils "./Utils";

shared ({ caller = installer }) actor class Backend() {
  type Response = Server.Response;
  type HttpRequest = Server.HttpRequest;
  type HttpResponse = Server.HttpResponse;

  let baseUrls = [
    "https://embed.motoko.org",
    "https://embed.smartcontracts.org",
  ];

  stable var serializedEntries : Server.SerializedEntries = ([], [], [installer]);

  var server = Server.Server({ serializedEntries });

  let cacheStrategy = #default;

  func error(res : Server.ResponseClass, message : Text) : Response {
    res.send({
      status_code = 400;
      headers = [("Content-Type", "text/plain")];
      body = Text.encodeUtf8(message);
      streaming_strategy = null;
      cache_strategy = cacheStrategy;
    });
  };

  func handleRequest(
    req : Server.Request,
    res : Server.ResponseClass,
    defaultWidth : Nat,
    baseHeight : Nat,
    lineHeight : Nat,
  ) : Response {
    let ?url = req.url.queryObj.get("url") else return error(res, "Expected `url` parameter");
    var isAllowed = false;
    label checkUrls for (baseUrl in baseUrls.vals()) {
      if (
        url == baseUrl or (
          Text.startsWith(
            url,
            #text(baseUrl # "/"),
          ) and not Text.startsWith(
            url,
            #text(baseUrl # "/api"),
          ) and not Text.startsWith(
            url,
            #text(baseUrl # "/services"),
          )
        )
      ) {
        isAllowed := true;
        break checkUrls;
      };
    };
    if (not isAllowed) {
      return error(res, "Invalid URL");
    };

    let formatParam = req.url.queryObj.get("format");
    let format : Types.Format = switch formatParam {
      case (?"xml") #xml;
      case (?"json") #json;
      case _ return error(res, "Invalid response format");
    };

    let maxWidthParam = req.url.queryObj.get("maxwidth");
    let maxHeightParam = req.url.queryObj.get("maxheight");
    let linesParam = req.url.queryObj.get("lines");

    // Calculate default embed height based on number of lines in the code snippet
    let defaultHeight = Option.get(do ? { baseHeight + Nat.fromText(linesParam!)! * lineHeight }, 500);

    let width = Option.get(do ? { Nat.fromText(maxWidthParam!)! }, defaultWidth);
    let height = Option.get(do ? { Nat.min(Nat.fromText(maxHeightParam!)!, defaultHeight) }, defaultHeight);

    let widthText = Nat.toText(width);
    let heightText = Nat.toText(height);

    let iframeHtml = (
      "<iframe" #
      " src=" # Utils.escapeXmlAttr(url) #
      " width=" # Utils.escapeXmlAttr(widthText) #
      " height=" # Utils.escapeXmlAttr(heightText) #
      " style=" # Utils.escapeXmlAttr("border:0") #
      " />"
    );

    switch format {
      case (#xml) {
        let xml = (
          "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>" #
          "<oembed>" # (
            "<version>1.0</version>" #
            "<provider_name>Embed Motoko</provider_name>" #
            "<provider_url>https://embed.motoko.org</provider_url>" #
            "<type>rich</type>" #
            "<width>" # Utils.escapeXml(widthText) # "</width>" #
            "<height>" # Utils.escapeXml(heightText) # "</height>" #
            "<html>" # Utils.escapeXml(iframeHtml) # "</html>"
          ) #
          "</oembed>"
        );
        res.send({
          status_code = 200;
          headers = [("Content-Type", "text/xml")];
          body = Text.encodeUtf8(xml);
          streaming_strategy = null;
          cache_strategy = cacheStrategy;
        });
      };
      case (#json) {
        let json = #Object([
          ("version", #String "1.0"),
          ("provider_name", #String "Embed Motoko"),
          ("provider_url", #String "https://embed.motoko.org"),
          ("type", #String "rich"),
          ("width", #Number width),
          ("height", #Number height),
          ("html", #String iframeHtml),
        ]);
        res.json({
          status_code = 200;
          body = Json.show(json);
          streaming_strategy = null;
          cache_strategy = cacheStrategy;
        });
      };
    };
  };

  server.get(
    "/services/oembed",
    func(req, res) {
      handleRequest(req, res, 800, 145, 28);
    },
  );

  server.get(
    "/services/onebox",
    func(req, res) {
      handleRequest(req, res, 695, 120, 24);
    },
  );

  public query func http_request(req : HttpRequest) : async HttpResponse {
    server.http_request(req);
  };
  public func http_request_update(req : HttpRequest) : async HttpResponse {
    server.http_request_update(req);
  };
  public func invalidate_cache() : async () {
    server.empty_cache();
  };
  system func preupgrade() {
    serializedEntries := server.entries();
  };
  system func postupgrade() {
    ignore server.cache.pruneAll();
  };
};
