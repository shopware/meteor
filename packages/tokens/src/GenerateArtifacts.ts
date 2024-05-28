import type { FileSystem } from './common/domain/file-system/FileSystem.js';
import { Dictionary } from './dictionary/domain/Dictionary.js';
import { CSSDeliverable } from './deliverable/domain/CSSDeliverable.js';
import { FigmaApi } from './figma/infrastructure/FigmaApi.js';
import { env } from './env.js';

export class GenerateArtifacts {
  public constructor(
    private readonly fileSystem: FileSystem,
    private readonly figmaApi: FigmaApi,
  ) {}

  public async execute() {
    const [primitiveTokenResponse, adminTokenResponse] = await Promise.all(
      [env.PRIMITIVE_TOKENS_FILE_KEY, env.ADMIN_TOKENS_FILE_KEY].map(
        (fileKey) => this.figmaApi.getLocalVariablesOfFile(fileKey),
      ),
    );

    if (!primitiveTokenResponse || !adminTokenResponse)
      throw new Error(
        'Failed to generate artifacts: Primitive or Admin Tokens are undefined.',
      );

    const primitiveDictionary = Dictionary.fromFigmaApiResponse(
      primitiveTokenResponse,
      { mode: 'Value' },
    );

    this.fileSystem.saveFile(
      './dictionaries/foundation/primitives.tokens.json',
      primitiveDictionary.toJSON(),
    );

    const primitiveCSSDeliverable =
      CSSDeliverable.fromDictionary(primitiveDictionary);

    this.fileSystem.saveFile(
      './deliverables/foundation/primitives.css',
      primitiveCSSDeliverable.toString(),
    );

    const adminLightModeDictionary = Dictionary.fromFigmaApiResponse(
      adminTokenResponse,
      { mode: 'Light mode', remoteFiles: [primitiveTokenResponse] },
    );

    this.fileSystem.saveFile(
      './dictionaries/administration/light.tokens.json',
      adminLightModeDictionary.toJSON(),
    );

    const adminLightModeCSSDeliverable = CSSDeliverable.fromDictionary(
      adminLightModeDictionary,
      {
        selector: ':root',
        additionalDictionaries: [primitiveDictionary],
      },
    );

    this.fileSystem.saveFile(
      './deliverables/administration/light.css',
      adminLightModeCSSDeliverable.toString(),
    );

    const adminDarkModeDictionary = Dictionary.fromFigmaApiResponse(
      adminTokenResponse,
      { mode: 'Dark mode', remoteFiles: [primitiveTokenResponse] },
    );

    this.fileSystem.saveFile(
      './dictionaries/administration/dark.tokens.json',
      adminDarkModeDictionary.toJSON(),
    );

    const adminDarkModeCSSDeliverable = CSSDeliverable.fromDictionary(
      adminDarkModeDictionary,
      {
        selector: "[data-theme='dark']",
        additionalDictionaries: [primitiveDictionary],
      },
    );

    this.fileSystem.saveFile(
      './deliverables/administration/dark.css',
      adminDarkModeCSSDeliverable.toString(),
    );
  }
}
