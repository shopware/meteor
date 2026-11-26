import { resolveFileIcon } from "./mt-file-icon-formats";

describe("resolveFileIcon", () => {
  it("resolves the category, format and brand from a file name", () => {
    expect(resolveFileIcon({ fileName: "Invoice 2026.PDF" })).toEqual({
      category: "document",
      format: "PDF",
      brand: "pdf",
    });
  });

  it.each([
    ["pdf", "pdf"],
    ["doc", "word"],
    ["docx", "word"],
    ["odt", "word"],
    ["xls", "excel"],
    ["xlsx", "excel"],
    ["xlsm", "excel"],
    ["ods", "excel"],
  ])("resolves the brand of the format %s", (format, brand) => {
    expect(resolveFileIcon({ format }).brand).toBe(brand);
  });

  it.each([
    "txt",
    "rtf",
    "csv",
    "numbers",
    "key",
    "pages",
    "ppt",
    "pptx",
    "pps",
    "ppsx",
    "odp",
    "svg",
    "fig",
    "ai",
    "psd",
    "sketch",
    "js",
    "mjs",
    "cjs",
    "zip",
  ])("resolves no brand for the format %s", (format) => {
    expect(resolveFileIcon({ format }).brand).toBeUndefined();
  });

  it("uses the last extension of a file name", () => {
    expect(resolveFileIcon({ fileName: "backup.tar.gz" })).toEqual({
      category: "archive",
      format: "GZ",
      brand: undefined,
    });
  });

  it("ignores the query and hash of a URL", () => {
    expect(resolveFileIcon({ fileName: "https://example.com/media/sheet.xlsx?v=2#top" })).toEqual({
      category: "table",
      format: "XLSX",
      brand: "excel",
    });
  });

  it("ignores the query and hash of a relative URL", () => {
    expect(resolveFileIcon({ fileName: "/media/sheet.xlsx?v=2#top" }).format).toBe("XLSX");
  });

  it.each(["Invoice #42.pdf", "what?.pdf", "C:\\files\\Invoice #42.pdf"])(
    "keeps the extension of the file name %j",
    (fileName) => {
      expect(resolveFileIcon({ fileName })).toEqual({
        category: "document",
        format: "PDF",
        brand: "pdf",
      });
    },
  );

  it.each(["README", ".env", "folder.name/README", ""])(
    "finds no extension in the file name %j",
    (fileName) => {
      expect(resolveFileIcon({ fileName })).toEqual({
        category: undefined,
        format: undefined,
        brand: undefined,
      });
    },
  );

  it("resolves the format and category from a known MIME type", () => {
    expect(resolveFileIcon({ mimeType: "application/msword" })).toEqual({
      category: "document",
      format: "DOC",
      brand: "word",
    });
  });

  it("ignores the parameters and case of a MIME type", () => {
    expect(resolveFileIcon({ mimeType: "Text/CSV; charset=utf-8" })).toEqual({
      category: "table",
      format: "CSV",
      brand: undefined,
    });
  });

  it("resolves only the category from the type of an unknown MIME type", () => {
    expect(resolveFileIcon({ mimeType: "video/x-unknown" })).toEqual({
      category: "video",
      format: undefined,
      brand: undefined,
    });
  });

  it("prefers the file name over the MIME type", () => {
    expect(resolveFileIcon({ fileName: "clip.mov", mimeType: "video/mp4" }).format).toBe("MOV");
  });

  it.each(["scan.xyz", "Report v1.2", "report.PDF.download"])(
    "uses the format of the MIME type when the extension of %j is unknown",
    (fileName) => {
      expect(resolveFileIcon({ fileName, mimeType: "application/pdf" })).toEqual({
        category: "document",
        format: "PDF",
        brand: "pdf",
      });
    },
  );

  it("keeps an unknown extension when the MIME type only names a category", () => {
    expect(resolveFileIcon({ fileName: "clip.xyz", mimeType: "video/x-unknown" })).toEqual({
      category: "video",
      format: "XYZ",
      brand: undefined,
    });
  });

  it("keeps the category of the file when the format is a custom label", () => {
    expect(resolveFileIcon({ fileName: "report.pdf", format: "invoice" })).toEqual({
      category: "document",
      format: "INVOICE",
      brand: undefined,
    });
  });

  it("ignores a category it has no icon for", () => {
    // @ts-expect-error -- a value from outside of the type, such as one from an API
    expect(resolveFileIcon({ fileName: "report.pdf", category: "other" }).category).toBe(
      "document",
    );
  });

  it("lets an explicit format override the file name", () => {
    expect(resolveFileIcon({ fileName: "report.docx", format: ".xls" })).toEqual({
      category: "table",
      format: "XLS",
      brand: "excel",
    });
  });

  it("lets an explicit category override the derived one", () => {
    expect(resolveFileIcon({ fileName: "report.pdf", category: "markup" })).toEqual({
      category: "markup",
      format: "PDF",
      brand: "pdf",
    });
  });

  it.each([
    ["slides.pptx", "presentation"],
    ["talk.key", "presentation"],
    ["logo.eps", "vector"],
    ["backup.7z", "archive"],
    ["mockup.psd", "image"],
    ["theme.css", "markup"],
    ["app.js", "markup"],
    ["Inter.woff2", "font"],
    ["setup.exe", "executable"],
  ])("resolves the category of %s", (fileName, category) => {
    expect(resolveFileIcon({ fileName }).category).toBe(category);
  });

  it.each([
    ["application/vnd.ms-powerpoint", "presentation", "PPT"],
    ["font/woff2", "font", "WOFF2"],
    ["font/x-unknown", "font", undefined],
    ["text/css", "markup", "CSS"],
  ])("resolves the MIME type %s", (mimeType, category, format) => {
    expect(resolveFileIcon({ mimeType })).toMatchObject({ category, format });
  });

  it("keeps a custom format without a category", () => {
    expect(resolveFileIcon({ format: "abc" })).toEqual({
      category: undefined,
      format: "ABC",
      brand: undefined,
    });
  });
});
