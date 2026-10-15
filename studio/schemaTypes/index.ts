import { localeBlockContent, localeString, localeText } from './objects/locale';
import { altImage, blockContent } from './objects/blockContent';
import { project } from './documents/project';
import { siteSettings } from './documents/siteSettings';

export const schemaTypes = [localeString, localeText, localeBlockContent, altImage, blockContent, project, siteSettings];
