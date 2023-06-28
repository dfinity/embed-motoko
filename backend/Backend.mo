import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Server "mo:server";

import Utils "./Utils";
import Types "./Types";

shared ({ caller = installer }) actor class Backend() {
  type Response = Server.Response;
  type HttpRequest = Server.HttpRequest;
  type HttpResponse = Server.HttpResponse;

  stable var serializedEntries : Server.SerializedEntries = ([], [], [installer]);

  var server = Server.Server({ serializedEntries });

  func error(res : Server.ResponseClass, message : Text) : Response {
    res.send({
      status_code = 400;
      headers = [("Content-Type", "text/plain")];
      body = Text.encodeUtf8(message);
      streaming_strategy = null;
      cache_strategy = #default;
    });
  };

  func handleRequest(
    req : Server.Request,
    res : Server.ResponseClass,
    defaultWidth : Nat,
    baseHeight : Nat,
    lineHeight : Nat,
  ) : Response {
    let ?urlParam = req.url.queryObj.get("key") else return error(res, "Expected `url` parameter");
    let formatParam = req.url.queryObj.get("format");

    let url = Utils.decodeUriComponent(urlParam);
    let format : Types.Format = switch formatParam {
      case (?"xml") #xml;
      case (?"json") #json;
      case _ return error(res, "Invalid response format");
    };

    let maxWidthParam = req.url.queryObj.get("maxwidth");
    let maxHeightParam = req.url.queryObj.get("maxheight");
    let linesParam = req.url.queryObj.get("lines");

    let width = Option.get(do ? { Nat.fromText(maxWidthParam!)! }, defaultWidth);

    let defaultHeight = Option.get(do ? { baseHeight + Nat.fromText(linesParam!)! * lineHeight }, 500);
    let height = Option.get(do ? { Nat.max(Nat.fromText(maxWidthParam!)!, defaultHeight) }, defaultHeight);

    let widthText = Nat.toText(width);
    let heightText = Nat.toText(height);

    let body = (
      "\nURL: " # url #
      "\nWIDTH: " # widthText #
      "\nHEIGHT: " #heightText
    );

    res.send({
      status_code = 200;
      headers = [("Content-Type", "text/plain")];
      body = Text.encodeUtf8(body);
      streaming_strategy = null;
      cache_strategy = #default;
    });
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
