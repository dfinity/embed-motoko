import Text "mo:base/Text";

module {
  /// Partial implementation of `decodeURIComponent()` from JavaScript.
  public func decodeUriComponent(uri : Text) : Text {
    // TODO: replace with pipe operator
    var t = uri;
    t := Text.replace(t, #text "%26", "&");
    t := Text.replace(t, #text "%2F", "/");
    t := Text.replace(t, #text "%3A", ":");
    t := Text.replace(t, #text "%3F", "?");
    t;
  };

  /// Returns an escaped XML attribute value.
  public func escapeXml(xml : Text) : Text {
    // TODO: replace with pipe operator
    var t = xml;
    t := Text.replace(t, #char '&', "&amp;");
    t := Text.replace(t, #char '<', "&lt;");
    t := Text.replace(t, #char '>', "&gt;");
    t := Text.replace(t, #char '\"', "&quot;");
    t := Text.replace(t, #char '\'', "&apos;");
    "\"" # t # "\"";
  };

  /// Finds a query parameter in a URI.
  public func findQueryParam(uri : Text, param : Text) : ?Text {
    // TODO: optimize with new Text and Array helper functions
    let chars = param.chars();
    var next = chars.next();
    label main while true {
      let ?nextChar = next else return null;
      if (nextChar == '?' or nextChar == '&') {
        // Check query parameter name
        for (c in param.chars()) {
          next := chars.next();
          if (next != ?c) {
            continue main;
          };
        };
        // Check equals sign
        if (chars.next() != ?'=') {
          continue main;
        };
        return ?Text.fromIter({
          next = func() : ?Char {
            next := chars.next();
            switch (next) {
              case (?'&') null;
              case c c;
            };
          };
        });
      };

      next := chars.next();
    };
    null;
  };
};
