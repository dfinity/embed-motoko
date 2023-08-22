import Text "mo:base/Text";

module {
  /// Returns an escaped XML text.
  public func escapeXml(xml : Text) : Text {
    // TODO: replace with pipe operator
    var t = xml;
    t := Text.replace(t, #char '&', "&amp;");
    t := Text.replace(t, #char '<', "&lt;");
    t := Text.replace(t, #char '>', "&gt;");
    t := Text.replace(t, #char '\"', "&quot;");
    t := Text.replace(t, #char '\'', "&apos;");
    t;
  };

  /// Returns an escaped XML attribute value surrounded in quotes.
  public func escapeXmlAttr(xml : Text) : Text {
    "\"" # escapeXml(xml) # "\"";
  };
};
