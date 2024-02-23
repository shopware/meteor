/**
 * JS file is needed because TypeScript can't use JSON imports
 * for UMD builds.
 */
import packageJson from '../../package.json';

export default packageJson.version;
