# Fix for i18n Loading in DSpace 8.2 Production

This guide details the minimum changes required to fix the issue where translation files fail to load in production builds (resulting in 404 errors and keys being displayed instead of values).

## 1. Update Webpack Configuration

Modify `webpack/webpack.common.ts` to inject the language hashes as a global variable. This bypasses the `process.env` issues in the browser.

**File:** `webpack/webpack.common.ts`

```typescript
// Add DefinePlugin to imports
import { EnvironmentPlugin, DefinePlugin } from 'webpack';

// ... inside commonExports.plugins array ...

export const commonExports = {
  plugins: [
    new EnvironmentPlugin({
      languageHashes: getFileHashes(path.join(__dirname, '..', 'src', 'assets', 'i18n'), /.*\.json5/g),
    }),
    // ADD THIS BLOCK:
    new DefinePlugin({
      '__LANGUAGE_HASHES__': JSON.stringify(getFileHashes(path.join(__dirname, '..', 'src', 'assets', 'i18n'), /.*\.json5/g)),
    }),
    new CopyWebpackPlugin(copyWebpackOptions),
  ],
  // ...
};
```

## 2. Update Type Definitions

Declare the global variable so TypeScript recognizes it.

**File:** `src/typings.d.ts`

```typescript
// ... existing declarations ...
declare let ENV: string;
declare let HMR: boolean;

// ADD THIS LINE:
declare var __LANGUAGE_HASHES__: any;

interface GlobalEnvironment {
// ...
```

## 3. Update Translation Loader

Update the loader to use the injected global variable.

**File:** `src/ngx-translate-loaders/translate-browser.loader.ts`

```typescript
import { HttpClient } from '@angular/common/http';
import { TransferState } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { hasValue } from '../app/shared/empty.util';
import { environment } from '../environments/environment';
import { NGX_TRANSLATE_STATE, NgxTranslateState } from './ngx-translate-state';

// ADD THIS DECLARATION
declare var __LANGUAGE_HASHES__: any;

export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    protected transferState: TransferState,
    protected http: HttpClient,
    protected prefix?: string,
    protected suffix?: string,
  ) {
  }

  getTranslation(lang: string): Observable<any> {
    const state = this.transferState.get<NgxTranslateState>(NGX_TRANSLATE_STATE, {});
    const messages = state[lang];
    if (hasValue(messages)) {
      return observableOf(messages);
    } else {
      // REPLACE THE ELSE BLOCK WITH THIS LOGIC:
      let translationHash = '';

      if (typeof __LANGUAGE_HASHES__ !== 'undefined' && __LANGUAGE_HASHES__[lang + '.json5']) {
        translationHash = `.${__LANGUAGE_HASHES__[lang + '.json5']}`;
      } else if (typeof process !== 'undefined' && process.env && (process.env as any).languageHashes && (process.env as any).languageHashes[lang + '.json5']) {
        translationHash = `.${(process.env as any).languageHashes[lang + '.json5']}`;
      }

      return this.http.get(`${this.prefix}${lang}${translationHash}${this.suffix}`, { responseType: 'text' }).pipe(
        map((json: any) => JSON.parse(json)),
      );
    }
  }
}
```
