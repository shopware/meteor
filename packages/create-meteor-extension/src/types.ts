import { GluegunToolbox as OriginalGluegunToolbox } from 'gluegun'

// extend GluegunToolbox with custom properties
declare module 'gluegun' {
  interface GluegunToolbox extends OriginalGluegunToolbox {
    foo: () => void
  }
}
