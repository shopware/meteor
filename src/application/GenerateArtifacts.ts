import type { FileSystem } from "../common/domain/file-system/FileSystem";
import { Dictionary } from "../dictionary";
import { FigmaApi } from "../figmaApi";

const PRIMITIVE_TOKENS_FILE_KEY = "hSDX8IwmRAPOTL4NWPwVCl";
const ADMIN_TOKENS_FILE_KEY = "8X90GCcpIa4GllKCHA7qFM";

export class GenerateArtifacts {
  public constructor(
    private readonly fileSystem: FileSystem,
    private readonly figmaApi: FigmaApi
  ) {}

  public async execute() {
    const [primitiveTokenResponse, adminTokenResponse] = await Promise.all(
      [PRIMITIVE_TOKENS_FILE_KEY, ADMIN_TOKENS_FILE_KEY].map((fileKey) =>
        this.figmaApi.getLocalVariablesOfFile(fileKey)
      )
    );

    const primitiveDictionary = Dictionary.fromFigmaApiResponse(
      primitiveTokenResponse,
      { mode: "Light mode" }
    );

    this.fileSystem.saveFile(
      "./tokens/foundation/primitives.tokens.json",
      primitiveDictionary.toJSON()
    );

    const adminLightModeDictionary = Dictionary.fromFigmaApiResponse(
      adminTokenResponse,
      { mode: "Light mode", remoteFiles: [primitiveTokenResponse] }
    );

    this.fileSystem.saveFile(
      "./tokens/administration/light.tokens.json",
      // TODO: format with prettier
      adminLightModeDictionary.toJSON()
    );

    const adminDarkModeDictionary = Dictionary.fromFigmaApiResponse(
      adminTokenResponse,
      { mode: "Dark mode", remoteFiles: [primitiveTokenResponse] }
    );

    this.fileSystem.saveFile(
      "./tokens/administration/dark.tokens.json",
      // TODO: format with prettier
      adminDarkModeDictionary.toJSON()
    );
  }
}
