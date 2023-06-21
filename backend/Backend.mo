import Server "mo:server";
import Text "mo:base/Text";

shared ({ caller = creator }) actor class Backend() {
  type Response = Server.Response;
  type HttpRequest = Server.HttpRequest;
  type HttpResponse = Server.HttpResponse;

  stable var serializedEntries : Server.SerializedEntries = ([], [], [creator]);

  var server = Server.Server({ serializedEntries });

  //   stable var files = Trie.empty<Text, Blob>();
  //   func key(x : Text) : Trie.Key<Text> { { key = x; hash = Text.hash(x) } };

  let template = (
    "<!DOCTYPE html>" #
    "<html lang=\"en\">" #
    "<head>" #
    "<meta charset=\"UTF-8\">" #
    "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">" #
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" #
    "<title>Motoko Server SSR</title>" #
    "<meta name=\"description\" content=\"Placeholder\">" #
    "</head>" #
    "<body>" #
    "<h1>Hello, world!</h1>" #
    "</body>" #
    "</html>"
  );

  server.get(
    "/api/oembed",
    func(req, res) : Response {
      res.send({
        status_code = 200;
        headers = [("Content-Type", "text/html")];
        body = Text.encodeUtf8(
          template
        );
        streaming_strategy = null;
        cache_strategy = #default;
      });
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
