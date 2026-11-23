import { resolveFileIcon } from "./mt-file-icon-formats";

describe("resolveFileIcon", () => {
  it("resolves the category, format and brand from a file name", () => {
    expect(resolveFileIcon({ fileName: "Invoice 2026.PDF" })).toEqual({
      category: "document",
      format: "PDF",
      brand: "pdf",
    });
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

  it("uses the category of the MIME type when the extension is unknown", () => {
    expect(resolveFileIcon({ fileName: "scan.xyz", mimeType: "application/pdf" })).toEqual({
      category: "document",
      format: "XYZ",
      brand: undefined,
    });
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
