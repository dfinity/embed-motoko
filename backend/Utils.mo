import Text "mo:base/Text";

module {
  /// Partial implementation of `decodeURIComponent()` from JavaScript.
  func decodeUriComponent(uri : Text) : Text {
    // TODO: replace with pipe operator
    var t = uri;
    t := Text.replace(t, #text "%26", "&");
    t := Text.replace(t, #text "%2F", "/");
    t := Text.replace(t, #text "%3A", ":");
    t := Text.replace(t, #text "%3F", "?");
    t;
  };

  /// Returns an escaped XML attribute value.
  func escapeXml(xml : Text) : Text {
    // TODO: replace with pipe operator
    var t = xml;
    t := Text.replace(t, #char '&', "&amp;");
    t := Text.replace(t, #char '<', "&lt;");
    t := Text.replace(t, #char '>', "&gt;");
    t := Text.replace(t, #char '\"', "&quot;");
    t := Text.replace(t, #char '\'', "&apos;");
    "\"" # t # "\"";
  };
};
