import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Json "mo:json/JSON";
import HttpParser "mo:http-parser.mo";

import Types "./Types";
import Utils "./Utils";

actor class Backend() {
  type Request = HttpParser.ParsedHttpRequest;
  type HttpRequest = HttpParser.HttpRequest;
  type HttpResponse = HttpParser.HttpResponse;

  let baseUrls = [
    "https://embed.motoko.org",
    "https://embed.smartcontracts.org",
  ];

  func error(message : Text) : HttpResponse {
    {
      status_code = 400;
      headers = [("Content-Type", "text/plain")];
      body = Text.encodeUtf8(message);
      streaming_strategy = null;
      cache_strategy = #noCache;
      upgrade = null;
    };
  };

  func handleRequest(
    req : Request,
    defaultWidth : Nat,
    baseHeight : Nat,
    lineHeight : Nat,
  ) : HttpResponse {
    let ?url = req.url.queryObj.get("url") else return error("Expected `url` parameter");
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
      return error("Invalid URL");
    };

    let formatParam = req.url.queryObj.get("format");
    let format : Types.Format = switch formatParam {
      case (?"xml") #xml;
      case (?"json") #json;
      case null #json;
      case _ return error("Invalid response format");
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
        return {
          status_code = 200;
          headers = [("Content-Type", "text/xml")];
          body = Text.encodeUtf8(xml);
          streaming_strategy = null;
          cache_strategy = #noCache;
          upgrade = null;
        };
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
        {
          status_code = 200;
          headers = [("Content-Type", "application/json")];
          body = Text.encodeUtf8(Json.show(json));
          streaming_strategy = null;
          cache_strategy = #noCache;
          upgrade = null;
        };
      };
    };
  };

  public query func http_request(request : HttpRequest) : async HttpResponse {
    let req = HttpParser.parse(request);

    switch (req.url.path.original) {
      case "/.well-known/ic-domains" {
        return {
          status_code = 200;
          headers = [("Content-Type", "text/plain")];
          body = Text.encodeUtf8("embed.smartcontracts.org\n");
          streaming_strategy = null;
          cache_strategy = #default;
          upgrade = null;
        };
      };
      case "/services/oembed" {
        handleRequest(req, 800, 145, 28);
      };
      case "/services/onebox" {
        handleRequest(req, 695, 120, 24);
      };
      case _ {
        {
          headers = [("Content-Type", "text/plain")];
          body = "Not found";
          status_code = 404;
          streaming_strategy = null;
          upgrade = null;
        };
      };
    };
  };
};
