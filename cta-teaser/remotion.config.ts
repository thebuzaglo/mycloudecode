/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// The sandboxed environment proxies HTTPS with a custom CA that headless
// Chromium does not trust; required for loading Google Fonts during render.
Config.setChromiumIgnoreCertificateErrors(true);
Config.overrideWebpackConfig(enableTailwind);
