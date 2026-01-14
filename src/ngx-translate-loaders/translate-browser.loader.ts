import { HttpClient } from '@angular/common/http';
import { TransferState } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { hasValue } from '../app/shared/empty.util';
import { environment } from '../environments/environment';
import {
  NGX_TRANSLATE_STATE,
  NgxTranslateState,
} from './ngx-translate-state';

/**
 * A TranslateLoader for ngx-translate to retrieve i18n messages from the TransferState, or download
 * them if they're not available there
 */
declare var __LANGUAGE_HASHES__: any;

/**
 * A TranslateLoader for ngx-translate to retrieve i18n messages from the TransferState, or download
 * them if they're not available there
 */
export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    protected transferState: TransferState,
    protected http: HttpClient,
    protected prefix?: string,
    protected suffix?: string,
  ) {
  }

  /**
   * Return the i18n messages for a given language, first try to find them in the TransferState
   * retrieve them using HttpClient if they're not available there
   *
   * @param lang the language code
   */
  getTranslation(lang: string): Observable<any> {
    // Get the ngx-translate messages from the transfer state, to speed up the initial page load
    // client side
    const state = this.transferState.get<NgxTranslateState>(NGX_TRANSLATE_STATE, {});
    const messages = state[lang];
    if (hasValue(messages)) {
      return observableOf(messages);
    } else {
      let translationHash = '';

      // Check if __LANGUAGE_HASHES__ is defined (injected by Webpack)
      if (typeof __LANGUAGE_HASHES__ !== 'undefined' && __LANGUAGE_HASHES__[lang + '.json5']) {
        translationHash = `.${__LANGUAGE_HASHES__[lang + '.json5']}`;
      }
      // Fallback to process.env if available (mostly for dev/test)
      else if (typeof process !== 'undefined' && process.env && (process.env as any).languageHashes && (process.env as any).languageHashes[lang + '.json5']) {
        translationHash = `.${(process.env as any).languageHashes[lang + '.json5']}`;
      }

      console.log('TranslateBrowserLoader:', {
        lang,
        production: environment.production,
        hashes: typeof __LANGUAGE_HASHES__ !== 'undefined' ? __LANGUAGE_HASHES__ : 'undefined',
        processHashes: (typeof process !== 'undefined' && process.env) ? (process.env as any).languageHashes : 'undefined',
        translationHash,
        url: `${this.prefix}${lang}${translationHash}${this.suffix}`
      });

      // If they're not available on the transfer state (e.g. when running in dev mode), retrieve
      // them using HttpClient
      return this.http.get(`${this.prefix}${lang}${translationHash}${this.suffix}`, { responseType: 'text' }).pipe(
        map((json: any) => JSON.parse(json)),
      );
    }
  }
}
